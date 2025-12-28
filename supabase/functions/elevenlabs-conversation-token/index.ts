import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agent ID loaded from environment variable for security
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per time window
const RATE_LIMIT_WINDOW_MINUTES = 60; // Time window in minutes

// Generate a hash for IP-based rate limiting
function hashIP(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const ELEVENLABS_AGENT_ID = Deno.env.get('ELEVENLABS_AGENT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
      throw new Error('Service configuration error');
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Service configuration error');
    }

    // Create Supabase client with service role for rate limiting
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const clientIP = forwardedFor.split(',')[0].trim() || 'unknown';
    const ipHash = hashIP(clientIP);

    // Check rate limit
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - RATE_LIMIT_WINDOW_MINUTES);

    const { count, error: countError } = await supabase
      .from('elevenlabs_rate_limit')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('requested_at', windowStart.toISOString());

    if (countError) {
      // Log internally but don't expose to client
      console.error('Rate limit check failed');
    }

    // Enforce rate limit
    if (count !== null && count >= RATE_LIMIT_MAX_REQUESTS) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Record this request for rate limiting
    const { error: insertError } = await supabase
      .from('elevenlabs_rate_limit')
      .insert({ ip_hash: ipHash });

    if (insertError) {
      console.error('Failed to record rate limit');
    }

    // Cleanup old entries periodically (1 in 100 requests)
    if (Math.random() < 0.01) {
      supabase.rpc('cleanup_old_elevenlabs_rate_limits').then(() => {});
    }

    // Request a signed URL for WebSocket connection
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Unable to initialize conversation');
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unable to connect. Please try again.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
