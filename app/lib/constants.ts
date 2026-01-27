
import { FileNode, Room, User, WorkspaceTheme } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Developer',
  username: 'alexdev',
  email: 'alex@codecollab.dev',
  avatar: 'https://ui-avatars.com/api/?name=Alex+Developer&background=0D8ABC&color=fff',
  tier: 'Free',
  socials: {
    github: '@alexdev',
    twitter: '@alex_codes',
  },
  dashboardTheme: 'Default',
  preferences: {
    editorTheme: 'vs-dark',
    cursorColor: '#3b82f6',
    cursorMapping: {
        host: '#3b82f6',       // Blue
        participant1: '#ef4444', // Red
        participant2: '#10b981', // Green
        participant3: '#f59e0b', // Amber
    },
    notifications: {
        joinRoom: true,
        runCode: false,
        typingIndicators: true,
        hostAccept: false,
    },
    showStatusBar: true
  },
  usage: {
    monthlyHours: 42,
    executions: 156,
    aiPrompts: 12,
    interviewsCompleted: 3,
    challengesSolved: 8,
    weeklyGoalProgress: 65,
    languages: [
        { name: 'TypeScript', percentage: 45 },
        { name: 'Python', percentage: 30 },
        { name: 'Go', percentage: 15 },
        { name: 'Other', percentage: 10 },
    ]
  },
  billing: {
    currentPlan: 'Free',
    amount: 0,
    nextBillingDate: '2024-06-01',
    paymentMethod: {
        brand: 'Visa',
        last4: '4242',
        expiry: '12/28'
    },
    history: [
        { id: 'inv_001', date: '2024-05-01', amount: 0, status: 'Paid' },
    ]
  },
  twoFactorEnabled: false
};

export const RECENT_ROOMS: Room[] = [
  { id: 'r1', name: 'Algorithm Practice', type: 'Playground', language: 'TypeScript', lastActive: '2 hours ago', participants: 1 },
  { id: 'r2', name: 'Team Sync - Frontend', type: 'Collab', language: 'React', lastActive: '1 day ago', participants: 3 },
  { id: 'r3', name: 'Interview: Junior Dev', type: 'Interview', language: 'Python', lastActive: '3 days ago', participants: 2 },
];

export const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'root',
    type: 'folder',
    isOpen: true,
    children: [
      { id: 'f1', name: 'index.ts', type: 'file', language: 'typescript', content: '// Welcome to CodeCollab\nconsole.log("Hello World");' },
      { id: 'f2', name: 'utils.ts', type: 'file', language: 'typescript', content: 'export const add = (a: number, b: number) => a + b;' },
      {
        id: 'd1',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'f3', name: 'Button.tsx', type: 'file', language: 'typescript', content: 'export const Button = () => <button>Click me</button>;' }
        ]
      },
      { id: 'f4', name: 'styles.css', type: 'file', language: 'css', content: 'body { background: #000; }' },
    ]
  }
];

export const MOCK_NEWS = [
  { id: 1, title: 'CodeCollab 2.0 Released', desc: 'New whiteboard features and improved latency.' },
  { id: 2, title: 'Community Challenge', desc: 'Build a snake game in < 100 lines of code.' },
];

export const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']; // Blue, Red, Green, Amber

export const WORKSPACE_THEME_CONFIG: Record<WorkspaceTheme, { 
    name: string;
    monaco: any; 
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