export const HOCUSPOCUS_URL = import.meta.env.VITE_HOCUSPOCUS_URL as string | undefined;
export const isHocuspocusConfigured = !!HOCUSPOCUS_URL;

if (!isHocuspocusConfigured) {
    console.warn('[Hocuspocus] No server URL configured — collaboration will use local Yjs only.');
}
