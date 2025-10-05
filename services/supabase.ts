// The import statement was removed as requested.
// import { createClient } from '@supabase/supabase-js';

// These variables are the public credentials for your Supabase project.
const supabaseUrl = 'https://jhwbxzoofskkntpzbued.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impod2J4em9vZnNra250cHpidWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NjA0ODgsImV4cCI6MjA3NTIzNjQ4OH0.4dM_txBSQTmBzJceDuAoSsPE-KjvbEuKKn_xZANypAk';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided.");
}

// To satisfy TypeScript, we declare the global `supabase` object
// that is loaded from the CDN script in index.html.
// The user requested to call this variable directly instead of using an import.
// FIX: To resolve the "Cannot redeclare block-scoped variable 'supabase'" error, the ambient declaration for the global 'supabase' object has been changed to augment the `Window` interface. This allows explicit access via `window.supabase`, preventing a name collision with the `supabase` client instance being exported from this module.
declare global {
    interface Window {
        supabase: {
            createClient: (url: string, key: string) => any;
        };
    }
}


// We call createClient from the global object to initialize the client.
export const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
