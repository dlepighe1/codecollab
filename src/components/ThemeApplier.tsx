/**
 * ThemeApplier - Applies theme to document body
 * 
 * Purpose: 
 * - Syncs theme with body element for global background
 * - Applies dark/light mode classes
 * - Updates meta theme-color for mobile browsers
 * 
 * Optimization:
 * - Runs only when theme changes (not on every render)
 * - Uses direct DOM manipulation (faster than re-rendering)
 * - Cleanup function prevents memory leaks
 */

import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeApplier: React.FC = () => {
  const { theme, themeName } = useTheme();

  useEffect(() => {
    // Extract background class (e.g., "bg-[#0f172a]" → "#0f172a")
    const bgClass = theme.appBg;
    
    // Apply to body element
    document.body.className = bgClass;

    // Add data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', themeName.toLowerCase());

    // Update meta theme-color for mobile browsers (address bar color)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const themeColorMap: Record<string, string> = {
      Default: '#0f172a',
      BlueSky: '#f8fafc',
      Galaxy: '#050505',
      Ocean: '#0f172a',
      Nebula: '#1e0b24',
      Vector: '#121212',
    };

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColorMap[themeName] || '#0f172a');
    } else {
      // Create meta tag if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeColorMap[themeName] || '#0f172a';
      document.head.appendChild(meta);
    }

    // Cleanup function
    return () => {
      document.body.className = '';
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme.appBg, themeName]);

  // This component doesn't render anything
  return null;
};