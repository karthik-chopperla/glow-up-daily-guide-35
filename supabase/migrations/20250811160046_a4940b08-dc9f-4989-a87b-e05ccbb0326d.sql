-- Update profiles table to support phone-only authentication and new partner types (non-destructive)
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

-- Safely create or update user_role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
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
  ELSE
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'home_remedies_expert';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'elder_advisor';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'hospital';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'private_doctor';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'medical_shop';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'pharmacy_dealership';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mental_health_support';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'in_home_nursing';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'pregnancy_care_plan';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'diet_plan_advisor';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'fitness_recovery_advisor';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'health_insurance_agent';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'restaurant';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'catering_service';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'hotel';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'cloud_kitchen';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'omlens_driver';
  END IF;
END $$;

-- Add role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'::user_role;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  partner_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own notifications') THEN
    CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Partners can view their own notifications') THEN
    CREATE POLICY "Partners can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = partner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own notifications') THEN
    CREATE POLICY "Users can insert their own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Partners can insert notifications') THEN
    CREATE POLICY "Partners can insert notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = partner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own notifications') THEN
    CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Partners can update their own notifications') THEN
    CREATE POLICY "Partners can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = partner_id);
  END IF;
END $$;

-- Update related tables
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notification_id uuid;
ALTER TABLE public.sos_alerts ADD COLUMN IF NOT EXISTS assigned_driver_id uuid, ADD COLUMN IF NOT EXISTS distance_km numeric;

-- Trigger for updating notification timestamps
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at') THEN
    CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;