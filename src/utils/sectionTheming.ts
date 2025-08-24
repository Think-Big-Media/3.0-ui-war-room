/**
 * Dynamic Section Theming System
 * Provides consistent color theming based on current route/section
 * Uses design tokens from tokens/colors.ts
 */

import { BRAND_ACCENTS, getRouteAccentColor } from '../tokens/colors';

export interface SectionTheme {
  name: string;
  pageAccent: string; // CSS variable value for --page-accent
  accentKey: keyof typeof BRAND_ACCENTS; // Design token key
}

export const SECTION_THEMES: Record<string, SectionTheme> = {
  dashboard: {
    name: 'Dashboard',
    pageAccent: BRAND_ACCENTS.dashboard,
    accentKey: 'dashboard',
  },
  monitoring: {
    name: 'Live Monitoring',
    pageAccent: BRAND_ACCENTS.liveMonitoring,
    accentKey: 'liveMonitoring',
  },
  warroom: {
    name: 'War Room',
    pageAccent: BRAND_ACCENTS.warRoom,
    accentKey: 'warRoom',
  },
  intelligence: {
    name: 'Intelligence',
    pageAccent: BRAND_ACCENTS.intelligence,
    accentKey: 'intelligence',
  },
  alerts: {
    name: 'Alert Center',
    pageAccent: BRAND_ACCENTS.alertCenter,
    accentKey: 'alertCenter',
  },
  settings: {
    name: 'Settings',
    pageAccent: BRAND_ACCENTS.settings,
    accentKey: 'settings',
  },
};

/**
 * Get the theme for the current route/pathname
 */
export function getSectionTheme(pathname: string): SectionTheme {
  // Route to theme mapping
  if (pathname === '/') return SECTION_THEMES.dashboard;
  if (pathname.startsWith('/real-time-monitoring'))
    return SECTION_THEMES.monitoring;
  if (pathname.startsWith('/campaign-control')) return SECTION_THEMES.warroom;
  if (pathname.startsWith('/intelligence-hub'))
    return SECTION_THEMES.intelligence;
  if (pathname.startsWith('/alert-center')) return SECTION_THEMES.alerts;
  if (pathname.startsWith('/settings')) return SECTION_THEMES.settings;

  // Default to dashboard theme
  return SECTION_THEMES.dashboard;
}

/**
 * Get CSS classes for navigation active state based on theme
 * Uses CSS variables for dynamic theming
 */
export function getNavActiveClasses(theme: SectionTheme): string {
  return `nav-active-bg text-white font-semibold border border-white/20`;
}

/**
 * Get CSS classes for navigation icon active state based on theme
 * Uses CSS variables for dynamic theming
 */
export function getNavIconActiveClasses(theme: SectionTheme): string {
  return `nav-active-icon`;
}

/**
 * Get CSS classes for navigation hover state based on theme (both icon and text)
 */
export function getNavHoverClasses(theme: SectionTheme): string {
  return `group-hover:text-${theme.colors.primary}`;
}

/**
 * Get CSS classes for navigation icon hover state based on theme
 */
export function getNavIconHoverClasses(theme: SectionTheme): string {
  return `group-hover:text-${theme.colors.primary}`;
}

/**
 * Get CSS classes for card hover effects based on theme
 */
export function getCardHoverClasses(theme: SectionTheme): string {
  return `hover:border-${theme.colors.border} group-hover:border-${theme.colors.border} group-hover:bg-${theme.colors.background} group-hover:text-${theme.colors.text}`;
}

/**
 * Get CSS classes for button active/accent based on theme
 */
export function getButtonAccentClasses(theme: SectionTheme): string {
  return `bg-${theme.colors.background} text-${theme.colors.text} border-${theme.colors.border}`;
}

/**
 * React hook for getting current section theme
 */
export function useSectionTheme(pathname: string) {
  const theme = getSectionTheme(pathname);

  return {
    theme,
    navActiveClasses: getNavActiveClasses(theme),
    cardHoverClasses: getCardHoverClasses(theme),
    buttonAccentClasses: getButtonAccentClasses(theme),
  };
}

/**
 * Get the page accent color for setting CSS variables
 */
export function getPageAccentColor(pathname: string): string {
  const theme = getSectionTheme(pathname);
  return theme.pageAccent;
}

/**
 * Generate dynamic CSS for section theming
 */
export function generateSectionCSS(theme: SectionTheme): string {
  return `
    .section-accent { color: rgb(var(--${theme.colors.primary})); }
    .section-border { border-color: rgb(var(--${theme.colors.border})); }
    .section-bg { background-color: rgb(var(--${theme.colors.background})); }
    .section-hover:hover {
      border-color: rgb(var(--${theme.colors.border}));
      background-color: rgb(var(--${theme.colors.background}));
      color: rgb(var(--${theme.colors.text}));
    }
  `;
}
