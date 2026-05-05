
export type UserTier = 'Free' | 'Pro' | 'Team';

export type DashboardTheme = 'Default' | 'Ocean' | 'Galaxy' | 'BlueSky' | 'Vector' | 'Nebula';
export type EditorTheme = 'vs-dark' | 'light' | 'hc-black' | 'night-owl' | 'dracula';

export interface Socials {
  github?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface UserPreferences {
  editorTheme: EditorTheme;
  cursorColor: string; // Deprecated in favor of mapping, kept for backward compat if needed
  cursorMapping: {
    host: string;
    participant1: string;
    participant2: string;
    participant3: string;
  };
  notifications: {
    joinRoom: boolean;
    runCode: boolean;
    typingIndicators: boolean;
    hostAccept: boolean;
  };
  showStatusBar: boolean;
}

export interface UsageMetrics {
  monthlyHours: number;
  executions: number;
  aiPrompts: number;
  interviewsCompleted: number;
  challengesSolved: number;
  weeklyGoalProgress: number; // 0-100
  languages: { name: string; percentage: number }[];
}

export interface BillingInfo {
  currentPlan: UserTier;
  amount: number;
  nextBillingDate: string;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
  history: { id: string; date: string; amount: number; status: 'Paid' | 'Pending' }[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  tier: UserTier;
  socials?: Socials;
  dashboardTheme?: DashboardTheme;
  status?: 'active' | 'paused' | 'away';
  activeTab?: 'editor' | 'whiteboard';
  // New detailed fields
  preferences?: UserPreferences;
  usage?: UsageMetrics;
  billing?: BillingInfo;
  twoFactorEnabled?: boolean;
}

export type RoomType = 'Playground' | 'Collab' | 'Interview';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  language: string;
  lastActive: string;
  participants: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

export interface RemoteCursor {
  userId: string;
  userName: string;
  color: string;
  fileId: string;
  position: { lineNumber: number; column: number };
  activeTab?: 'editor' | 'whiteboard';
}


export type WorkspaceTheme = 'Default' | 'Obsidian Black' | 'Snow White' | 'Cyberpunk' | 'Nebula' | 'Ocean';
