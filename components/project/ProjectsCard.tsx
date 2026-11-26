import Link from "next/link";
import { Plus } from "lucide-react";

export default function ProjectsCard() {
  return (
    <section className="w-full">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-slate-400">
          Your projects are ready to explore.
        </p>
        <Link
          href="/home/create"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={15} />
          Add Project
        </Link>
      </div>

      <div className="flex min-h-[280px] w-full items-center justify-center rounded-3xl border border-white/[0.06] bg-[#0B1220]/70 px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-400">
          This is the projects card page. We&apos;ll build it next.
        </p>
      </div>
    </section>
  );
}
