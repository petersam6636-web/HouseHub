
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Check,
  ClipboardList,
  Users,
  Wallet,
} from "lucide-react";

const areas = [
  { icon: Users, label: "Students" },
  { icon: CalendarCheck, label: "Attendance" },
  { icon: ClipboardList, label: "Responsibilities" },
  { icon: Wallet, label: "Finances" },
];

export default function AboutHouseHub() {
  return (
    <section
      id="about-househub"
      className="relative isolate w-full overflow-hidden bg-[#070B13] text-white"
    >
      {/* Subtle blue atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/[0.09] blur-[110px]" />
        <div className="absolute right-[-8rem] top-0 h-72 w-72 rounded-full bg-blue-500/[0.07] blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* LEFT: Abstract school dashboard */}
          <div className="relative mx-auto w-full max-w-[460px] md:order-1">
            <div className="absolute inset-8 rounded-[2rem] bg-blue-600/[0.15] blur-[70px]" />

            <div className="relative overflow-hidden rounded-3xl border border-blue-400/[0.15] bg-gradient-to-br from-[#111D31] via-[#0B1220] to-[#080D16] p-4 shadow-[0_25px_70px_rgba(0,0,0,0.5)] sm:p-5">
              {/* Dashboard header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10">
                    <Building2 size={17} className="text-blue-300" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-2 w-20 rounded-full bg-slate-200/70" />
                    <div className="h-1.5 w-12 rounded-full bg-slate-500/40" />
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/10 bg-blue-500/[0.07]">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                </div>
              </div>

              {/* Dashboard cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-blue-400/[0.10] bg-[#080F1B]/80 p-3.5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-400/40" />
                    <Users size={14} className="text-blue-400/70" />
                  </div>

                  <div className="h-6 w-14 rounded-md bg-blue-400/15" />
                  <div className="mt-2 h-1.5 w-20 rounded-full bg-slate-500/30" />
                </div>

                <div className="rounded-2xl border border-white/[0.05] bg-[#080F1B]/80 p-3.5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-400/40" />
                    <CalendarCheck
                      size={14}
                      className="text-blue-400/70"
                    />
                  </div>

                  <div className="h-6 w-14 rounded-md bg-slate-300/[0.08]" />
                  <div className="mt-2 h-1.5 w-16 rounded-full bg-slate-500/30" />
                </div>

                {/* Abstract chart */}
                <div className="col-span-2 rounded-2xl border border-white/[0.05] bg-[#080F1B]/80 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-20 rounded-full bg-slate-300/40" />
                    <div className="h-1.5 w-8 rounded-full bg-blue-400/50" />
                  </div>

                  <div className="flex h-20 items-end gap-2">
                    {[35, 55, 42, 72, 50, 88, 64, 96].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-blue-700/60 to-blue-400/90"
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Small task panel */}
              <div className="mt-3 rounded-2xl border border-white/[0.05] bg-[#080F1B]/80 p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
                  <ClipboardList
                    size={14}
                    className="text-blue-400/70"
                  />
                </div>

                <div className="space-y-2.5">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-md bg-blue-500/15">
                        <Check size={10} className="text-blue-300" />
                      </div>

                      <div
                        className={`h-1.5 rounded-full bg-slate-400/25 ${
                          item === 1 ? "w-24" : "w-32"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: About text */}
          <div className="w-full max-w-[460px] md:order-2">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                About HouseHub
              </span>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-[2.6rem]">
              School life,
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                better organized.
              </span>
            </h2>

            <p className="mt-4 text-[13px] leading-6 text-slate-400 sm:text-sm sm:leading-7">
              HouseHub brings essential school activities into one
              organized space. Manage students, attendance, duties,
              finances, and more with greater clarity and coordination.
            </p>

            {/* Main benefits */}
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {areas.map((area) => {
                const Icon = area.icon;

                return (
                  <div
                    key={area.label}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 transition-colors hover:border-blue-400/20 hover:bg-blue-500/[0.04]"
                  >
                    <Icon size={15} className="shrink-0 text-blue-400" />

                    <span className="text-[11px] font-medium text-slate-300 sm:text-xs">
                      {area.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[11px] font-medium text-slate-500">
              <Check size={14} className="text-blue-400" />
              Designed to make school management simpler
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
