import React from 'react';
import { Monitor, Github, Key, Lock } from 'lucide-react';

export const SecurityTab = ({ user, updateProfile, theme, onNavigateToBilling }: any) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Account & Security</h3>
                <p className={`text-sm ${theme.textSecondary}`}>Protect your account and manage access.</p>
            </div>

            {/* Plan Summary */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between">
                <div>
                    <h4 className={`font-bold text-lg mb-1 ${theme.textPrimary}`}>Current Plan: {user?.tier}</h4>
                    <p className={`text-xs ${theme.textSecondary}`}>You are on the {user?.tier} tier.</p>
                </div>
                {user?.tier === 'Free' && (
                    <button onClick={onNavigateToBilling} className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition shadow-lg">Upgrade to Pro</button>
                )}
            </div>

            {/* Linked Accounts */}
            <div className="space-y-4">
                <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Monitor className="w-4 h-4"/> Linked Accounts</h4>
                <div className="space-y-3">
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${theme.cardBg} ${theme.cardBorder}`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-full"><img src="https://www.google.com/favicon.ico" className="w-4 h-4" /></div>
                            <div>
                                <div className={`text-sm font-bold ${theme.textPrimary}`}>Google</div>
                                <div className={`text-xs ${theme.textTertiary}`}>Connected</div>
                            </div>
                        </div>
                        <button className={`text-xs font-medium ${theme.textSecondary} hover:underline`}>Disconnect</button>
                    </div>
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${theme.cardBg} ${theme.cardBorder}`}>
                        <div className="flex items-center gap-3">
                            <div className="bg-black p-1.5 rounded-full"><Github className="w-4 h-4 text-white" /></div>
                            <div>
                                <div className={`text-sm font-bold ${theme.textPrimary}`}>GitHub</div>
                                <div className={`text-xs ${theme.textTertiary}`}>Not connected</div>
                            </div>
                        </div>
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">Connect</button>
                    </div>
                </div>
            </div>

            {/* Password */}
            <div className={`space-y-4 pt-4 border-t ${theme.panelBorder}`}>
                <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Key className="w-4 h-4"/> Password</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${theme.textTertiary}`}>Current Password</label>
                        <input type="password" placeholder="••••••••" className={`w-full border rounded-xl px-4 py-3 outline-none transition ${theme.inputBg} ${theme.inputBorder}`} />
                    </div>
                    <div className="space-y-2">
                        <label className={`text-xs font-bold ${theme.textTertiary}`}>New Password</label>
                        <input type="password" placeholder="••••••••" className={`w-full border rounded-xl px-4 py-3 outline-none transition ${theme.inputBg} ${theme.inputBorder}`} />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className={`px-6 py-2 rounded-lg text-sm font-bold border transition ${theme.cardBg} ${theme.cardBorder} hover:bg-white/5 ${theme.textPrimary}`}>Update Password</button>
                </div>
            </div>

            {/* 2FA */}
            <div className={`flex items-center justify-between pt-4 border-t ${theme.panelBorder}`}>
                <div>
                    <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Lock className="w-4 h-4"/> Two-Factor Authentication</h4>
                    <p className={`text-xs mt-1 ${theme.textTertiary}`}>Add an extra layer of security to your account.</p>
                </div>
                <button
                    onClick={() => updateProfile({ twoFactorEnabled: !user?.twoFactorEnabled })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${user?.twoFactorEnabled ? 'bg-green-600' : 'bg-slate-500/30'}`}
                >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${user?.twoFactorEnabled ? 'translate-x-6' : ''}`} />
                </button>
            </div>
        </div>
    );
};
