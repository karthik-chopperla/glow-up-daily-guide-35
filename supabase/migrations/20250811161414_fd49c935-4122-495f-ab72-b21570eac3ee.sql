-- 1. Enum creation & update
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'user', 'partner',
      'home_remedies_expert', 'elder_advisor', 'hospital',
      'private_doctor', 'medical_shop', 'pharmacy_dealership',
      'mental_health_support', 'in_home_nursing', 'pregnancy_care_plan',
      'diet_plan_advisor', 'fitness_recovery_advisor', 'health_insurance_agent',
      'restaurant', 'catering_service', 'hotel', 'cloud_kitchen', 'omlens_driver'
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

-- 2. Profiles table update
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'::user_role;

-- Remove unused auth columns
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS email,
DROP COLUMN IF EXISTS password;

-- 3. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  partner_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT notif_user_or_partner CHECK (user_id IS NOT NULL OR partner_id IS NOT NULL)
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_select_notifications') THEN
    CREATE POLICY users_select_notifications ON public.notifications
      FOR SELECT USING (auth.uid() = user_id OR auth.uid() = partner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_insert_notifications') THEN
    CREATE POLICY users_insert_notifications ON public.notifications
      FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() = partner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_update_notifications') THEN
    CREATE POLICY users_update_notifications ON public.notifications
      FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = partner_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_delete_notifications') THEN
    CREATE POLICY users_delete_notifications ON public.notifications
      FOR DELETE USING (auth.uid() = user_id OR auth.uid() = partner_id);
  END IF;
END $$;

-- Trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notifications_updated_at') THEN
    CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;