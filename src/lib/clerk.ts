export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const isClerkConfigured = !!CLERK_PUBLISHABLE_KEY;
export const isDevMode = import.meta.env.VITE_DEV_MODE === 'true';

if (!isClerkConfigured && !isDevMode) {
    console.warn('[Clerk] No VITE_CLERK_PUBLISHABLE_KEY and dev mode is off — auth will be blocked.');
}

if (!isClerkConfigured && isDevMode) {
    console.info('[Clerk] Dev mode active — using local auth bypass.');
}
