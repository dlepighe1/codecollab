
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserTier } from '../../lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => Promise<void>;
  logout: () => void;
  updateTier: (tier: UserTier) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage for persistent login simulation
    const stored = localStorage.getItem('codecollab_auth');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (username: string, password?: string) => {
    // Simulate API call with delay for "Authenticating..." state
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            // Create a dynamic user based on input
            const newUser: User = {
                id: `u-${Date.now()}`,
                name: username,
                username: username.toLowerCase().replace(/\s+/g, ''),
                email: `${username.toLowerCase().replace(/\s+/g, '.')}@codecollab.dev`,
                avatar: `https://ui-avatars.com/api/?name=${username.replace(' ', '+')}&background=0D8ABC&color=fff`,
                tier: 'Free',
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
      // Deep merge for preferences if needed, simple shallow merge for now
      const updated = { ...user, ...data };
      // Handle nested preference updates if passed partially
      if (data.preferences) {
          updated.preferences = { ...user.preferences, ...data.preferences } as any;
      }
      setUser(updated);
      localStorage.setItem('codecollab_auth', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateTier, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};