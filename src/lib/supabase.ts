const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
    console.warn('[Supabase] No VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — using localStorage fallback.');
}

// Client will be initialized in Phase 4 when @supabase/supabase-js is installed.
// For now, export a placeholder that consumers can check with isSupabaseConfigured.
export const supabase = null;
