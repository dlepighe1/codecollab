import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { HOCUSPOCUS_URL, isHocuspocusConfigured } from '../../../lib/hocuspocus';

interface CollaborationState {
    ydoc: Y.Doc;
    provider: HocuspocusProvider | null;
    isConnected: boolean;
}

export function useCollaboration(roomId: string, userName: string): CollaborationState {
    const ydocRef = useRef<Y.Doc>(new Y.Doc());
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ydoc = ydocRef.current;
        let provider: HocuspocusProvider | null = null;

        workerRef.current = new Worker(
            new URL('../../../lib/workers/yjs-sync.worker.ts', import.meta.url),
            { type: 'module' }
        );

        if (isHocuspocusConfigured && HOCUSPOCUS_URL) {
            provider = new HocuspocusProvider({
                url: HOCUSPOCUS_URL,
                name: roomId,
                document: ydoc,
                onConnect: () => setIsConnected(true),
                onDisconnect: () => setIsConnected(false),
            });
            providerRef.current = provider;
        } else {
            setIsConnected(true);
        }

        return () => {
            provider?.destroy();
            ydoc.destroy();
            workerRef.current?.terminate();
            ydocRef.current = new Y.Doc();
            providerRef.current = null;
            workerRef.current = null;
            setIsConnected(false);
        };
    }, [roomId, userName]);

    return {
        ydoc: ydocRef.current,
        provider: providerRef.current,
        isConnected,
    };
}
