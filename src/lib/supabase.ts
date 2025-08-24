/**
 * Mock Supabase Client for War Room 3.0 UI (Frontend Only)
 * This is a temporary mock service until Leap.new backend is connected
 */

import mockDataService from '../services/mockDataService';

// Mock Supabase client that returns mock data
export const supabase = mockDataService;

// Export auth and db for compatibility
export const auth = mockDataService.auth;
export const db = mockDataService;

// Mock database types for compatibility
export type Database = any;

// Export default for compatibility
export default supabase;
