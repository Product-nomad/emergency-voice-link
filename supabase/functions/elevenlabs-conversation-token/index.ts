import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Allowed origins - add your production domain here
const ALLOWED_ORIGINS = [
  'https://911callsimulator.com',
  'https://www.911callsimulator.com',
  'https://999callsimulator.com',
  'https://www.999callsimulator.com',
  'https://999callbuddy.com',
  'https://www.999callbuddy.com',
  'https://emergency-voice-link.lovable.app',
  '.lovableproject.com',  // Lovable project preview URLs
  '.lovable.app',         // Lovable published URLs
  'https://preview--',    // Lovable legacy preview URLs
  'http://localhost:',    // Local development
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const isAllowed = origin && ALLOWED_ORIGINS.some(allowed => origin.includes(allowed));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Rate limit: balance abuse-mitigation against legitimate use. A child
// practising 4-5 scenarios in one session was hitting the previous 3/hour
// wall mid-lesson. 10/hour gives normal use plenty of headroom while
// still catching scripted abuse from a single source.
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MINUTES = 60;

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
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Reject requests from unauthorized origins (extra protection layer)
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => origin.includes(allowed));
  if (!isAllowedOrigin && origin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized origin' }),
      {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
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

    // Run the rate-limit read and the ElevenLabs token fetch concurrently
    // rather than serially — minting a token costs nothing on its own (spend
    // only happens once a conversation actually starts), so there's no cost
    // risk in fetching it before the rate-limit verdict is known. If the
    // caller turns out to be over the limit, the fetched token is simply
    // discarded below. This removes one DB round-trip from the latency-
    // critical path for every request under the limit (the common case).
    const [rateLimitResult, elevenLabsResponse] = await Promise.all([
      supabase
        .from('elevenlabs_rate_limit')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('requested_at', windowStart.toISOString()),
      fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
        }
      ),
    ]);

    const { count, error: countError } = rateLimitResult;

    if (countError) {
      // Log internally but don't expose to client
      console.error('Rate limit check failed');
    }

    // Enforce rate limit (discards the already-fetched ElevenLabs token)
    if (count !== null && count >= RATE_LIMIT_MAX_REQUESTS) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait before trying again.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!elevenLabsResponse.ok) {
      const errorText = await elevenLabsResponse.text();
      console.error('ElevenLabs API error:', elevenLabsResponse.status, errorText);
      throw new Error('Unable to initialize conversation');
    }

    const data = await elevenLabsResponse.json();

    // Record this request for rate limiting. Not awaited before responding —
    // this is bookkeeping for future requests, not something the current
    // response depends on — but the isolate can be frozen the instant the
    // response is returned, so the write is handed to EdgeRuntime.waitUntil
    // to guarantee it actually completes rather than racing shutdown.
    const insertPromise = supabase
      .from('elevenlabs_rate_limit')
      .insert({ ip_hash: ipHash })
      .then(({ error: insertError }) => {
        if (insertError) console.error('Failed to record rate limit');
      });

    // Cleanup old entries periodically (1 in 100 requests)
    const cleanupPromise =
      Math.random() < 0.01
        ? supabase.rpc('cleanup_old_elevenlabs_rate_limits').then(() => {})
        : Promise.resolve();

    // @ts-expect-error EdgeRuntime is a Supabase Edge Functions (Deno Deploy) global, not in std lib types
    if (typeof EdgeRuntime !== 'undefined') {
      // @ts-expect-error see above
      EdgeRuntime.waitUntil(Promise.all([insertPromise, cleanupPromise]));
    } else {
      // Local dev (Supabase CLI) fallback: still don't block the response on these.
      Promise.all([insertPromise, cleanupPromise]).catch(() => {});
    }

    // Return the token for WebRTC connection (lower latency than WebSocket)
    return new Response(JSON.stringify({ token: data.token }), {
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
