-- Create RLS policies for audit_logs table
-- Audit logs should be read-only for admins and system-controlled for inserts

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'partner' 
    AND service_type = 'admin'
  );
$$;

-- Audit logs policies
CREATE POLICY "Only admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true); -- System inserts, no user restriction needed

-- No UPDATE/DELETE policies for audit logs (immutable by design)