import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import HomeDashboard from "./HomeDashboard";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    throw error;
  }

  if (!user) {
    redirect("/");
  }

  return <HomeDashboard email={user.email ?? ""} />;
}
