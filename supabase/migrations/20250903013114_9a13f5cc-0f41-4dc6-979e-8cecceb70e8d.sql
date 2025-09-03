-- Fix missing RLS policies for security-critical tables (without problematic constraints)

-- Enable RLS on tables that don't have it
ALTER TABLE public.location_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurse_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_sessions ENABLE ROW LEVEL SECURITY;

-- Location index policies (admin only for management, public read for location queries)
CREATE POLICY "Admins can manage location index" 
ON public.location_index 
FOR ALL 
USING (is_admin());

CREATE POLICY "Public read access for location queries" 
ON public.location_index 
FOR SELECT 
USING (is_active = true);

-- Nurse certifications policies
CREATE POLICY "Nurses can view their own certifications" 
ON public.nurse_certifications 
FOR SELECT 
USING (auth.uid() = nurse_id);

CREATE POLICY "Lab staff can view all certifications" 
ON public.nurse_certifications 
FOR SELECT 
USING (is_lab_staff());

CREATE POLICY "Nurses can insert their own certifications" 
ON public.nurse_certifications 
FOR INSERT 
WITH CHECK (auth.uid() = nurse_id);

CREATE POLICY "Nurses can update their own certifications" 
ON public.nurse_certifications 
FOR UPDATE 
USING (auth.uid() = nurse_id);

-- Pharmacy stock policies
CREATE POLICY "Pharmacy partners can manage their stock" 
ON public.pharmacy_stock 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'partner' 
  AND profiles.service_type = 'pharmacy'
));

CREATE POLICY "Public can view available pharmacy stock" 
ON public.pharmacy_stock 
FOR SELECT 
USING (stock_quantity > 0 AND expiry_date > CURRENT_DATE);

-- Trainer sessions policies
CREATE POLICY "Trainers can manage their own sessions" 
ON public.trainer_sessions 
FOR ALL 
USING (auth.uid() = trainer_id);

CREATE POLICY "Public can view available trainer sessions" 
ON public.trainer_sessions 
FOR SELECT 
USING (is_available = true);

-- Fix database function security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Secure the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$;

-- Secure admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'partner' 
    AND service_type = 'admin'
  );
$$;

-- Secure lab staff check function
CREATE OR REPLACE FUNCTION public.is_lab_staff()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path TO public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'partner' 
    AND service_type IN ('lab_technician', 'doctor', 'admin')
  );
$$;

-- Add safer input validation constraints
ALTER TABLE public.profiles ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$');

-- Create audit table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security events" 
ON public.security_events 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can insert security events" 
ON public.security_events 
FOR INSERT 
WITH CHECK (true);