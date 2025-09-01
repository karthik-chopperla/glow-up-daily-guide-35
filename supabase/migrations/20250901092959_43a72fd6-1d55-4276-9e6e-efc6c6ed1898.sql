-- Create RLS policies for lab_samples table
-- Patients can view their own samples, lab staff can view all samples

-- Create function to check if user is lab staff
CREATE OR REPLACE FUNCTION public.is_lab_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'partner' 
    AND service_type IN ('lab_technician', 'doctor', 'admin')
  );
$$;

-- Lab samples policies
CREATE POLICY "Patients can view their own lab samples" 
ON public.lab_samples 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Lab staff can view all lab samples" 
ON public.lab_samples 
FOR SELECT 
USING (public.is_lab_staff());

CREATE POLICY "Lab staff can insert lab samples" 
ON public.lab_samples 
FOR INSERT 
WITH CHECK (public.is_lab_staff());

CREATE POLICY "Lab staff can update lab samples" 
ON public.lab_samples 
FOR UPDATE 
USING (public.is_lab_staff());

-- No DELETE policy for lab samples (medical records should be immutable)