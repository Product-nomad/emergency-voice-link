-- Create rate limit table for ElevenLabs conversation tokens
CREATE TABLE public.elevenlabs_rate_limit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.elevenlabs_rate_limit ENABLE ROW LEVEL SECURITY;

-- No public access - only edge function with service role can access
CREATE POLICY "No public access to elevenlabs rate limit"
ON public.elevenlabs_rate_limit
FOR ALL
USING (false)
WITH CHECK (false);

-- Create index for faster lookups
CREATE INDEX idx_elevenlabs_rate_limit_ip_hash ON public.elevenlabs_rate_limit(ip_hash, requested_at);

-- Create cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_elevenlabs_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.elevenlabs_rate_limit
  WHERE requested_at < now() - INTERVAL '1 hour';
END;
$$;