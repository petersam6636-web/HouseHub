import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
const supabaseUrl = 'https://dypyljcrmlsytobgzuno.supabase.co'

const supabaseKey =
  "sb_publishable_3NiK4p_u4U9dKf5zhs4Q9w_DiPw5G-M";
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
