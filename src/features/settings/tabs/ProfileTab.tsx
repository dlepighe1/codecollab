import React, { useState } from 'react';
import { Camera, Edit2, Mail, Lock, Info, Check } from 'lucide-react';
import { AvatarCustomizer } from '../components/AvatarCustomizer';

export const ProfileTab = ({ user, updateProfile, theme, themeName }: any) => {
    const [name, setName] = useState(user?.name || ''); const [username, setUsername] = useState(user?.username || ''); const [isEditing, setIsEditing] = useState(false); const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
    const handleSave = () => { updateProfile({ name }); setIsEditing(false); }; const handleAvatarSave = (newAvatarUrl: string) => { updateProfile({ avatar: newAvatarUrl }); setShowAvatarCustomizer(false); };
    return (<div className="space-y-8 animate-fade-in">{showAvatarCustomizer && <AvatarCustomizer currentAvatar={user?.avatar} userName={user?.name || 'User'} onClose={() => setShowAvatarCustomizer(false)} onSave={handleAvatarSave} theme={theme} themeName={themeName} />}<div><h3 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Profile Information</h3><p className={`text-sm ${theme.textSecondary}`}>Manage your public profile details.</p></div>

    <div className="flex flex-col items-center gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer shrink-0" onClick={() => isEditing && setShowAvatarCustomizer(true)}>
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-2xl">
                    <img src={user?.avatar} alt="Profile" className={`w-full h-full rounded-full object-cover border-4 ${theme.appBg === 'bg-white' ? 'border-white' : 'border-[#0f172a]'}`} />
                </div>
                {isEditing && (<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm border-4 border-transparent"><Camera className="w-8 h-8 text-white" /></div>)}
            </div>
            {isEditing && (<button onClick={() => setShowAvatarCustomizer(true)} className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline">Change Avatar</button>)}
        </div>

        {/* Inputs Section */}
        <div className="w-full max-w-lg space-y-6">
            <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary}`}>Display Name</label>
                <input type="text" value={name} disabled={!isEditing} onChange={(e) => setName(e.target.value)} className={`w-full border rounded-xl px-4 py-3 outline-none transition-all ${theme.inputBg} ${isEditing ? `border-blue-500/50 focus:border-blue-500 ${theme.textPrimary}` : `${theme.panelBorder} opacity-70 cursor-not-allowed ${theme.textSecondary}`}`} />
                {isEditing && <p className="text-[10px] text-amber-500/80 flex items-center gap-1.5 mt-1"><Info className="w-3 h-3" /> You can change your display name once every 60 days.</p>}
            </div>
            <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary}`}>Username</label>
                <div className="relative">
                    <span className={`absolute left-4 top-3.5 text-sm ${theme.textTertiary}`}>@</span>
                    <input type="text" value={username} disabled className={`w-full border rounded-xl px-4 py-3 pl-8 outline-none transition-all ${theme.inputBg} ${theme.panelBorder} opacity-50 cursor-not-allowed ${theme.textSecondary}`} />
                    <Lock className="absolute right-4 top-3.5 w-4 h-4 opacity-30" />
                </div>
                <p className="text-[10px] opacity-50">Username cannot be changed.</p>
            </div>
            <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${theme.textTertiary}`}>Email Address</label>
                <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${theme.cardBg} ${theme.panelBorder} opacity-80`}>
                    <Mail className={`w-4 h-4 ${theme.textTertiary}`} />
                    <span className={`flex-1 ${theme.textSecondary}`}>{user?.email}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded flex items-center gap-1"><Check className="w-3 h-3"/> Verified</span>
                </div>
            </div>

            <div className={`pt-4 flex justify-end border-t ${theme.panelBorder}`}>
                {isEditing ? (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button onClick={() => setIsEditing(false)} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition ${theme.buttonSecondary}`}>Cancel</button>
                        <button onClick={handleSave} className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition shadow-lg ${theme.buttonPrimary}`}>Save Changes</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition border ${theme.cardBg} ${theme.panelBorder} ${theme.textPrimary} hover:bg-white/5`}><Edit2 className="w-4 h-4" /> Edit Profile</button>
                )}
            </div>
        </div>
    </div>
    </div>);
};
