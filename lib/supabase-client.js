
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = 'https://qjapdcjrdzrvkqadxuoj.supabase.co';
const supabaseKey = 'sb_publishable_Y-49ZlHv4LNAmz2FO97G4A__ydbzCnx';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      flowType: "pkce",
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
