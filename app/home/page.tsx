import { Suspense } from "react";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import HomeDashboard from "./HomeDashboard";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <AuthenticatedHomePage />
    </Suspense>
  );
}

async function AuthenticatedHomePage() {
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

function HomeLoading() {
  return (
    <main className="home-page">
      <section className="home-content">
        <p className="form-eyebrow">YOUR HOUSEHUB</p>
        <h1>Loading your home...</h1>
      </section>
    </main>
  );
}
