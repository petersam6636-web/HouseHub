
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = 'https://dypyljcrmlsytobgzuno.supabase.co'

const supabaseKey =
  "sb_publishable_3NiK4p_u4U9dKf5zhs4Q9w_DiPw5G-M";

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
