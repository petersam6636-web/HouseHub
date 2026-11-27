
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Mail,
  MapPin,
  Users,
  UserPlus,
  UserRound,
  Phone,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  ProjectWithRelations,
  StudentDetailsWithRelations,
} from "@/types";
import useApp from "@/lib/useApp";
import {
  fetchProjectForUser,
  getErrorMessage,
} from "@/lib/projectService";

const EMPTY_STUDENTS: StudentDetailsWithRelations[] = [];

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { projects, setProjects, authenticatedId } = useApp();

  const [search, setSearch] = useState("");
  const [loadedProject, setLoadedProject] =
    useState<ProjectWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const cachedProject = projects.find(
    (item: ProjectWithRelations) => item.id === projectId
  );

  const project =
    cachedProject?.id === projectId
      ? cachedProject
      : loadedProject?.id === projectId
        ? loadedProject
        : null;

  const students = project?.students ?? EMPTY_STUDENTS;

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      if (!projectId) {
        setLoadError("This project link is missing a project ID.");
        setIsLoading(false);
        return;
      }

      if (!authenticatedId) {
        setLoadError("Sign in to view this project.");
        setIsLoading(false);
        return;
      }

      if (cachedProject) {
        setLoadedProject(cachedProject);
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await fetchProjectForUser(
          authenticatedId,
          projectId
        );

        if (!result) {
          throw new Error("This project could not be found.");
        }

        if (cancelled) return;

        setLoadedProject(result);

        setProjects((currentProjects) => [
          ...currentProjects.filter((item) => item.id !== result.id),
          result,
        ]);
      } catch (error) {
        console.error("Unable to load project students.", error);

        if (!cancelled) {
          setLoadError(
            getErrorMessage(error, "Unable to load project students.")
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [
    authenticatedId,
    cachedProject,
    projectId,
    reloadKey,
    setProjects,
  ]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter(
      (student: StudentDetailsWithRelations) => {
        const name = student.full_name?.toLowerCase() ?? "";
        const index = student.index_number?.toLowerCase() ?? "";
        const email = student.email_address?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          index.includes(query) ||
          email.includes(query)
        );
      }
    );
  }, [students, search]);

  const registerHref = project
    ? `/home/${project.id}/students/${project.id}`
    : "/home/project";

  /* Loading state */
  if (isLoading && !project) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center px-3 py-4 text-white">
        <section className="w-full max-w-sm rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#172943] via-[#101e32] to-[#0b1422] p-7 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <GraduationCap size={22} className="text-blue-300" />
          </div>

          <h1 className="mt-4 text-base font-semibold">
            Loading students
          </h1>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Please wait while we load your project.
          </p>
        </section>
      </main>
    );
  }

  /* Error state */
  if (loadError || !project) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center px-3 py-4 text-white">
        <section className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#172943] via-[#101e32] to-[#0b1422] p-6 text-center sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/15 blur-[70px]" />

          <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <GraduationCap size={22} className="text-blue-300" />
          </div>

          <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
            Project unavailable
          </p>

          <h1 className="relative mt-2 text-lg font-semibold">
            {loadError ? "Unable to open project" : "Project not found"}
          </h1>

          <p className="relative mt-2 text-sm leading-6 text-slate-400">
            {loadError ??
              "We couldn't find this project in your dashboard."}
          </p>

          {loadError && (
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="relative mt-5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Try again
            </button>
          )}

          <Link
            href="/home/project"
            className="relative mt-5 inline-flex items-center gap-2 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            Back to projects
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>
    );
  }

  /* Empty directory: centered without unnecessary page content */
  if (students.length === 0) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] w-full items-center justify-center overflow-hidden px-3 py-4 text-white sm:px-5">
        <section className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-blue-400/[0.11] bg-gradient-to-br from-[#111e30] via-[#0d1726] to-[#090f19] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:rounded-[32px] sm:p-8">
          {/* Blue glow */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/[0.18] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-sky-500/[0.10] blur-[80px]" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-blue-300/20 bg-blue-400/[0.10] text-blue-200 shadow-[0_10px_30px_rgba(37,99,235,0.12)] sm:h-16 sm:w-16">
              <GraduationCap size={27} />
            </div>

            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300 sm:text-[10px]">
              Student directory
            </p>

            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Your student space is ready
            </h1>

            <p className="mt-3 max-w-sm text-xs leading-6 text-slate-300/75 sm:text-sm">
              Start building your class directory by adding your first
              student. Their profile and essential information will appear
              here.
            </p>

            <Link
              href={registerHref}
              className="group mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition hover:bg-blue-500 sm:w-auto sm:min-w-[210px]"
            >
              <UserPlus size={16} />
              Add your first student
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-400">
              <Users size={13} className="text-blue-300" />
              No student profiles added yet
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full px-1.5 py-3 text-white sm:px-3 sm:py-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        {/* Compact project heading */}
        <section className="flex items-center justify-between gap-3 rounded-[22px] border border-white/[0.07] bg-gradient-to-r from-[#172943] via-[#101e32] to-[#0b1422] p-3.5 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Users size={18} className="text-blue-300" />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                Student directory
              </p>

              <h1 className="mt-1 truncate text-base font-bold tracking-tight sm:text-lg">
                {project.title}
              </h1>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {students.length}{" "}
                {students.length === 1 ? "student" : "students"}
              </p>
            </div>
          </div>

          <Link
            href={registerHref}
            aria-label="Add student"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3.5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(37,99,235,0.2)] transition hover:brightness-110 sm:px-4"
          >
            <UserPlus size={15} />
            <span className="hidden sm:inline">Add student</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </section>

        {/* Search and count */}
        <section className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[11px] text-slate-400">
            <Users size={14} className="text-blue-400" />
            Showing {filteredStudents.length} of {students.length}
          </p>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#0b1422] pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </section>

        {/* No search results */}
        {filteredStudents.length === 0 ? (
          <section className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-white/[0.06] bg-gradient-to-br from-[#14243a] to-[#0b1422] px-5 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
              <Search size={19} />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              No students found
            </h2>

            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
              Try searching with another name, index number, or email.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-3.5">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

/* Student profile card */
function StudentCard({
  student,
}: {
  student: StudentDetailsWithRelations;
}) {
  const image = student.profile_image;

  const initials = (student.full_name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="relative grid min-h-[200px] min-w-0 grid-cols-[minmax(0,1fr)_88px] overflow-hidden rounded-[22px] border border-blue-400/[0.12] bg-gradient-to-r from-[#101e30]/95 via-[#0d1828]/90 to-[#0b1422]/85 shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:grid-cols-[minmax(0,1fr)_150px] sm:rounded-[26px] lg:grid-cols-[minmax(0,1fr)_185px]">
      {/* Profile image */}
      <div className="relative order-2 h-full min-h-[200px] overflow-hidden bg-[#172943] sm:min-h-[230px]">
        {image ? (
          <img
            src={image}
            alt={`${student.full_name ?? "Student"} profile`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3976b8] via-[#204875] to-[#112239]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100/20 bg-blue-200/10 text-lg font-bold text-blue-100 sm:h-16 sm:w-16 sm:text-2xl">
              {initials || <UserRound size={25} />}
            </div>
          </div>
        )}

        {/* Gradient that blends photo into the card */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0b1422]/80 via-[#0b1422]/15 to-transparent" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b1422]/70 to-transparent" />

        <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-[#10213a]/75 px-2 py-1 text-[8px] font-semibold text-blue-100 backdrop-blur-md sm:right-3 sm:top-3 sm:text-[9px]">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          Student
        </div>
      </div>

      {/* Student information */}
      <div className="relative order-1 flex min-w-0 flex-col justify-center p-3 sm:p-4 lg:p-5">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-blue-400/[0.10] blur-[60px]" />

        <div className="relative min-w-0">
          <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-300 sm:text-[9px]">
            Student profile
          </p>

          <h2 className="mt-1 break-words text-base font-extrabold leading-tight tracking-tight text-white sm:text-xl">
            {student.full_name || "Unnamed student"}
          </h2>

          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-blue-300/15 bg-blue-400/[0.08] px-2 py-1">
            <GraduationCap size={11} className="shrink-0 text-blue-300" />
            <span className="truncate text-[9px] font-semibold text-blue-100 sm:text-[10px]">
              {student.index_number || "Index number not added"}
            </span>
          </div>
        </div>

        {/* Essential information */}
        <div className="relative mt-3 grid min-w-0 grid-cols-1 gap-x-4 gap-y-2.5 sm:mt-4 sm:grid-cols-2 sm:gap-y-3">
          {student.email_address && (
            <StudentInfo
              icon={<Mail size={13} />}
              label="Email"
              value={student.email_address}
            />
          )}

          {student.location && (
            <StudentInfo
              icon={<MapPin size={13} />}
              label="Location"
              value={student.location}
            />
          )}

          {student.gender && (
            <StudentInfo
              icon={<UserRound size={13} />}
              label="Gender"
              value={student.gender}
            />
          )}

          {student.mother_contact && (
            <StudentInfo
              icon={<Phone size={13} />}
              label="Parent / emergency contact"
              value={student.mother_contact}
              important
            />
          )}
        </div>
      </div>
    </article>
  );
}

function StudentInfo({
  icon,
  label,
  value,
  important = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <div
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
          important
            ? "border-blue-300/20 bg-blue-400/[0.10] text-blue-200"
            : "border-white/[0.06] bg-white/[0.035] text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[8px] font-medium sm:text-[9px] ${
            important ? "text-blue-200/80" : "text-slate-500"
          }`}
        >
          {label}
        </p>

        <p
          className={`mt-0.5 break-words text-[9px] leading-4 sm:text-[11px] sm:leading-[18px] ${
            important
              ? "font-semibold text-blue-100"
              : "text-slate-300"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
