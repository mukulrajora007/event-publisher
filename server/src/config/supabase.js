import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseKey !== 'your-anon-or-service-role-key'
);

let supabaseClient = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized successfully with:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
    supabaseClient = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not provided or using defaults. Running in local in-memory fallback mode.');
  console.log('💡 Tip: Set SUPABASE_URL and SUPABASE_KEY in server/.env and run supabase/schema.sql in your Supabase SQL editor to connect your live database.');
}

export const supabase = supabaseClient;
