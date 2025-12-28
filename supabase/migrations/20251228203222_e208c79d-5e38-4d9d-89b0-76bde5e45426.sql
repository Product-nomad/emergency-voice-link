-- The feedback_rate_limit table is only accessed by the trigger function (SECURITY DEFINER)
-- and should never be directly accessible by users, so we add restrictive policies

-- Deny all public access to rate limit table (it's internal)
CREATE POLICY "No public access to rate limit table" 
ON public.feedback_rate_limit 
FOR ALL 
USING (false)
WITH CHECK (false);