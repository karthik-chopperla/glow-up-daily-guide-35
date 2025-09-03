-- Fix missing RLS policies for security-critical tables

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

-- Add input validation constraints
ALTER TABLE public.profiles ADD CONSTRAINT check_phone_format 
CHECK (phone IS NULL OR phone ~ '^\+?[1-9]\d{1,14}$');

ALTER TABLE public.profiles ADD CONSTRAINT check_full_name_length 
CHECK (full_name IS NULL OR char_length(full_name) BETWEEN 1 AND 100);

-- Add password policy trigger (for future password changes)
CREATE OR REPLACE FUNCTION public.validate_password_strength()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- This will be called on password updates via RPC
  IF char_length(NEW.encrypted_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;
  RETURN NEW;
END;
$$;