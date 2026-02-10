/**
 * Theme Style Definitions
 * 
 * Purpose: Centralized theme configurations
 * Optimization: 
 * - Frozen object prevents accidental mutations
 * - Can be tree-shaken if unused themes are removed
 * - No runtime overhead (compile-time constants)
 */

import type { ThemeColors, ThemeName } from '../types/theme.types';

export const THEME_STYLES: Readonly<Record<ThemeName, ThemeColors>> = Object.freeze({
  Default: {
    appBg: 'bg-[#0f172a]',
    panelBg: 'bg-slate-900/50 backdrop-blur-xl',
    panelBorder: 'border-white/10',
    cardBg: 'bg-slate-800/40',
    cardBorder: 'border-white/5 hover:border-white/10',
    modalBg: 'bg-[#0f172a]',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textTertiary: 'text-slate-400',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-600',
    accentBorder: 'border-blue-500/30',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20',
    buttonSecondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/5',
    activeItem: 'bg-blue-600/10 text-blue-400 border-blue-500/50',
    inactiveItem: 'text-slate-400 hover:bg-white/5 hover:text-slate-200',
    inputBg: 'bg-black/20',
    inputBorder: 'border-white/10 focus:border-blue-500/50',
  },
  
  BlueSky: {
    appBg: 'bg-slate-50',
    panelBg: 'bg-white/80 backdrop-blur-xl shadow-xl',
    panelBorder: 'border-white/60',
    cardBg: 'bg-white/60',
    cardBorder: 'border-blue-100 hover:border-blue-200',
    modalBg: 'bg-white',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-700',
    textTertiary: 'text-slate-500',
    accent: 'text-blue-600',
    accentBg: 'bg-blue-500',
    accentBorder: 'border-blue-200',
    buttonPrimary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20',
    buttonSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200',
    activeItem: 'bg-blue-50 text-blue-700 border-blue-200',
    inactiveItem: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    inputBg: 'bg-white',
    inputBorder: 'border-slate-200 focus:border-blue-400',
  },
  
  Galaxy: {
    appBg: 'bg-[#050505]',
    panelBg: 'bg-[#0a0a0a]/80 backdrop-blur-2xl',
    panelBorder: 'border-purple-500/10',
    cardBg: 'bg-[#111]',
    cardBorder: 'border-white/5 hover:border-purple-500/20',
    modalBg: 'bg-[#0a0a0a]',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-500',
    accent: 'text-purple-400',
    accentBg: 'bg-purple-600',
    accentBorder: 'border-purple-500/30',
    buttonPrimary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20',
    buttonSecondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/5',
    activeItem: 'bg-purple-900/20 text-purple-300 border-purple-500/40',
    inactiveItem: 'text-gray-500 hover:bg-white/5 hover:text-gray-300',
    inputBg: 'bg-[#151515]',
    inputBorder: 'border-white/10 focus:border-purple-500',
  },
  
  Ocean: {
    appBg: 'bg-[#0f172a]',
    panelBg: 'bg-[#0f172a]/60 backdrop-blur-xl',
    panelBorder: 'border-cyan-500/20',
    cardBg: 'bg-[#162a42]/60',
    cardBorder: 'border-cyan-500/10 hover:border-cyan-400/30',
    modalBg: 'bg-[#0f172a]',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-100',
    textTertiary: 'text-cyan-200/60',
    accent: 'text-cyan-400',
    accentBg: 'bg-cyan-600',
    accentBorder: 'border-cyan-500/30',
    buttonPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20',
    buttonSecondary: 'bg-cyan-900/30 hover:bg-cyan-900/50 text-cyan-100 border border-cyan-500/20',
    activeItem: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/40',
    inactiveItem: 'text-cyan-200/50 hover:bg-cyan-900/20 hover:text-cyan-100',
    inputBg: 'bg-[#0c1826]',
    inputBorder: 'border-cyan-500/30 focus:border-cyan-400',
  },
  
  Nebula: {
    appBg: 'bg-[#1e0b24]',
    panelBg: 'bg-[#2e1065]/40 backdrop-blur-xl',
    panelBorder: 'border-fuchsia-500/20',
    cardBg: 'bg-[#2e1065]/40',
    cardBorder: 'border-fuchsia-500/10 hover:border-fuchsia-400/30',
    modalBg: 'bg-[#1e0b24]',
    textPrimary: 'text-fuchsia-50',
    textSecondary: 'text-fuchsia-100',
    textTertiary: 'text-fuchsia-200/60',
    accent: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-600',
    accentBorder: 'border-fuchsia-500/30',
    buttonPrimary: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20',
    buttonSecondary: 'bg-fuchsia-900/30 hover:bg-fuchsia-900/50 text-fuchsia-100 border border-fuchsia-500/20',
    activeItem: 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-500/40',
    inactiveItem: 'text-fuchsia-200/50 hover:bg-fuchsia-900/20 hover:text-fuchsia-100',
    inputBg: 'bg-[#1a0b2e]',
    inputBorder: 'border-fuchsia-500/30 focus:border-fuchsia-400',
  },
  
  Vector: {
    appBg: 'bg-[#121212]',
    panelBg: 'bg-[#181818]/90 backdrop-blur-xl',
    panelBorder: 'border-white/10',
    cardBg: 'bg-[#222]',
    cardBorder: 'border-white/5 hover:border-white/20',
    modalBg: 'bg-[#121212]',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-500',
    accent: 'text-white',
    accentBg: 'bg-white',
    accentBorder: 'border-white/20',
    buttonPrimary: 'bg-white hover:bg-gray-200 text-black shadow-lg',
    buttonSecondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/10',
    activeItem: 'bg-white text-black border-transparent',
    inactiveItem: 'text-gray-500 hover:bg-white/10 hover:text-white',
    inputBg: 'bg-[#111]',
    inputBorder: 'border-white/10 focus:border-white',
  },
});

// Export as const array for better tree-shaking
export const AVAILABLE_THEMES = Object.keys(THEME_STYLES) as readonly ThemeName[];

// Theme preview gradients for UI
export const THEME_GRADIENTS: Readonly<Record<ThemeName, string>> = Object.freeze({
  Default: 'from-slate-700 to-slate-900',
  BlueSky: 'from-sky-400 via-cyan-200 to-white',
  Galaxy: 'from-purple-900 to-black',
  Ocean: 'from-cyan-900 to-slate-900',
  Nebula: 'from-fuchsia-900 to-purple-900',
  Vector: 'from-zinc-800 to-zinc-950',
});

/**
 * Storage Keys - Centralized to avoid typos
 */
export const STORAGE_KEYS = {
  THEME: 'app-theme',
  THEME_VERSION: 'theme-version', // For cache busting if theme structure changes
} as const;

/**
 * Theme version - increment when theme structure changes
 * This helps invalidate old cached themes
 */
export const THEME_VERSION = '1.0.0';