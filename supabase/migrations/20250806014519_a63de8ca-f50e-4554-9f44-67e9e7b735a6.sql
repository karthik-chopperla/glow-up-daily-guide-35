-- Add role enum and update profiles table for role-based auth
CREATE TYPE public.user_role AS ENUM ('user', 'partner');

-- Add role and phone to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role DEFAULT 'user',
ADD COLUMN phone text,
ADD COLUMN partner_type text,
ADD COLUMN address text,
ADD COLUMN location_lat decimal,
ADD COLUMN location_lng decimal,
ADD COLUMN is_email_verified boolean DEFAULT false;

-- Create SOS alerts table
CREATE TABLE public.sos_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  location_lat decimal NOT NULL,
  location_lng decimal NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  status text DEFAULT 'active',
  nearest_partner_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on SOS alerts
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- SOS alerts policies
CREATE POLICY "Users can create their own SOS alerts" 
ON public.sos_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own SOS alerts" 
ON public.sos_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view all SOS alerts" 
ON public.sos_alerts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'partner'
  )
);

CREATE POLICY "Partners can update SOS alerts" 
ON public.sos_alerts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'partner'
  )
);

-- Update appointments table to include real-time notifications
ALTER TABLE public.appointments 
ADD COLUMN partner_id uuid,
ADD COLUMN message text,
ADD COLUMN notification_sent boolean DEFAULT false;

-- Update appointment policies for partners
CREATE POLICY "Partners can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.uid() = partner_id);

CREATE POLICY "Partners can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (auth.uid() = partner_id);

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.appointments REPLICA IDENTITY FULL;
ALTER TABLE public.sos_alerts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sos_alerts;