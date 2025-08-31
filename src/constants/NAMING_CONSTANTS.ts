/**
 * War Room Platform - Naming Constants
 * Single source of truth for all naming conventions
 * Based on DEFINITIVE_NOMENCLATURE_AUDIT.md
 * 
 * CTO/CMO Best Practice: Centralize all naming to prevent inconsistencies
 * Last Updated: 2025-08-30
 */

/**
 * Page Names - Official nomenclature from UI Schema
 * These MUST be used consistently across all components
 */
export const PAGE_NAMES = {
  COMMAND_CENTER: 'Command Center',
  REAL_TIME_MONITORING: 'Real-Time Monitoring',
  CAMPAIGN_CONTROL: 'Campaign Control',
  INTELLIGENCE_HUB: 'Intelligence Hub',
  ALERT_CENTER: 'Alert Center',
  SETTINGS: 'Settings',
} as const;

/**
 * Navigation Labels - All caps for navigation menu
 */
export const NAV_LABELS = {
  COMMAND_CENTER: 'COMMAND CENTER',
  REAL_TIME_MONITORING: 'REAL-TIME MONITORING',
  CAMPAIGN_CONTROL: 'CAMPAIGN CONTROL',
  INTELLIGENCE_HUB: 'INTELLIGENCE HUB',
  ALERT_CENTER: 'ALERT CENTER',
  SETTINGS: 'SETTINGS',
} as const;

/**
 * Routes - URL paths (kebab-case)
 */
export const ROUTES = {
  HOME: '/',
  COMMAND_CENTER: '/command-center',
  REAL_TIME_MONITORING: '/real-time-monitoring',
  CAMPAIGN_CONTROL: '/campaign-control',
  INTELLIGENCE_HUB: '/intelligence-hub',
  ALERT_CENTER: '/alert-center',
  SETTINGS: '/settings',
  // Legacy routes for backward compatibility
  LEGACY_DASHBOARD: '/dashboard',
} as const;

/**
 * API Endpoints - Backend routes
 * Based on actual backend implementation
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    ME: '/api/v1/auth/me',
    LOGOUT: '/api/v1/auth/logout',
  },
  
  // Analytics (Command Center)
  ANALYTICS: {
    SUMMARY: '/api/v1/analytics/summary',      // NOT /dashboard
    SENTIMENT: '/api/v1/analytics/sentiment',   // NOT /metrics/overview
  },
  
  // Real-Time Monitoring
  MONITORING: {
    MENTIONS: '/api/v1/monitoring/mentions',
    SENTIMENT: '/api/v1/monitoring/sentiment',  // NOT /sentiment/current
    TRENDS: '/api/v1/monitoring/trends',        // NOT /platforms/performance
  },
  
  // Campaign Control
  CAMPAIGNS: {
    META: '/api/v1/campaigns/meta',
    GOOGLE: '/api/v1/campaigns/google',
    INSIGHTS: '/api/v1/campaigns/insights',
  },
  
  // Intelligence Hub
  INTELLIGENCE: {
    CHAT_MESSAGE: '/api/v1/chat/message',
    CHAT_HISTORY: '/api/v1/chat/history',
    DOCUMENT_UPLOAD: '/api/v1/documents/upload',
  },
  
  // Alert Center
  ALERTS: {
    QUEUE: '/api/v1/alerts/queue',
    SEND: '/api/v1/alerts/send',
  },
} as const;

/**
 * Component Names - For dynamic imports and references
 */
export const COMPONENT_NAMES = {
  COMMAND_CENTER: 'CommandCenter',
  REAL_TIME_MONITORING: 'RealTimeMonitoring',
  CAMPAIGN_CONTROL: 'CampaignControl',
  INTELLIGENCE_HUB: 'IntelligenceHub',
  ALERT_CENTER: 'AlertCenter',
} as const;

/**
 * Theme/Section Names - For styling consistency
 */
export const SECTION_THEMES = {
  COMMAND_CENTER: 'dashboard',        // Historical theme name
  REAL_TIME_MONITORING: 'monitoring',
  CAMPAIGN_CONTROL: 'campaign',
  INTELLIGENCE_HUB: 'intelligence',
  ALERT_CENTER: 'alerts',
} as const;

/**
 * DEPRECATED - Old naming to be phased out
 * Keep for migration reference only
 */
export const DEPRECATED_NAMES = {
  'Dashboard': 'Use Command Center instead',
  'Live Monitoring': 'Use Real-Time Monitoring instead',
  'Notification Center': 'Use Alert Center instead',
  'Home Dashboard': 'Use Command Center instead',
  'Campaign Management': 'Use Campaign Control instead',
  'Intelligence Center': 'Use Intelligence Hub instead',
} as const;

/**
 * Helper function to check for deprecated naming
 */
export function checkDeprecatedNaming(text: string): string | null {
  for (const [deprecated, suggestion] of Object.entries(DEPRECATED_NAMES)) {
    if (text.includes(deprecated)) {
      return `Found deprecated term "${deprecated}". ${suggestion}`;
    }
  }
  return null;
}

// Type exports for TypeScript
export type PageName = typeof PAGE_NAMES[keyof typeof PAGE_NAMES];
export type NavLabel = typeof NAV_LABELS[keyof typeof NAV_LABELS];
export type Route = typeof ROUTES[keyof typeof ROUTES];
export type ComponentName = typeof COMPONENT_NAMES[keyof typeof COMPONENT_NAMES];