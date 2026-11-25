
"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  House,
  ShieldCheck,
  Sparkles,
  Wallet,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Shared expenses",
    description: "Keep household costs organized.",
  },
  {
    icon: ClipboardCheck,
    title: "Daily responsibilities",
    description: "Make everyday tasks easier to manage.",
  },
  {
    icon: MessageCircle,
    title: "Stay connected",
    description: "Keep your household on the same page.",
  },
];

export default function HeroSection() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#05070D] text-white">
      {/* Blue background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/[0.16] blur-[120px] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-blue-500/[0.12] blur-[100px]" />

        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-blue-700/[0.10] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 md:flex-row md:justify-between md:gap-10 lg:gap-16">
          {/* LEFT: Hero text */}
          <div className="w-full max-w-2xl text-center md:max-w-[560px] md:flex-1 md:text-left">
            {/* Trust introduction */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3.5 py-2 shadow-[0_0_25px_rgba(37,99,235,0.08)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                <Sparkles size={12} className="text-blue-300" />
              </span>

              <span className="text-[11px] font-semibold tracking-wide text-blue-200 sm:text-xs">
                A simpler way to manage your home
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-[2.65rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl md:text-5xl lg:text-6xl xl:text-[4.25rem]">
              Your home,
              <br />

              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                better managed.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 md:mx-0">
              Bring your household together in one place. Keep track of
              responsibilities, manage shared expenses, and make everyday
              home life feel a little more organized.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/home"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.30)] transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-400 hover:shadow-[0_15px_40px_rgba(37,99,235,0.40)] active:translate-y-0 sm:w-auto"
              >
                Explore HouseHub

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-blue-400/20 hover:bg-blue-500/[0.06] hover:text-white sm:w-auto"
              >
                How it works

                <ArrowDown size={15} className="text-blue-400" />
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 md:justify-start">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CheckCircle2 size={15} className="text-blue-400" />
                Simple to use
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CheckCircle2 size={15} className="text-blue-400" />
                Made for everyday life
              </div>
            </div>
          </div>

          {/* RIGHT: HouseHub feature visual */}
          <div className="relative mx-auto w-full max-w-lg md:mx-0 md:max-w-[460px] md:flex-1 lg:max-w-[520px]">
            {/* Outer blue glow */}
            <div className="pointer-events-none absolute inset-0 scale-90 rounded-[3rem] bg-blue-600/[0.18] blur-[90px]" />

            {/* Main visual card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-blue-400/[0.16] bg-gradient-to-br from-[#101D32]/95 via-[#0B1220]/95 to-[#080D17]/95 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65),0_0_60px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-7 lg:p-8">
              {/* Decorative blue light */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.12] blur-[80px]" />

              {/* Card header */}
              <div className="relative mb-7 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.12)]">
                    <House size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      HouseHub
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Your household space
                    </p>
                  </div>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-400/10 bg-blue-500/[0.06]">
                  <ShieldCheck size={17} className="text-blue-400" />
                </div>
              </div>

              {/* Main feature panel */}
              <div className="relative overflow-hidden rounded-2xl border border-blue-400/[0.12] bg-[#080E1A]/80 p-4 sm:p-5">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.14),transparent_60%)]" />

                <div className="relative mb-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/70">
                    Your home at a glance
                  </p>

                  <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Everything in
                    <span className="text-blue-400"> one place.</span>
                  </h2>
                </div>

                {/* Feature rows */}
                <div className="relative space-y-3">
                  {features.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.title}
                        className="group flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3 transition-all duration-300 hover:border-blue-400/15 hover:bg-blue-500/[0.05]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08] text-blue-400 transition-transform duration-300 group-hover:scale-105">
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-100 sm:text-sm">
                            {feature.title}
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                            {feature.description}
                          </p>
                        </div>

                        <CheckCircle2
                          size={16}
                          className="ml-auto shrink-0 text-blue-400/70"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom message */}
              <div className="relative mt-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Everything starts at home.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    One place for the things that matter.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] shadow-[0_0_20px_rgba(37,99,235,0.08)]">
                  <ArrowRight size={18} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Floating trust indicator */}
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-blue-400/15 bg-[#101827]/95 px-4 py-3 shadow-[0_15px_45px_rgba(0,0,0,0.55),0_0_25px_rgba(37,99,235,0.08)] backdrop-blur-xl sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <CheckCircle2 size={18} className="text-blue-400" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  Stay organized
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  One step at a time
                </p>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="pointer-events-none absolute -right-3 -top-3 h-16 w-16 rounded-2xl border border-blue-400/10 bg-blue-500/[0.06] shadow-[0_0_30px_rgba(37,99,235,0.08)] sm:-right-4 sm:-top-4 sm:h-20 sm:w-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
