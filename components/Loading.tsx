
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full min-h-[280px] w-full flex-1 items-center justify-center"
    >
      <div className="flex flex-col items-center gap-5 rounded-3xl border border-blue-400/10 bg-gradient-to-br from-[#101B2D]/90 to-[#07101D]/90 px-10 py-8 shadow-[0_16px_50px_rgba(0,0,0,0.25)]">
        <span className="flex items-center gap-3" aria-hidden="true">
          <span className="h-3 w-3 animate-[dot-bounce_0.9s_ease-in-out_infinite] rounded-full bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.55)]" />
          <span className="h-3 w-3 animate-[dot-bounce_0.9s_ease-in-out_0.15s_infinite] rounded-full bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.55)]" />
          <span className="h-3 w-3 animate-[dot-bounce_0.9s_ease-in-out_0.3s_infinite] rounded-full bg-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.55)]" />
        </span>

        <span className="text-base font-semibold tracking-wide text-slate-200">
          Loading
        </span>
      </div>

      <style jsx>{`
        @keyframes dot-bounce {
          0%,
          60%,
          100% {
            transform: translateY(3px);
            opacity: 0.55;
          }

          30% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
