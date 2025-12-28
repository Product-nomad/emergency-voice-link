-- Drop and recreate the rate limiting function with improved validation
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_count INTEGER;
  session_id TEXT;
  forwarded_for TEXT;
  user_agent TEXT;
BEGIN
  -- Extract headers safely
  forwarded_for := COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', '');
  user_agent := COALESCE(current_setting('request.headers', true)::json->>'user-agent', '');
  
  -- Generate session identifier from headers
  session_id := md5(forwarded_for || user_agent);
  
  -- Validate that we have a usable session identifier
  IF session_id IS NULL OR session_id = '' OR session_id = md5('') THEN
    RAISE EXCEPTION 'Unable to identify session for rate limiting';
  END IF;
  
  -- Count recent submissions from this session (last 10 minutes)
  SELECT COUNT(*) INTO recent_count
  FROM public.feedback_rate_limit
  WHERE ip_hash = session_id
    AND submitted_at > now() - INTERVAL '10 minutes';
  
  -- If too many recent submissions, reject
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting more feedback.';
  END IF;
  
  -- Log this submission for rate limiting with explicit table reference
  INSERT INTO public.feedback_rate_limit (ip_hash, submitted_at)
  VALUES (session_id, now());
  
  RETURN NEW;
END;
$function$;