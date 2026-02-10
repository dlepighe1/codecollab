/**
 * Central type definitions for the theme system
 * 
 * Purpose: Ensures type safety across the entire theme system
 * Benefits: 
 * - Autocomplete in IDEs
 * - Compile-time error checking
 * - Better refactoring support
 */

export interface ThemeColors {
  appBg: string;
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  modalBg: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  buttonPrimary: string;
  buttonSecondary: string;
  activeItem: string;
  inactiveItem: string;
  inputBg: string;
  inputBorder: string;
}

export type ThemeName = 
  | 'Default'
  | 'BlueSky'
  | 'Galaxy'
  | 'Ocean'
  | 'Nebula'
  | 'Vector';

export interface ThemeContextValue {
  themeName: ThemeName;
  theme: ThemeColors;
  setTheme: (themeName: ThemeName, saveToDb?: boolean) => Promise<void>;
  availableThemes: readonly ThemeName[];
  isLoading: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
  dashboardTheme?: ThemeName;
  tier?: 'Free' | 'Pro' | 'Team';
  // ... other user properties
}