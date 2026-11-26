
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#0B1220] px-4 text-white"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-[15%] h-96 w-96 animate-[loading-float_8s_ease-in-out_infinite] rounded-full bg-emerald-500/[0.09] blur-[120px]" />
        <div className="absolute -right-36 bottom-[8%] h-[28rem] w-[28rem] animate-[loading-float_10s_ease-in-out_infinite_reverse] rounded-full bg-blue-500/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.07),transparent_52%)]" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-emerald-400/15" />
          <span
            className="absolute inset-1 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400/40 animate-spin"
            aria-hidden="true"
          />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.8)]" />
        </div>

        <p className="mt-7 animate-[loading-text_1.8s_ease-in-out_infinite] text-sm font-semibold tracking-[0.12em] text-slate-100">
          Loading your workspace
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Getting everything ready for you
        </p>
        <span className="mt-5 flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_infinite] rounded-full bg-emerald-400" />
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_0.15s_infinite] rounded-full bg-emerald-400" />
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_0.3s_infinite] rounded-full bg-emerald-400" />
        </span>
      </div>
    </div>
  );
}
