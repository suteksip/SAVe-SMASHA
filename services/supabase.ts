import { createClient } from '@supabase/supabase-js';

// These variables are the public credentials for your Supabase project.
const supabaseUrl = 'https://jhwbxzoofskkntpzbued.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2J4em9vZnNra250cHpidWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjA0ODgsImV4cCI6MjA3NTIzNjQ4OH0.4dM_txBSQTmBzJceDuAoSsPE-KjvbEuKKn_xZANypAk';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
