import React from 'react';
import { isClerkConfigured, CLERK_PUBLISHABLE_KEY } from '../../lib/clerk';
import { ClerkProvider } from '@clerk/clerk-react';

export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
    if (!isClerkConfigured) {
        return <>{children}</>;
    }

    return (
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            {children}
        </ClerkProvider>
    );
};
