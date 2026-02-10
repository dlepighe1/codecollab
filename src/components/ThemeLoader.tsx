/**
 * ThemeLoader - Loading state while theme initializes
 * 
 * Purpose:
 * - Prevents FOUC (Flash of Unstyled Content)
 * - Shows loading indicator while theme loads from database
 * - Graceful transition once theme is ready
 * 
 * Optimization:
 * - Minimal re-renders (only when isLoading changes)
 * - Lightweight spinner (no heavy animations)
 * - Can be code-split if needed
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeLoaderProps {
  children: React.ReactNode;
  /**
   * Custom loading component (optional)
   * Falls back to default spinner if not provided
   */
  fallback?: React.ReactNode;
}

export const ThemeLoader: React.FC<ThemeLoaderProps> = ({ 
  children, 
  fallback 
}) => {
  const { isLoading } = useTheme();

  if (isLoading) {
    return (
      <>
        {fallback || <DefaultLoadingScreen />}
      </>
    );
  }

  return <>{children}</>;
};

/**
 * Default Loading Screen
 * Shown while theme loads from database
 */
const DefaultLoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
    <div className="text-center">
      {/* Spinner */}
      <div className="relative w-12 h-12 mx-auto mb-4">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin" />
      </div>
      
      {/* Loading text */}
      <p className="text-slate-400 text-sm font-medium">
        Loading your theme...
      </p>
    </div>
  </div>
);

/**
 * Example: Custom loading screen with brand logo
 */
export const BrandedThemeLoader: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { isLoading, themeName } = useTheme();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">CodeCollab</span>
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-[loading_1.5s_ease-in-out_infinite]" 
               style={{ width: '40%' }} 
          />
        </div>

        <p className="text-slate-500 text-sm">
          Preparing {themeName || 'your'} experience...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// Add to your global CSS for the loading animation
/*
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(250%);
  }
  100% {
    transform: translateX(-100%);
  }
}
*/