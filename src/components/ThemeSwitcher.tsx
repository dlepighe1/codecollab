/**
 * ThemeSwitcher - UI Component for changing themes
 * 
 * Purpose:
 * - Visual theme selector for settings page
 * - Shows preview of each theme
 * - Handles theme change interactions
 * 
 * Optimization:
 * - Memoized theme cards prevent re-renders
 * - Lazy-loaded animations
 * - Efficient click handlers
 */

import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_GRADIENTS } from '../constants/themes';
import type { ThemeName } from '../types/theme.types';
import { Palette, Check, Loader2 } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { themeName, theme, setTheme, availableThemes } = useTheme();
  const [switchingTheme, setSwitchingTheme] = useState<ThemeName | null>(null);

  /**
   * Handle theme change with loading state
   */
  const handleThemeChange = useCallback(
    async (newTheme: ThemeName) => {
      if (newTheme === themeName) return; // Already active

      setSwitchingTheme(newTheme);
      
      try {
        await setTheme(newTheme, true); // Save to DB
      } catch (error) {
        console.error('Failed to change theme:', error);
      } finally {
        setSwitchingTheme(null);
      }
    },
    [themeName, setTheme]
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-bold flex items-center gap-2 ${theme.textPrimary}`}>
          <Palette className="w-4 h-4" />
          Dashboard Theme
        </h4>
        <span className={`text-xs ${theme.textTertiary}`}>
          {availableThemes.length} themes available
        </span>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableThemes.map((t) => {
          const isActive = themeName === t;
          const isSwitching = switchingTheme === t;
          const gradient = THEME_GRADIENTS[t];

          return (
            <ThemeCard
              key={t}
              themeName={t}
              gradient={gradient}
              isActive={isActive}
              isSwitching={isSwitching}
              onClick={() => handleThemeChange(t)}
              currentTheme={theme}
            />
          );
        })}
      </div>

      {/* Info Text */}
      <p className={`text-xs ${theme.textTertiary} mt-2`}>
        Your theme preference is automatically saved and synced across devices.
      </p>
    </div>
  );
};

/**
 * Individual Theme Card Component
 * Memoized to prevent unnecessary re-renders
 */
interface ThemeCardProps {
  themeName: ThemeName;
  gradient: string;
  isActive: boolean;
  isSwitching: boolean;
  onClick: () => void;
  currentTheme: any;
}

const ThemeCard = React.memo<ThemeCardProps>(({
  themeName,
  gradient,
  isActive,
  isSwitching,
  onClick,
  currentTheme,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isSwitching}
      className={`
        relative h-28 rounded-xl border-2 transition-all overflow-hidden 
        group text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isActive 
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl scale-[1.02]' 
          : `${currentTheme.cardBorder} hover:border-white/20 opacity-80 hover:opacity-100 hover:scale-[1.01]`
        }
        ${isSwitching ? 'cursor-wait' : 'cursor-pointer'}
      `}
      aria-label={`Switch to ${themeName} theme`}
      aria-pressed={isActive}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform group-hover:scale-105`} />

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white p-1.5 rounded-full shadow-lg z-10 animate-fade-in">
          <Check className="w-3 h-3" />
        </div>
      )}

      {/* Switching Loader */}
      {isSwitching && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        </div>
      )}

      {/* Theme Name Label */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/30 backdrop-blur-sm z-10">
        <span className={`text-xs font-bold ${themeName === 'BlueSky' ? 'text-slate-900' : 'text-white'}`}>
          {themeName}
        </span>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors z-[5]" />
    </button>
  );
});

ThemeCard.displayName = 'ThemeCard';