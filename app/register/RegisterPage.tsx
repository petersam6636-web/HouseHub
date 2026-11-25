
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import gsap from 'gsap'
import {useGSAP} from '@gsap/react';
import { supabase } from "@/lib/supabase-client";

type AuthMode = "signin" | "signup";
type PendingAction = "google" | "email" | null;

export default function RegisterPage() {
  const router = useRouter();
  const pageRef = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState<"error" | "success">("error");



  const setError = (message: string) => {
    setFeedbackType("error");
    setFeedback(message);
  };

  const handleGoogleSignIn = async () => {
    setPendingAction("google");
    setFeedback("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/home` },
      });

      if (error) setError(error.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to start Google sign in.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPendingAction("email");
    setFeedback("");

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
          return;
        }

        router.replace("/home");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: new URL("/", window.location.origin).toString(),
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        router.replace("/home");
        return;
      }

      setFeedbackType("success");
      setFeedback("Check your email for a confirmation link. After confirming, sign in here to continue.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to complete your request.");
    } finally {
      setPendingAction(null);
    }
  };

  const switchMode = () => {
    setMode((currentMode) => (currentMode === "signin" ? "signup" : "signin"));
    setFeedback("");
  };

  const isPending = pendingAction !== null;

  useGSAP(() => {
    gsap.from(".register-card", {
      scale: 0,
      opacity: 0,
      duration: 0.2
    });
  }, { scope: pageRef, dependencies: [mode] });

  return (
    <main ref={pageRef} className="register-page">
      <section className="register-card" aria-labelledby="auth-heading">
        <div className="register-brand">
          <Link href="/" className="register-brand-link" aria-label="HouseHub home">
            <Image
              src="/househub_logo.png"
              alt=""
              width={48}
              height={48}
              priority
            />
            <span>HouseHub</span>
          </Link>
        </div>

        <header className="form-heading">
          <p className="form-eyebrow">WELCOME HOME</p>
          <h1 id="auth-heading">
            {mode === "signin" ? "Sign in to " : "Create your "}
            <span>{mode === "signin" ? "HouseHub" : "account"}</span>
          </h1>
          <p>
            {mode === "signin"
              ? "Your home, thoughtfully connected."
              : "A simpler way to manage your home."}
          </p>
        </header>

        <button
          className="google-button"
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isPending}
          aria-busy={pendingAction === "google"}
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" className="google-icon">
            <path
              fill="#4285F4"
              d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.62 4.62 0 0 1-2 3.03v2.47h3.23c1.9-1.75 2.98-4.33 2.98-7.29Z"
            />
            <path
              fill="#34A853"
              d="M10 20c2.7 0 4.97-.9 6.62-2.48l-3.23-2.47c-.9.6-2.05.96-3.39.96-2.6 0-4.8-1.76-5.59-4.13H1.08v2.55A10 10 0 0 0 10 20Z"
            />
            <path
              fill="#FBBC05"
              d="M4.41 11.88a6.02 6.02 0 0 1 0-3.76V5.57H1.08a10 10 0 0 0 0 8.86l3.33-2.55Z"
            />
            <path
              fill="#EA4335"
              d="M10 3.99c1.47 0 2.79.5 3.82 1.5l2.86-2.86C14.96.99 12.7 0 10 0a10 10 0 0 0-8.92 5.57l3.33 2.55C5.2 5.75 7.4 3.99 10 3.99Z"
            />
          </svg>
          {pendingAction === "google" ? "Opening Google sign-in..." : "Sign in with Google"}
        </button>
        {pendingAction === "google" && (
          <p className="google-feedback" role="status" aria-live="polite">
            Redirecting to Google to complete sign-in...
          </p>
        )}

        <div className="form-separator" aria-hidden="true">
          <span />
          <p>OR CONTINUE WITH EMAIL</p>
          <span />
        </div>

        <form className="auth-form" onSubmit={handleEmailSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
              disabled={isPending}
            />
          </div>

          {feedback && (
            <p
              className={`auth-feedback ${feedbackType === "success" ? "auth-success" : "auth-error"}`}
              role={feedbackType === "error" ? "alert" : "status"}
            >
              {feedback}
            </p>
          )}

          <button className="submit-button" type="submit" disabled={isPending}>
            {pendingAction === "email"
              ? "Please wait..."
              : mode === "signin"
                ? "Sign in"
                : "Sign up"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "signin" ? "New to HouseHub?" : "Already have an account?"}
          <button type="button" onClick={switchMode} disabled={isPending}>
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}
