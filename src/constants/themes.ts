import { WorkspaceTheme } from '../types';
import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';

export const WORKSPACE_THEME_CONFIG: Record<WorkspaceTheme, {
    name: string;
    monaco: any;
    codemirror: Extension[];
    ui: {
        bg: string,
        sidebar: string,
        header: string,
        border: string,
        text: string,
        accent: string,
        secondaryAccent: string,
        glass: string,
        menuBg: string,
        panelBg: string
    }
}> = {
    'Default': {
        name: 'Default Dark',
        monaco: 'vs-dark',
        codemirror: [oneDark],
        ui: {
            bg: 'linear-gradient(to bottom, #0f172a, #1e293b)',
            sidebar: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
            header: 'rgba(15, 23, 42, 0.95)',
            border: '#334155',
            text: '#e2e8f0',
            accent: '#3b82f6',
            secondaryAccent: '#f59e0b',
            glass: 'rgba(30, 41, 59, 0.95)',
            menuBg: '#1e293b',
            panelBg: '#1e293b'
        }
    },
    'Ocean': {
        name: 'Ocean Depth',
        monaco: 'vs-dark',
        codemirror: [oneDark],
        ui: {
            bg: 'linear-gradient(135deg, #020617 0%, #172554 50%, #1e3a8a 100%)',
            sidebar: 'rgba(15, 23, 42, 0.9)',
            header: 'rgba(15, 23, 42, 0.9)',
            border: 'rgba(96, 165, 250, 0.3)',
            text: '#eff6ff',
            accent: '#3b82f6',
            secondaryAccent: '#06b6d4',
            glass: 'rgba(23, 37, 84, 0.8)',
            menuBg: '#1e3a8a',
            panelBg: '#0f172a'
        }
    },
    'Obsidian Black': {
        name: 'Obsidian Black',
        monaco: {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: { 'editor.background': '#000000' }
        },
        codemirror: [
            oneDark,
            EditorView.theme({
                '&': { backgroundColor: '#000000' },
                '.cm-gutters': { backgroundColor: '#000000', borderRight: '1px solid #262626' },
            }, { dark: true }),
        ],
        ui: {
            bg: '#000000',
            sidebar: '#000000',
            header: '#000000',
            border: '#262626',
            text: '#a3a3a3',
            accent: '#ffffff',
            secondaryAccent: '#6366f1',
            glass: '#171717',
            menuBg: '#0a0a0a',
            panelBg: '#000000'
        }
    },
    'Snow White': {
        name: 'Snow White',
        monaco: 'light',
        codemirror: [],
        ui: {
            bg: '#f3f4f6',
            sidebar: '#ffffff',
            header: '#ffffff',
            border: '#e5e7eb',
            text: '#000000',
            accent: '#4b5563',
            secondaryAccent: '#ef4444',
            glass: '#ffffff',
            menuBg: '#ffffff',
            panelBg: '#ffffff'
        }
    },
    'Cyberpunk': {
        name: 'Cyberpunk',
        monaco: {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4' },
                { token: 'keyword', foreground: 'ff79c6' },
                { token: 'identifier', foreground: '8be9fd' },
                { token: 'string', foreground: 'f1fa8c' },
            ],
            colors: {
                'editor.background': '#0b0c15',
                'editorCursor.foreground': '#ff79c6',
                'editor.lineHighlightBackground': '#1f2130'
            }
        },
        codemirror: [
            oneDark,
            EditorView.theme({
                '&': { backgroundColor: '#0b0c15' },
                '.cm-gutters': { backgroundColor: '#0b0c15', borderRight: '1px solid #2a2c3f' },
                '.cm-cursor': { borderLeftColor: '#ff79c6' },
                '.cm-activeLine': { backgroundColor: '#1f2130' },
            }, { dark: true }),
        ],
        ui: {
            bg: 'linear-gradient(to bottom right, #0b0c15, #131426)',
            sidebar: '#0b0c15',
            header: '#0b0c15',
            border: '#2a2c3f',
            text: '#e2e8f0',
            accent: '#ff79c6',
            secondaryAccent: '#06b6d4',
            glass: '#131426',
            menuBg: '#161829',
            panelBg: '#0b0c15'
        }
    },
    'Nebula': {
        name: 'Cosmic Nebula',
        monaco: {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: { 'editor.background': '#0f0c29' }
        },
        codemirror: [
            oneDark,
            EditorView.theme({
                '&': { backgroundColor: '#0f0c29' },
                '.cm-gutters': { backgroundColor: '#0f0c29', borderRight: '1px solid #4c1d95' },
            }, { dark: true }),
        ],
        ui: {
            bg: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
            sidebar: '#0f0c29',
            header: '#0f0c29',
            border: '#4c1d95',
            text: '#e9d5ff',
            accent: '#d8b4fe',
            secondaryAccent: '#f472b6',
            glass: '#2e1065',
            menuBg: '#2e1065',
            panelBg: '#0f0c29'
        }
    }
};
