/**
 * Design Tokens - Brand Accent Colors
 * Single source of truth for all accent colors across the application
 */

export const BRAND_ACCENTS = {
  dashboard: '#D97706',
  liveMonitoring: '#2A434A', 
  warRoom: '#DB2777',
  intelligence: '#426897',
  alertCenter: '#FACC15',
  settings: '#818CF8',
} as const;

/**
 * Route to accent color mapping
 * Maps route paths to their corresponding brand accent
 */
export const ROUTE_ACCENT_MAP = {
  '/': 'dashboard',
  '/real-time-monitoring': 'liveMonitoring',
  '/campaign-control': 'warRoom',
  '/intelligence-hub': 'intelligence',
  '/alert-center': 'alertCenter',
  '/settings': 'settings',
} as const;

/**
 * CSS Custom Property names for brand accents
 */
export const CSS_ACCENT_VARS = {
  dashboard: '--accent-dashboard',
  liveMonitoring: '--accent-live-monitoring',
  warRoom: '--accent-war-room',
  intelligence: '--accent-intelligence',
  alertCenter: '--accent-alert-center',
  settings: '--accent-settings',
} as const;

/**
 * Get brand accent color for a given route
 */
export function getRouteAccentColor(pathname: string): string {
  const routeKey = ROUTE_ACCENT_MAP[pathname as keyof typeof ROUTE_ACCENT_MAP] || 'dashboard';
  return BRAND_ACCENTS[routeKey];
}

/**
 * Get CSS custom property name for a given route
 */
export function getRouteAccentVar(pathname: string): string {
  const routeKey = ROUTE_ACCENT_MAP[pathname as keyof typeof ROUTE_ACCENT_MAP] || 'dashboard';
  return CSS_ACCENT_VARS[routeKey];
}

/**
 * Type definitions
 */
export type BrandAccentKey = keyof typeof BRAND_ACCENTS;
export type RoutePathname = keyof typeof ROUTE_ACCENT_MAP;
