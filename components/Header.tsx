
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  House,
  Wallet,
  ClipboardCheck,
  MessageCircle,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
} from "lucide-react";

import { supabase } from "@/lib/supabase-client";

type LoginUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

const navigation = [
  {
    name: "Home",
    path: "/home",
    icon: House,
  },
  {
    name: "Amount",
    path: "/home/amount",
    icon: Wallet,
  },
  {
    name: "Duties",
    path: "/home/duties",
    icon: ClipboardCheck,
  },
  {
    name: "Chat",
    path: "/home/chat",
    icon: MessageCircle,
  },
];

export default function Header() {
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // Get the current route without using React Router
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    function handleRouteChange() {
      setCurrentPath(window.location.pathname);
      setProfileOpen(false);
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Fetch the logged-in Supabase user
  useEffect(() => {
    let mounted = true;

    function formatUser(user: any): LoginUser {
      return {
        id: user.id,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "HouseHub User",
        email: user.email || "",
        avatar:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          "",
      };
    }

    async function fetchLoginUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !user) {
        setLoginUser(null);
        return;
      }

      setLoginUser(formatUser(user));
    }

    fetchLoginUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (!session?.user) {
        setLoginUser(null);
        return;
      }

      setLoginUser(formatUser(session.user));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const initials =
    loginUser?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  function isActive(path: string) {
    if (path === "/home") {
      return currentPath === "/home";
    }

    return currentPath === path || currentPath.startsWith(`${path}/`);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setProfileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#05070D]/95 shadow-[0_8px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {/* Full-width outer container */}
      <div className="w-full px-3 sm:px-5 lg:px-8">
        {/* Centered inner container */}
        <div className="mx-auto w-full max-w-[1440px]">
          {/* Main header row */}
          <div className="flex h-[68px] items-center justify-between gap-3 sm:h-[76px]">
            {/* LEFT: HouseHub brand */}
            <Link
              href="/home"
              className="flex shrink-0 items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[0_4px_20px_rgba(37,99,235,0.35)]">
                <House
                  size={21}
                  strokeWidth={2.4}
                  className="text-white"
                />
              </div>

              <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                House<span className="text-blue-400">Hub</span>
              </span>
            </Link>

            {/* DESKTOP: Center navigation */}
            <nav className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#0B1220] p-1.5 shadow-inner md:flex">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setCurrentPath(item.path)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 lg:px-4 ${
                      active
                        ? "bg-blue-600/15 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon size={17} strokeWidth={2} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: User profile - desktop only */}
            <div className="relative hidden shrink-0 md:block">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0B1220] p-1.5 pr-3 transition-all hover:border-blue-500/40 hover:bg-[#111B2C]"
              >
                {loginUser?.avatar ? (
                  <img
                    src={loginUser.avatar}
                    alt={loginUser.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-blue-500/30"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-bold text-blue-400 ring-1 ring-blue-500/20">
                    {initials}
                  </div>
                )}

                <div className="max-w-[150px] text-left">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    {loginUser?.name || "Loading profile..."}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {loginUser?.email || "HouseHub account"}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-slate-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile dropdown */}
              {profileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close profile menu"
                    onClick={() => setProfileOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />

                  <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101827] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                    <div className="border-b border-white/[0.06] px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {loginUser?.name || "HouseHub User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {loginUser?.email}
                      </p>
                    </div>

                    <Link
                      href="/home/profile"
                      onClick={() => setProfileOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <UserRound size={17} />
                      My profile
                    </Link>

                    <Link
                      href="/home/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-400"
                    >
                      <Settings size={17} />
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LogOut size={17} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* MOBILE: Four navigation links */}
          <nav className="grid grid-cols-4 gap-1 pb-3 md:hidden">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setCurrentPath(item.path)}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl py-2 transition-all duration-200 ${
                    active
                      ? "bg-blue-600/15 text-blue-400"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <Icon size={19} strokeWidth={2} />

                  <span className="text-[11px] font-medium sm:text-xs">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
