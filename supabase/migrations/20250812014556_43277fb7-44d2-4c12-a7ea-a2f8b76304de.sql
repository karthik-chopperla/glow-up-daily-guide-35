-- Add service_type column to profiles table with proper enum values
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS service_type text;

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_service_type ON public.profiles(service_type);

-- Add constraint to ensure service_type is from allowed values
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_service_type_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_service_type_check 
CHECK (service_type IS NULL OR service_type IN (
  'home_remedies_expert',
  'hospital_owner', 
  'doctor',
  'private_doctor',
  'online_doctor',
  'pharmacy_shop',
  'medical_shop',
  'mental_health_support',
  'home_nursing',
  'pregnancy_care',
  'gynecologist',
  'diet_plan_advisor',
  'fitness_recovery_advisor',
  'health_insurance_agent',
  'restaurant_owner',
  'torrent_owner',
  'emergency_sos',
  'ambulance_driver'
));