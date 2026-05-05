// Server-side MUTABLE tree helpers
// These modify arrays in place (splice, push) unlike the client-side immutable versions

export interface TreeNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: TreeNode[];
    [key: string]: any;
}

export const addNodeToTree = (nodes: TreeNode[], parentId: string | null | undefined, newNode: TreeNode): boolean => {
    // If no parentId, add to root
    if (!parentId) {
        nodes.push(newNode);
        return true;
    }
    for (const node of nodes) {
        if (node.id === parentId) {
            if (!node.children) node.children = [];
            node.children.push(newNode);
            return true;
        }
        if (node.children) {
            if (addNodeToTree(node.children, parentId, newNode)) return true;
        }
    }
    return false;
};

export const deleteNodeFromTree = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
    const idx = nodes.findIndex(n => n.id === nodeId);
    if (idx !== -1) {
        // Return the removed node for moving
        return nodes.splice(idx, 1)[0];
    }
    for (const node of nodes) {
        if (node.children) {
            const removed = deleteNodeFromTree(node.children, nodeId);
            if (removed) return removed;
        }
    }
    return null;
};

export const updateNodeInTree = (nodes: TreeNode[], nodeId: string, updates: Partial<TreeNode>): boolean => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            Object.assign(node, updates);
            return true;
        }
        if (node.children) {
            if (updateNodeInTree(node.children, nodeId, updates)) return true;
        }
    }
    return false;
};

export const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
};
