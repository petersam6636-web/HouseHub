
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
import { useApp } from "@/lib/useApp";
import type { StudentDetailsWithRelations } from "@/types";

import StudentDashboardOverview from "./StudentDashboardOverview";
import StudentCharts from "./StudentCharts";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function dateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

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

  const student: StudentDetailsWithRelations | undefined =
    project?.students?.find(
      (item) => item.id === studentId,
    );

  if (!studentId || !projectId) {
    return (
      <div className="min-h-dvh bg-[#060d18] px-4 py-10 text-white">
        <Header />

        <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-white/[0.07] bg-[#0b1424] p-6 text-center">
          <UserRound className="mx-auto mb-3 text-slate-500" size={28} />
          <h1 className="text-lg font-semibold">Student not selected</h1>
          <p className="mt-2 text-sm text-slate-500">
            Please return to the students list and select a student.
          </p>

          <Link
            href="/home/students"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Back to students
          </Link>
        </div>
      </div>
    );
  }

  if (!project || !student) {
    return (
      <div className="min-h-dvh bg-[#060d18] px-4 py-10 text-white">
        <Header />

        <div className="mx-auto mt-12 max-w-lg rounded-3xl border border-white/[0.07] bg-[#0b1424] p-6 text-center">
          <UserRound className="mx-auto mb-3 text-slate-500" size={28} />
          <h1 className="text-lg font-semibold">Student not found</h1>
          <p className="mt-2 text-sm text-slate-500">
            We could not find this student in the selected project.
          </p>

          <Link
            href="/home/students"
            className="mt-5 inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Back to students
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#060d18] text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1500px] space-y-5 px-3 py-5 sm:px-5 sm:py-7 lg:px-8">
        {/* Top navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/home/students"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0b1424] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-blue-400/30 hover:text-white"
          >
            <ArrowLeft size={15} />
            Students
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <GraduationCap size={15} />
            <span className="max-w-[180px] truncate sm:max-w-none">
              {project.school_name}
            </span>
          </div>
        </div>

        {/* Student profile hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b1424]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.18),transparent_50%)]" />
          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/[0.07] blur-3xl" />

          <div className="relative flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-6 lg:p-8">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-3xl border border-blue-400/20 bg-blue-500/10 sm:size-28">
              {student.profile_image ? (
                <img
                  src={student.profile_image}
                  alt={student.full_name}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-3xl font-bold text-blue-300">
                  {initials(student.full_name)}
                </div>
              )}
            </div>

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
                  <MapPin size={13} className="text-blue-400" />
                  {student.location || "Location not provided"}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-blue-400" />
                  Joined {dateLabel(student.created_at)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/[0.07] bg-black/20 px-4 py-3">
              <Activity size={17} className="text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-500">
                  Student records
                </p>
                <p className="text-sm font-bold text-white">
                  {student.transactions.length +
                    student.messages.length +
                    student.fees.length +
                    student.products.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Student overview */}
        <StudentDashboardOverview student={student} />

        {/* Charts */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-blue-400">
              <Activity size={18} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Student analytics
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                A visual summary of the student's recorded activity
              </p>
            </div>
          </div>

          <StudentCharts transactions={student.transactions} />
        </section>

        <footer className="pb-4 pt-2 text-center text-[10px] text-slate-600">
          HouseHub · Student overview
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