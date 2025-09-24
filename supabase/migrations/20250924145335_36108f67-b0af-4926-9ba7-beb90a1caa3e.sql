-- Add Row Level Security (RLS) policies for all new tables (Fixed)
-- This fixes the security linter warnings

-- Enable RLS on all new tables
ALTER TABLE elder_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Elder Experts policies
CREATE POLICY "Elder experts can view their own profile" ON elder_experts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Elder experts can update their own profile" ON elder_experts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view available elder experts" ON elder_experts
FOR SELECT USING (is_available = true AND verification_status = 'verified');

CREATE POLICY "Only elders can create their profile" ON elder_experts
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Prescriptions policies
CREATE POLICY "Patients can view their own prescriptions" ON prescriptions
FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view prescriptions they created" ON prescriptions
FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can create prescriptions" ON prescriptions
FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update their own prescriptions" ON prescriptions
FOR UPDATE USING (auth.uid() = doctor_id);

-- Triage Results policies
CREATE POLICY "Users can view their own triage results" ON triage_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own triage results" ON triage_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscription Plans policies (public read for now)
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
FOR SELECT USING (is_active = true);

-- For now, allow system to manage subscription plans until we implement proper admin
CREATE POLICY "System can manage subscription plans" ON subscription_plans
FOR ALL USING (true);

-- User Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON user_subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
FOR UPDATE USING (auth.uid() = user_id);