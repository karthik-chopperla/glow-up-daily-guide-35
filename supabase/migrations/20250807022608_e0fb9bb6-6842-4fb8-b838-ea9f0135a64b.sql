-- Add more partner types and fields to support the enhanced functionality
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ambulance_driver';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'elder_advisor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'health_advisor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'restaurant_partner';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'gym_trainer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'insurance_agent';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'health_company';

-- Update profiles table to support enhanced fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS service_range text,
ADD COLUMN IF NOT EXISTS expertise_area text,
ADD COLUMN IF NOT EXISTS business_type text, -- restaurant/hotel/cloud_kitchen
ADD COLUMN IF NOT EXISTS vehicle_info text,
ADD COLUMN IF NOT EXISTS availability_schedule text,
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_available boolean DEFAULT true;

-- Create food_items table for restaurant partners
CREATE TABLE IF NOT EXISTS public.food_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on food_items
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- Create policies for food_items
CREATE POLICY "Anyone can view available food items" 
ON public.food_items 
FOR SELECT 
USING (is_available = true);

CREATE POLICY "Partners can manage their own food items" 
ON public.food_items 
FOR ALL 
USING (auth.uid() = partner_id);

-- Create insurance_plans table for insurance agents
CREATE TABLE IF NOT EXISTS public.insurance_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid NOT NULL,
  plan_name text NOT NULL,
  description text,
  target_locations text[],
  price_range text,
  coverage_details text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on insurance_plans
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for insurance_plans
CREATE POLICY "Anyone can view active insurance plans" 
ON public.insurance_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Agents can manage their own plans" 
ON public.insurance_plans 
FOR ALL 
USING (auth.uid() = agent_id);

-- Create workout_plans table for gym trainers
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id uuid NOT NULL,
  plan_name text NOT NULL,
  description text,
  duration_weeks integer,
  difficulty_level text,
  equipment_needed text[],
  target_muscle_groups text[],
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on workout_plans
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for workout_plans
CREATE POLICY "Anyone can view active workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Trainers can manage their own plans" 
ON public.workout_plans 
FOR ALL 
USING (auth.uid() = trainer_id);

-- Create health_packages table for health companies
CREATE TABLE IF NOT EXISTS public.health_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL,
  package_name text NOT NULL,
  description text,
  services_included text[],
  price numeric,
  duration_months integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on health_packages
ALTER TABLE public.health_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for health_packages
CREATE POLICY "Anyone can view active health packages" 
ON public.health_packages 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Companies can manage their own packages" 
ON public.health_packages 
FOR ALL 
USING (auth.uid() = company_id);

-- Update appointments table to support different service types
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'consultation',
ADD COLUMN IF NOT EXISTS location_preference text,
ADD COLUMN IF NOT EXISTS estimated_duration integer DEFAULT 30;

-- Update sos_alerts table to include more details
ALTER TABLE public.sos_alerts 
ADD COLUMN IF NOT EXISTS emergency_type text DEFAULT 'medical',
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS assigned_partner_id uuid,
ADD COLUMN IF NOT EXISTS eta_minutes integer,
ADD COLUMN IF NOT EXISTS response_notes text;

-- Add triggers for updated_at columns
CREATE TRIGGER update_food_items_updated_at
BEFORE UPDATE ON public.food_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_plans_updated_at
BEFORE UPDATE ON public.insurance_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_plans_updated_at
BEFORE UPDATE ON public.workout_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_packages_updated_at
BEFORE UPDATE ON public.health_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();