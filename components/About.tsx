
"use client";

import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Check,
  ClipboardList,
  HeartHandshake,
  Users,
  Wallet,
} from "lucide-react";

const schoolAreas = [
  {
    icon: Users,
    label: "Student management",
    color: "text-blue-300",
  },
  {
    icon: CalendarCheck,
    label: "Attendance & duties",
    color: "text-sky-300",
  },
  {
    icon: Wallet,
    label: "School finances",
    color: "text-indigo-300",
  },
  {
    icon: HeartHandshake,
    label: "Student welfare",
    color: "text-blue-200",
  },
];

const principles = [
  {
    number: "01",
    title: "Clarity for administrators",
    description:
      "Keep important school information organized and easier to oversee.",
  },
  {
    number: "02",
    title: "Coordination for housemasters",
    description:
      "Make everyday responsibilities and student care easier to manage.",
  },
  {
    number: "03",
    title: "A better experience for students",
    description:
      "Support a school environment where people and their needs stay in focus.",
  },
];

export default function AboutHouseHub() {
  return (
    <section
      id="about-househub"
      className="relative isolate w-full overflow-hidden bg-[#070B13] text-white"
    >
      {/* Section atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12rem] top-20 h-80 w-80 rounded-full bg-blue-600/[0.08] blur-[110px]" />

        <div className="absolute right-[-10rem] bottom-0 h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015),transparent_35%,rgba(255,255,255,0.01))]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section heading */}
          <div className="mb-10 flex flex-col gap-3 sm:mb-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300 sm:text-[11px]">
                About HouseHub
              </span>
            </div>

            <h2 className="max-w-2xl text-2xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-[2.6rem]">
              A better school day starts with{" "}
              <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                better coordination.
              </span>
            </h2>

            <p className="max-w-2xl text-[13px] leading-6 text-slate-400 sm:text-sm sm:leading-7">
              Schools are built around people. HouseHub helps the people
              responsible for running a school stay connected, organized,
              and focused on what matters most.
            </p>
          </div>

          {/* Main content */}
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            {/* Left: purpose and principles */}
            <div className="w-full">
              <div className="mb-7">
                <p className="text-sm font-semibold leading-6 text-slate-200 sm:text-base">
                  One school. Many responsibilities. One clearer way to
                  manage them.
                </p>

                <p className="mt-3 text-[13px] leading-6 text-slate-400 sm:text-sm sm:leading-7">
                  From student records and attendance to finances,
                  dormitories, duties, and welfare, HouseHub brings
                  essential school operations into one connected space.
                  Less time searching for information. More time supporting
                  students and the people who care for them.
                </p>
              </div>

              {/* Principles */}
              <div className="space-y-3">
                {principles.map((principle) => (
                  <div
                    key={principle.number}
                    className="group flex gap-3 rounded-xl border border-white/[0.055] bg-white/[0.018] p-3.5 transition-all duration-300 hover:border-blue-400/15 hover:bg-blue-500/[0.035] sm:p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-500/[0.08] text-[10px] font-bold text-blue-300">
                      {principle.number}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-[12px] font-semibold text-slate-100 sm:text-[13px]">
                        {principle.title}
                      </h3>

                      <p className="mt-1 text-[11px] leading-5 text-slate-500 sm:text-xs">
                        {principle.description}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="ml-auto mt-1 shrink-0 text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: abstract school management visual */}
            <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
              {/* Background glow */}
              <div className="pointer-events-none absolute inset-8 rounded-[3rem] bg-blue-600/[0.13] blur-[80px]" />

              {/* Main visual */}
              <div className="relative overflow-hidden rounded-[1.6rem] border border-blue-400/[0.14] bg-gradient-to-br from-[#111C2E] via-[#0B1220] to-[#080D16] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:rounded-[2rem] sm:p-5">
                {/* Decorative interface header */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10">
                      <Building2 size={17} className="text-blue-300" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-100">
                        School overview
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Connected school operations
                      </p>
                    </div>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/10 bg-blue-500/[0.06]">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                </div>

                {/* Main abstract dashboard */}
                <div className="grid grid-cols-[1fr_0.72fr] gap-3">
                  {/* Left dashboard panel */}
                  <div className="rounded-2xl border border-white/[0.06] bg-[#080F1B]/80 p-3 sm:p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-1.5 w-20 rounded-full bg-slate-300/50" />

                      <div className="h-5 w-5 rounded-md bg-blue-500/10" />
                    </div>

                    {/* Abstract information blocks */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-blue-400/[0.08] bg-blue-500/[0.06] p-3">
                        <div className="mb-3 h-6 w-6 rounded-lg bg-blue-400/15" />
                        <div className="h-1.5 w-12 rounded-full bg-slate-300/40" />
                        <div className="mt-2 h-1 w-8 rounded-full bg-slate-500/30" />
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                        <div className="mb-3 h-6 w-6 rounded-lg bg-slate-400/10" />
                        <div className="h-1.5 w-10 rounded-full bg-slate-300/40" />
                        <div className="mt-2 h-1 w-7 rounded-full bg-slate-500/30" />
                      </div>

                      <div className="col-span-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
                          <div className="h-1.5 w-7 rounded-full bg-blue-400/50" />
                        </div>

                        <div className="flex h-12 items-end gap-1.5">
                          {[32, 48, 39, 68, 54, 83, 61, 94, 72].map(
                            (height, index) => (
                              <div
                                key={index}
                                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700/50 to-blue-400/80"
                                style={{ height: `${height}%` }}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right mini panel */}
                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl border border-blue-400/[0.10] bg-[#080F1B]/80 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="h-1.5 w-10 rounded-full bg-slate-300/40" />
                        <ClipboardList
                          size={13}
                          className="text-blue-400/70"
                        />
                      </div>

                      <div className="space-y-2.5">
                        {[0, 1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-2"
                          >
                            <div className="flex h-4 w-4 items-center justify-center rounded-md bg-blue-500/10">
                              <Check
                                size={9}
                                className="text-blue-300"
                              />
                            </div>

                            <div
                              className={`h-1.5 rounded-full bg-slate-400/25 ${
                                item % 2 === 0 ? "w-10" : "w-7"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 rounded-2xl border border-white/[0.05] bg-[#080F1B]/80 p-3">
                      <div className="mb-3 h-1.5 w-12 rounded-full bg-slate-300/40" />

                      <div className="flex h-16 items-center justify-center">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-blue-500/20">
                          <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-blue-400 border-r-blue-500 rotate-45" />

                          <Users
                            size={17}
                            className="text-blue-300"
                          />
                        </div>
                      </div>

                      <div className="mx-auto mt-2 h-1.5 w-14 rounded-full bg-slate-300/30" />
                      <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-slate-500/25" />
                    </div>
                  </div>
                </div>

                {/* Connected operations strip */}
                <div className="relative mt-3 overflow-hidden rounded-xl border border-blue-400/[0.10] bg-blue-500/[0.045] p-3">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 to-blue-700" />

                  <div className="flex flex-wrap items-center justify-between gap-3 pl-1">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-200 sm:text-[11px]">
                        Every part of school life, connected
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Information · People · Responsibilities
                      </p>
                    </div>

                    <div className="flex -space-x-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#111C2E] bg-blue-500/20">
                        <Users size={12} className="text-blue-300" />
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#111C2E] bg-sky-500/15">
                        <CalendarCheck
                          size={12}
                          className="text-sky-300"
                        />
                      </div>

                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#111C2E] bg-indigo-500/15">
                        <Wallet size={12} className="text-indigo-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent */}
              <div className="pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-2xl border border-blue-400/15 bg-blue-500/[0.07] shadow-[0_0_30px_rgba(37,99,235,0.10)] sm:-right-4 sm:-top-4 sm:h-16 sm:w-16" />
            </div>
          </div>

          {/* Bottom feature categories */}
          <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-12 sm:grid-cols-4 sm:gap-3">
            {schoolAreas.map((area) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.label}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.055] bg-white/[0.018] px-3 py-3 transition-colors duration-300 hover:border-blue-400/15 hover:bg-blue-500/[0.035] sm:px-4"
                >
                  <Icon size={15} className={area.color} />

                  <span className="text-[10px] font-medium leading-4 text-slate-400 sm:text-xs">
                    {area.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
