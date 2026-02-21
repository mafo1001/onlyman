import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client configuration for ONLYMAN.
 * 
 * Setup instructions:
 * 1. Create a project at https://supabase.com
 * 2. Copy your project URL and anon key
 * 3. Create a .env file in the project root with:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 4. Run the SQL schema from supabase/schema.sql in Supabase SQL Editor
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Only create client if credentials are configured
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured() {
  return !!supabase;
}

export default supabase;
