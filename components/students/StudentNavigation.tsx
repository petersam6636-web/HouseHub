
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
    `group relative flex min-w-0 flex-1 items-center justify-center gap-2
     rounded-xl px-2.5 py-3 text-xs font-semibold transition-all duration-200
     sm:px-3 sm:text-sm
     ${
       isActive(href)
         ? "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/25"
         : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
     }`;

  const moreIsActive = moreItems.some((item) => isActive(item.href));

  return (
    <nav
      aria-label="Student navigation"
      className="relative z-30 w-full"
    >
      <div className="flex w-full items-center gap-1.5 rounded-2xl border border-slate-800/80 bg-[#0b1220]/90 p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl sm:gap-2 sm:p-2">
        {/* Transactions */}
        <Link
          href={navigationItems[0].href}
          className={linkClass(navigationItems[0].href)}
        >
          <Receipt className="size-4 shrink-0 sm:size-[18px]" />
          <span className="truncate">Transactions</span>
        </Link>

        {/* Jobs */}
        <Link
          href={navigationItems[1].href}
          className={linkClass(navigationItems[1].href)}
        >
          <BriefcaseBusiness className="size-4 shrink-0 sm:size-[18px]" />
          <span className="truncate">Jobs</span>
        </Link>

        {/* Products: visible from sm and above */}
        <Link
          href={navigationItems[2].href}
          className={`hidden sm:flex ${linkClass(
            navigationItems[2].href
          )}`}
        >
          <Package className="size-4 shrink-0 sm:size-[18px]" />
          <span className="truncate">Products</span>
        </Link>

        {/* Feedback: visible from md and above */}
        <Link
          href={navigationItems[3].href}
          className={`hidden md:flex ${linkClass(
            navigationItems[3].href
          )}`}
        >
          <ThumbsUp className="size-4 shrink-0 sm:size-[18px]" />
          <span className="truncate">Feedback</span>
        </Link>

        {/* Chat: visible from md and above */}
        <Link
          href={navigationItems[4].href}
          className={`hidden md:flex ${linkClass(
            navigationItems[4].href
          )}`}
        >
          <MessageCircle className="size-4 shrink-0 sm:size-[18px]" />
          <span className="truncate">Chat</span>
        </Link>

        {/* More: visible below md */}
        <div ref={menuRef} className="relative flex-1 md:hidden">
          <button
            type="button"
            aria-expanded={isMoreOpen}
            aria-haspopup="menu"
            onClick={() => setIsMoreOpen((open) => !open)}
            className={`flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-2.5 py-3 text-xs font-semibold transition-all duration-200 sm:px-3 sm:text-sm ${
              moreIsActive || isMoreOpen
                ? "bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-400/25"
                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <MoreHorizontal className="size-4 shrink-0 sm:size-[18px]" />
            <span>More</span>
            <ChevronDown
              className={`hidden size-3.5 shrink-0 transition-transform duration-200 sm:block ${
                isMoreOpen ? "rotate-180" : ""
              }`}
            />
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
