import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the shape of our User
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    dashboardTheme?: string; // For ThemeContext compatibility
    isGuest?: boolean;
}

// Define the shape of our Context
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (type: 'guest' | 'demo') => void;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount to persist session
    useEffect(() => {
        const storedUser = localStorage.getItem('fake_auth_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem('fake_auth_user');
            }
        }
    }, []);

    const login = (type: 'guest' | 'demo') => {
        let newUser: User;

        if (type === 'guest') {
            newUser = {
                id: `guest-${Date.now()}`,
                name: 'Guest User',
                email: 'guest@example.com',
                isGuest: true,
                dashboardTheme: 'Default'
            };
        } else {
            newUser = {
                id: 'demo-user-123',
                name: 'Demo User',
                email: 'demo@codecollab.io',
                avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random',
                isGuest: false,
                dashboardTheme: 'Default' // Default theme for demo user
            };
        }

        setUser(newUser);
        localStorage.setItem('fake_auth_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fake_auth_user');
        // Clear theme preference from local storage if desired, or keep it.
        // For now, let's leave theme info in local storage as that's handled by ThemeContext often.
    };

    const updateProfile = (updates: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updated = { ...prev, ...updates };
            localStorage.setItem('fake_auth_user', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
