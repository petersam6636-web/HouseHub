
"use client";

import {
  ArrowUpRight,
  Quote,
  Star,
  Sparkles,
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner",
    initials: "SM",
    quote:
      "HouseHub has made managing our home feel so much easier. Everything is finally organized in one place, and the whole family knows what needs to be done.",
    highlight: "A more organized home",
  },
  {
    name: "Daniel Brooks",
    role: "Household Manager",
    initials: "DB",
    quote:
      "I used to spend so much time keeping track of household responsibilities. HouseHub brings everything together in a way that feels simple, clear, and effortless.",
    highlight: "Everything in one place",
  },
  {
    name: "Olivia Carter",
    role: "Family Organizer",
    initials: "OC",
    quote:
      "What I love most is how easy it is to stay on top of everyday things. It gives our household a better sense of structure without making things complicated.",
    highlight: "Made for everyday life",
  },
];

export default function TestimonialSection() {
  return (
    <section
      id="testimonials"
      className="relative isolate w-full overflow-hidden bg-[#05070D] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Main blue gradient behind the heading */}
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/[0.18] blur-[110px] sm:h-[720px] sm:w-[720px] sm:bg-blue-600/[0.20] sm:blur-[150px]" />

        {/* Stronger blue illustration glow */}
        <div className="absolute -left-40 top-[15%] h-[420px] w-[420px] rounded-full bg-blue-500/[0.12] blur-[120px] sm:h-[560px] sm:w-[560px] sm:bg-blue-500/[0.14]" />

        {/* Right-side blue atmosphere */}
        <div className="absolute -right-40 top-[35%] h-[380px] w-[380px] rounded-full bg-blue-700/[0.12] blur-[110px] sm:h-[520px] sm:w-[520px] sm:bg-blue-700/[0.14]" />

        {/* Subtle center highlight */}
        <div className="absolute left-1/2 top-[30%] h-[300px] w-[85%] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[100px] sm:bg-blue-500/[0.09]" />

        {/* Fine dotted texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto w-full max-w-[1440px]">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/[0.10] px-3.5 py-2 shadow-[0_0_35px_rgba(37,99,235,0.10)]">
            <Sparkles
              size={14}
              className="text-blue-400"
            />

            <span className="text-[11px] font-semibold tracking-wide text-blue-200 sm:text-xs">
              The HouseHub experience
            </span>
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-[-0.045em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            A better home starts
            <br className="hidden sm:block" />

            <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              with better organization.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Discover how a simpler way to manage everyday responsibilities
            can bring more clarity, balance, and peace of mind to your home.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {testimonials.map((testimonial, index) => {
            const isFeatured = index === 1;

            return (
              <article
                key={testimonial.name}
                className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-500 sm:p-8 ${
                  isFeatured
                    ? "border-blue-400/25 bg-gradient-to-b from-[#101D32] via-[#0B1424] to-[#080D17] shadow-[0_25px_80px_rgba(37,99,235,0.13)] lg:-translate-y-7 lg:scale-[1.025]"
                    : "border-white/[0.07] bg-[#0A0F19]/80 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:translate-y-7"
                } hover:border-blue-400/25 hover:shadow-[0_25px_70px_rgba(37,99,235,0.10)]`}
              >
                {/* Card glow */}
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-[80px] transition-opacity duration-500 ${
                    isFeatured
                      ? "bg-blue-500/[0.20]"
                      : "bg-blue-500/[0.10] opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Top row */}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        className="fill-blue-400 text-blue-400"
                      />
                    ))}
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      isFeatured
                        ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
                        : "border-white/[0.06] bg-white/[0.03] text-slate-500"
                    }`}
                  >
                    <Quote size={18} />
                  </div>
                </div>

                {/* Highlight */}
                <div className="relative mt-7">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide ${
                      isFeatured
                        ? "border border-blue-400/15 bg-blue-500/[0.08] text-blue-200"
                        : "border border-white/[0.06] bg-white/[0.025] text-slate-400"
                    }`}
                  >
                    {testimonial.highlight}
                  </span>
                </div>

                {/* Testimonial */}
                <blockquote className="relative mt-5 flex-1">
                  <p
                    className={`text-sm leading-7 sm:text-[15px] sm:leading-8 ${
                      isFeatured
                        ? "text-slate-200"
                        : "text-slate-400"
                    }`}
                  >
                    “{testimonial.quote}”
                  </p>
                </blockquote>

                {/* Divider */}
                <div className="relative my-7 h-px w-full bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent" />

                {/* Author */}
                <div className="relative flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-bold ${
                        isFeatured
                          ? "border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-blue-700/10 text-blue-200"
                          : "border border-white/[0.07] bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      {testimonial.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {testimonial.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      isFeatured
                        ? "bg-blue-500/10 text-blue-300"
                        : "bg-white/[0.03] text-slate-500 group-hover:text-blue-400"
                    }`}
                  >
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom trust message */}
        <div className="mt-16 flex flex-col items-center justify-center gap-3 text-center sm:mt-24 lg:mt-28">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.6)]" />

            A simpler way to care for your home
          </div>

          <p className="max-w-md text-xs leading-6 text-slate-600">
            Less stress. Better coordination. More time for what matters.
          </p>
        </div>
      </div>
    </section>
  );
}
