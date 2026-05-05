import { useEffect } from 'react';

interface ShortcutConfig {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
}

export const useKeyboardShortcut = (shortcuts: ShortcutConfig[]) => {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            for (const shortcut of shortcuts) {
                if (
                    e.key === shortcut.key &&
                    !!e.ctrlKey === !!shortcut.ctrlKey &&
                    !!e.shiftKey === !!shortcut.shiftKey &&
                    !!e.altKey === !!shortcut.altKey
                ) {
                    e.preventDefault();
                    shortcut.action();
                    return;
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [shortcuts]);
};
