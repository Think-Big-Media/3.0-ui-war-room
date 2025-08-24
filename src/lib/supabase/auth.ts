/**
 * Mock Authentication Layer for frontend-only operation
 * This will be replaced when connecting to Leap.new backend
 */

import { supabase } from './client';

// Mock types - remove Supabase dependency
export interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

export interface Session {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
}

/**
 * Mock sign up
 */
export async function signUp(credentials: RegisterCredentials) {
  console.log('Mock sign up:', credentials.email);
  return {
    user: { id: '1', email: credentials.email },
    session: { access_token: 'mock-token', user: { id: '1', email: credentials.email } }
  };
}

/**
 * Mock sign in
 */
export async function signIn(credentials: LoginCredentials) {
  const result = await supabase.auth.signIn(credentials.email, credentials.password);
  return result;
}

/**
 * Mock sign out
 */
export async function signOut() {
  const result = await supabase.auth.signOut();
  return result;
}

/**
 * Mock get session
 */
export async function getSession() {
  const result = await supabase.auth.getSession();
  return result?.session || null;
}

/**
 * Mock get current user
 */
export async function getCurrentUser() {
  return { id: '1', email: 'user@example.com' };
}

/**
 * Mock reset password
 */
export async function resetPassword(email: string) {
  console.log('Mock reset password:', email);
  return { data: null, error: null };
}

/**
 * Mock update password
 */
export async function updatePassword(password: string) {
  console.log('Mock update password');
  return { user: { id: '1', email: 'user@example.com' } };
}

/**
 * Mock auth state listener
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  // Return mock unsubscribe function
  return { data: { subscription: { unsubscribe: () => {} } } };
