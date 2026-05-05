import React, { useState, useEffect, useRef } from 'react';
import { Plus, User as UserIcon, Crown, Eye, UserMinus } from 'lucide-react';
import { User } from '../../../types';
import { getUserColor } from '../helpers/colors';

interface ParticipantsPanelProps {
    themeConfig: any;
    onInvite: () => void;
    participants: User[];
    currentUserId: string | undefined;
    hostId: string | null;
    onKick: (userId: string) => void;
    onFollow: (userId: string) => void;
}

const ParticipantsPanel = ({ themeConfig, onInvite, participants, currentUserId, hostId, onKick, onFollow }: ParticipantsPanelProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const otherParticipants = participants.filter((p: User) => p.id !== currentUserId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(!isOpen)} className="flex -space-x-2 hover:opacity-80 transition cursor-pointer px-1">
                    {otherParticipants.slice(0, 3).map((p: User) => (
                        <div key={p.id} className="relative inline-block border-2 rounded-full" style={{ borderColor: themeConfig.ui.menuBg }}>
                            <img
                                src={p.avatar}
                                className={`w-8 h-8 rounded-full object-cover ${p.status === 'away' ? 'opacity-50 grayscale' : ''}`}
                                title={`${p.name} ${p.status === 'away' ? '(Away)' : ''}`}
                            />
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[${themeConfig.ui.menuBg}] ${p.status === 'away' ? 'bg-slate-400' : 'bg-green-500'}`}></span>
                        </div>
                    ))}
                    {otherParticipants.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white" style={{ borderColor: themeConfig.ui.menuBg }}>
                            +{otherParticipants.length - 3}
                        </div>
                    )}
                    {otherParticipants.length === 0 && (
                        <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center text-white/40" title="Just You">
                            <UserIcon className="w-3 h-3" />
                        </div>
                    )}
                </button>
                <button
                    onClick={onInvite}
                    className="w-8 h-8 rounded-full text-white flex items-center justify-center shadow-lg border-2 transition transform hover:scale-105"
                    style={{ backgroundColor: themeConfig.ui.accent, borderColor: themeConfig.ui.menuBg, color: (themeConfig.name === 'Cyberpunk' || themeConfig.name === 'Obsidian Black') ? '#000' : '#fff' }}
                    title="Invite People"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 rounded-xl shadow-2xl border p-2 z-50 animate-fade-in" style={{ backgroundColor: themeConfig.ui.menuBg, borderColor: themeConfig.ui.border, color: themeConfig.ui.text }}>
                    <h3 className="text-xs font-bold uppercase opacity-50 px-2 py-2 mb-1 border-b border-white/5">Collaborators</h3>
                    <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-1 mt-1">
                        {otherParticipants.length === 0 ? (
                            <div className="py-8 text-center opacity-40 text-xs italic">No other participants in the room</div>
                        ) : (
                            otherParticipants.map((p: User) => {
                                const isHost = p.id === hostId;
                                const userColor = getUserColor(p.id);

                                return (
                                    <div key={p.id} className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 group ${p.status === 'away' ? 'opacity-60' : ''}`}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="relative shrink-0">
                                                <img src={p.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-transparent" style={{ borderColor: isHost ? '#f59e0b' : 'transparent' }} />
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[${themeConfig.ui.menuBg}] ${p.status === 'away' ? 'bg-slate-400' : 'bg-green-500'}`}></div>
                                            </div>
                                            <div className="truncate">
                                                <div className="text-sm font-bold leading-none flex items-center gap-1.5">
                                                    <span className="truncate">{p.name}</span>
                                                    {isHost && <Crown className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: userColor }} title="Assigned Color" />
                                                </div>
                                                <div className="text-[10px] opacity-60 truncate mt-1 flex items-center gap-1.5">
                                                    {p.status === 'away' ? 'Away' : 'Active'}
                                                    <span className="opacity-30">•</span>
                                                    <span className="capitalize">{p.activeTab || 'Editor'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {p.status !== 'away' && (
                                                <button
                                                    onClick={() => onFollow(p.id)}
                                                    className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition"
                                                    title={`Follow ${p.name}`}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            {currentUserId === hostId && (
                                                <button
                                                    onClick={() => onKick(p.id)}
                                                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                                    title={`Kick ${p.name}`}
                                                >
                                                    <UserMinus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ParticipantsPanel;
