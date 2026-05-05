import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AVATAR_COLORS = ['0D8ABC', 'EF4444', '10B981', 'F59E0B', '8B5CF6', 'EC4899', '14B8A6', '6366F1'];
const PRESET_AVATARS = [
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix', 'https://api.dicebear.com/9.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Zack', 'https://api.dicebear.com/9.x/avataaars/svg?seed=Molly',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Garfield', 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bella',
    'https://api.dicebear.com/9.x/avataaars/svg?seed=Rocky', 'https://api.dicebear.com/9.x/avataaars/svg?seed=Simba',
];

export const AvatarCustomizer = ({ currentAvatar, onClose, onSave, userName, theme, themeName }: any) => {
    const [mode, setMode] = useState<'initials' | 'presets'>('initials');
    const [initials, setInitials] = useState(userName.substring(0, 2).toUpperCase() || 'DEV');
    const [bgColor, setBgColor] = useState(AVATAR_COLORS[0]);
    const [preview, setPreview] = useState(currentAvatar);
    useEffect(() => { if (mode === 'initials') setPreview(`https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff&size=256&font-size=0.4`); }, [initials, bgColor, mode]);
    const handlePresetClick = (url: string) => { setPreview(url); setMode('presets'); };
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className={`relative border rounded-2xl p-6 w-full max-w-md animate-fade-in shadow-2xl ${theme.modalBg} ${theme.cardBorder}`}>
                <div className="flex justify-between items-center mb-6"><h3 className={`text-xl font-bold ${theme.textPrimary}`}>Customize Avatar</h3><button onClick={onClose} className={`p-1 hover:bg-white/10 rounded-full transition hover:text-white ${theme.textSecondary}`}><X className="w-5 h-5" /></button></div>
                <div className="flex flex-col items-center mb-8"><div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-xl mb-4"><img src={preview} alt="Preview" className={`w-full h-full rounded-full object-cover border-4 ${theme.appBg === 'bg-white' ? 'border-white' : 'border-[#0f172a]'}`} /></div><div className={`flex gap-2 p-1 rounded-xl border ${theme.inputBg} ${theme.cardBorder}`}><button onClick={() => { setMode('initials'); setPreview(`https://ui-avatars.com/api/?name=${initials}&background=${bgColor}&color=fff&size=256`); }} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${mode === 'initials' ? 'bg-blue-600 text-white shadow-lg' : `${theme.textSecondary} hover:text-white`}`}>Initials</button><button onClick={() => setMode('presets')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${mode === 'presets' ? 'bg-blue-600 text-white shadow-lg' : `${theme.textSecondary} hover:text-white`}`}>Avatars</button></div></div>
                {mode === 'initials' ? (<div className="space-y-6"><div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textTertiary}`}>Initials</label><input type="text" maxLength={2} value={initials} onChange={(e) => setInitials(e.target.value.toUpperCase())} className={`w-full border rounded-xl px-4 py-3 text-center font-bold tracking-widest outline-none focus:border-blue-500 transition ${theme.inputBg} ${theme.cardBorder} ${theme.textPrimary}`} /></div><div><label className={`text-xs font-bold uppercase tracking-wider mb-2 block ${theme.textTertiary}`}>Background Color</label><div className="flex flex-wrap gap-3 justify-center">{AVATAR_COLORS.map(color => (<button key={color} onClick={() => setBgColor(color)} className={`w-8 h-8 rounded-full border-2 transition hover:scale-110 ${bgColor === color ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`} style={{ backgroundColor: `#${color}` }} />))}</div></div></div>) : (<div className="grid grid-cols-4 gap-3">{PRESET_AVATARS.map((url, i) => (<button key={i} onClick={() => handlePresetClick(url)} className={`rounded-full p-1 border-2 transition hover:scale-105 ${preview === url ? 'border-blue-500 bg-blue-500/20' : 'border-transparent hover:bg-white/5'}`}><img src={url} className="w-full h-full rounded-full" alt={`Avatar ${i+1}`} /></button>))}</div>)}
                <div className="mt-8 flex gap-3"><button onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold transition ${theme.buttonSecondary}`}>Cancel</button><button onClick={() => onSave(preview)} className={`flex-1 py-3 rounded-xl font-bold shadow-lg transition ${theme.buttonPrimary}`}>Apply Changes</button></div>
            </div>
        </div>
    );
};
