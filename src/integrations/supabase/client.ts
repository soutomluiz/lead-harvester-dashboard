import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pvkzcewudzvlqiwszzwi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2a3pjZXd1ZHp2bHFpd3N6endpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwNjI0OTgsImV4cCI6MjA1MjYzODQ5OH0.0irZR2wrg7JxG_S8LkNw6scKdaRyk0U9h1KA-ht393k";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);