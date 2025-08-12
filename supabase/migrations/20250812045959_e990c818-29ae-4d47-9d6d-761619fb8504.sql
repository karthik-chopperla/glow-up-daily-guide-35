-- Create comprehensive database schema for Health Mate app

-- Core SOS emergency system tables
CREATE TABLE IF NOT EXISTS public.sos_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  location_accuracy INTEGER DEFAULT 15,
  symptoms_summary TEXT,
  medical_flags JSONB DEFAULT '{}',
  subscription_level VARCHAR(20) DEFAULT 'SILVER',
  state VARCHAR(20) DEFAULT 'CREATED',
  emergency_type VARCHAR(20) DEFAULT 'medical',
  preferred_hospital_id UUID,
  device_info JSONB DEFAULT '{}',
  contacts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  billing_amount DECIMAL(10,2),
  priority_score INTEGER DEFAULT 50
);

CREATE TABLE IF NOT EXISTS public.sos_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sos_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  driver_id UUID,
  vehicle_id UUID,
  eta_minutes INTEGER,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  arrived_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  state VARCHAR(20) DEFAULT 'ASSIGNED',
  response_notes TEXT,
  distance_km DECIMAL(8,2)
);

-- Ambulance driver specific tables
CREATE TABLE IF NOT EXISTS public.ambulance_vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type VARCHAR(50) DEFAULT 'basic_ambulance',
  equipment_list JSONB DEFAULT '[]',
  license_plate VARCHAR(20),
  insurance_expiry DATE,
  last_maintenance DATE,
  is_available BOOLEAN DEFAULT true,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hospital system tables
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  specialties JSONB DEFAULT '[]',
  total_beds INTEGER DEFAULT 0,
  available_beds INTEGER DEFAULT 0,
  emergency_beds INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  contact_info JSONB DEFAULT '{}',
  facilities JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hospital_beds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID NOT NULL,
  bed_type VARCHAR(50) NOT NULL,
  total_count INTEGER NOT NULL DEFAULT 0,
  available_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced appointments table (extending existing)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS hospital_id UUID,
ADD COLUMN IF NOT EXISTS bed_id UUID,
ADD COLUMN IF NOT EXISTS consultation_type VARCHAR(50) DEFAULT 'in_person',
ADD COLUMN IF NOT EXISTS insurance_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS symptoms TEXT,
ADD COLUMN IF NOT EXISTS vitals JSONB DEFAULT '{}';

-- Partner service specific tables
CREATE TABLE IF NOT EXISTS public.pharmacy_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_id UUID NOT NULL,
  medicine_name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200),
  brand_name VARCHAR(200),
  strength VARCHAR(50),
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  expiry_date DATE,
  prescription_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nurse_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nurse_id UUID NOT NULL,
  certification_type VARCHAR(100) NOT NULL,
  issued_by VARCHAR(200),
  issue_date DATE,
  expiry_date DATE,
  certificate_number VARCHAR(100),
  verification_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.trainer_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id UUID NOT NULL,
  session_name VARCHAR(200) NOT NULL,
  session_type VARCHAR(50),
  duration_minutes INTEGER,
  max_participants INTEGER DEFAULT 1,
  price DECIMAL(10,2),
  description TEXT,
  requirements JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lab_samples (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lab_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  test_type VARCHAR(100) NOT NULL,
  sample_id VARCHAR(50) UNIQUE NOT NULL,
  collection_date TIMESTAMP WITH TIME ZONE,
  result_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'collected',
  results JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Location indexing for geo queries
CREATE TABLE IF NOT EXISTS public.location_index (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  location_lat DOUBLE PRECISION NOT NULL,
  location_lng DOUBLE PRECISION NOT NULL,
  geohash VARCHAR(20),
  radius_km DECIMAL(8,2) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit logs for compliance and debugging
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID,
  service_type VARCHAR(50) NOT NULL,
  service_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  payment_method VARCHAR(50),
  payment_gateway VARCHAR(50),
  gateway_transaction_id VARCHAR(200),
  status VARCHAR(20) DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enhanced subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name VARCHAR(50) NOT NULL,
  plan_level VARCHAR(20) DEFAULT 'SILVER',
  features JSONB DEFAULT '[]',
  price DECIMAL(10,2),
  billing_cycle VARCHAR(20) DEFAULT 'monthly',
  status VARCHAR(20) DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renewal BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.sos_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sos_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurse_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for SOS system
CREATE POLICY "Users can create their own SOS cases" ON public.sos_cases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own SOS cases" ON public.sos_cases
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Ambulance drivers can view active SOS cases" ON public.sos_cases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'partner' 
      AND profiles.service_type = 'ambulance_driver'
    )
  );

CREATE POLICY "Partners can update SOS cases" ON public.sos_cases
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'partner'
    )
  );

-- RLS Policies for SOS assignments
CREATE POLICY "Users can view their SOS assignments" ON public.sos_assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sos_cases 
      WHERE sos_cases.id = sos_assignments.sos_id 
      AND sos_cases.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can view their assignments" ON public.sos_assignments
  FOR SELECT USING (auth.uid() = partner_id);

CREATE POLICY "Partners can insert assignments" ON public.sos_assignments
  FOR INSERT WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Partners can update their assignments" ON public.sos_assignments
  FOR UPDATE USING (auth.uid() = partner_id);

-- RLS Policies for ambulance vehicles
CREATE POLICY "Drivers can manage their vehicles" ON public.ambulance_vehicles
  FOR ALL USING (auth.uid() = driver_id);

-- RLS Policies for hospitals
CREATE POLICY "Anyone can view active hospitals" ON public.hospitals
  FOR SELECT USING (is_active = true);

CREATE POLICY "Hospital staff can update their hospital" ON public.hospitals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'partner' 
      AND profiles.service_type = 'hospital_owner'
    )
  );

-- RLS Policies for hospital beds
CREATE POLICY "Anyone can view hospital beds" ON public.hospital_beds
  FOR SELECT USING (true);

CREATE POLICY "Hospital staff can update beds" ON public.hospital_beds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'partner' 
      AND profiles.service_type = 'hospital_owner'
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Partners can view their payments" ON public.payments
  FOR SELECT USING (auth.uid() = partner_id);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sos_cases_location ON public.sos_cases (location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_sos_cases_state ON public.sos_cases (state);
CREATE INDEX IF NOT EXISTS idx_sos_cases_created_at ON public.sos_cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sos_assignments_sos_id ON public.sos_assignments (sos_id);
CREATE INDEX IF NOT EXISTS idx_sos_assignments_partner_id ON public.sos_assignments (partner_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON public.hospitals (location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_ambulance_vehicles_driver_id ON public.ambulance_vehicles (driver_id);
CREATE INDEX IF NOT EXISTS idx_location_index_geohash ON public.location_index (geohash);

-- Update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sos_cases_updated_at
  BEFORE UPDATE ON public.sos_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ambulance_vehicles_updated_at
  BEFORE UPDATE ON public.ambulance_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at
  BEFORE UPDATE ON public.hospitals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Sample data inserts
INSERT INTO public.hospitals (id, name, location_lat, location_lng, address, city, state, phone, specialties, total_beds, available_beds, emergency_beds, rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'City General Hospital', 12.9716, 77.5946, '123 MG Road, Bangalore', 'Bangalore', 'Karnataka', '+91-80-12345678', '["emergency", "cardiology", "orthopedics"]', 200, 45, 20, 4.2),
('550e8400-e29b-41d4-a716-446655440002', 'Metro Medical Center', 12.9352, 77.6245, '456 Brigade Road, Bangalore', 'Bangalore', 'Karnataka', '+91-80-87654321', '["pediatrics", "gynecology", "neurology"]', 150, 30, 15, 4.5);

INSERT INTO public.hospital_beds (hospital_id, bed_type, total_count, available_count) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'general', 120, 25),
('550e8400-e29b-41d4-a716-446655440001', 'icu', 30, 8),
('550e8400-e29b-41d4-a716-446655440001', 'emergency', 20, 12),
('550e8400-e29b-41d4-a716-446655440002', 'general', 90, 20),
('550e8400-e29b-41d4-a716-446655440002', 'icu', 25, 5),
('550e8400-e29b-41d4-a716-446655440002', 'emergency', 15, 8);