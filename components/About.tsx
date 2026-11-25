
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
      {/* Enhanced blue atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Main blue glow */}
        <div className="absolute left-[-12rem] top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-blue-600/[0.18] blur-[120px] sm:h-[42rem] sm:w-[42rem] sm:bg-blue-600/[0.20] sm:blur-[150px]" />

        {/* Strong illustration-side gradient */}
        <div className="absolute left-[5%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-blue-500/[0.16] blur-[130px] sm:bg-blue-500/[0.18]" />

        {/* Right-side atmosphere behind the text */}
        <div className="absolute -right-[12rem] top-[5%] h-[30rem] w-[30rem] rounded-full bg-blue-700/[0.12] blur-[120px] sm:h-[40rem] sm:w-[40rem] sm:bg-blue-700/[0.15]" />

        {/* Soft center blue light */}
        <div className="absolute left-1/2 top-[35%] h-[24rem] w-[80%] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[120px]" />

        {/* Subtle blue gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/[0.30] via-transparent to-blue-900/[0.15]" />

        {/* Fine dotted texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      {/* Same max width and horizontal spacing as HeroSection */}
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* LEFT: Abstract school dashboard */}
          <div className="order-2 relative mx-auto w-full max-w-[460px] md:order-1">
            {/* Stronger blue gradient behind dashboard */}
            <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-blue-600/[0.20] blur-[75px] sm:-inset-12 sm:bg-blue-600/[0.24] sm:blur-[100px]" />

            {/* Additional illustration glow */}
            <div className="pointer-events-none absolute -left-10 top-[15%] h-[22rem] w-[22rem] rounded-full bg-blue-400/[0.14] blur-[90px] sm:h-[30rem] sm:w-[30rem] sm:bg-blue-400/[0.18]" />

            {/* Dashboard frame */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-400/[0.22] bg-gradient-to-br from-[#142746]/95 via-[#0B1425]/95 to-[#080D17]/95 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.55),0_0_70px_rgba(37,99,235,0.12)] backdrop-blur-2xl sm:p-5">
              {/* Inner blue atmosphere */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.18),transparent_55%)]" />

              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

              {/* Dashboard header */}
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-blue-600/[0.05] shadow-[0_0_25px_rgba(37,99,235,0.12)]">
                    <Building2 size={17} className="text-blue-300" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-2 w-20 rounded-full bg-slate-200/70" />
                    <div className="h-1.5 w-12 rounded-full bg-slate-500/40" />
                  </div>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/[0.12] shadow-[0_0_20px_rgba(59,130,246,0.12)]">
                  <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                </div>
              </div>

              {/* Dashboard cards */}
              <div className="relative grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-blue-400/[0.16] bg-gradient-to-br from-blue-500/[0.10] via-[#080F1B]/90 to-[#080F1B]/90 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-400/40" />
                    <Users size={14} className="text-blue-400/80" />
                  </div>

                  <div className="h-6 w-14 rounded-md bg-gradient-to-r from-blue-400/25 to-blue-600/10" />
                  <div className="mt-2 h-1.5 w-20 rounded-full bg-slate-500/30" />
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.035] via-[#080F1B]/90 to-[#080F1B]/90 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-12 rounded-full bg-slate-400/40" />
                    <CalendarCheck
                      size={14}
                      className="text-blue-400/80"
                    />
                  </div>

                  <div className="h-6 w-14 rounded-md bg-blue-400/[0.10]" />
                  <div className="mt-2 h-1.5 w-16 rounded-full bg-slate-500/30" />
                </div>

                {/* Abstract chart */}
                <div className="col-span-2 overflow-hidden rounded-2xl border border-blue-400/[0.12] bg-gradient-to-br from-blue-500/[0.07] via-[#080F1B]/90 to-[#080F1B]/90 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-1.5 w-20 rounded-full bg-slate-300/40" />
                    <div className="h-1.5 w-8 rounded-full bg-blue-400/60" />
                  </div>

                  <div className="relative flex h-20 items-end gap-2">
                    {/* Chart glow */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-blue-500/[0.08] blur-xl" />

                    {[35, 55, 42, 72, 50, 88, 64, 96].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="relative flex-1 rounded-t-md bg-gradient-to-t from-blue-700/80 via-blue-500/80 to-blue-300"
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Small task panel */}
              <div className="relative mt-3 overflow-hidden rounded-2xl border border-blue-400/[0.10] bg-gradient-to-br from-blue-500/[0.05] via-[#080F1B]/90 to-[#080F1B]/90 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.15)]">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
                  <ClipboardList
                    size={14}
                    className="text-blue-400/80"
                  />
                </div>

                <div className="space-y-2.5">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-md border border-blue-400/15 bg-blue-500/15">
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

              {/* Bottom subtle blue edge */}
              <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
            </div>

            {/* Floating decorative accent */}
            <div className="pointer-events-none absolute -right-3 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-[#101D32]/90 text-blue-300 shadow-[0_15px_40px_rgba(0,0,0,0.35),0_0_30px_rgba(37,99,235,0.15)] sm:-right-5 sm:-top-5 sm:h-14 sm:w-14">
              <ArrowUpRight size={20} />
            </div>
          </div>

          {/* RIGHT: About text */}
          <div className="order-1 w-full max-w-[460px] text-center md:order-2 md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.10] px-3 py-1.5 shadow-[0_0_25px_rgba(37,99,235,0.08)]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                About HouseHub
              </span>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-3xl lg:text-[2.6rem]">
              School life,
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
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
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3 transition-colors hover:border-blue-400/20 hover:bg-blue-500/[0.06]"
                  >
                    <Icon size={15} className="shrink-0 text-blue-400" />

                    <span className="text-[11px] font-medium text-slate-300 sm:text-xs">
                      {area.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500 md:justify-start">
              <Check size={14} className="text-blue-400" />
              Designed to make school management simpler
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
