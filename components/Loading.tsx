
"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((current) => (current.length >= 3 ? "" : current + "."));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[180px] w-full items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-blue-400/10 bg-[#07101D]/80 px-6 py-4 shadow-[0_0_35px_rgba(59,130,246,0.06)]">
        <span className="text-sm font-medium tracking-wide text-slate-300">
          Loading
        </span>

        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_infinite] rounded-full bg-blue-400" />
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_0.15s_infinite] rounded-full bg-blue-400" />
          <span className="h-1.5 w-1.5 animate-[dot-bounce_0.9s_ease-in-out_0.3s_infinite] rounded-full bg-blue-400" />
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
