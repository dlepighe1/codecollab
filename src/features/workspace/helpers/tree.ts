import { FileNode } from '../../../types';

export const addNodeToTree = (nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] => {
    if (!parentId) return [...nodes, newNode];
    return nodes.map(node => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode], isOpen: true };
        }
        if (node.children) {
            return { ...node, children: addNodeToTree(node.children, parentId, newNode) };
        }
        return node;
    });
};

export const removeNodeFromTree = (nodes: FileNode[], nodeId: string): FileNode[] => {
    const filtered = nodes.filter(n => n.id !== nodeId);
    if (filtered.length < nodes.length) return filtered;
    return nodes.map(node => ({
        ...node,
        children: node.children ? removeNodeFromTree(node.children, nodeId) : undefined
    }));
};

export const updateNodeInTree = (nodes: FileNode[], nodeId: string, updates: Partial<FileNode>): FileNode[] => {
    return nodes.map(node => {
        if (node.id === nodeId) return { ...node, ...updates };
        if (node.children) return { ...node, children: updateNodeInTree(node.children, nodeId, updates) };
        return node;
    });
};

export const findNode = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
};
