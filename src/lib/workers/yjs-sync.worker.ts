import * as Y from 'yjs';

// Handles encoding/decoding of Yjs updates off the main thread

self.onmessage = (e: MessageEvent) => {
    const { type, data } = e.data;

    switch (type) {
        case 'encode-update': {
            try {
                const update = new Uint8Array(data.update);
                const doc = new Y.Doc();
                Y.applyUpdate(doc, update);
                const encoded = Y.encodeStateAsUpdate(doc);
                self.postMessage({ type: 'encoded', encoded });
            } catch (error: any) {
                self.postMessage({ type: 'error', message: error.message });
            }
            break;
        }
        case 'merge-updates': {
            try {
                const updates = data.updates.map((u: ArrayBuffer) => new Uint8Array(u));
                const merged = Y.mergeUpdates(updates);
                self.postMessage({ type: 'merged', merged });
            } catch (error: any) {
                self.postMessage({ type: 'error', message: error.message });
            }
            break;
        }
    }
};
