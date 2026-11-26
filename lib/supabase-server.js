import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
const supabaseUrl = 'https://qjapdcjrdzrvkqadxuoj.supabase.co';
const supabaseKey = 'sb_publishable_Y-49ZlHv4LNAmz2FO97G4A__ydbzCnx';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie updates may be unavailable in a Server Component.
          // Middleware can handle session refresh.
        }
      },
    },
  });
}
