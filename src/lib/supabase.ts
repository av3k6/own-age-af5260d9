
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzlotgkzipwukdjfbaso.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bG90Z2t6aXB3dWtkamZiYXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjIyMjQsImV4cCI6MjA1ODc5ODIyNH0.t3fqUrQPxN07o0JoE2VFIklHFxWHtp7IE_116IXIX0E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
