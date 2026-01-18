import { supabase } from '@/integrations/supabase/client';

interface TokenCache {
  token: string;
  fetchedAt: number;
}

// Token is valid for 10 minutes, but we'll refresh after 5 minutes to be safe
const TOKEN_VALIDITY_MS = 5 * 60 * 1000;

let tokenCache: TokenCache | null = null;
let fetchPromise: Promise<string | null> | null = null;

/**
 * Pre-fetches and caches the ElevenLabs conversation token
 * This reduces perceived latency by having the token ready when user calls
 */
export const prefetchToken = async (): Promise<string | null> => {
  // If we're already fetching, return that promise
  if (fetchPromise) {
    return fetchPromise;
  }

  // If we have a valid cached token, return it
  if (tokenCache && Date.now() - tokenCache.fetchedAt < TOKEN_VALIDITY_MS) {
    return tokenCache.token;
  }

  // Start fetching
  fetchPromise = (async () => {
    try {
      console.log('[TokenPrefetch] Fetching new token...');
      const { data, error } = await supabase.functions.invoke(
        'elevenlabs-conversation-token'
      );

      if (error || !data?.token) {
        console.error('[TokenPrefetch] Failed to fetch token:', error);
        return null;
      }

      tokenCache = {
        token: data.token,
        fetchedAt: Date.now(),
      };

      console.log('[TokenPrefetch] Token cached successfully');
      return data.token;
    } catch (err) {
      console.error('[TokenPrefetch] Error:', err);
      return null;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

/**
 * Gets a cached token if available and valid
 */
export const getCachedToken = (): string | null => {
  if (tokenCache && Date.now() - tokenCache.fetchedAt < TOKEN_VALIDITY_MS) {
    return tokenCache.token;
  }
  return null;
};

/**
 * Clears the token cache (useful after a call ends)
 */
export const clearTokenCache = (): void => {
  tokenCache = null;
};

/**
 * Warms up the connection by pre-fetching the token
 * Call this when user starts dialing an emergency number
 */
export const warmupConnection = (): void => {
  // Only prefetch if we don't have a valid token
  if (!getCachedToken()) {
    prefetchToken();
  }
};
