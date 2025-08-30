/**
 * Background Theme Context
 * Manages background theme selection with persistence
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export type BackgroundTheme = 
  | 'classic-blue'       // Current blue/slate gradient
  | 'tactical-camo'      // Woodland camo with balanced overlay
  | 'digital-camo'       // Digital/pixelated camo
  | 'dark-slate';        // Dark slate theme you've been using all day

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
 * Hook to get background CSS classes for a component
 */
export const useBackgroundClasses = () => {
  const { themeConfig } = useBackgroundTheme();
  
  return {
    baseClass: themeConfig.baseClass || '',
    overlayClass: themeConfig.overlayClass || '',
    hasOverlay: !!themeConfig.overlayClass,
  };
};