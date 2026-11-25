"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ClipboardCheck,
  House,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";

const navigation = [
  { name: "Home", path: "/home", icon: House },
  { name: "Amount", path: "/home/amount", icon: Wallet },
  { name: "Duties", path: "/home/duties", icon: ClipboardCheck },
  { name: "Chat", path: "/home/chat", icon: MessageCircle },
];

type LoginUser = {
  name: string;
  email: string;
  avatar: string;
};

export default function Header() {
  const pathname = usePathname();
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    async function getLoginUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setLoginUser(null);
        return;
      }

      setLoginUser({
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
      });
    }

    void getLoginUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (!user) {
        setLoginUser(null);
        return;
      }

      setLoginUser({
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
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const initials =
    loginUser?.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/40 bg-[#0B1220] shadow-[0_8px_30px_rgba(0,0,0,0.28)]">
      <div className="w-full px-3 sm:px-5">
        <div className="mx-auto flex h-[76px] w-full max-w-[1440px] items-center justify-between gap-4">
          <Link
            href="/home"
            className="flex shrink-0 items-center gap-3"
            aria-label="HouseHub home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <House size={21} strokeWidth={2.5} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              House<span className="text-emerald-400">Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-2xl border border-slate-700/50 bg-[#101A2A] p-1.5 shadow-inner md:flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.path ||
                (item.path !== "/home" && pathname.startsWith(`${item.path}/`));

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="relative flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              aria-label="Toggle profile menu"
              className="flex items-center gap-2 rounded-2xl border border-slate-700/50 bg-[#101A2A] p-1.5 pr-2.5 transition hover:border-emerald-500/40 hover:bg-[#151F30] sm:gap-3 sm:pr-3"
            >
              {loginUser?.avatar ? (
                <img
                  src={loginUser.avatar}
                  alt={loginUser.name}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-xl object-cover ring-1 ring-emerald-500/20"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-sm font-bold text-emerald-400 ring-1 ring-emerald-500/20">
                  {initials}
                </div>
              )}

              <div className="hidden max-w-[150px] text-left sm:block">
                <p className="truncate text-sm font-semibold text-slate-100">
                  {loginUser?.name || "Loading..."}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {loginUser?.email || "Your account"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`hidden text-slate-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-64 overflow-hidden rounded-2xl border border-slate-700/60 bg-[#151F30] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="border-b border-slate-700/60 px-3 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {loginUser?.name}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {loginUser?.email}
                  </p>
                </div>

                <Link
                  href="/home/settings"
                  onClick={() => setProfileOpen(false)}
                  className="mt-2 flex items-center rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  Account settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
