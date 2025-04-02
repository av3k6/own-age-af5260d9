
import { AuthError } from '@supabase/supabase-js';

// Error message mapping to provide more specific error messages
export const getAuthErrorMessage = (error: AuthError | Error | any): string => {
  // Handle Supabase AuthError types
  if (error?.message) {
    if (error.message.includes('Email not confirmed')) {
      return 'Please verify your email address before logging in.';
    } else if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please try again.';
    } else if (error.message.includes('Email already registered')) {
      return 'This email is already registered. Try logging in instead.';
    } else if (error.message.includes('Password should be')) {
      return 'Password should be at least 6 characters long.';
    } else if (error.message.includes('rate limit')) {
      return 'Too many login attempts. Please try again later.';
    } else if (error.message.includes('session expired')) {
      return 'Your session has expired. Please sign in again.';
    } else if (error.message.includes('token expired')) {
      return 'Your authentication token has expired. Please sign in again.';
    }
  }
  
  // Default error message
  return error?.message || 'An unknown error occurred. Please try again.';
};
