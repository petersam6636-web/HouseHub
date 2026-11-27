
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  MessageCircle,
  Package,
  Receipt,
  ThumbsUp,
  MoreHorizontal,
} from "lucide-react";

type StudentNavigationProps = {
  studentId: string;
  projectId: string;
};

export default function StudentNavigation({
  studentId,
  projectId,
}: StudentNavigationProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const query = `?id=${studentId}&projectId=${projectId}`;

  const navigationItems = [
    {
      label: "Transactions",
      href: `/home/transactions?studentId=${studentId}&projectId=${projectId}`,
      icon: Receipt,
    },
    {
      label: "Jobs",
      href: `/home/students/jobs${query}`,
      icon: BriefcaseBusiness,
    },
    {
      label: "Products",
      href: `/home/students/products${query}`,
      icon: Package,
    },
    {
      label: "Feedback",
      href: `/home/students/feedback${query}`,
      icon: ThumbsUp,
    },
    {
      label: "Chat",
      href: `/home/students/chat${query}`,
      icon: MessageCircle,
    },
  ];

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const moreItems = navigationItems.slice(3);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMoreOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const linkClass = (href: string) =>
    `group flex min-w-0 flex-col items-center gap-2 rounded-2xl py-3
     text-center outline-none transition-colors focus-visible:ring-2
     focus-visible:ring-blue-500 ${
       isActive(href) ? "text-blue-300" : "text-slate-400"
     }`;

  const activeIconClass = (href: string) =>
    isActive(href) ? "ring-2 ring-inset ring-blue-400/50" : "";

  const moreIsActive = moreItems.some((item) => isActive(item.href));

  return (
    <nav
      aria-label="Student navigation"
      className="relative z-30 w-full"
    >
      <div className="mx-auto grid w-full max-w-xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {/* Transactions */}
        <Link
          href={navigationItems[0].href}
          className={linkClass(navigationItems[0].href)}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/[0.12] bg-indigo-500/[0.08] text-indigo-300 transition-colors group-hover:bg-indigo-500/[0.14] ${activeIconClass(navigationItems[0].href)}`}
          >
            <Receipt size={20} />
          </div>
          <span
            className={`text-[10px] font-medium ${
              isActive(navigationItems[0].href)
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-indigo-300"
            }`}
          >
            Transactions
          </span>
        </Link>

        {/* Jobs */}
        <Link
          href={navigationItems[1].href}
          className={linkClass(navigationItems[1].href)}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/[0.12] bg-cyan-500/[0.08] text-cyan-300 transition-colors group-hover:bg-cyan-500/[0.14] ${activeIconClass(navigationItems[1].href)}`}
          >
            <BriefcaseBusiness size={20} />
          </div>
          <span
            className={`text-[10px] font-medium ${
              isActive(navigationItems[1].href)
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-cyan-300"
            }`}
          >
            Jobs
          </span>
        </Link>

        {/* Products: visible from sm and above */}
        <Link
          href={navigationItems[2].href}
          className={`hidden sm:flex ${linkClass(
            navigationItems[2].href
          )}`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/[0.12] bg-blue-500/[0.08] text-blue-400 transition-colors group-hover:bg-blue-500/[0.14] ${activeIconClass(navigationItems[2].href)}`}
          >
            <Package size={20} />
          </div>
          <span
            className={`text-[10px] font-medium ${
              isActive(navigationItems[2].href)
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-blue-300"
            }`}
          >
            Products
          </span>
        </Link>

        {/* Feedback: visible from md and above */}
        <Link
          href={navigationItems[3].href}
          className={`hidden md:flex ${linkClass(
            navigationItems[3].href
          )}`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/[0.12] bg-violet-500/[0.08] text-violet-300 transition-colors group-hover:bg-violet-500/[0.14] ${activeIconClass(navigationItems[3].href)}`}
          >
            <ThumbsUp size={20} />
          </div>
          <span
            className={`text-[10px] font-medium ${
              isActive(navigationItems[3].href)
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-violet-300"
            }`}
          >
            Feedback
          </span>
        </Link>

        {/* Chat: visible from md and above */}
        <Link
          href={navigationItems[4].href}
          className={`hidden md:flex ${linkClass(
            navigationItems[4].href
          )}`}
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/[0.12] bg-sky-500/[0.08] text-sky-300 transition-colors group-hover:bg-sky-500/[0.14] ${activeIconClass(navigationItems[4].href)}`}
          >
            <MessageCircle size={20} />
          </div>
          <span
            className={`text-[10px] font-medium ${
              isActive(navigationItems[4].href)
                ? "text-blue-300"
                : "text-slate-400 group-hover:text-sky-300"
            }`}
          >
            Chat
          </span>
        </Link>

        {/* More: visible below md */}
        <div ref={menuRef} className="relative md:hidden">
          <button
            type="button"
            aria-expanded={isMoreOpen}
            aria-haspopup="menu"
            onClick={() => setIsMoreOpen((open) => !open)}
            className={`group flex w-full min-w-0 flex-col items-center gap-2 rounded-2xl py-3 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
              moreIsActive || isMoreOpen
                ? "text-blue-300"
                : "text-slate-400"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/[0.12] bg-blue-500/[0.08] text-blue-400 transition-colors group-hover:bg-blue-500/[0.14] ${
                moreIsActive || isMoreOpen
                  ? "ring-2 ring-inset ring-blue-400/50"
                  : ""
              }`}
            >
              <MoreHorizontal size={20} />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 group-hover:text-blue-300">
              More
              <ChevronDown
                className={`size-3 transition-transform duration-200 ${
                  isMoreOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {/* Dropdown menu */}
          <div
            role="menu"
            className={`absolute right-0 top-full z-50 mt-2 w-52 origin-top-right rounded-2xl border border-slate-700/80 bg-[#0b1220] p-2 shadow-2xl shadow-black/40 transition-all duration-200 ${
              isMoreOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-2 scale-95 opacity-0"
            }`}
          >
            {/* Products appears inside More only below sm */}
            <Link
              href={navigationItems[2].href}
              role="menuitem"
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white sm:hidden"
            >
              <Package className="size-4 text-blue-400" />
              <span className="flex-1">Products</span>
              <ArrowUpRight className="size-3.5 text-slate-600" />
            </Link>

            {/* Feedback */}
            <Link
              href={navigationItems[3].href}
              role="menuitem"
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ThumbsUp className="size-4 text-blue-400" />
              <span className="flex-1">Feedback</span>
              <ArrowUpRight className="size-3.5 text-slate-600" />
            </Link>

            {/* Chat */}
            <Link
              href={navigationItems[4].href}
              role="menuitem"
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MessageCircle className="size-4 text-blue-400" />
              <span className="flex-1">Chat</span>
              <ArrowUpRight className="size-3.5 text-slate-600" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
