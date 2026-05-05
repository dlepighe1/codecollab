import React from 'react';
import { Palette, Code2, MousePointer2, Bell, Check } from 'lucide-react';
import { WorkspaceTheme } from '../../../types';
import { WORKSPACE_THEME_CONFIG } from '../../../constants';
import { THEME_STYLES } from '../constants/themeStyles';
import { RoleCursorPicker } from '../components/RoleCursorPicker';
import { EditorThemePreview } from '../components/EditorThemePreview';

export const AppearanceTab = ({ user, updateProfile, theme, themeName }: any) => {
    const prefs = user?.preferences;
    const dashboardThemes = Object.keys(THEME_STYLES);
    const workspaceThemes = Object.keys(WORKSPACE_THEME_CONFIG) as WorkspaceTheme[];
    const isVector = themeName === 'Vector';

    const updateCursorMapping = (role: string, color: string) => {
        updateProfile({
            preferences: {
                ...prefs,
                cursorMapping: {
                    ...prefs.cursorMapping,
                    [role]: color
                }
            }
        });
    };

    const toggleNotification = (key: string) => {
        updateProfile({
            preferences: {
                ...prefs,
                notifications: {
                    ...prefs.notifications,
                    [key]: !prefs.notifications[key]
                }
            }
        });
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h3 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>Appearance</h3>
                <p className={`text-sm ${theme.textSecondary}`}>Customize the look and feel of your dashboard.</p>
            </div>

            {/* Dashboard Theme */}
            <div className="space-y-4">
                <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Palette className="w-4 h-4"/> Dashboard Theme</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {dashboardThemes.map((t) => {
                        let gradient = 'from-slate-700 to-slate-900';
                        if (t === 'BlueSky') gradient = 'from-sky-400 via-cyan-200 to-white';
                        else if (t === 'Galaxy') gradient = 'from-purple-900 to-black';
                        else if (t === 'Ocean') gradient = 'from-cyan-900 to-slate-900';
                        else if (t === 'Nebula') gradient = 'from-fuchsia-900 to-purple-900';
                        else if (t === 'Vector') gradient = 'from-zinc-800 to-zinc-950';

                        const isActive = user?.dashboardTheme === t;

                        return (
                            <button
                                key={t}
                                onClick={() => updateProfile({ dashboardTheme: t })}
                                className={`relative h-28 rounded-xl border-2 transition-all overflow-hidden group text-left ${isActive ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl' : `${theme.cardBorder} hover:border-white/20 opacity-80 hover:opacity-100`}`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                                {isActive && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-lg z-10">
                                        <Check className="w-3 h-3" />
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/20 backdrop-blur-sm z-10">
                                    <span className={`text-xs font-bold ${t === 'BlueSky' ? 'text-slate-900' : 'text-white'}`}>{t}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Editor Theme */}
            <div className={`space-y-4 pt-6 border-t ${theme.panelBorder}`}>
                <label className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Code2 className="w-4 h-4"/> Editor & Workspace Theme</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {workspaceThemes.map(t => (
                        <button key={t} onClick={() => updateProfile({ preferences: { ...prefs, editorTheme: t } })} className="block w-full text-left">
                            <EditorThemePreview theme={t} isActive={prefs?.editorTheme === t} themeConfig={theme} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Cursor Mapping */}
            <div className={`space-y-4 pt-6 border-t ${theme.panelBorder}`}>
                <label className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><MousePointer2 className="w-4 h-4"/> Collaboration Cursors</label>
                <p className={`text-xs mb-4 ${theme.textSecondary}`}>Assign unique colors to identify roles in your collaborative sessions.</p>

                <div className="grid lg:grid-cols-2 gap-4">
                    <RoleCursorPicker
                        label="Host (You)"
                        role="host"
                        currentColor={prefs?.cursorMapping?.host || '#3b82f6'}
                        mapping={prefs?.cursorMapping}
                        onUpdate={updateCursorMapping}
                        theme={theme}
                    />
                    <RoleCursorPicker
                        label="Participant 1"
                        role="participant1"
                        currentColor={prefs?.cursorMapping?.participant1 || '#ef4444'}
                        mapping={prefs?.cursorMapping}
                        onUpdate={updateCursorMapping}
                        theme={theme}
                    />
                    <RoleCursorPicker
                        label="Participant 2"
                        role="participant2"
                        currentColor={prefs?.cursorMapping?.participant2 || '#10b981'}
                        mapping={prefs?.cursorMapping}
                        onUpdate={updateCursorMapping}
                        theme={theme}
                    />
                    <RoleCursorPicker
                        label="Participant 3"
                        role="participant3"
                        currentColor={prefs?.cursorMapping?.participant3 || '#f59e0b'}
                        mapping={prefs?.cursorMapping}
                        onUpdate={updateCursorMapping}
                        theme={theme}
                    />
                </div>
            </div>

            {/* Toggles */}
            <div className={`space-y-4 pt-6 border-t ${theme.panelBorder}`}>
                <label className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}><Bell className="w-4 h-4"/> Notifications & Privacy</label>
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { key: 'joinRoom', label: 'Notify when someone joins my room' },
                        { key: 'runCode', label: 'Notify on code execution' },
                        { key: 'typingIndicators', label: 'Show typing indicators' },
                        { key: 'hostAccept', label: 'Wait for host to accept (Security)' },
                    ].map(item => (
                        <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border ${theme.cardBg} ${theme.cardBorder}`}>
                            <span className={`text-sm ${theme.textSecondary}`}>{item.label}</span>
                            <button
                                onClick={() => toggleNotification(item.key)}
                                className={`w-11 h-6 rounded-full p-1 transition-colors ${prefs?.notifications[item.key] ? theme.accentBg : 'bg-slate-500/30'}`}
                            >
                                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${prefs?.notifications[item.key] ? 'translate-x-5' : ''} ${isVector && prefs?.notifications[item.key] ? 'bg-black' : 'bg-white'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
