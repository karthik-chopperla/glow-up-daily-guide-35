-- Health Mate Database Schema Migration (Fixed)
-- This creates the comprehensive schema for the Health Mate healthcare platform

-- First, create custom types/enums (only if they don't exist)
DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_type AS ENUM ('online', 'in_person');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE triage_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('SILVER', 'GOLD', 'PLATINUM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sos_status AS ENUM ('active', 'assigned', 'en_route', 'arrived', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE medicine_system AS ENUM ('Allopathy', 'Ayurveda', 'Homeopathy');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to use new role enum values (convert existing data)
DO $$ BEGIN
    -- First update existing role values to match new enum
    UPDATE profiles SET role = 'patient' WHERE role = 'user';
    
    -- Drop existing user_role type and recreate with new values
    ALTER TABLE profiles ALTER COLUMN role TYPE text;
    DROP TYPE IF EXISTS user_role CASCADE;
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'pharmacy_partner', 'elder_expert', 'nurse', 'admin');
    ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING 
        CASE 
            WHEN role = 'user' THEN 'patient'::user_role
            WHEN role = 'partner' THEN 'doctor'::user_role
            ELSE role::user_role
        END;
    ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'patient';
EXCEPTION
    WHEN others THEN 
        RAISE NOTICE 'Error updating profiles role column: %', SQLERRM;
END $$;

-- Add comprehensive profile fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS medical_history TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_medicine_system medicine_system DEFAULT 'Allopathy';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS emergency_contacts JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS blood_group TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height_cm INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_kg DECIMAL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create elder_experts table
CREATE TABLE IF NOT EXISTS elder_experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  traditional_knowledge_areas TEXT[],
  languages_spoken TEXT[],
  consultation_fee DECIMAL DEFAULT 0,
  availability_schedule JSONB DEFAULT '{}',
  rating DECIMAL DEFAULT 0,
  total_consultations INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending',
  verification_documents JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES profiles(id),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  appointment_id UUID REFERENCES appointments(id),
  medicines JSONB NOT NULL DEFAULT '[]',
  dosage_instructions TEXT,
  duration_days INTEGER,
  special_instructions TEXT,
  digital_signature TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triage_results table (for AI symptom checker)
CREATE TABLE IF NOT EXISTS triage_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  symptoms TEXT NOT NULL,
  triage_level triage_level NOT NULL,
  recommended_action TEXT NOT NULL,
  suggested_specialties TEXT[],
  home_remedies TEXT[],
  ai_response_raw TEXT,
  consultation_urgent BOOLEAN DEFAULT false,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  tier subscription_tier NOT NULL,
  price_monthly DECIMAL NOT NULL,
  price_yearly DECIMAL,
  features JSONB NOT NULL DEFAULT '[]',
  max_sos_calls INTEGER DEFAULT 0,
  max_consultations INTEGER DEFAULT 0,
  includes_elder_advice BOOLEAN DEFAULT false,
  includes_diet_plans BOOLEAN DEFAULT false,
  includes_pregnancy_care BOOLEAN DEFAULT false,
  discount_percentage DECIMAL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renewal BOOLEAN DEFAULT true,
  payment_status TEXT DEFAULT 'active',
  billing_cycle TEXT DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, tier, price_monthly, price_yearly, features, max_sos_calls, max_consultations, includes_elder_advice, includes_diet_plans, includes_pregnancy_care, discount_percentage) VALUES
('Silver Plan', 'SILVER', 299.00, 2999.00, '["Basic health tracking", "Medicine reminders", "Hospital finder"]', 2, 5, false, false, false, 10),
('Gold Plan', 'GOLD', 599.00, 5999.00, '["All Silver features", "Unlimited consultations", "SOS emergency", "Elder advice"]', 10, -1, true, true, false, 15),
('Platinum Plan', 'PLATINUM', 999.00, 9999.00, '["All Gold features", "Pregnancy care", "Premium support", "Home nursing"]', -1, -1, true, true, true, 20)
ON CONFLICT DO NOTHING;