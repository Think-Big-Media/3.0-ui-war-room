/**
 * Mock Supabase Client for frontend-only operation
 * This will be replaced when connecting to Leap.new backend
 */

import mockDataService from '../../services/mockDataService';
import { type Database } from './database.types';

// Export mock as supabase for compatibility
export const supabase = mockDataService as any;
export default supabase;
