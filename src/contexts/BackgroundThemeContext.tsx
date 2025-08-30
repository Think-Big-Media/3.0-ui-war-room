/**
 * Background Theme Context
 * Manages background theme selection with persistence
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export type BackgroundTheme = 
  | 'classic-blue'       // Current blue/slate gradient
  | 'dark-blue'          // Darker blue gradient (from Live Monitoring)
  | 'tactical-camo'      // Woodland camo with balanced overlay
  | 'digital-camo'       // Digital/pixelated camo
  | 'urban-camo'         // Gray urban camo
  | 'desert-camo';       // Desert tan camo

export interface BackgroundThemeConfig {
  id: BackgroundTheme;
  name: string;
  description: string;
  baseClass: string;
  overlayClass?: string;
}

export const BACKGROUND_THEMES: Record<BackgroundTheme, BackgroundThemeConfig> = {
  'classic-blue': {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Original blue/slate gradient theme',
    baseClass: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800',
  },
  'dark-blue': {
    id: 'dark-blue',
    name: 'Dark Blue',
    description: 'Darker blue gradient from Live Monitoring',
    baseClass: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
  },
  'tactical-camo': {
    id: 'tactical-camo',
    name: 'Tactical Camo',
    description: 'Military woodland camouflage pattern',
    baseClass: 'bg-camo',
    overlayClass: 'camo-overlay-balanced',
  },
  'digital-camo': {
    id: 'digital-camo',
    name: 'Digital Camo',
    description: 'Digital/pixelated military pattern',
    baseClass: 'bg-camo-digital',
    overlayClass: 'camo-overlay-balanced',
  },
  'urban-camo': {
    id: 'urban-camo',
    name: 'Urban Camo',
    description: 'Gray urban warfare pattern',
    baseClass: 'bg-camo-urban',
    overlayClass: 'camo-overlay-balanced',
  },
  'desert-camo': {
    id: 'desert-camo',
    name: 'Desert Camo',
    description: 'Desert tan camouflage pattern',
    baseClass: 'bg-camo-desert',
    overlayClass: 'camo-overlay-balanced',
  },
};

interface BackgroundThemeContextType {
  currentTheme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
  themeConfig: BackgroundThemeConfig;
  availableThemes: BackgroundThemeConfig[];
}

const BackgroundThemeContext = createContext<BackgroundThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'war-room-background-theme';

export const BackgroundThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<BackgroundTheme>(() => {
    // Load theme from localStorage or default to tactical-camo
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in BACKGROUND_THEMES) {
      return saved as BackgroundTheme;
    }
    return 'tactical-camo'; // Default to the camo theme
  });

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
 * Hook to get background classes for a component
 */
export const useBackgroundClasses = () => {
  const { themeConfig } = useBackgroundTheme();
  
  return {
    baseClass: themeConfig.baseClass,
    overlayClass: themeConfig.overlayClass,
    containerClasses: themeConfig.overlayClass 
      ? `${themeConfig.baseClass}` // Base will be applied to first div
      : themeConfig.baseClass,
  };
};