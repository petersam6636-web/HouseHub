"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { supabase } from "@/lib/supabase-client";

export default function HomeDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <Image src="/househub_logo.png" alt="" width={34} height={34} priority />
          <span>HouseHub</span>
        </div>
        <button
          className="home-signout"
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </header>

      <section className="home-content">
        <p className="form-eyebrow">YOUR HOUSEHUB</p>
        <h1>Welcome home.</h1>
        <p>{email ? `Signed in as ${email}` : "You’re signed in and ready to get started."}</p>
        <div className="home-welcome-card">
          <h2>Your home, all in one place</h2>
          <p>Your HouseHub dashboard is ready. More ways to manage your home are coming soon.</p>
        </div>
        {errorMessage && (
          <p className="auth-feedback auth-error" role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </main>
  );
}
