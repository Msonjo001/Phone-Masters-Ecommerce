import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnsubjweybalebejsope.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;  // <-- safer

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,     // <-- keeps the user logged in
    autoRefreshToken: true,   // <-- refreshes session automatically
    detectSessionInUrl: true, // <-- required for OAuth / magic links
    flowType: "pkce",         // <-- required for modern Supabase auth
  },
  cookies: {
    name: "sb-session",
    sameSite: "lax",
  }
});
