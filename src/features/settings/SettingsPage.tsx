import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../auth/hooks/useAuth';
import { User, BarChart2, Palette, Shield, CreditCard, HelpCircle, LogOut, X } from 'lucide-react';
import { THEME_STYLES } from './constants/themeStyles';
import { ProfileTab } from './tabs/ProfileTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { SecurityTab } from './tabs/SecurityTab';
import { BillingTab } from './tabs/BillingTab';
import { SupportTab } from './tabs/SupportTab';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MENU_ITEMS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'analytics', label: 'Usage & Analytics', icon: BarChart2 },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Account & Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'support', label: 'Support Center', icon: HelpCircle },
] as const;

type TabId = typeof MENU_ITEMS[number]['id'];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, updateProfile, logout, updateTier } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('profile');
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleLogout = () => {
        setIsSigningOut(true);
        setTimeout(() => {
            logout();
            onClose();
        }, 1500);
    };

    const themeName = user?.dashboardTheme || 'Default';
    const theme = THEME_STYLES[themeName] || THEME_STYLES['Default'];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile': return <ProfileTab user={user} updateProfile={updateProfile} theme={theme} themeName={themeName} />;
            case 'analytics': return <AnalyticsTab user={user} theme={theme} updateTier={updateTier} />;
            case 'appearance': return <AppearanceTab user={user} updateProfile={updateProfile} theme={theme} themeName={themeName} />;
            case 'security': return <SecurityTab user={user} updateProfile={updateProfile} theme={theme} onNavigateToBilling={() => setActiveTab('billing')} />;
            case 'billing': return <BillingTab user={user} updateTier={updateTier} theme={theme} />;
            case 'support': return <SupportTab user={user} theme={theme} />;
            default: return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-5xl">
            <div className={`rounded-2xl border overflow-hidden flex h-[72vh] max-h-[720px] ${theme.panelBg} ${theme.panelBorder}`}>
                {/* Left sidebar */}
                <aside
                    className={`w-52 shrink-0 flex flex-col border-r ${theme.panelBorder}`}
                    style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}
                >
                    <div className="px-4 pt-5 pb-3">
                        <h2 className={`text-sm font-semibold tracking-widest uppercase opacity-50 ${theme.textPrimary}`}>Settings</h2>
                    </div>

                    <nav className="flex-1 px-2 space-y-0.5">
                        {MENU_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={[
                                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium',
                                        // Specific transitions — not transition-all
                                        'transition-[background,color,border-color] duration-150',
                                        // Active press feedback
                                        'active:scale-[0.98] active:duration-100',
                                        isActive
                                            ? `${theme.activeItem}`
                                            : `${theme.inactiveItem}`,
                                    ].join(' ')}
                                >
                                    <Icon className={`w-4 h-4 shrink-0 transition-opacity duration-150 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className={`px-2 pb-2 pt-2 border-t ${theme.panelBorder}`}>
                        <button
                            onClick={handleLogout}
                            className={[
                                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium',
                                'text-red-400 hover:bg-red-500/8',
                                'transition-[background] duration-150',
                                'active:scale-[0.98] active:duration-100',
                            ].join(' ')}
                        >
                            <LogOut className="w-4 h-4 shrink-0 opacity-70" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Right content */}
                <main className="flex-1 overflow-y-auto relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 right-3.5 z-10 p-1.5 hover:bg-white/8 rounded-lg transition-[background] duration-150 active:scale-90 active:duration-100"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                    <div className="p-6 md:p-7 relative min-h-full">
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Sign Out Overlay — scale from 0.95, not from nothing */}
            {isSigningOut && (
                <div className="absolute inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center rounded-2xl animate-fade-in">
                    <div className={`px-8 py-7 rounded-2xl flex flex-col items-center gap-3 border shadow-2xl animate-modal-in ${theme.panelBg} ${theme.panelBorder}`}>
                        <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                        <div className="text-center">
                            <h3 className={`text-base font-semibold ${theme.textPrimary}`}>Signing out…</h3>
                            <p className={`text-sm mt-0.5 ${theme.textTertiary}`}>See you next time</p>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};
