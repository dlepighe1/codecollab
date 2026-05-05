import React from 'react';
import { FAB } from '../../components/ui/FAB';

interface FABControllerProps {
    fabEnabled: boolean;
    fabOpen: boolean;
    onToggleFab: () => void;
    panels: {
        explorer: boolean;
        terminal: boolean;
        aiChat: boolean;
    };
    onTogglePanel: (panel: 'explorer' | 'terminal' | 'aiChat') => void;
    fabColor: 'colorful' | 'theme';
    accentColor: string;
    activeTab: 'editor' | 'whiteboard';
    isAiOpen: boolean;
}

export const FABController: React.FC<FABControllerProps> = ({
    fabEnabled, fabOpen, onToggleFab, panels, onTogglePanel, fabColor, accentColor, activeTab, isAiOpen
}) => {
    // FAB is editor-only — hide entirely on whiteboard tab
    if (activeTab === 'whiteboard') return null;

    if (fabEnabled) {
        return (
            <FAB
                isOpen={fabOpen}
                onToggle={onToggleFab}
                panels={panels}
                onTogglePanel={onTogglePanel}
                colorMode={fabColor}
                accentColor={accentColor}
                isAiOpen={isAiOpen}
            />
        );
    }

    // Classic mode — only the terminal toggle button (black pill, bottom-right)
    // The AI Chat toggle lives in the status bar; no extra floating button needed.
    return null;
};
