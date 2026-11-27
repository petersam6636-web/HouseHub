
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  GraduationCap,
  MapPin,
  UserRound,
  Activity,
  CalendarDays,
} from "lucide-react";

import Header from "@/components/Header";
import useApp  from "@/lib/useApp";

import StudentNavigation from "./StudentNavigation";
import StudentDashboardOverview from "./StudentDashboardOverview";
import StudentCharts from "./StudentCharts";

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();

  const studentId = searchParams.get("id");
  const projectId = searchParams.get("projectId");

  const { projects } = useApp();

  const project = projects.find(
    (item) => item.id === projectId,
  );

  const student = project?.students?.find(
    (item) => item.id === studentId,
  );

  // Missing URL parameters
  if (!studentId || !projectId) {
    return (
      <div className="min-h-dvh bg-[#060d18] text-white">
        <Header />

        <main className="mx-auto max-w-lg px-4 py-12">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1424] p-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <UserRound size={22} />
            </div>

            <h1 className="text-lg font-semibold">
              Student not selected
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Please return to the students list and select a student
              to view their dashboard.
            </p>

            <Link
              href="/home/students"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <ArrowLeft size={15} />
              Back to students
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Student or project not found
  if (!project || !student) {
    return (
      <div className="min-h-dvh bg-[#060d18] text-white">
        <Header />

        <main className="mx-auto max-w-lg px-4 py-12">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0b1424] p-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <GraduationCap size={22} />
            </div>

            <h1 className="text-lg font-semibold">
              Student not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We could not find this student in the selected project.
              Please check the student and project information.
            </p>

            <Link
              href="/home/students"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <ArrowLeft size={15} />
              Back to students
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalRecords =
    student.transactions.length +
    student.messages.length +
    student.fees.length +
    student.products.length +
    student.feedback.length;

  return (
    <div className="min-h-dvh bg-[#060d18] text-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl space-y-5 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">

        {/* Back button and school name */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/home/students"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0b1424] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-blue-400/30 hover:text-white"
          >
            <ArrowLeft size={15} />
            Students
          </Link>

          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
            <GraduationCap
              size={15}
              className="shrink-0 text-blue-400"
            />

            <span className="max-w-[200px] truncate sm:max-w-none">
              {project.school_name}
            </span>
          </div>
        </div>

        {/* Student profile hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b1424]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.18),transparent_55%)]" />

          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/[0.07] blur-3xl" />

          <div className="relative flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-6 lg:p-8">

            {/* Profile image */}
            <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-blue-400/20 bg-blue-500/10 sm:size-28">
              {student.profile_image ? (
                <img
                  src={student.profile_image}
                  alt={student.full_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-3xl font-bold text-blue-300">
                  {getInitials(student.full_name)}
                </div>
              )}
            </div>

            {/* Student identity */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                  Student profile
                </span>

                {student.index_number && (
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
                    {student.index_number}
                  </span>
                )}
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {student.full_name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin
                    size={13}
                    className="shrink-0 text-blue-400"
                  />
                  {student.location || "Location not provided"}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays
                    size={13}
                    className="shrink-0 text-blue-400"
                  />
                  Joined {formatDate(student.created_at)}
                </span>
              </div>
            </div>

            {/* Total student records */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Activity size={17} />
              </div>

              <div>
                <p className="text-[10px] text-slate-500">
                  Student records
                </p>

                <p className="text-sm font-bold text-white">
                  {totalRecords}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Student navigation - directly under profile hero */}
        <StudentNavigation
          studentId={student.id}
          projectId={project.id}
        />

        {/* Metric cards, alerts, information and recent activity */}
        <StudentDashboardOverview student={student} />

        {/* Student charts */}
        <section className="space-y-4">
          <StudentCharts
            transactions={student.transactions}
          />
        </section>

        {/* Footer */}
        <footer className="pb-4 pt-2 text-center text-[10px] text-slate-600">
          HouseHub · Student dashboard
        </footer>
      </main>
    </div>
  );
}

function StudentDashboardFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#060d18] text-sm text-slate-400">
      Loading student dashboard...
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<StudentDashboardFallback />}>
      <StudentDashboardContent />
    </Suspense>
  );
}
