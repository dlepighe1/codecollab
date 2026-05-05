import React, { useEffect } from 'react';
import { Tldraw, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

interface TldrawBoardProps {
    isDarkMode: boolean;
}

const TldrawBoard: React.FC<TldrawBoardProps> = ({ isDarkMode }) => {
    return (
        <div className="h-full w-full relative overflow-hidden" style={{ position: 'relative' }}>
            <Tldraw
                options={{ maxPages: 1 }}
            >
                <SetDarkMode isDarkMode={isDarkMode} />
            </Tldraw>
        </div>
    );
};

function SetDarkMode({ isDarkMode }: { isDarkMode: boolean }) {
    const editor = useEditor();

    useEffect(() => {
        editor.user.updateUserPreferences({ colorScheme: isDarkMode ? 'dark' : 'light' });
    }, [editor, isDarkMode]);

    return null;
}

export default TldrawBoard;
