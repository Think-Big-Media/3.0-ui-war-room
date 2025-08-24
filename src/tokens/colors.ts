/**
 * Design Tokens - Brand Accent Colors
 * Step 1: Constants only, not referenced anywhere yet
 */

export const DASHBOARD_ORANGE = '#D97706';
export const LIVE_MONITORING_GREEN = '#2A434A';
export const WAR_ROOM_FUSCHIA = '#DB2777';
export const INTELLIGENCE_BLUE = '#426897';
export const ALERT_CENTER_YELLOW = '#FACC15';
export const SETTINGS_MAUVE = '#818CF8';

export const BRAND_TOKENS = {
  dashboard: DASHBOARD_ORANGE,
  liveMonitoring: LIVE_MONITORING_GREEN,
  warRoom: WAR_ROOM_FUSCHIA,
  intelligence: INTELLIGENCE_BLUE,
  alertCenter: ALERT_CENTER_YELLOW,
  settings: SETTINGS_MAUVE,
} as const;

// Type for accessing brand tokens
export type BrandTokenKey = keyof typeof BRAND_TOKENS;
