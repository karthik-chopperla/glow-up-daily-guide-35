-- Add columns to profiles table for comprehensive partner data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS consultation_price NUMERIC,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS doctor_name TEXT,
ADD COLUMN IF NOT EXISTS hospital_name TEXT,
ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS doctors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS partner_setup_complete BOOLEAN DEFAULT false;

-- Create doctors table for better data management
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  education TEXT,
  consultation_price NUMERIC NOT NULL,
  availability_schedule TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create facilities table 
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table
CREATE POLICY "Partners can manage their own doctors" ON public.doctors
  FOR ALL USING (auth.uid() = partner_id);

CREATE POLICY "Public can view available doctors" ON public.doctors
  FOR SELECT USING (is_available = true);

-- Create policies for facilities table  
CREATE POLICY "Partners can manage their own facilities" ON public.facilities
  FOR ALL USING (auth.uid() = partner_id);

CREATE POLICY "Public can view available facilities" ON public.facilities
  FOR SELECT USING (is_available = true);

-- Add trigger for updated_at columns
CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();