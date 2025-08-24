/**
 * Dynamic Section Theming System
 * Provides consistent color theming based on current route/section
 * Uses CSS variables for dynamic theming
 */

export interface SectionTheme {
  name: string;
  pageAccent: string; // CSS variable value for --page-accent
  colors: {
    primary: string; // Main accent color (legacy)
    border: string; // Border hover colors (legacy)
    text: string; // Text accent colors (legacy)
    background: string; // Background accent colors (legacy)
    light: string; // Light variant for backgrounds (legacy)
  };
}

export const SECTION_THEMES: Record<string, SectionTheme> = {
  dashboard: {
    name: 'Dashboard',
    pageAccent: '#6366f1', // indigo-500
    colors: {
      primary: 'orange-500',
      border: 'orange-400/50',
      text: 'orange-300',
      background: 'orange-400/10',
      light: 'orange-50',
    },
  },
  monitoring: {
    name: 'Live Monitoring',
    pageAccent: '#22c55e', // green-500
    colors: {
      primary: 'green-500',
      border: 'green-400/50',
      text: 'green-300',
      background: 'green-400/10',
      light: 'green-50',
    },
  },
  warroom: {
    name: 'War Room',
    pageAccent: '#ef4444', // red-500
    colors: {
      primary: 'red-500',
      border: 'red-400/50',
      text: 'red-300',
      background: 'red-400/10',
      light: 'red-50',
    },
  },
  intelligence: {
    name: 'Intelligence',
    pageAccent: '#3b82f6', // blue-500
    colors: {
      primary: 'blue-500',
      border: 'blue-400/50',
      text: 'blue-300',
      background: 'blue-400/10',
      light: 'blue-50',
    },
  },
  alerts: {
    name: 'Alert Center',
    pageAccent: '#f59e0b', // amber-500
    colors: {
      primary: 'amber-500',
      border: 'amber-400/50',
      text: 'amber-300',
      background: 'amber-400/10',
      light: 'amber-50',
    },
  },
  settings: {
    name: 'Settings',
    pageAccent: '#a855f7', // purple-500
    colors: {
      primary: 'purple-500',
      border: 'purple-400/50',
      text: 'purple-300',
      background: 'purple-400/10',
      light: 'purple-50',
    },
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
