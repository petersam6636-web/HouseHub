
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  House,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#05070D] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-600/[0.12] blur-[120px] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-blue-500/[0.07] blur-[100px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* LEFT: Hero content */}
          <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
            {/* Trust introduction */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3.5 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15">
                <Sparkles
                  size={12}
                  className="text-blue-400"
                />
              </span>

              <span className="text-[11px] font-semibold tracking-wide text-blue-200 sm:text-xs">
                A simpler way to manage your home
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-[2.65rem] font-extrabold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl sm:leading-[1.08] md:text-6xl lg:text-[4.25rem]">
              Your home,
              <br />

              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                  better managed.
                </span>
              </span>
            </h1>

            {/* Supporting description */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8 lg:mx-0">
              Bring your household together in one place. Keep track of
              responsibilities, manage shared expenses, and make everyday
              home life feel a little more organized.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/home"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_12px_35px_rgba(37,99,235,0.32)] active:translate-y-0 sm:w-auto"
              >
                Explore HouseHub

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-6 py-3 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white sm:w-auto"
              >
                How it works

                <ArrowDown
                  size={15}
                  className="text-slate-500"
                />
              </a>
            </div>

            {/* Reassuring trust points */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 lg:justify-start">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CheckCircle2
                  size={15}
                  className="text-blue-400"
                />
                Simple to use
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <CheckCircle2
                  size={15}
                  className="text-blue-400"
                />
                Made for everyday life
              </div>
            </div>
          </div>

          {/* RIGHT: HouseHub visual */}
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center lg:max-w-none">
            {/* Decorative glow */}
            <div className="absolute h-[75%] w-[75%] rounded-full bg-blue-600/[0.12] blur-[90px]" />

            {/* Main logo presentation */}
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0B1220]/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8">
                {/* Top card details */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                      <House size={18} />
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

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
                    <ShieldCheck
                      size={16}
                      className="text-blue-400"
                    />
                  </div>
                </div>

                {/* Logo */}
                <div className="relative flex aspect-[1.15/1] items-center justify-center overflow-hidden rounded-[1.5rem] border border-blue-500/[0.12] bg-gradient-to-br from-[#101D32] via-[#0B1220] to-[#080D17]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12),transparent_65%)]" />

                  <div className="relative flex w-full items-center justify-center px-6">
                    <Image
                      src="/househub_logo.png"
                      alt="HouseHub logo"
                      width={420}
                      height={420}
                      priority
                      className="h-auto max-h-64 w-full max-w-[260px] object-contain drop-shadow-[0_15px_35px_rgba(37,99,235,0.15)] sm:max-w-[300px]"
                    />
                  </div>

                  {/* Subtle corner decoration */}
                  <div className="absolute left-5 top-5 h-8 w-8 rounded-tl-xl border-l border-t border-blue-400/20" />

                  <div className="absolute bottom-5 right-5 h-8 w-8 rounded-br-xl border-b border-r border-blue-400/20" />
                </div>

                {/* Bottom card message */}
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">
                      Everything starts at home.
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      One place for the things that matter.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/15 bg-blue-500/[0.08]">
                    <ArrowRight
                      size={18}
                      className="text-blue-400"
                    />
                  </div>
                </div>
              </div>

              {/* Floating decorative element */}
              <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#101827]/95 px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <CheckCircle2
                    size={18}
                    className="text-blue-400"
                  />
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

              {/* Floating blue accent */}
              <div className="absolute -right-2 -top-4 h-16 w-16 rounded-2xl border border-blue-400/10 bg-blue-500/[0.06] blur-[1px] sm:-right-4 sm:-top-5 sm:h-20 sm:w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
