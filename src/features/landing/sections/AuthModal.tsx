import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { AuthModalContent } from '../../auth/components/AuthModalContent';
import { isDevMode, isClerkConfigured } from '../../../lib/clerk';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (username: string, password?: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const handleSocialLogin = (provider: 'google' | 'github') => {
        if (isClerkConfigured) {
            console.info(`[Auth] Would trigger Clerk ${provider} OAuth`);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
            <AuthModalContent
                onClose={onClose}
                onLogin={onLogin}
                onSocialLogin={handleSocialLogin}
                isDevMode={isDevMode && !isClerkConfigured}
            />
        </Modal>
    );
};
