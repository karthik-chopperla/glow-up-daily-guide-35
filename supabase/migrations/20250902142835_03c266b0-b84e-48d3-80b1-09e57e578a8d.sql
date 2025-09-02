-- Create tables for enhanced Health Mate app

-- Extend profiles table for role-based access
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_services TEXT[],
ADD COLUMN IF NOT EXISTS partner_type TEXT CHECK (partner_type IN ('hospital', 'doctor', 'expert')),
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}'::jsonb;

-- Create hospitals table
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  contact TEXT,
  description TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  education TEXT,
  experience_years INTEGER,
  specialty TEXT NOT NULL CHECK (specialty IN (
    'General Physician', 'Pediatrician', 'Gynecologist / Obstetrician (OB-GYN)',
    'Cardiologist', 'Neurologist', 'Psychiatrist', 'Dermatologist', 
    'Ophthalmologist', 'ENT Specialist', 'Orthopedic Surgeon', 'Dentist',
    'Pulmonologist', 'Gastroenterologist', 'Nephrologist', 'Oncologist',
    'Endocrinologist', 'Radiologist', 'Pathologist', 'Urologist'
  )),
  consultation_price NUMERIC NOT NULL CHECK (consultation_price > 0),
  availability JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price > 0),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sos_events table
CREATE TABLE IF NOT EXISTS public.sos_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dispatched', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hospitals
CREATE POLICY "Anyone can view hospitals" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Hospital owners can manage their hospitals" ON public.hospitals FOR ALL USING (auth.uid() = owner_user_id);

-- Create RLS policies for doctors
CREATE POLICY "Anyone can view doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Hospital owners can manage their doctors" ON public.doctors FOR ALL USING (auth.uid() = owner_user_id);

-- Create RLS policies for facilities
CREATE POLICY "Anyone can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Hospital owners can manage facilities" ON public.facilities 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.hospitals 
  WHERE hospitals.id = facilities.hospital_id 
  AND hospitals.owner_user_id = auth.uid()
));

-- Create RLS policies for sos_events
CREATE POLICY "Users can create their own SOS events" ON public.sos_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own SOS events" ON public.sos_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Hospital partners can view all SOS events" ON public.sos_events 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'partner' 
  AND profiles.partner_type = 'hospital'
));
CREATE POLICY "Hospital partners can update SOS events" ON public.sos_events 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'partner' 
  AND profiles.partner_type = 'hospital'
));

-- Create triggers for updated_at columns
CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_facilities_updated_at
  BEFORE UPDATE ON public.facilities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sos_events_updated_at
  BEFORE UPDATE ON public.sos_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();