// Vercel Edge Function — mints a short-lived ElevenLabs WebRTC conversation
// token. Replaces the old Supabase Edge Function of the same name.
//
// Served from the same domain as the frontend (this repo's Vercel project
// per production domain), so the browser's request here is same-origin —
// no CORS allowlist needed, unlike the Supabase version this replaces.
//
// No rate limiting: ElevenLabs' own account-level spend cap is the sole
// abuse backstop (see DECISIONS.md, 2026-07-30). Deliberate simplification,
// not an oversight — this app has no DB to persist counters in anymore.
export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID;

  if (!ELEVENLABS_API_KEY || !ELEVENLABS_AGENT_ID) {
    console.error('[elevenlabs-conversation-token] Missing ELEVENLABS_API_KEY or ELEVENLABS_AGENT_ID');
    return new Response(JSON.stringify({ error: 'Service configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Request a WebRTC token for lower latency (preferred over WebSocket signed URL)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${ELEVENLABS_AGENT_ID}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error('Unable to initialize conversation');
    }

    const data = await response.json();

    return new Response(JSON.stringify({ token: data.token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[elevenlabs-conversation-token] Error:', error);
    return new Response(JSON.stringify({ error: 'Unable to connect. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
