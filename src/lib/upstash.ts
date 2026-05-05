const UPSTASH_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

export const isUpstashConfigured = !!(UPSTASH_URL && UPSTASH_TOKEN);

if (!isUpstashConfigured) {
    console.warn('[Upstash] No Redis credentials — using in-memory fallback on server.');
}

export const upstash = null;
