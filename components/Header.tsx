
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import useApp from "@/lib/useApp";

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
  {
    name: "Settings",
    path: "/home/settings",
    icon: Settings,
  },
];

export default function Header() {
  const router = useRouter();
  const { authenticatedId, setAuthenticatedId } = useApp();
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [mobilePopup, setMobilePopup] = useState<string | null>(null);

  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the popup timer.
  function clearPopupTimer() {
    if (popupTimer.current) {
      clearTimeout(popupTimer.current);
      popupTimer.current = null;
    }
  }

  // Show the mobile navigation popup.
  function showMobilePopup(name: string) {
    clearPopupTimer();
    setMobilePopup(name);
  }

  // Hide the popup after one second.
  function schedulePopupClose() {
    clearPopupTimer();

    popupTimer.current = setTimeout(() => {
      setMobilePopup(null);
      popupTimer.current = null;
    }, 1000);
  }

  // Close popup when component unmounts.
  useEffect(() => {
    return () => {
      clearPopupTimer();
    };
  }, []);

  // Track browser navigation.
  useEffect(() => {
    setCurrentPath(window.location.pathname);

    function handleRouteChange() {
      setCurrentPath(window.location.pathname);
      setProfileOpen(false);
      setMobilePopup(null);
    }

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Fetch and listen for the logged-in Supabase user.
  useEffect(() => {
    let mounted = true;
    let authEventsReceived = 0;

    function formatUser(user: {
      id: string;
      email?: string;
      user_metadata?: {
        full_name?: string;
        name?: string;
        avatar_url?: string;
        picture?: string;
      };
    }): LoginUser {
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventsReceived += 1;
      if (!mounted) return;

      setAuthenticatedId(session?.user.id ?? null);
      setLoginUser(session?.user ? formatUser(session.user) : null);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted || authEventsReceived > 0) return;

        if (error) {
          console.error("Unable to read the current auth session.", error);
          return;
        }

        const user = data.session?.user;
        setAuthenticatedId(user?.id ?? null);
        setLoginUser(user ? formatUser(user) : null);
      })
      .catch((error: unknown) => {
        if (mounted) {
          console.error("Unable to read the current auth session.", error);
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setAuthenticatedId]);

  const currentLoginUser =
    loginUser?.id === authenticatedId ? loginUser : null;

  const initials =
    currentLoginUser?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  function isActive(path: string) {
    if (path === "/home") {
      return (
        currentPath === "/home" ||
        currentPath === "/home/create" ||
        currentPath === "/home/project" ||
        /^\/home\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          currentPath
        )
      );
    }

    return (
      currentPath === path ||
      currentPath.startsWith(`${path}/`)
    );
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Unable to sign out.", error);
      return;
    }

    setProfileOpen(false);
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full border-b border-white/[0.06] bg-[#05070D]/95 shadow-[0_8px_35px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="h-full w-full px-2 sm:px-4 lg:px-8">
        <div className="mx-auto h-full w-full max-w-6xl">
          {/* Same header height on every device */}
          <div className="flex h-full items-center justify-between gap-1.5 sm:gap-3 md:gap-5">
            {/* LEFT: HouseHub brand */}
            <Link
              href="/home"
              onClick={() => {
                setCurrentPath("/home");
                setMobilePopup(null);
                clearPopupTimer();
              }}
              className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-transform duration-300 hover:scale-105 sm:h-10 sm:w-10 sm:rounded-xl">
                <House
                  size={19}
                  strokeWidth={2.4}
                  className="text-white"
                />
              </div>

              <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-white sm:text-lg md:text-xl">
                House<span className="text-blue-400">Hub</span>
              </span>
            </Link>

            {/* MOBILE: Icons only below sm */}
            <nav className="flex shrink-0 items-center gap-0.5 sm:hidden">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const popupOpen = mobilePopup === item.name;

                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => showMobilePopup(item.name)}
                    onMouseLeave={schedulePopupClose}
                  >
                    <Link
                      href={item.path}
                      aria-label={item.name}
                      aria-expanded={popupOpen}
                      onClick={() => {
                        setCurrentPath(item.path);
                        showMobilePopup(item.name);
                        schedulePopupClose();
                      }}
                      className={`group relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 active:scale-90 ${
                        active
                          ? "bg-blue-500/15 text-blue-400"
                          : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                      }`}
                    >
                      <Icon
                        size={19}
                        strokeWidth={active ? 2.5 : 2}
                        className={`transition-transform duration-200 ${
                          active
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />

                      {active && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      )}
                    </Link>

                    {/* Compact icon + name popup */}
                    <div
                      className={`pointer-events-none absolute right-0 top-[calc(100%+8px)] z-[60] w-32 origin-top-right transition-all duration-150 ${
                        popupOpen
                          ? "visible translate-y-0 scale-100 opacity-100"
                          : "invisible -translate-y-1 scale-95 opacity-0"
                      }`}
                    >
                      <div className="relative flex items-center gap-2.5 rounded-xl border border-blue-500/20 bg-[#101827] px-3 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.55)]">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                          <Icon size={16} strokeWidth={2.3} />
                        </div>

                        <span className="truncate text-xs font-semibold text-slate-100">
                          {item.name}
                        </span>

                        {/* Popup arrow */}
                        <span className="absolute -top-1 right-3 h-2 w-2 rotate-45 border-l border-t border-blue-500/20 bg-[#101827]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* sm to md: Text-only navigation */}
            <nav className="hidden shrink-0 items-center gap-0.5 sm:flex md:hidden">
              {navigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => {
                      setCurrentPath(item.path);
                      setMobilePopup(null);
                      clearPopupTimer();
                    }}
                    className={`cursor-pointer whitespace-nowrap rounded-lg px-2 py-2 text-[11px] font-semibold transition-colors duration-200 sm:px-2.5 sm:text-xs ${
                      active
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* md and above: Full desktop navigation */}
            <nav className="hidden items-center gap-1 rounded-2xl border border-white/[0.06] bg-[#0B1220] p-1 md:flex">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => {
                      setCurrentPath(item.path);
                      setMobilePopup(null);
                      clearPopupTimer();
                    }}
                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 lg:gap-2 lg:px-4 lg:py-2.5 lg:text-sm ${
                      active
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
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
                className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0B1220] p-1.5 pr-2.5 transition-all hover:border-blue-500/40 hover:bg-[#111B2C] lg:gap-3 lg:rounded-2xl lg:pr-3"
              >
                {currentLoginUser?.avatar ? (
                  <img
                    src={currentLoginUser.avatar}
                    alt={currentLoginUser.name}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-blue-500/30 lg:h-9 lg:w-9 lg:rounded-xl"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-xs font-bold text-blue-400 ring-1 ring-blue-500/20 lg:h-9 lg:w-9 lg:rounded-xl lg:text-sm">
                    {initials}
                  </div>
                )}

                <div className="hidden max-w-[120px] text-left lg:block">
                  <p className="truncate text-sm font-semibold text-slate-100">
                    {currentLoginUser?.name || "Loading profile..."}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {currentLoginUser?.email || "HouseHub account"}
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  className={`text-slate-500 transition-transform duration-200 ${
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

                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101827] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                    <div className="border-b border-white/[0.06] px-3 py-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {currentLoginUser?.name || "HouseHub User"}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {currentLoginUser?.email}
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
        </div>
      </div>
    </header>
  );
}
