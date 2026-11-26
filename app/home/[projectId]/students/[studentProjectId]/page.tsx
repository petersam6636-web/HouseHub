import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";

type StudentRegistrationPageProps = {
  params: Promise<{
    projectId: string;
    studentProjectId: string;
  }>;
};

export default function StudentRegistrationPage({
  params,
}: StudentRegistrationPageProps) {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex min-h-[calc(100vh-72px)] w-full">
            <Loading />
          </main>
        </>
      }
    >
      <StudentRegistrationContent params={params} />
    </Suspense>
  );
}

async function StudentRegistrationContent({
  params,
}: StudentRegistrationPageProps) {
  const { projectId, studentProjectId } = await params;

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href={`/home/${projectId}/students?id=${projectId}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to students
          </Link>

          <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#101B2D] to-[#0B1220] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08]">
              <UserPlus size={20} className="text-blue-300" />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Student directory
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Register student
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              This project-specific registration page is ready for its form
              functionality to be added.
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                Project foreign key
              </p>
              <p className="mt-1 break-all text-xs text-slate-300">
                {studentProjectId}
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
