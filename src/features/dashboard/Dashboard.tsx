import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '../../components/ui/Layout';
import { useAuth } from '../auth/hooks/useAuth';
import { useSocket } from '../../stores/EventSocketContext';
import { useNavigate } from 'react-router-dom';
import { Clock, Zap, ArrowRight, Terminal, Users, Play, Code, MessageSquare, X, LogIn, Plus, ArrowLeft, Rocket, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { MOCK_NEWS } from '../../constants';
import { Room } from '../../types';
import { THEME_STYLES } from './constants/themeStyles';
import { GlassCard } from './components/GlassCard';
import { StatBadge } from './components/StatBadge';
import { QuickAction } from './components/QuickAction';
import { CollabChoiceModal } from './modals/CollabChoiceModal';
import { JoinSessionModal } from './modals/JoinSessionModal';
import { SessionSetupModal } from './modals/SessionSetupModal';
import { ComingSoonModal } from './modals/ComingSoonModal';

export const Dashboard = () => {
    const { user } = useAuth();
    const { socket, getUserSessions, checkRoomExists } = useSocket();
    const navigate = useNavigate();

    // States for Modals
    const [setupMode, setSetupMode] = useState<string | null>(null); // 'Playground' | 'Interview'
    const [showCollabChoice, setShowCollabChoice] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [collabCreateMode, setCollabCreateMode] = useState(false);
    const [showComingSoon, setShowComingSoon] = useState(false);

    const [recentRooms, setRecentRooms] = useState<Room[]>([]);

    const firstName = user?.name.split(' ')[0] || 'Developer';
    const theme = user?.dashboardTheme || 'Default';
    const styles = THEME_STYLES[theme] || THEME_STYLES['Default'];

    useEffect(() => {
        // Fetch rooms on mount
        getUserSessions();

        if (!socket) return;

        const onUserRoomsList = (rooms: Room[]) => {
            // Calculate time ago helper
            const formatTimeAgo = (timestamp: string) => {
                if (!timestamp) return 'Just now';
                const diff = Date.now() - parseInt(timestamp);
                const minutes = Math.floor(diff / 60000);
                if (minutes < 1) return 'Just now';
                if (minutes < 60) return `${minutes}m ago`;
                const hours = Math.floor(minutes / 60);
                if (hours < 24) return `${hours}h ago`;
                return `${Math.floor(hours / 24)}d ago`;
            };

            const formattedRooms = rooms.map(r => ({
                ...r,
                lastActive: formatTimeAgo(r.lastActive)
            }));
            setRecentRooms(formattedRooms);
        };

        socket.on('user-rooms-list', onUserRoomsList);

        return () => {
            socket.off('user-rooms-list', onUserRoomsList);
        };
    }, [socket, getUserSessions]);

    const handleActionClick = (mode: string) => {
        if (mode === 'Collab') {
            setShowCollabChoice(true);
        } else if (mode === 'Playground') {
            setSetupMode(mode);
        } else {
            setShowComingSoon(true);
        }
    };

    // Called when creating a room (Playground, Interview, or Collab Host)
    const handleSessionStart = (name: string, lang: string) => {
        let routeType = setupMode ? setupMode.toLowerCase() : 'collab';

        // Generate Unique ID: RoomName-####-####
        const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "-");
        const part1 = Math.floor(1000 + Math.random() * 9000);
        const part2 = Math.floor(1000 + Math.random() * 9000);
        const uniqueId = `${cleanName}-${part1}-${part2}`;

        // Navigate to the specific room ID
        navigate(`/room/${routeType}/${uniqueId}`, {
            state: {
                sessionName: name,
                language: lang,
                isHost: true
            }
        });

        // Reset
        setSetupMode(null);
        setCollabCreateMode(false);
    };

    const handleJoinSession = async (code: string) => {
        const exists = await checkRoomExists(code);
        if (exists) {
            navigate(`/room/collab/${code}`, {
                state: {
                    sessionName: `Room: ${code}`,
                    language: 'javascript',
                    isHost: false
                }
            });
            setShowJoinModal(false);
        } else {
            throw new Error('Room not found');
        }
    };

    return (
        <AppLayout>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 animate-fade-in">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Hero Welcome — staggered entry */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 animate-stagger-1">
                        <div className="space-y-1.5">
                            <h1 className={`text-4xl md:text-5xl font-bold tracking-tight ${styles.heading}`}>
                                Hello, <span className={styles.accent}>{firstName}</span>.
                            </h1>
                            <p className={`text-base ${styles.subtext}`}>What are we building today?</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <StatBadge icon={<Clock />} label="Time Coded" value="12h 4m" color="bg-blue-500 text-blue-400" styles={styles} />
                            <StatBadge icon={<Zap />} label="Streak" value="5 Days" color="bg-amber-500 text-amber-400" styles={styles} />
                        </div>
                    </div>

                    {/* Quick Start Grid — stagger each card (30-80ms between items) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="animate-stagger-1">
                            <QuickAction
                                title="Playground"
                                sub="Solo sandbox"
                                icon={<Terminal className="w-5 h-5 text-emerald-300" />}
                                gradient="from-emerald-500 to-teal-700"
                                colorClass="bg-emerald-500/15"
                                onClick={() => handleActionClick('Playground')}
                                styles={styles}
                            />
                        </div>
                        <div className="animate-stagger-2">
                            <QuickAction
                                title="Collab Room"
                                sub="Multiplayer session"
                                icon={<Users className="w-5 h-5 text-blue-300" />}
                                gradient="from-blue-500 to-indigo-700"
                                colorClass="bg-blue-500/15"
                                onClick={() => handleActionClick('Collab')}
                                styles={styles}
                            />
                        </div>
                        <div className="animate-stagger-3">
                            <QuickAction
                                title="Mock Interview"
                                sub="AI & Peer practice"
                                icon={<MessageSquare className="w-5 h-5 text-purple-300" />}
                                gradient="from-purple-500 to-pink-700"
                                colorClass="bg-purple-500/15"
                                onClick={() => handleActionClick('Interview')}
                                styles={styles}
                            />
                        </div>
                        <div className="animate-stagger-4">
                            <QuickAction
                                title="Challenges"
                                sub="Level up"
                                icon={<Code className="w-5 h-5 text-amber-300" />}
                                gradient="from-amber-500 to-orange-700"
                                colorClass="bg-amber-500/15"
                                onClick={() => handleActionClick('Challenges')}
                                styles={styles}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Sessions */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className={`text-xl font-bold ${styles.heading}`}>Recent Sessions</h2>
                                <button className={`text-sm font-medium transition ${styles.highlight} hover:underline`}>All Sessions</button>
                            </div>

                            <div className="space-y-3">
                                {recentRooms.length === 0 ? (
                                    <div className={`p-8 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center opacity-50 ${styles.cardBorder}`}>
                                        <Terminal className="w-8 h-8 mb-2 opacity-50" />
                                        <p className="text-sm font-medium">No recent sessions found.</p>
                                        <p className="text-xs">Start a new project to see it here.</p>
                                    </div>
                                ) : (
                                    recentRooms.map((room) => (
                                        <GlassCard
                                            key={room.id}
                                            className="!p-4 flex items-center justify-between group"
                                            onClick={() => navigate(`/room/${room.type.toLowerCase()}/${room.id}`, { state: { sessionName: room.name, language: room.language } })}
                                            styles={styles}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${styles.badgeBorder} ${
                                                    room.type === 'Playground' ? 'bg-green-500/10 text-green-400' :
                                                    room.type === 'Collab' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                                }`}>
                                                    {room.type === 'Playground' && <Terminal className="w-6 h-6" />}
                                                    {room.type === 'Collab' && <Users className="w-6 h-6" />}
                                                    {room.type === 'Interview' && <MessageSquare className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h4 className={`font-semibold text-base transition-colors duration-150 group-hover:opacity-80 ${styles.heading}`}>{room.name}</h4>
                                                    <div className="flex items-center gap-3 text-xs font-medium mt-1">
                                                        <span className={`px-2.5 py-1 rounded-md border backdrop-blur-md shadow-sm ${styles.badgeBg} ${styles.badgeBorder} ${styles.heading} bg-opacity-50`}>{room.language}</span>
                                                        <span className={styles.subtext}>{room.lastActive}</span>
                                                        {room.participants > 0 && <span className="flex items-center gap-1 text-xs opacity-60"><Users className="w-3 h-3"/> {room.participants}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${styles.iconContainer} ${styles.subtext} group-hover:bg-blue-500 group-hover:text-white`}>
                                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                            </div>
                                        </GlassCard>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                             {/* Weekly Progress */}
                             <div className={`border rounded-3xl p-6 relative overflow-hidden backdrop-blur-md ${styles.cardBg} ${styles.cardBorder}`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className={`font-bold text-lg ${styles.heading}`}>Weekly Goal</h3>
                                        <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Level 4</span>
                                    </div>

                                    <div className="flex items-end gap-2 mb-2">
                                        <span className={`text-5xl font-bold tracking-tight ${styles.heading}`}>12</span>
                                        <span className={`mb-2 font-medium ${styles.subtext}`}>/ 20 problems</span>
                                    </div>

                                    <div className={`w-full h-3 rounded-full overflow-hidden shadow-inner ${theme === 'BlueSky' ? 'bg-slate-200' : 'bg-slate-800'}`}>
                                        <div className={`bg-gradient-to-r ${styles.hoverGradient} h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]`} style={{ width: '60%' }}></div>
                                    </div>
                                    <p className={`text-xs mt-4 text-center ${styles.subtext}`}>Keep it up! You're in the top 10% this week.</p>
                                </div>
                             </div>

                             {/* Community Updates */}
                             <div>
                                <h3 className={`text-lg font-bold mb-4 px-2 ${styles.heading}`}>Community Updates</h3>
                                <div className="space-y-4">
                                    {MOCK_NEWS.map(news => (
                                        <GlassCard key={news.id} className="!p-4 hover:bg-white/5 transition" styles={styles}>
                                            <div className="flex gap-3">
                                                <div className="mt-1.5 min-w-[6px] h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"></div>
                                                <div>
                                                    <h4 className={`font-bold text-sm leading-tight mb-1 ${styles.heading}`}>{news.title}</h4>
                                                    <p className={`text-xs leading-relaxed ${styles.subtext}`}>{news.desc}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Logic */}
            {setupMode && (
                <SessionSetupModal
                    type={setupMode}
                    onClose={() => setSetupMode(null)}
                    onConfirm={handleSessionStart}
                    styles={styles}
                />
            )}

            {showCollabChoice && (
                <CollabChoiceModal
                    onClose={() => setShowCollabChoice(false)}
                    onCreate={() => { setShowCollabChoice(false); setCollabCreateMode(true); }}
                    onJoin={() => { setShowCollabChoice(false); setShowJoinModal(true); }}
                    styles={styles}
                />
            )}

            {collabCreateMode && (
                <SessionSetupModal
                    type="Collab"
                    onClose={() => setCollabCreateMode(false)}
                    onConfirm={handleSessionStart}
                    onBack={() => { setCollabCreateMode(false); setShowCollabChoice(true); }}
                    styles={styles}
                />
            )}

            {showJoinModal && (
                <JoinSessionModal
                    onClose={() => setShowJoinModal(false)}
                    onJoin={handleJoinSession}
                    onBack={() => { setShowJoinModal(false); setShowCollabChoice(true); }}
                    styles={styles}
                />
            )}

            {showComingSoon && (
                <ComingSoonModal onClose={() => setShowComingSoon(false)} styles={styles} />
            )}
        </AppLayout>
    );
};
