
import {
  ArrowUpRight,
  CalendarCheck,
  Check,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  House,
  Wallet,
  Users,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Users,
    title: "Student management",
    description:
      "Keep student information organized and accessible in one place.",
    visual: "students",
  },
  {
    number: "02",
    icon: Wallet,
    title: "Student finances",
    description:
      "Track student payments, balances, and financial records with clarity.",
    visual: "finance",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Duties & tasks",
    description:
      "Assign responsibilities, organize tasks, and make daily duties easier to manage.",
    visual: "tasks",
  },
  {
    number: "04",
    icon: CalendarCheck,
    title: "Attendance",
    description:
      "Record attendance and keep track of student presence.",
    visual: "attendance",
  },
  {
    number: "05",
    icon: House,
    title: "Dormitory management",
    description:
      "Organize dormitory information and keep house life structured.",
    visual: "dormitory",
  },
  {
    number: "06",
    icon: HeartHandshake,
    title: "Student welfare",
    description:
      "Keep student welfare information organized to support better care.",
    visual: "welfare",
  },
];

function FeatureVisual({ type }: { type: string }) {
  if (type === "students") {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

        <div className="relative w-full max-w-[230px] rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
            <Users size={14} className="text-blue-400/70" />
          </div>

          <div className="space-y-2">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.04] bg-white/[0.025] p-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                  <GraduationCap size={13} className="text-blue-300" />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-slate-300/40 ${
                      item === 1 ? "w-16" : "w-20"
                    }`}
                  />
                  <div className="h-1 w-12 rounded-full bg-slate-500/30" />
                </div>

                <div className="h-2 w-2 rounded-full bg-blue-400/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "finance") {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

        <div className="relative w-full max-w-[230px] rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
            <Wallet size={14} className="text-blue-400/70" />
          </div>

          <div className="h-6 w-24 rounded-md bg-blue-400/[0.13]" />
          <div className="mt-2 h-1.5 w-16 rounded-full bg-slate-500/30" />

          <div className="mt-4 flex h-12 items-end gap-1.5">
            {[30, 48, 38, 65, 52, 85, 68, 95].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700/60 to-blue-400/90"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.05]">
            <div className="h-full w-[68%] rounded-full bg-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "tasks") {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

        <div className="relative w-full max-w-[230px] rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
            <ClipboardCheck size={14} className="text-blue-400/70" />
          </div>

          <div className="space-y-2.5">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.04] bg-white/[0.025] px-2.5 py-2"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-md ${
                    item < 2 ? "bg-blue-500/20" : "border border-slate-500/30"
                  }`}
                >
                  {item < 2 && (
                    <Check size={10} className="text-blue-300" />
                  )}
                </div>

                <div
                  className={`h-1.5 rounded-full ${
                    item === 1 ? "w-16" : "w-20"
                  } bg-slate-400/25`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "attendance") {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

        <div className="relative flex w-full max-w-[230px] items-center gap-4 rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#3B82F6_0deg,#60A5FA_250deg,rgba(30,41,59,0.7)_250deg)]">
            <div className="absolute inset-[7px] rounded-full bg-[#0B1424]" />
            <Check size={23} className="relative text-blue-300" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
            <div className="h-1.5 w-12 rounded-full bg-blue-400/50" />
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.05]">
              <div className="h-full w-[82%] rounded-full bg-blue-500" />
            </div>
            <div className="h-1 w-10 rounded-full bg-slate-500/30" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "dormitory") {
    return (
      <div className="relative flex h-full items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

        <div className="relative w-full max-w-[230px] rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
            <House size={14} className="text-blue-400/70" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className={`flex aspect-square items-center justify-center rounded-lg border ${
                  index === 4
                    ? "border-blue-400/25 bg-blue-500/15"
                    : "border-white/[0.05] bg-white/[0.025]"
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-md ${
                    index === 4 ? "bg-blue-400/70" : "bg-slate-500/25"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute h-32 w-32 rounded-full bg-blue-500/[0.12] blur-3xl" />

      <div className="relative w-full max-w-[230px] rounded-2xl border border-blue-400/[0.12] bg-[#080F1B]/90 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.25)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-1.5 w-16 rounded-full bg-slate-300/40" />
          <HeartHandshake size={14} className="text-blue-400/70" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10">
            <HeartHandshake size={21} className="text-blue-300" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="h-1.5 w-20 rounded-full bg-slate-300/40" />
            <div className="h-1.5 w-14 rounded-full bg-slate-500/30" />
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/[0.05] bg-white/[0.025] p-3">
          <div className="h-1.5 w-16 rounded-full bg-slate-300/30" />
          <div className="mt-2 h-1.5 w-24 rounded-full bg-slate-500/25" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturesHouseHub() {
  return (
    <section
      id="features"
      className="relative isolate w-full overflow-hidden bg-[#05070D] text-white"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 right-[-10rem] h-80 w-80 rounded-full bg-blue-500/[0.06] blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-7xl">
          {/* Section heading */}
          <div className="mb-9 flex flex-col items-center w-full gap-3 text-center sm:mb-12  ">
            <div className="inline-flex text-center w-fit items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                HouseHub features
              </span>
            </div>

            <h2 className="max-w-3xl text-[2.15rem] font-bold leading-tight tracking-[-0.04em] text-white sm:text-4xl md:text-[2.65rem] lg:text-5xl">
              Everything your school needs,
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
                working together.
              </span>
            </h2>

            <p className="max-w-xl text-[13px] leading-6 text-slate-400 sm:text-sm sm:leading-7">
              One connected platform for managing students, school
              activities, and everyday responsibilities.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-gradient-to-br from-[#0D1523] via-[#090F1A] to-[#070B12] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-blue-400/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_35px_rgba(37,99,235,0.07)] sm:p-5"
                >
                  {/* Card glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/[0.06] blur-[60px] transition-opacity duration-500 group-hover:bg-blue-500/[0.12]" />

                  {/* Card header */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/[0.12] bg-blue-500/[0.08] text-blue-300 transition-all duration-300 group-hover:border-blue-400/25 group-hover:bg-blue-500/[0.14]">
                      <Icon size={16} />
                    </div>

                    <span className="text-[10px] font-medium tracking-[0.12em] text-slate-600">
                      {feature.number}
                    </span>
                  </div>

                  {/* Visual area */}
                  <div className="relative my-4 h-[150px] overflow-hidden rounded-2xl border border-white/[0.04] bg-[#060B13]/70">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.07),transparent_70%)]" />

                    <FeatureVisual type={feature.visual} />
                  </div>

                  {/* Text */}
                  <div className="relative mt-auto">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[15px] font-semibold tracking-tight text-slate-100 sm:text-base">
                        {feature.title}
                      </h3>

                      <ArrowUpRight
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-400"
                      />
                    </div>

                    <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500 sm:text-[13px]">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
