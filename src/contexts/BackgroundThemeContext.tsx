/**
 * Background Theme Context
 * Manages background theme selection with persistence
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export type BackgroundTheme = 
  | 'classic-blue'       // Current blue/slate gradient
  | 'tactical-camo'      // Woodland camo with balanced overlay
  | 'digital-camo';      // Digital/pixelated camo

export interface BackgroundThemeConfig {
  id: BackgroundTheme;
  name: string;
  description: string;
  baseClass?: string;
  overlayClass?: string;
  backgroundStyle?: React.CSSProperties;
  overlayStyle?: React.CSSProperties;
}

const BACKGROUND_THEMES: Record<BackgroundTheme, BackgroundThemeConfig> = {
  'classic-blue': {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Original blue/slate gradient theme',
    baseClass: 'war-room-classic-blue',
  },
  'tactical-camo': {
    id: 'tactical-camo',
    name: 'Tactical Camo',
    description: 'Military woodland camouflage pattern',
    baseClass: 'war-room-tactical-camo',
    overlayClass: 'war-room-camo-overlay',
  },
  'digital-camo': {
    id: 'digital-camo',
    name: 'Digital Camo',
    description: 'Digital/pixelated military pattern',
    baseClass: 'war-room-digital-camo',
    overlayClass: 'war-room-camo-overlay',
  },
};

interface BackgroundThemeContextType {
  currentTheme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
  themeConfig: BackgroundThemeConfig;
  availableThemes: BackgroundThemeConfig[];
}

// Export function to get themes (HMR-friendly)
export const getBackgroundThemes = () => BACKGROUND_THEMES;

const BackgroundThemeContext = createContext<BackgroundThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'war-room-background-theme';

// Inject CSS directly into the page
const injectBackgroundCSS = () => {
  const styleId = 'war-room-background-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = `
    .war-room-classic-blue {
      background: linear-gradient(135deg, rgb(71 85 105) 0%, rgb(51 65 85) 50%, rgb(30 41 59) 100%) !important;
    }
    
    .war-room-tactical-camo {
      background-color: #2a3329 !important;
      background-image: 
        radial-gradient(ellipse at 20% 30%, rgba(52, 61, 51, 0.8) 15%, transparent 40%),
        radial-gradient(ellipse at 80% 70%, rgba(76, 84, 70, 0.6) 20%, transparent 50%),
        radial-gradient(ellipse at 60% 10%, rgba(34, 51, 29, 0.9) 25%, transparent 45%),
        radial-gradient(ellipse at 10% 80%, rgba(90, 95, 85, 0.5) 18%, transparent 35%),
        radial-gradient(ellipse at 90% 20%, rgba(45, 52, 43, 0.7) 22%, transparent 55%),
        radial-gradient(ellipse at 40% 90%, rgba(65, 70, 62, 0.6) 16%, transparent 38%) !important;
    }
    
    .war-room-digital-camo {
      background-color: #1a1f1a !important;
      background-image:
        linear-gradient(45deg, rgba(40, 50, 38, 0.8) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(30, 40, 28, 0.6) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(50, 60, 48, 0.4) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(35, 45, 33, 0.7) 75%) !important;
      background-size: 20px 20px, 20px 20px, 20px 20px, 20px 20px !important;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px !important;
    }
    
    .war-room-camo-overlay {
      background: 
        radial-gradient(circle at 0% 0%, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 25%, rgba(0, 0, 0, 0.2) 50%),
        radial-gradient(circle at 100% 0%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 30%, rgba(0, 0, 0, 0.1) 60%),
        radial-gradient(circle at 0% 100%, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 35%, rgba(0, 0, 0, 0.05) 70%),
        radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 80%) !important;
    }
  `;
};

export const BackgroundThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(() => {
    // Load theme from localStorage or default to tactical-camo
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in BACKGROUND_THEMES) {
      return saved as BackgroundTheme;
    }
    return 'tactical-camo'; // Default to the camo theme
  });
  
  // Inject CSS when component mounts
  useEffect(() => {
    injectBackgroundCSS();
  }, []);

  const setTheme = (theme: BackgroundTheme) => {
    console.log('🎯 BackgroundThemeContext: Setting theme to:', theme);
    console.log('🎯 Theme config:', BACKGROUND_THEMES[theme]);
    setCurrentTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    console.log('💾 Theme saved to localStorage:', theme);
  };

  const themeConfig = BACKGROUND_THEMES[currentTheme];
  const availableThemes = Object.values(BACKGROUND_THEMES);

  return (
    <BackgroundThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        themeConfig,
        availableThemes,
      }}
    >
      {children}
    </BackgroundThemeContext.Provider>
  );
};

export const useBackgroundTheme = () => {
  const context = useContext(BackgroundThemeContext);
  if (!context) {
    throw new Error('useBackgroundTheme must be used within a BackgroundThemeProvider');
  }
  return context;
};

/**
 * Hook to get background styles for a component
 */
export const useBackgroundStyles = () => {
  const { themeConfig } = useBackgroundTheme();
  
  return {
    backgroundStyle: themeConfig.backgroundStyle || {},
    overlayStyle: themeConfig.overlayStyle || {},
    hasOverlay: !!themeConfig.overlayStyle,
  };
};