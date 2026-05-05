import React, { useState, useEffect, useRef } from 'react';
import { FileNode } from '../../../types';
import {
    FileText, MoreVertical, Edit2, Download, Columns, Trash2,
    FolderPlus, Folder, FileCode, ChevronRight as ChevronRightIcon
} from 'lucide-react';

// --- FilePlusIcon ---
export const FilePlusIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

// --- FileContextMenu ---
interface FileContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onAction: (action: string) => void;
    themeConfig: any;
    nodeType: 'file' | 'folder';
}

export const FileContextMenu = ({ x, y, onClose, onAction, themeConfig, nodeType }: FileContextMenuProps) => {
    useEffect(() => {
        const handleClick = () => onClose();
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [onClose]);

    const style: React.CSSProperties = {
        top: y,
        left: x,
        backgroundColor: themeConfig.ui.menuBg,
        borderColor: themeConfig.ui.border
    };

    if (window.innerHeight - y < 220) {
        style.top = 'auto';
        style.bottom = window.innerHeight - y;
    }

    if (window.innerWidth - x < 220) {
        style.left = 'auto';
        style.right = window.innerWidth - x;
    }

    return (
        <div
            className="fixed z-[1000] w-52 overflow-hidden rounded-lg shadow-2xl animate-fade-in border backdrop-blur-xl"
            style={style}
            onClick={(e) => e.stopPropagation()}
        >
            {nodeType === 'folder' && (
                <>
                    <button onClick={() => { onAction('New File'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:brightness-110 flex items-center gap-2" style={{ color: themeConfig.ui.text, backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <FilePlusIcon className="w-4 h-4 opacity-70" /> New File
                    </button>
                    <button onClick={() => { onAction('New Folder'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:brightness-110 flex items-center gap-2" style={{ color: themeConfig.ui.text, backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <FolderPlus className="w-4 h-4 opacity-70" /> New Folder
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                </>
            )}
            <button onClick={() => { onAction('Rename'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:brightness-110 flex items-center gap-2" style={{ color: themeConfig.ui.text, backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Edit2 className="w-4 h-4 opacity-70" /> Rename
            </button>
            {nodeType === 'file' && (
                <>
                    <button onClick={() => { onAction('Download'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:brightness-110 flex items-center gap-2" style={{ color: themeConfig.ui.text, backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Download className="w-4 h-4 opacity-70" /> Download
                    </button>
                    <button onClick={() => { onAction('Split Screen'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:brightness-110 flex items-center gap-2" style={{ color: themeConfig.ui.text, backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.ui.border} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <Columns className="w-4 h-4 opacity-70" /> Split Screen
                    </button>
                </>
            )}
            <div className="h-px bg-white/10 my-1" />
            <button onClick={() => { onAction('Delete'); onClose(); }} className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 text-red-500 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" /> Delete
            </button>
        </div>
    );
};

// --- FileTreeItem ---
interface FileTreeItemProps {
    node: FileNode;
    activeFile: string;
    onSelect: (node: FileNode) => void;
    onContextMenu: (e: React.MouseEvent, id: string, type: 'file' | 'folder') => void;
    themeConfig: any;
    isRenaming: boolean;
    onRename: (newName: string) => void;
    onDragStart: (e: React.DragEvent, node: FileNode) => void;
    onDragOver: (e: React.DragEvent, node: FileNode) => void;
    onDrop: (e: React.DragEvent, node: FileNode) => void;
}

export const FileTreeItem = ({
    node,
    activeFile,
    onSelect,
    onContextMenu,
    themeConfig,
    isRenaming,
    onRename,
    onDragStart,
    onDragOver,
    onDrop
}: FileTreeItemProps) => {
    const isActive = activeFile === node.id;
    const [renameValue, setRenameValue] = useState(node.name);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(node.isOpen ?? true);
    const [isDragOver, setIsDragOver] = useState(false);

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isRenaming]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onRename(renameValue);
        } else if (e.key === 'Escape') {
            onRename(node.name);
        }
    };

    const displayIconName = isRenaming ? renameValue : node.name;

    const getIcon = (name: string, type: string) => {
        if (type === 'folder') return isOpen ? <Folder className="w-4 h-4 text-blue-300 fill-blue-500/20" /> : <Folder className="w-4 h-4 text-blue-300" />;
        const lower = name.toLowerCase();
        if (lower.endsWith('.js') || lower.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
        if (lower.endsWith('.ts') || lower.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-blue-400" />;
        if (lower.endsWith('.py')) return <FileCode className="w-4 h-4 text-green-400" />;
        if (lower.endsWith('.java')) return <FileCode className="w-4 h-4 text-orange-400" />;
        if (lower.endsWith('.cpp') || lower.endsWith('.c')) return <FileCode className="w-4 h-4 text-blue-600" />;
        if (lower.endsWith('.go')) return <FileCode className="w-4 h-4 text-cyan-400" />;
        if (lower.endsWith('.css')) return <FileCode className="w-4 h-4 text-sky-300" />;
        if (lower.endsWith('.html')) return <FileCode className="w-4 h-4 text-red-500" />;
        return <FileText className="w-4 h-4 opacity-70" />;
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    const handleDragStartInternal = (e: React.DragEvent) => {
        e.stopPropagation();
        onDragStart(e, node);
    };

    const handleDragOverInternal = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (node.type === 'folder') {
            setIsDragOver(true);
            onDragOver(e, node);
        }
    };

    const handleDragLeaveInternal = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDropInternal = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        onDrop(e, node);
    };

    return (
        <div className="select-none">
            <div
                className={`group flex items-center gap-2 py-1.5 px-3 cursor-pointer transition-all duration-200 rounded-md mx-2 mb-0.5 relative`}
                style={{
                    backgroundColor: isDragOver ? `${themeConfig.ui.accent}30` : (isActive ? `${themeConfig.ui.accent}15` : 'transparent'),
                    color: isActive ? themeConfig.ui.accent : themeConfig.ui.text,
                }}
                onClick={handleSelect}
                onMouseEnter={(e) => !isActive && !isDragOver && (e.currentTarget.style.backgroundColor = `${themeConfig.ui.border}40`)}
                onMouseLeave={(e) => !isActive && !isDragOver && (e.currentTarget.style.backgroundColor = 'transparent')}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu(e, node.id, node.type); }}
                draggable
                onDragStart={handleDragStartInternal}
                onDragOver={handleDragOverInternal}
                onDragLeave={handleDragLeaveInternal}
                onDrop={handleDropInternal}
            >
                <div className="shrink-0 flex items-center justify-center w-4">
                    {node.type === 'folder' && (
                        <ChevronRightIcon
                            className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                            style={{ opacity: 0.6 }}
                        />
                    )}
                </div>
                <div className="shrink-0 flex items-center justify-center">
                    {getIcon(displayIconName, node.type)}
                </div>
                {isRenaming ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={() => onRename(renameValue)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 min-w-0 bg-transparent text-sm px-1 py-0.5 outline-none border-b border-blue-500 text-inherit leading-tight"
                        style={{ color: 'inherit' }}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                    />
                ) : (
                    <span className="text-sm truncate flex-1 font-medium tracking-tight" style={{ opacity: isActive ? 1 : 0.8 }}>{node.name}</span>
                )}
                <button
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
                    onClick={(e) => { e.stopPropagation(); onContextMenu(e, node.id, node.type); }}
                >
                    <MoreVertical className="w-3.5 h-3.5" />
                </button>
            </div>
            {node.type === 'folder' && isOpen && node.children && (
                <div className="pl-3 border-l border-white/5 ml-4">
                    {[...node.children].sort((a, b) => (a.type === 'folder' && b.type !== 'folder' ? -1 : a.type !== 'folder' && b.type === 'folder' ? 1 : a.name.localeCompare(b.name))).map((child: FileNode) => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            activeFile={activeFile}
                            onSelect={onSelect}
                            onContextMenu={onContextMenu}
                            themeConfig={themeConfig}
                            isRenaming={isRenaming}
                            onRename={onRename}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
