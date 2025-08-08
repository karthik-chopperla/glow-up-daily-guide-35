-- Update profiles table to support phone-only authentication and new partner types
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS years_experience integer,
ADD COLUMN IF NOT EXISTS education text,
ADD COLUMN IF NOT EXISTS work_description text,
ADD COLUMN IF NOT EXISTS booking_price numeric,
ADD COLUMN IF NOT EXISTS hospital_affiliation text,
ADD COLUMN IF NOT EXISTS service_charge numeric,
ADD COLUMN IF NOT EXISTS city text;

-- Update the user_role enum to include all new partner types
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM (
  'user',
  'partner',
  'home_remedies_expert',
  'elder_advisor', 
  'hospital',
  'private_doctor',
  'medical_shop',
  'pharmacy_dealership',
  'mental_health_support',
  'in_home_nursing',
  'pregnancy_care_plan',
  'diet_plan_advisor',
  'fitness_recovery_advisor',
  'health_insurance_agent',
  'restaurant',
  'catering_service',
  'hotel',
  'cloud_kitchen',
  'omlens_driver'
);

-- Recreate the role column with the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role DROP DEFAULT,
ALTER COLUMN role TYPE user_role USING role::text::user_role,
ALTER COLUMN role SET DEFAULT 'user'::user_role;

-- Create notifications table for persistent notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  partner_id uuid,
  type text NOT NULL, -- 'appointment', 'emergency', 'medicine', 'health_announcement', 'food_order', 'service_booking'
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Partners can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = partner_id);

CREATE POLICY "Users can insert their own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Partners can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Partners can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = partner_id);

-- Update appointments table to support the new partner types
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS notification_id uuid;

-- Update sos_alerts table to support distance calculation and specific driver assignment
ALTER TABLE public.sos_alerts 
ADD COLUMN IF NOT EXISTS assigned_driver_id uuid,
ADD COLUMN IF NOT EXISTS distance_km numeric;

-- Create trigger for updating timestamps
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();