
"use client";

import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  MapPin,
  Users,
  UserPlus,
  UserRound,
  Phone,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ProjectWithRelations, StudentDetailsWithRelations } from "@/types";
import useApp  from "@/lib/useApp";

export default function StudentsPage({
  projectId,
}: {
  projectId: string;
}) {
  const { projects } = useApp();

  const project = projects.find(
    (item: ProjectWithRelations) => item.id === projectId
  );

  const [search, setSearch] = useState("");

  const students = project?.students ?? [];

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student: StudentDetailsWithRelations) => {
      return (
        student.full_name.toLowerCase().includes(query) ||
        student.index_number?.toLowerCase().includes(query) ||
        student.email_address?.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  if (!project) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <GraduationCap className="h-6 w-6 text-blue-400" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">
            Project not found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            We couldn’t find this project in your dashboard.
          </p>
        </div>
      </div>
    );
  }

  const registerHref = `/home/${project.id}/students/register`;

  return (
    <main className="space-y-7 pb-10">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-blue-400">
            <Users size={14} />
            <span>Student directory</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Students
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Manage your students, view their information, and keep your school
            community organized.
          </p>
        </div>

        <Link
          href={registerHref}
          className="
            group inline-flex min-h-11 items-center justify-center gap-2
            rounded-xl bg-blue-600 px-5
            text-sm font-semibold text-white
            shadow-lg shadow-blue-600/20
            transition-[transform,background-color,box-shadow]
            duration-300 ease-out
            hover:-translate-y-0.5
            hover:bg-blue-500
            hover:shadow-xl hover:shadow-blue-500/25
            active:translate-y-0 active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-blue-400
            focus-visible:ring-offset-2 focus-visible:ring-offset-[#050b14]
          "
        >
          <UserPlus size={17} />
          Register Student
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </section>

      {/* Directory summary and search */}
      <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-[#080f1b]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08]">
            <Users size={19} className="text-blue-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {students.length} {students.length === 1 ? "Student" : "Students"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Registered in {project.title}
            </p>
          </div>
        </div>

        {students.length > 0 && (
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              className="
                h-11 w-full rounded-xl
                border border-white/[0.07]
                bg-[#050b14] pl-9 pr-4
                text-sm text-white placeholder:text-slate-600
                outline-none
                transition-colors duration-300
                focus:border-blue-500/40
                focus:ring-2 focus:ring-blue-500/10
              "
            />
          </div>
        )}
      </section>

      {/* Student cards */}
      {students.length === 0 ? (
        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#080f1b] px-6 py-14 text-center sm:px-10">
          {/* Background decoration */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/[0.10] blur-[90px]" />

          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/[0.08]">
            <GraduationCap size={29} className="text-blue-400" />
          </div>

          <h2 className="relative mt-6 text-xl font-semibold text-white sm:text-2xl">
            Your student community starts here
          </h2>

          <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
            Every great school begins with its students. Register your first
            student to start building your directory and keeping their
            information organized in one place.
          </p>

          <Link
            href={registerHref}
            className="
              group relative mt-7 inline-flex min-h-11 items-center
              justify-center gap-2 rounded-xl bg-blue-600 px-5
              text-sm font-semibold text-white
              shadow-lg shadow-blue-600/20
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-blue-500
              hover:shadow-xl hover:shadow-blue-500/25
              active:translate-y-0
            "
          >
            <UserPlus size={17} />
            Register your first student
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </section>
      ) : filteredStudents.length === 0 ? (
        <section className="rounded-2xl border border-white/[0.06] bg-[#080f1b] px-6 py-12 text-center">
          <Search size={25} className="mx-auto text-slate-500" />

          <h2 className="mt-4 text-base font-semibold text-white">
            No students found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Try searching with another name, index number, or email.
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student: StudentDetailsWithRelations) => (
            <StudentCard
              key={student.id}
              student={student}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function StudentCard({
  student,
}: {
  student: StudentDetailsWithRelations;
}) {
  const image = student.profile_image;

  const initials = student.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article
      className="
        group relative isolate min-w-0 overflow-hidden
        rounded-[24px] border border-white/[0.07]
        bg-[#080f1b]
        transition-[transform,border-color,box-shadow]
        duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-1.5
        hover:border-blue-400/25
        hover:shadow-[0_20px_55px_rgba(37,99,235,0.12)]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      {/* Student photo */}
      <div className="relative h-[280px] overflow-hidden bg-[#0b1625]">
        {image ? (
          <img
            src={image}
            alt={`${student.full_name} profile`}
            className="
              h-full w-full object-cover object-center
              transition-transform duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:scale-[1.06]
              motion-reduce:transform-none
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-950/70 via-[#101d30] to-[#050b14]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/[0.08] text-3xl font-bold tracking-wider text-blue-300">
              {initials || <UserRound size={35} />}
            </div>
          </div>
        )}

        {/* Dark gradient from bottom upward */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-gradient-to-t
            from-[#050b14] from-[5%]
            via-[#050b14]/75 via-[38%]
            to-[#050b14]/0 to-[100%]
          "
        />

        {/* Top image shading */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050b14]/50 to-transparent" />

        {/* Student status label */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050b14]/60 px-3 py-1.5 text-[10px] font-medium text-slate-200 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Student
        </div>

        {/* Name and index over gradient */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-white">
            {student.full_name}
          </h3>

          <p className="mt-2 text-xs font-medium tracking-wide text-blue-200/90">
            {student.index_number || "Index number not added"}
          </p>
        </div>
      </div>

      {/* Student information */}
      <div className="space-y-3.5 p-5">
        {student.email_address && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400 transition-colors duration-300 group-hover:bg-blue-500/[0.08] group-hover:text-blue-300">
              <Mail size={15} />
            </div>

            <p className="min-w-0 truncate text-xs text-slate-400">
              {student.email_address}
            </p>
          </div>
        )}

        {student.location && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400 transition-colors duration-300 group-hover:bg-blue-500/[0.08] group-hover:text-blue-300">
              <MapPin size={15} />
            </div>

            <p className="min-w-0 truncate text-xs text-slate-400">
              {student.location}
            </p>
          </div>
        )}

        {student.gender && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400 transition-colors duration-300 group-hover:bg-blue-500/[0.08] group-hover:text-blue-300">
              <UserRound size={15} />
            </div>

            <p className="text-xs text-slate-400">
              {student.gender}
            </p>
          </div>
        )}

        {student.mother_contact && (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400 transition-colors duration-300 group-hover:bg-blue-500/[0.08] group-hover:text-blue-300">
              <Phone size={15} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">Parent contact</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {student.mother_contact}
              </p>
            </div>
          </div>
        )}

        {/* Bottom accent */}
        <div className="pt-1">
          <div className="h-px w-full bg-gradient-to-r from-blue-500/25 via-white/[0.05] to-transparent" />
        </div>
      </div>
    </article>
  );
}
