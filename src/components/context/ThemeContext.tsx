/**
 * Theme Context - Core Theme Management
 * 
 * Responsibilities:
 * 1. Load theme from database (via user preferences)
 * 2. Fallback to localStorage for offline/guest users
 * 3. Sync theme changes to database and localStorage
 * 4. Provide global theme state to all components
 * 
 * Optimization Strategy:
 * - Lazy loading of theme (async)
 * - Debounced database updates
 * - Memoized context values
 * - Single source of truth pattern
 */

import React, { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  useMemo,
} from 'react';
import type { ReactNode } from 'react';
import { useAuth }  from './AuthContext';
import { THEME_STYLES, AVAILABLE_THEMES, STORAGE_KEYS, THEME_VERSION } from '../../constants/themes';
import type { ThemeContextValue, ThemeName } from '../../types/theme.types';

// Create context with undefined default (forces error if used outside provider)
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider Component
 * 
 * Flow:
 * 1. Mount → Check user.dashboardTheme from AuthContext
 * 2. If exists → Load from database
 * 3. If not → Fallback to localStorage
 * 4. If neither → Use default theme
 * 5. On theme change → Update state + localStorage + database (if authenticated)
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user, updateProfile } = useAuth();
  
  // Local state
  const [themeName, setThemeName] = useState<ThemeName>('Default');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load theme from storage
   * Priority: Database > localStorage > Default
   */
  const loadTheme = useCallback(async () => {
    setIsLoading(true);

    try {
      // Check theme version - invalidate cache if outdated
      const storedVersion = localStorage.getItem(STORAGE_KEYS.THEME_VERSION);
      if (storedVersion !== THEME_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.THEME);
        localStorage.setItem(STORAGE_KEYS.THEME_VERSION, THEME_VERSION);
      }

      // Priority 1: User database preference (if authenticated)
      if (user?.dashboardTheme && THEME_STYLES[user.dashboardTheme]) {
        setThemeName(user.dashboardTheme);
        // Sync to localStorage for consistency
        localStorage.setItem(STORAGE_KEYS.THEME, user.dashboardTheme);
        return;
      }

      // Priority 2: localStorage (guest users or offline)
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeName | null;
      if (savedTheme && THEME_STYLES[savedTheme]) {
        setThemeName(savedTheme);
        return;
      }

      // Priority 3: Default theme (fallback)
      setThemeName('Default');
    } catch (error) {
      console.error('[ThemeContext] Error loading theme:', error);
      setThemeName('Default');
    } finally {
      setIsLoading(false);
    }
  }, [user?.dashboardTheme]);

  // Load theme on mount and when user preference changes
  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  /**
   * Update theme
   * @param newThemeName - Theme to switch to
   * @param saveToDb - Whether to persist to database (default: true)
   */
  const setTheme = useCallback(
    async (newThemeName: ThemeName, saveToDb: boolean = true): Promise<void> => {
      // Validate theme exists
      if (!THEME_STYLES[newThemeName]) {
        console.error(`[ThemeContext] Invalid theme: "${newThemeName}"`);
        return;
      }

      // Optimistic update - apply immediately for instant feedback
      setThemeName(newThemeName);
      localStorage.setItem(STORAGE_KEYS.THEME, newThemeName);

      // Persist to database if authenticated and requested
      if (saveToDb && user && updateProfile) {
        try {
          await updateProfile({ dashboardTheme: newThemeName });
          console.log('[ThemeContext] Theme saved to database:', newThemeName);
        } catch (error) {
          console.error('[ThemeContext] Failed to save theme to database:', error);
          // Note: Theme still applied locally even if DB save fails
          // This ensures good UX even with network issues
        }
      }
    },
    [user, updateProfile]
  );

  /**
   * Memoize context value to prevent unnecessary re-renders
   * Only updates when dependencies change
   */
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      themeName,
      theme: THEME_STYLES[themeName],
      setTheme,
      availableThemes: AVAILABLE_THEMES,
      isLoading,
    }),
    [themeName, setTheme, isLoading]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context
 * Throws error if used outside ThemeProvider
 */
export const useTheme = (): ThemeContextValue => {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      '[useTheme] must be used within a ThemeProvider. ' +
      'Make sure your component is wrapped with <ThemeProvider>.'
    );
  }
  
  return context;
};

// Export context for advanced use cases (testing, etc.)
export { ThemeContext };