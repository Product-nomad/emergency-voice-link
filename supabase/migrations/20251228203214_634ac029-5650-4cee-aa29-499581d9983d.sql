-- Add constraint for maximum message length
ALTER TABLE public.feedback ADD CONSTRAINT feedback_message_length 
CHECK (length(message) <= 5000);

-- Create rate limiting table
CREATE TABLE public.feedback_rate_limit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limit table
ALTER TABLE public.feedback_rate_limit ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_feedback_rate_limit_ip_hash_time ON public.feedback_rate_limit(ip_hash, submitted_at DESC);

-- Create function to check rate limit (max 5 submissions per 10 minutes per session)
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
  session_id TEXT;
BEGIN
  -- Use a hash of the current timestamp truncated to hour as a simple session identifier
  -- This is a basic approach; for production, consider using actual session tokens
  session_id := md5(current_setting('request.headers', true)::json->>'x-forwarded-for' || 
                   COALESCE(current_setting('request.headers', true)::json->>'user-agent', ''));
  
  -- Count recent submissions from this session (last 10 minutes)
  SELECT COUNT(*) INTO recent_count
  FROM public.feedback_rate_limit
  WHERE ip_hash = session_id
    AND submitted_at > now() - INTERVAL '10 minutes';
  
  -- If too many recent submissions, reject
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting more feedback.';
  END IF;
  
  -- Log this submission for rate limiting
  INSERT INTO public.feedback_rate_limit (ip_hash, submitted_at)
  VALUES (session_id, now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to check rate limit before feedback insert
CREATE TRIGGER check_feedback_rate_limit_trigger
BEFORE INSERT ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.check_feedback_rate_limit();

-- Cleanup old rate limit entries (entries older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.feedback_rate_limit
  WHERE submitted_at < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;