import { FileNode, Room, User } from '../types';

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

export * from './themes';
export * from './languages';
