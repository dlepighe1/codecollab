import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserTier } from '../../types';
import { isDevMode as checkDevMode, isClerkConfigured } from '../../lib/clerk';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDevMode: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  updateTier: (tier: UserTier) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const devMode = checkDevMode && !isClerkConfigured;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('codecollab_auth');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('codecollab_auth');
    }
  }, []);

  const login = async (username: string, password?: string) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const newUser: User = {
                id: `dev-${username.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`,
                name: username,
                username: username.toLowerCase().replace(/\s+/g, ''),
                email: `${username.toLowerCase().replace(/\s+/g, '.')}@codecollab.dev`,
                avatar: `https://ui-avatars.com/api/?name=${username.replace(' ', '+')}&background=0D8ABC&color=fff`,
                tier: 'Pro',
                socials: {
                    github: `@${username.toLowerCase().replace(/\s+/g, '')}`,
                    twitter: `@${username.toLowerCase().replace(/\s+/g, '_')}`,
                },
                dashboardTheme: 'Default',
                twoFactorEnabled: false,
                preferences: {
                    editorTheme: 'vs-dark',
                    cursorColor: '#3b82f6',
                    cursorMapping: {
                        host: '#3b82f6',
                        participant1: '#ef4444',
                        participant2: '#10b981',
                        participant3: '#f59e0b',
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
                        { id: 'inv_002', date: '2024-04-01', amount: 0, status: 'Paid' },
                    ]
                }
            };

            setUser(newUser);
            localStorage.setItem('codecollab_auth', JSON.stringify(newUser));
            resolve();
        }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codecollab_auth');
  };

  const updateTier = (tier: UserTier) => {
    if (user) {
      const updated = { ...user, tier };
      if (updated.billing) updated.billing.currentPlan = tier;
      setUser(updated);
      localStorage.setItem('codecollab_auth', JSON.stringify(updated));
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      if (data.preferences) {
          updated.preferences = { ...user.preferences, ...data.preferences } as any;
      }
      setUser(updated);
      localStorage.setItem('codecollab_auth', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isDevMode: devMode, login, logout, updateTier, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const DevModeIndicator = () => {
    const { user, isDevMode } = useAuth();
    if (!isDevMode || !user) return null;
    return (
        <div className="fixed bottom-4 left-4 z-[200] px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold backdrop-blur-sm flex items-center gap-1.5">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Dev Mode
        </div>
    );
};
