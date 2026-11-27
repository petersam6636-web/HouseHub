
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  Home,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "About HouseHub", href: "#about" },
    { label: "Testimonials", href: "#testimonials" },
  ],
  Resources: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Get started", href: "#get-started" },
    { label: "Contact", href: "#contact" },
  ],
};

const copyrightYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden rounded-[2rem] border-t border-white/[0.06] bg-[#05070D] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -bottom-48 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-600/[0.12] blur-[150px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* CTA */}
        <div className="relative py-16 sm:py-20 lg:py-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/[0.15] bg-gradient-to-br from-[#101D32] via-[#0B1424] to-[#080D17] px-6 py-10 shadow-[0_25px_100px_rgba(37,99,235,0.08)] sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            {/* CTA glow */}
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-500/[0.15] blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-blue-600/[0.10] blur-[100px]" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3.5 py-2">
                  <Sparkles size={14} className="text-blue-400" />

                  <span className="text-[11px] font-semibold tracking-wide text-blue-200 sm:text-xs">
                    Your home, better organized
                  </span>
                </div>

                <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                  Make room for
                  <br className="hidden sm:block" />

                  <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                    what matters most.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                  Bring your household together with a simpler way to organize
                  responsibilities, manage everyday tasks, and create a home
                  that works better for everyone.
                </p>
              </div>

              <Link
                href="#get-started"
                className="group inline-flex shrink-0 items-center gap-3 rounded-2xl border border-blue-400/20 bg-blue-500 px-6 py-4 text-sm font-bold text-white shadow-[0_12px_35px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-blue-400 hover:shadow-[0_18px_45px_rgba(37,99,235,0.35)]"
              >
                Get started

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/[0.06] pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10 lg:pb-16">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="#home"
              className="group inline-flex items-center gap-3"
            >
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-blue-400/15 bg-blue-500/[0.07]">
                <Image
                  src="/househub_logo.png"
                  alt="HouseHub logo"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
              </div>

              <div>
                <p className="text-lg font-extrabold tracking-tight text-white">
                  HouseHub
                </p>

                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  A better home experience
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500">
              A thoughtful space for managing your household, bringing
              responsibilities together, and making everyday living feel
              a little more effortless.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                <Home size={13} className="text-blue-400" />

                <span className="text-[11px] font-medium text-slate-400">
                  Built for everyday living
                </span>
              </div>
            </div>
          </div>

          {/* Explore links */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Explore
            </h3>

            <ul className="space-y-3.5">
              {footerLinks.Explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-blue-300"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white">
              Resources
            </h3>

            <ul className="space-y-3.5">
              {footerLinks.Resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-blue-300"
                  >
                    {link.label}

                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust card */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                <ShieldCheck size={19} />
              </div>

              <h3 className="mt-4 text-sm font-bold text-white">
                A calmer way to manage home
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Keep household details organized and make it easier for
                everyone to stay on the same page.
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                <Building2 size={14} className="text-blue-400" />

                <span className="text-[11px] font-medium text-slate-400">
                  Designed around your household
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-600">
            © {copyrightYear} HouseHub. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-xs text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70" />
            Made for better everyday living
          </p>
        </div>
      </div>
    </footer>
  );
}
