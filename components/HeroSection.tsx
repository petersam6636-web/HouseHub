
"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardCheck,
  House,
  MessageCircle,
  Sparkles,
  Wallet,
} from "lucide-react";

const rooms = [
  { width: "w-[72%]", height: "h-2" },
  { width: "w-[48%]", height: "h-2" },
  { width: "w-[62%]", height: "h-2" },
];

const bars = [35, 55, 42, 75, 50, 88, 64];

export default function HeroSection() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#05070D] text-white">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-48 left-[55%] h-[480px] w-[480px] rounded-full bg-blue-600/[0.15] blur-[130px]" />
        <div className="absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-blue-500/[0.10] blur-[100px]" />
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-blue-700/[0.08] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-between md:gap-8 lg:gap-12">
          {/* LEFT: Compact hero content */}
          <div className="w-full max-w-[460px] text-center md:flex-1 md:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 py-1.5">
              <Sparkles size={12} className="text-blue-300" />

              <span className="text-[10px] font-semibold tracking-wide text-blue-200 sm:text-[11px]">
                A simpler way to manage your home
              </span>
            </div>

            <h1 className="text-[2.15rem] font-extrabold leading-[1.08] tracking-[-0.05em] text-white sm:text-4xl md:text-[2.65rem] lg:text-5xl">
              Your home,
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                better managed.
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[390px] text-[13px] leading-6 text-slate-400 sm:text-sm sm:leading-7 md:mx-0">
              Bring your household together in one place. Organize
              responsibilities, shared expenses, and everyday home life.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center md:justify-start">
              <Link
                href="/home"
                className="group inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 sm:w-auto"
              >
                Explore HouseHub
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-2.5 text-xs font-semibold text-slate-300 transition-all duration-300 hover:border-blue-400/20 hover:bg-blue-500/[0.06] hover:text-white sm:w-auto"
              >
                How it works
                <ArrowDown size={13} className="text-blue-400" />
              </a>
            </div>

            {/* Small trust points */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 size={13} className="text-blue-400" />
                Simple to use
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 size={13} className="text-blue-400" />
                Made for everyday life
              </div>
            </div>
          </div>

          {/* RIGHT: Decorative dashboard visual */}
          <div className="relative mx-auto w-full max-w-[390px] md:mx-0 md:flex-1 lg:max-w-[430px]">
            {/* Blue glow */}
            <div className="pointer-events-none absolute inset-4 rounded-[2.5rem] bg-blue-600/[0.20] blur-[65px]" />

            {/* Main dashboard frame */}
            <div className="relative rounded-[1.7rem] border border-blue-400/[0.18] bg-gradient-to-br from-[#111E33] via-[#0B1220] to-[#080D17] p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_45px_rgba(37,99,235,0.12)] sm:p-4">
              {/* Decorative top bar */}
              <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                    <House size={14} />
                  </div>

                  <div className="space-y-1">
                    <div className="h-1.5 w-16 rounded-full bg-slate-200/80" />
                    <div className="h-1 w-10 rounded-full bg-slate-500/50" />
                  </div>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
                  <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
              </div>

              {/* Dashboard body */}
              <div className="grid grid-cols-[1.05fr_0.95fr] gap-3">
                {/* Progress card */}
                <div className="relative overflow-hidden rounded-2xl border border-blue-400/[0.13] bg-[#080F1C]/90 p-3">
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.12] blur-2xl" />

                  <div className="relative mb-3 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-400/50" />
                    <div className="h-1.5 w-5 rounded-full bg-blue-400/60" />
                  </div>

                  <div className="relative flex items-center justify-center py-1">
                    <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[conic-gradient(from_220deg,#2563eb_0deg,#60a5fa_245deg,rgba(30,41,59,0.65)_245deg,rgba(30,41,59,0.65)_360deg)] shadow-[0_0_24px_rgba(37,99,235,0.16)]">
                      <div className="absolute inset-[7px] rounded-full bg-[#0B1424]" />

                      <div className="relative flex flex-col items-center gap-1">
                        <Check size={20} className="text-blue-300" />
                        <div className="h-1.5 w-7 rounded-full bg-slate-300/60" />
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-3 space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                      <div className="h-full w-[72%] rounded-full bg-blue-500" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-1 w-8 rounded-full bg-slate-500/50" />
                      <div className="h-1 w-5 rounded-full bg-slate-500/30" />
                    </div>
                  </div>
                </div>

                {/* Mini activity card */}
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="h-1.5 w-10 rounded-full bg-slate-400/50" />
                      <Wallet size={13} className="text-blue-400/70" />
                    </div>

                    <div className="h-5 w-14 rounded-md bg-blue-400/15" />

                    <div className="mt-3 flex h-10 items-end gap-1.5">
                      {bars.map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700/60 to-blue-400/90"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="h-1.5 w-12 rounded-full bg-slate-400/50" />
                      <ClipboardCheck size={13} className="text-blue-400/70" />
                    </div>

                    <div className="space-y-2.5">
                      {rooms.map((room, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex h-4 w-4 items-center justify-center rounded-md bg-blue-500/15">
                            <Check size={9} className="text-blue-300" />
                          </div>

                          <div
                            className={`${room.width} ${room.height} rounded-full bg-slate-400/25`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom visual tiles */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                    <Wallet size={13} className="text-blue-400" />
                  </div>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-400/30" />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                    <ClipboardCheck size={13} className="text-blue-400" />
                  </div>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-400/30" />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                    <MessageCircle size={13} className="text-blue-400" />
                  </div>
                  <div className="h-1.5 flex-1 rounded-full bg-slate-400/30" />
                </div>
              </div>
            </div>

            {/* Floating blue accent */}
            <div className="pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] shadow-[0_0_30px_rgba(37,99,235,0.12)] sm:-right-4 sm:-top-4 sm:h-16 sm:w-16" />

            {/* Floating status tile */}
            <div className="absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-xl border border-blue-400/15 bg-[#101827]/95 px-3 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:-left-5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                <CheckCircle2 size={15} className="text-blue-400" />
              </div>

              <div className="space-y-1">
                <div className="h-1.5 w-14 rounded-full bg-slate-200/70" />
                <div className="h-1 w-10 rounded-full bg-slate-500/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
