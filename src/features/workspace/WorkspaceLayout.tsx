import React, { useState, useEffect, useRef } from 'react';
import { FileNode, RoomType, WorkspaceTheme, RemoteCursor, User } from '../../types';
import { WORKSPACE_THEME_CONFIG, LANGUAGE_MAP } from '../../constants';
import { useAuth } from '../auth/hooks/useAuth';
import { useSocket } from '../../stores/EventSocketContext';
import { useNavigate } from 'react-router-dom';
import CodeMirrorEditor from './editor/CodeMirrorEditor';
import {
    FileText, Play, Settings, Plus,
    Terminal as TerminalIcon, X, Code2, LogOut, Trash2,
    PenTool, PanelLeftClose, PanelLeftOpen,
    Loader2, FolderPlus
} from 'lucide-react';

import { addNodeToTree, removeNodeFromTree, updateNodeInTree, findNode } from './helpers/tree';
import { executeCode } from '../../lib/piston';
import { getUserColor } from './helpers/colors';
import ToastContainer from './components/ToastContainer';
import StatusBar from './components/StatusBar';
import TldrawBoard from './whiteboard/TldrawBoard';
import { FileTreeItem, FileContextMenu } from './panels/FileExplorer';
import AIChatPanel from './panels/AIChatPanel';
import TerminalPanel from './panels/TerminalPanel';
import ParticipantsPanel from './participants/ParticipantsPanel';
import InviteModal from './participants/InviteModal';
import WorkspaceSettings from './settings/WorkspaceSettings';
import { FABController } from './FABController';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { useCollaboration } from './collaboration/useCollaboration';

type LayoutMode = 'connected' | 'separated';
type TerminalLine = { type: 'stdout' | 'stderr' | 'info' | 'system'; text: string };


export const Workspace = ({ mode, sessionName, language, roomId }: { mode: RoomType, sessionName: string, language: string, roomId: string }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { socket, joinRoom, leaveRoom, pauseRoom, deleteSession, updateUserStatus, isConnected } = useSocket();

    // Realtime State
    const [toasts, setToasts] = useState<{ id: string, message: string, type: 'info' | 'warning' }[]>([]);
    const [remoteCursors, setRemoteCursors] = useState<RemoteCursor[]>([]);
    const [participants, setParticipants] = useState<User[]>([]);
    const [hostId, setHostId] = useState<string | null>(null);

    const [currentSessionName, setCurrentSessionName] = useState(sessionName);
    const [activeTab, setActiveTab] = useState<'editor' | 'whiteboard'>('editor');

    // Initialize files with a default starter file immediately
    const [files, setFiles] = useState<FileNode[]>(() => {
        const config = LANGUAGE_MAP[language] || LANGUAGE_MAP['javascript'];
        return [{ id: 'main', name: `main.${config.ext}`, type: 'file', language, content: config.defaultContent }];
    });

    // Initialize activeFileId to main
    const [activeFileId, setActiveFileId] = useState<string>('main');
    const [currentLanguage, setCurrentLanguage] = useState(language);

    // Layout State
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('connected');
    const [isExplorerOpen, setIsExplorerOpen] = useState(window.innerWidth >= 768);
    const [isConsoleOpen, setIsConsoleOpen] = useState(true);
    const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [showStatusBar, setShowStatusBar] = useState(user?.preferences?.showStatusBar ?? true);

    const [isSplit, setIsSplit] = useState(false);
    const [activePane, setActivePane] = useState<'primary' | 'secondary'>('primary');
    const [secondaryFileId, setSecondaryFileId] = useState<string | null>(null);

    const [showSettings, setShowSettings] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [theme, setTheme] = useState<WorkspaceTheme>('Default');

    const [fontSize, setFontSize] = useState(14);
    const [minimapEnabled, setMinimapEnabled] = useState(false);
    const [terminalFontSize, setTerminalFontSize] = useState(12);
    const [executionMeta, setExecutionMeta] = useState(false);

    const [fabEnabled, setFabEnabled] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);
    const [fabColor, setFabColor] = useState<'colorful' | 'theme'>('colorful');
    const [toastSounds, setToastSounds] = useState(true);

    const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, fileId: string, nodeType: 'file' | 'folder' } | null>(null);
    const [cursorPosition, setCursorPosition] = useState<{ lineNumber: number, column: number }>({ lineNumber: 1, column: 1 });

    // Drag and Drop State
    const [draggedNode, setDraggedNode] = useState<FileNode | null>(null);

    // User Menu Ref
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Resizing State
    const [explorerWidth, setExplorerWidth] = useState(256);
    const [consoleHeight, setConsoleHeight] = useState(200);
    const [splitRatio, setSplitRatio] = useState(0.5);
    const [isResizing, setIsResizing] = useState<null | 'explorer' | 'console' | 'split'>(null);
    const editorsContainerRef = useRef<HTMLDivElement>(null);

    const currentThemeConfig = WORKSPACE_THEME_CONFIG[theme];

    useKeyboardShortcut([
        { key: 'b', ctrlKey: true, action: () => setIsExplorerOpen(prev => !prev) },
        { key: '`', ctrlKey: true, action: () => setIsConsoleOpen(prev => !prev) },
        { key: 'l', ctrlKey: true, action: () => setIsAiOpen(prev => !prev) },
        { key: 'F', ctrlKey: true, shiftKey: true, action: () => setFabEnabled(prev => !prev) },
    ]);

    const { ydoc, provider } = useCollaboration(roomId, user?.name || 'Anonymous');

    const getYText = (fileId: string) => ydoc.getText(`file:${fileId}`);

    const isLightMode = theme === 'Snow White';

    const hasUnsavedChanges = useRef(false);
    const filesRef = useRef(files);
    const sessionCleanupIntent = useRef<'pause' | 'leave' | 'end'>('pause');
    const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { filesRef.current = files; }, [files]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) { setShowUserMenu(false); }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update presence based on tab switch
    useEffect(() => {
        if (socket && isConnected) {
            updateUserStatus(roomId, 'active');
            socket.emit('user:presence-update', { roomId, userId: user?.id, activeTab });
        }
    }, [activeTab, socket, isConnected, roomId, user]);

    useEffect(() => {
        const handleActivity = () => {
            if (idleTimeoutRef.current) { clearTimeout(idleTimeoutRef.current); idleTimeoutRef.current = null; }
            idleTimeoutRef.current = setTimeout(() => { updateUserStatus(roomId, 'away'); }, 15000);
            updateUserStatus(roomId, 'active');
        };
        let throttleTimeout: ReturnType<typeof setTimeout> | null = null;
        const throttledActivity = () => {
            if (!throttleTimeout) { handleActivity(); throttleTimeout = setTimeout(() => { throttleTimeout = null; }, 2000); }
            else { if (idleTimeoutRef.current) { clearTimeout(idleTimeoutRef.current); idleTimeoutRef.current = setTimeout(() => { updateUserStatus(roomId, 'away'); }, 15000); } }
        };
        window.addEventListener('mousemove', throttledActivity);
        window.addEventListener('keydown', throttledActivity);
        window.addEventListener('click', throttledActivity);
        updateUserStatus(roomId, 'active');
        idleTimeoutRef.current = setTimeout(() => { updateUserStatus(roomId, 'away'); }, 15000);
        return () => {
            window.removeEventListener('mousemove', throttledActivity);
            window.removeEventListener('keydown', throttledActivity);
            window.removeEventListener('click', throttledActivity);
            if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
            if (throttleTimeout) clearTimeout(throttleTimeout);
        };
    }, [roomId, updateUserStatus]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            e.preventDefault();
            if (isResizing === 'explorer') { setExplorerWidth(Math.max(160, Math.min(600, e.clientX))); }
            else if (isResizing === 'console') { setConsoleHeight(Math.max(40, Math.min(window.innerHeight - 100, window.innerHeight - e.clientY))); }
            else if (isResizing === 'split' && editorsContainerRef.current) { const rect = editorsContainerRef.current.getBoundingClientRect(); setSplitRatio(Math.max(0.2, Math.min(0.8, (e.clientX - rect.left) / rect.width))); }
        };
        const handleMouseUp = () => { setIsResizing(null); document.body.style.cursor = 'default'; document.body.style.userSelect = 'auto'; };
        if (isResizing) { window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp); document.body.style.cursor = isResizing === 'console' ? 'row-resize' : 'col-resize'; document.body.style.userSelect = 'none'; }
        return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
    }, [isResizing]);

    useEffect(() => {
        if (!socket || !roomId) return;
        const onRoomState = ({ files: initialFiles, participants: initialParticipants }: { files: FileNode[]; participants: User[] }) => {
            if (initialFiles && initialFiles.length > 0) {
                setFiles(initialFiles);
                const activeFileExists = initialFiles.some((f: FileNode) => f.id === activeFileId);
                if (!activeFileExists) {
                    const findFirstFile = (nodes: FileNode[]): string | null => {
                        for (const n of nodes) {
                            if (n.type === 'file') return n.id;
                            if (n.children) { const res = findFirstFile(n.children); if (res) return res; }
                        }
                        return null;
                    };
                    const first = findFirstFile(initialFiles);
                    if (first) setActiveFileId(first);
                }
            }
            if (initialParticipants) setParticipants(initialParticipants);
        };
        const onRoomConfig = (config: { language?: string; name?: string; hostId?: string }) => {
            if (config.language) setCurrentLanguage(config.language);
            if (config.name) setCurrentSessionName(config.name);
            if (config.hostId) setHostId(config.hostId);
        };
        const onTerminalOutput = (line: TerminalLine) => {
            setTerminalOutput(prev => [...prev, line]);
            if (!isConsoleOpen) setIsConsoleOpen(true);
        };
        const onUserJoined = (joinedUser: User) => {
            setParticipants(prev => {
                const idx = prev.findIndex(p => p.id === joinedUser.id);
                if (idx !== -1) { const newArr = [...prev]; newArr[idx] = joinedUser; return newArr; }
                return [...prev, joinedUser];
            });
            addToast(`${joinedUser.name} joined the session`, 'info');
        };
        const onUserPaused = ({ userId }: { userId: string }) => { setParticipants(prev => prev.map(p => p.id === userId ? { ...p, status: 'paused' as const } : p)); };
        const onUserUpdated = (updatedUser: User) => { setParticipants(prev => prev.map(p => p.id === updatedUser.id ? { ...p, ...updatedUser } : p)); };
        const onUserLeft = ({ userId, userName }: { userId: string; userName?: string }) => {
            setParticipants(prev => prev.filter(p => p.id !== userId));
            addToast(`${userName || 'A participant'} left the session`, 'warning');
        };
        const onUserKicked = ({ userId }: { userId: string }) => {
            if (userId === user?.id) {
                alert('You have been kicked from the room.');
                navigate('/dashboard');
            } else {
                setParticipants(prev => prev.filter(p => p.id !== userId));
            }
        };
        const onSessionEnded = () => { alert("The host has ended this session."); navigate('/dashboard'); };

        const onFileCreate = ({ file, parentId }: { file: FileNode, parentId?: string }) => {
            setFiles(prev => addNodeToTree(prev, parentId || null, file));
            addToast(`${file.type === 'folder' ? 'Folder' : 'File'} ${file.name} created`, 'info');
        };
        const onFileDelete = ({ fileId }: { fileId: string }) => {
            setFiles(prev => removeNodeFromTree(prev, fileId));
            if (activeFileId === fileId) setActiveFileId(files.find(f => f.id !== fileId)?.id || '');
            if (secondaryFileId === fileId) setSecondaryFileId(null);
            addToast('Item deleted', 'warning');
        };
        const onFileRename = ({ fileId, name }: { fileId: string; name: string }) => setFiles(prev => updateNodeInTree(prev, fileId, { name }));
        const onFileMove = ({ fileId, targetFolderId }: { fileId: string; targetFolderId: string | null }) => {
            setFiles(prev => {
                const temp = removeNodeFromTree(prev, fileId);
                const nodeToMove = findNode(filesRef.current, fileId);
                if (!nodeToMove) return prev;
                return addNodeToTree(temp, targetFolderId, nodeToMove);
            });
        };
        socket.on('room-state', onRoomState);
        socket.on('room-config', onRoomConfig);
        socket.on('terminal:output', onTerminalOutput);
        socket.on('user:joined', onUserJoined);
        socket.on('user:paused', onUserPaused);
        socket.on('user:updated', onUserUpdated);
        socket.on('user:left', onUserLeft);
        socket.on('user:kicked', onUserKicked);
        socket.on('session-ended', onSessionEnded);
        socket.on('file:create', onFileCreate);
        socket.on('file:delete', onFileDelete);
        socket.on('file:rename', onFileRename);
        socket.on('file:move', onFileMove);

        joinRoom(roomId, { language, name: sessionName, type: mode });
        return () => {
            socket.off('room-state', onRoomState); socket.off('room-config', onRoomConfig); socket.off('terminal:output', onTerminalOutput);
            socket.off('user:joined', onUserJoined); socket.off('user:paused', onUserPaused); socket.off('user:updated', onUserUpdated);
            socket.off('user:left', onUserLeft); socket.off('user:kicked', onUserKicked); socket.off('session-ended', onSessionEnded);
            socket.off('file:create', onFileCreate); socket.off('file:delete', onFileDelete);
            socket.off('file:rename', onFileRename); socket.off('file:move', onFileMove);
            if (sessionCleanupIntent.current === 'end' || sessionCleanupIntent.current === 'leave') { leaveRoom(roomId); } else { pauseRoom(roomId); }
        };
    }, [socket, roomId, user, navigate, joinRoom, leaveRoom, pauseRoom, language, sessionName, mode]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (hasUnsavedChanges.current && filesRef.current.length > 0) { localStorage.setItem(`codecollab_room_${roomId}_files`, JSON.stringify(filesRef.current)); hasUnsavedChanges.current = false; addToast('Auto-saved to local storage', 'info'); }
        }, 30000);
        return () => clearInterval(interval);
    }, [roomId]);

    const addToast = (message: string, type: 'info' | 'warning') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    useEffect(() => { setTerminalOutput([{ type: 'info', text: `Connected to Piston Runtime (${currentLanguage})...` }]); }, [currentLanguage]);

    const activeFile = findNode(files, activeFileId);
    const secondaryFile = findNode(files, secondaryFileId || '');

    const updateFileContent = (value: string | undefined, fileId: string) => {
        setFiles(prev => updateNodeInTree(prev, fileId, { content: value || '' }));
        hasUnsavedChanges.current = true;
    };

    const handleCursorChange = (pos: { lineNumber: number; column: number }) => {
        setCursorPosition(pos);
    };

    const cleanPistonOutput = (text: string) =>
        text.replace(/\/piston\/jobs\/[a-f0-9-]+\/file\d+\.code:(\d+)/g, 'Error on line $1');

    const emitLine = (type: TerminalLine['type'], text: string) => {
        const line: TerminalLine = { type, text };
        setTerminalOutput(prev => [...prev, line]);
        socket?.emit('terminal:output', { roomId, line });
    };

    const handleRunCode = async (targetFile: FileNode | null | undefined) => {
        if (!targetFile || targetFile.type === 'folder') return;
        setIsRunning(true);
        if (!isConsoleOpen) setIsConsoleOpen(true);
        setTerminalOutput([]);
        const config = LANGUAGE_MAP[currentLanguage] || LANGUAGE_MAP['javascript'];
        const startTime = performance.now();

        if (executionMeta) emitLine('system', `[Running] ${targetFile.name}...`);

        const result = await executeCode(config.piston, targetFile.content || '');
        const duration = ((performance.now() - startTime) / 1000).toFixed(3);

        if (result.output) emitLine('stdout', result.output);
        if (result.error) emitLine('stderr', cleanPistonOutput(result.error));
        if (!result.output && !result.error) emitLine('info', 'Program finished with no output.');
        if (executionMeta) emitLine('system', `[Done] exited in ${duration}s`);

        setIsRunning(false);
    };

    const handleRenameFile = (newName: string) => {
        if (renamingFileId) {
            setFiles(prev => updateNodeInTree(prev, renamingFileId, { name: newName }));
            if (socket) socket.emit('file:rename', { roomId, fileId: renamingFileId, name: newName });
            setRenamingFileId(null);
        }
    };

    const handleFileAction = (action: string) => {
        if (!contextMenu) return;
        const { fileId, nodeType } = contextMenu;

        if (action === 'Split Screen') {
            if (nodeType === 'file') { setIsSplit(true); setSecondaryFileId(fileId); setActivePane('secondary'); }
        } else if (action === 'Delete') {
            if (files.length <= 1 && files[0].id === fileId) { alert("Cannot delete the last item."); return; }
            setFiles(prev => removeNodeFromTree(prev, fileId));
            if (activeFileId === fileId) setActiveFileId(files.find(f => f.id !== fileId)?.id || '');
            if (secondaryFileId === fileId) setSecondaryFileId(null);
            if (socket) socket.emit('file:delete', { roomId, fileId });
        } else if (action === 'Rename') {
            setRenamingFileId(fileId);
        } else if (action === 'Download') {
            const file = findNode(files, fileId);
            if (file && file.type === 'file') {
                const blob = new Blob([file.content || ''], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = file.name; a.click();
            }
        } else if (action === 'New File') {
            createNewFile(fileId);
        } else if (action === 'New Folder') {
            createNewFolder(fileId);
        }
    };

    const createNewFile = (parentId?: string) => {
        const config = LANGUAGE_MAP[currentLanguage] || LANGUAGE_MAP['javascript'];
        const newFile: FileNode = { id: `file-${Date.now()}`, name: `untitled.${config.ext}`, type: 'file', language: currentLanguage, content: '' };
        setFiles(prev => addNodeToTree(prev, parentId || null, newFile));
        if (activePane === 'primary') setActiveFileId(newFile.id); else setSecondaryFileId(newFile.id);
        if (socket) socket.emit('file:create', { roomId, file: newFile, parentId });
        setRenamingFileId(newFile.id);
    };

    const createNewFolder = (parentId?: string) => {
        const newFolder: FileNode = { id: `folder-${Date.now()}`, name: `New Folder`, type: 'folder', children: [], isOpen: true };
        setFiles(prev => addNodeToTree(prev, parentId || null, newFolder));
        if (socket) socket.emit('file:create', { roomId, file: newFolder, parentId });
        setRenamingFileId(newFolder.id);
    };

    const handleDragStart = (e: React.DragEvent, node: FileNode) => {
        setDraggedNode(node);
        e.dataTransfer.setData('text/plain', node.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, node: FileNode) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetNode: FileNode) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId && draggedId !== targetNode.id && targetNode.type === 'folder') {
            setFiles(prev => {
                const temp = removeNodeFromTree(prev, draggedId);
                const nodeToMove = draggedNode || findNode(files, draggedId);
                if (!nodeToMove) return prev;
                return addNodeToTree(temp, targetNode.id, nodeToMove);
            });
            if (socket) { socket.emit('file:move', { roomId, fileId: draggedId, targetFolderId: targetNode.id }); }
        }
        setDraggedNode(null);
    };

    const onFileSelect = (node: FileNode) => {
        if (node.type === 'folder') return;
        if (activePane === 'primary') { setActiveFileId(node.id); } else { setSecondaryFileId(node.id); }
    };

    const handleKick = (targetUserId: string) => { if (socket) socket.emit('kick-user', { roomId, targetUserId }); };

    const handleFollow = (targetUserId: string) => {
        const targetUser = participants.find(p => p.id === targetUserId);
        if (!targetUser) return;

        const targetTab = targetUser.activeTab || 'editor';
        setActiveTab(targetTab);

        if (targetTab === 'editor') {
            const cursor = remoteCursors.find(c => c.userId === targetUserId);
            if (cursor) {
                if (cursor.fileId !== activeFileId) {
                    setActiveFileId(cursor.fileId);
                }
                addToast(`Following ${cursor.userName} in ${cursor.fileId}`, 'info');
            } else {
                addToast(`${targetUser.name} is in Editor but cursor position is unknown.`, 'warning');
            }
        } else {
            addToast(`Following ${targetUser.name} on the Whiteboard`, 'info');
        }
    };

    const isSeparated = layoutMode === 'separated';
    const isObsidian = theme === 'Obsidian Black';
    const bgStyle = (isObsidian && isSeparated) ? '#111111' : currentThemeConfig.ui.bg;

    return (
        <div
            className="font-sans transition-colors duration-300 fixed inset-0 overflow-hidden"
            style={{ background: bgStyle, color: currentThemeConfig.ui.text, zIndex: 10 }}
        >
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <header
                className="absolute top-0 left-0 right-0 flex flex-row items-center justify-between px-4 z-30"
                style={{ height: '48px', background: isSeparated ? currentThemeConfig.ui.panelBg : currentThemeConfig.ui.glass, borderBottom: `1px solid ${currentThemeConfig.ui.border}` }}
            >
                {/* Left — logo + session breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '0 1 auto' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity"
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <div className="p-1.5 rounded-lg" style={{ background: currentThemeConfig.ui.accent, borderRadius: '8px', padding: '6px' }}>
                            <Code2 className="w-4 h-4" style={{ width: '16px', height: '16px', color: theme === 'Obsidian Black' ? '#000' : '#fff' }} />
                        </div>
                        <span className="font-bold text-sm tracking-tight hidden md:block" style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '-0.01em', color: currentThemeConfig.ui.text }}>CodeCollab</span>
                    </button>

                    <div style={{ width: '1px', height: '18px', background: currentThemeConfig.ui.border, flexShrink: 0 }} />

                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <span className="font-semibold text-xs truncate" style={{ fontWeight: 600, fontSize: '12px', color: currentThemeConfig.ui.text, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSessionName}</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.07em', padding: '2px 6px', borderRadius: '4px', background: `${currentThemeConfig.ui.accent}22`, color: currentThemeConfig.ui.accent, border: `1px solid ${currentThemeConfig.ui.accent}40` }}>{mode}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span className="font-mono text-[10px]" style={{ fontFamily: 'monospace', fontSize: '10px', opacity: 0.45, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{currentLanguage}</span>
                            <span style={{ fontSize: '10px', opacity: 0.2 }}>·</span>
                            <span className="font-mono text-[10px] select-all" style={{ fontFamily: 'monospace', fontSize: '10px', opacity: 0.3 }} title="Room ID">{roomId}</span>
                        </div>
                    </div>
                </div>

                {/* Center — tab switcher */}
                <div
                    className="flex items-center rounded-xl border"
                    style={{ display: 'flex', alignItems: 'center', padding: '3px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)', borderColor: currentThemeConfig.ui.border, gap: '2px' }}
                >
                    <button
                        onClick={() => setActiveTab('editor')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, background: activeTab === 'editor' ? currentThemeConfig.ui.accent : 'transparent', color: activeTab === 'editor' ? '#fff' : `${currentThemeConfig.ui.text}70`, border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                        <Code2 style={{ width: '13px', height: '13px' }} /> Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('whiteboard')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, background: activeTab === 'whiteboard' ? currentThemeConfig.ui.secondaryAccent : 'transparent', color: activeTab === 'whiteboard' ? '#fff' : `${currentThemeConfig.ui.text}70`, border: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                        <PenTool style={{ width: '13px', height: '13px' }} /> Whiteboard
                    </button>
                </div>

                {/* Right — participants + user menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {(mode === 'Collab' || mode === 'Interview') && (<ParticipantsPanel themeConfig={currentThemeConfig} onInvite={() => setShowInvite(true)} participants={participants} currentUserId={user?.id} hostId={hostId} onKick={handleKick} onFollow={handleFollow} />)}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 transition-colors duration-200 rounded-full pl-4 pr-1.5 py-1.5 hover:bg-white/5 border border-transparent outline-none"
                            onMouseEnter={e => (e.currentTarget.style.borderColor = currentThemeConfig.ui.border)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                        >
                            <div className="text-right hidden sm:flex flex-col justify-center translate-y-[1px]">
                                <div className="text-[13px] font-bold leading-none tracking-tight mb-1" style={{ color: currentThemeConfig.ui.text }}>{user?.name || 'Developer'}</div>
                                <div className="text-[9px] font-bold text-green-400 uppercase tracking-widest leading-none">{user?.tier || 'Free'} Plan</div>
                            </div>
                            <div className="relative shrink-0 w-8 h-8 rounded-full shadow-md" style={{ border: `1px solid ${currentThemeConfig.ui.border}` }}>
                                <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="User" className="w-full h-full rounded-full object-cover" />
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: bgStyle }}></div>
                            </div>
                        </button>
                        {showUserMenu && (
                            <div className="absolute top-full right-0 mt-3 w-52 overflow-hidden rounded-lg shadow-2xl animate-fade-in border z-50" style={{ backgroundColor: currentThemeConfig.ui.menuBg, borderColor: currentThemeConfig.ui.border }}>
                                <button onClick={() => { setShowSettings(true); setShowUserMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm hover:brightness-125 flex items-center gap-2 transition" style={{ color: currentThemeConfig.ui.text }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentThemeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <Settings className="w-4 h-4 opacity-70" /> Settings
                                </button>
                                <div className="h-px bg-white/5 my-1" />
                                {user?.id === hostId ? (
                                    <button onClick={() => { sessionCleanupIntent.current = 'end'; deleteSession(roomId); navigate('/dashboard'); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition"><Trash2 className="w-4 h-4" /> End Session</button>
                                ) : (
                                    <button onClick={() => { sessionCleanupIntent.current = 'leave'; deleteSession(roomId); navigate('/dashboard'); }} className="w-full text-left px-4 py-2.5 text-sm text-orange-400 hover:bg-orange-500/10 flex items-center gap-2 transition"><LogOut className="w-4 h-4" /> Leave Session</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div
                className={`absolute left-0 right-0 flex min-h-0 overflow-hidden ${isSeparated ? 'p-3 gap-3' : ''}`}
                style={{
                    top: '48px',
                    bottom: (showStatusBar && activeTab === 'editor') ? '28px' : '0px',
                    ...(isSeparated ? { padding: '12px', gap: '12px' } : {})
                }}
            >
                {/* File Explorer */}
                <div
                    className={`flex flex-col shrink-0 backdrop-blur-md relative z-20 overflow-hidden min-w-0 min-h-0 ${isResizing === 'explorer' ? '' : 'transition-all duration-300'} ${isSeparated ? 'rounded-2xl shadow-xl' : ''} ${isExplorerOpen ? 'absolute md:relative h-full shadow-2xl md:shadow-none' : ''}`}
                    style={{
                        display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20, overflow: 'hidden', position: isExplorerOpen ? undefined : undefined,
                        width: isExplorerOpen ? `${explorerWidth}px` : '3.5rem',
                        background: isSeparated ? currentThemeConfig.ui.panelBg : currentThemeConfig.ui.glass,
                        borderColor: currentThemeConfig.ui.border,
                        borderStyle: 'solid',
                        borderWidth: isSeparated ? '1px' : '0 1px 0 0',
                        borderRadius: isSeparated ? '16px' : '0',
                        boxShadow: isSeparated ? '0 20px 60px rgba(0,0,0,0.3)' : 'none'
                    }}
                >
                    <div className="h-10 flex items-center justify-between px-3 border-b shrink-0 bg-black/40" style={{ borderColor: currentThemeConfig.ui.border }}>
                        <div className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${isExplorerOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 pl-1">Explorer</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isExplorerOpen && (
                                <>
                                    <button onClick={() => createNewFile()} className="p-1.5 hover:bg-white/10 rounded-lg transition opacity-70 hover:opacity-100" title="New File"><Plus className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => createNewFolder()} className="p-1.5 hover:bg-white/10 rounded-lg transition opacity-70 hover:opacity-100" title="New Folder"><FolderPlus className="w-3.5 h-3.5" /></button>
                                </>
                            )}
                            <button onClick={() => setIsExplorerOpen(!isExplorerOpen)} className="p-1.5 hover:bg-white/10 rounded transition opacity-50 hover:opacity-100" title={isExplorerOpen ? "Collapse" : "Expand"}>
                                {isExplorerOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className={`flex-1 overflow-y-auto py-3 custom-scrollbar bg-black/20 transition-opacity duration-300 ${isExplorerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ overflowX: 'hidden' }}>
                        <div className="w-full flex flex-col">
                            {[...files].sort((a, b) => (a.type === 'folder' && b.type !== 'folder' ? -1 : a.type !== 'folder' && b.type === 'folder' ? 1 : a.name.localeCompare(b.name))).map(file => (
                                <FileTreeItem
                                    key={file.id}
                                    node={file}
                                    activeFile={activePane === 'primary' ? activeFileId : (secondaryFileId || '')}
                                    onSelect={onFileSelect}
                                    onContextMenu={(e: React.MouseEvent, id: string, type: 'file' | 'folder') => setContextMenu({ x: e.clientX, y: e.clientY, fileId: id, nodeType: type })}
                                    themeConfig={currentThemeConfig}
                                    isRenaming={renamingFileId === file.id}
                                    onRename={handleRenameFile}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                />
                            ))}
                        </div>
                    </div>
                    {isExplorerOpen && (<div className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 z-50 transition-colors" onMouseDown={(e) => { e.stopPropagation(); setIsResizing('explorer'); }} />)}
                </div>

                {/* Main Content */}
                <div
                    className={`flex-1 flex flex-col min-w-0 relative ${isSeparated && isConsoleOpen ? 'gap-3' : ''}`}
                    style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, position: 'relative', ...(isSeparated && isConsoleOpen ? { gap: '12px' } : {}) }}
                >
                    {activeTab === 'editor' ? (
                        <>
                            <div ref={editorsContainerRef} className={`flex-1 flex min-h-0 ${isSeparated ? 'gap-3' : ''}`} style={{ display: 'flex', flex: 1, minHeight: 0, ...(isSeparated ? { gap: '12px' } : {}) }}>
                                {/* Primary Editor Pane */}
                                <div
                                    className={`flex flex-col min-h-0 min-w-0 relative transition-all duration-300 group overflow-hidden ${isSeparated ? 'rounded-2xl shadow-xl' : ''}`}
                                    onClick={() => setActivePane('primary')}
                                    style={{
                                        flex: isSplit ? splitRatio : 1,
                                        background: isSeparated ? currentThemeConfig.ui.panelBg : 'transparent',
                                        borderColor: currentThemeConfig.ui.border,
                                        borderStyle: 'solid',
                                        borderWidth: isSeparated ? '1px' : (isSplit ? '0 1px 0 0' : '0px'),
                                        borderRadius: isSeparated ? '16px' : '0',
                                        opacity: activePane !== 'primary' && isSplit ? 0.6 : 1,
                                        filter: activePane !== 'primary' && isSplit ? 'grayscale(0.5)' : 'none',
                                        transform: activePane !== 'primary' && isSplit ? 'scale(0.98)' : 'scale(1)',
                                        zIndex: activePane === 'primary' ? 10 : 0
                                    }}
                                >
                                    <div className="h-10 border-b flex items-center justify-between px-4 shrink-0 backdrop-blur-md transition-colors duration-300" style={{ background: activePane === 'primary' && isSplit ? `${currentThemeConfig.ui.accent}15` : currentThemeConfig.ui.glass, borderColor: currentThemeConfig.ui.border, borderTopWidth: '2px', borderTopColor: activePane === 'primary' && isSplit ? currentThemeConfig.ui.accent : 'transparent' }}>
                                        <div className="flex items-center gap-2 text-sm font-bold opacity-90 tracking-tight">
                                            <FileText className="w-4 h-4" style={{ color: currentThemeConfig.ui.accent }} />
                                            {activeFile ? activeFile.name : 'No file selected'}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={(e) => { e.stopPropagation(); handleRunCode(activeFile); }} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold text-white transition hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                                                {isRunning ? <span className="animate-spin">⟳</span> : <Play className="w-3 h-3 fill-current" />}
                                                Run Code
                                            </button>
                                            {isSplit && (
                                                <button onClick={(e) => { e.stopPropagation(); if (secondaryFileId) { setActiveFileId(secondaryFileId); setSecondaryFileId(null); } setIsSplit(false); setActivePane('primary'); }} className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-red-400" title="Close Pane">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 relative min-h-0 overflow-hidden" style={{ backgroundColor: currentThemeConfig.ui.panelBg }}>
                                        {activeFile && activeFile.type === 'file' ? (
                                            <CodeMirrorEditor
                                                language={activeFile.language || currentLanguage}
                                                content={activeFile.content || ''}
                                                onChange={(v) => updateFileContent(v, activeFileId)}
                                                onCursorChange={handleCursorChange}
                                                fontSize={fontSize}
                                                themeExtensions={currentThemeConfig.codemirror}
                                                ytext={getYText(activeFileId)}
                                                awareness={provider?.awareness}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full opacity-50 flex-col gap-4">
                                                <Code2 className="w-16 h-16 opacity-20" />
                                                <span className="font-medium">Select a file to start coding</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Split Divider */}
                                {isSplit && (<div className="w-1 cursor-col-resize hover:bg-blue-500/50 z-50 transition-colors bg-transparent flex-shrink-0" onMouseDown={(e) => { e.stopPropagation(); setIsResizing('split'); }} />)}

                                {/* Secondary Editor Pane */}
                                {isSplit && (
                                    <div
                                        className={`flex flex-col min-h-0 min-w-0 relative transition-all duration-300 group overflow-hidden ${isSeparated ? 'rounded-2xl shadow-xl' : ''}`}
                                        onClick={() => setActivePane('secondary')}
                                        style={{
                                            flex: 1 - splitRatio,
                                            background: isSeparated ? currentThemeConfig.ui.panelBg : 'transparent',
                                            borderColor: currentThemeConfig.ui.border,
                                            borderStyle: 'solid',
                                            borderWidth: isSeparated ? '1px' : '0px',
                                            borderRadius: isSeparated ? '16px' : '0',
                                            opacity: activePane !== 'secondary' ? 0.6 : 1,
                                            filter: activePane !== 'secondary' ? 'grayscale(0.5)' : 'none',
                                            transform: activePane !== 'secondary' ? 'scale(0.98)' : 'scale(1)',
                                            zIndex: activePane === 'secondary' ? 10 : 0
                                        }}
                                    >
                                        <div className="h-10 border-b flex items-center justify-between px-4 shrink-0 backdrop-blur-md transition-colors duration-300" style={{ background: activePane === 'secondary' ? `${currentThemeConfig.ui.accent}15` : currentThemeConfig.ui.glass, borderColor: currentThemeConfig.ui.border, borderTopWidth: '2px', borderTopColor: activePane === 'secondary' ? currentThemeConfig.ui.accent : 'transparent' }}>
                                            <div className="flex items-center gap-2 text-sm font-bold opacity-90 tracking-tight">
                                                <FileText className="w-4 h-4" style={{ color: currentThemeConfig.ui.accent }} />
                                                {secondaryFile ? secondaryFile.name : 'No file selected'}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={(e) => { e.stopPropagation(); handleRunCode(secondaryFile); }} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold text-white transition hover:scale-105 active:scale-95 disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                                                    {isRunning ? <span className="animate-spin">⟳</span> : <Play className="w-3 h-3 fill-current" />}
                                                    Run Code
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); setIsSplit(false); setActivePane('primary'); setSecondaryFileId(null); }} className="p-1 hover:bg-white/10 rounded transition text-slate-400 hover:text-red-400" title="Close Pane">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 relative min-h-0 overflow-hidden" style={{ backgroundColor: currentThemeConfig.ui.panelBg }}>
                                            {secondaryFile && secondaryFile.type === 'file' ? (
                                                <CodeMirrorEditor
                                                    language={secondaryFile.language || currentLanguage}
                                                    content={secondaryFile.content || ''}
                                                    onChange={(v) => updateFileContent(v, secondaryFileId!)}
                                                    fontSize={fontSize}
                                                    themeExtensions={currentThemeConfig.codemirror}
                                                    ytext={secondaryFileId ? getYText(secondaryFileId) : undefined}
                                                    awareness={provider?.awareness}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full opacity-50 flex-col gap-4">
                                                    <Code2 className="w-16 h-16 opacity-20" />
                                                    <span className="font-medium">Select a file to start coding</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Terminal Panel */}
                            <TerminalPanel
                                themeConfig={currentThemeConfig}
                                isObsidian={isObsidian}
                                isLightMode={isLightMode}
                                isSeparated={isSeparated}
                                isConsoleOpen={isConsoleOpen}
                                consoleHeight={consoleHeight}
                                terminalOutput={terminalOutput}
                                terminalFontSize={terminalFontSize}
                                onClearTerminal={() => setTerminalOutput([])}
                                onCloseConsole={() => setIsConsoleOpen(false)}
                                onStartResizing={() => setIsResizing('console')}
                            />

                            {/* Floating console open button — only shown when FAB is disabled */}
                            {!fabEnabled && (
                                <div className={`absolute z-50 transition-all duration-300 transform ${isAiOpen ? 'bottom-24' : 'bottom-6'} right-6 ${isConsoleOpen ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                                    <button onClick={() => setIsConsoleOpen(true)} className="w-14 h-14 bg-black hover:bg-neutral-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ring-4 ring-black/20" title="Open Output Console">
                                        <TerminalIcon className="w-6 h-6" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={`flex-1 overflow-hidden relative ${isSeparated ? 'rounded-2xl border shadow-xl' : ''}`} style={{ background: isSeparated ? currentThemeConfig.ui.panelBg : 'transparent', borderColor: currentThemeConfig.ui.border }}>
                            <TldrawBoard isDarkMode={theme !== 'Snow White'} />
                        </div>
                    )}
                </div>

                {/* AI Chat Panel */}
                <AIChatPanel themeConfig={currentThemeConfig} isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} user={user} roomType={mode} isSeparated={isSeparated} />
            </div>

            {showStatusBar && activeTab === 'editor' && (
                <div className="absolute bottom-0 left-0 right-0 z-30 flex h-7">
                    <StatusBar
                        themeConfig={currentThemeConfig}
                        language={currentLanguage}
                        cursorPosition={cursorPosition}
                        errorCount={0}
                        onToggleAI={() => setIsAiOpen(!isAiOpen)}
                        isAiOpen={isAiOpen}
                    />
                </div>
            )}

            <FABController
                fabEnabled={fabEnabled}
                fabOpen={fabOpen}
                onToggleFab={() => setFabOpen(!fabOpen)}
                panels={{
                    explorer: isExplorerOpen,
                    terminal: isConsoleOpen,
                    aiChat: isAiOpen,
                }}
                onTogglePanel={(panel) => {
                    if (panel === 'explorer') setIsExplorerOpen(!isExplorerOpen);
                    if (panel === 'terminal') setIsConsoleOpen(!isConsoleOpen);
                    if (panel === 'aiChat') setIsAiOpen(!isAiOpen);
                }}
                fabColor={fabColor}
                accentColor={currentThemeConfig.ui.accent}
                activeTab={activeTab}
                isAiOpen={isAiOpen}
            />
            {showSettings && (
                <WorkspaceSettings
                    onClose={() => setShowSettings(false)}
                    theme={theme}
                    setTheme={setTheme}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    themeConfig={currentThemeConfig}
                    layoutMode={layoutMode}
                    setLayoutMode={setLayoutMode}
                    minimapEnabled={minimapEnabled}
                    setMinimapEnabled={setMinimapEnabled}
                    terminalFontSize={terminalFontSize}
                    setTerminalFontSize={setTerminalFontSize}
                    executionMeta={executionMeta}
                    setExecutionMeta={setExecutionMeta}
                    showStatusBar={showStatusBar}
                    setShowStatusBar={setShowStatusBar}
                    fabEnabled={fabEnabled}
                    setFabEnabled={setFabEnabled}
                    fabColor={fabColor}
                    setFabColor={setFabColor}
                    toastSounds={toastSounds}
                    setToastSounds={setToastSounds}
                />
            )}
            {showInvite && <InviteModal onClose={() => setShowInvite(false)} themeConfig={currentThemeConfig} roomId={roomId} />}
            {contextMenu && (
                <FileContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    onAction={handleFileAction}
                    themeConfig={currentThemeConfig}
                    nodeType={contextMenu.nodeType}
                />
            )}
        </div>
    );
};
