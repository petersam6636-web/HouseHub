
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

  if (isLoading && !project) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-3 py-6 text-white">
        <section className="w-full max-w-md rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#172943] to-[#0b1422] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <GraduationCap className="h-6 w-6 text-blue-300" />
          </div>

          <h1 className="mt-4 text-lg font-semibold">
            Loading students
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Please wait while we load your project.
          </p>
        </section>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-3 py-6 text-white">
        <section className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#172943] to-[#0b1422] p-6 text-center sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/15 blur-[70px]" />

          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
            <GraduationCap className="h-6 w-6 text-blue-300" />
          </div>

          <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
            Project unavailable
          </p>

          <h1 className="relative mt-2 text-lg font-semibold">
            {loadError ? "Unable to open project" : "Project not found"}
          </h1>

          <p className="relative mt-2 text-sm leading-6 text-slate-400">
            {loadError ??
              "We couldn’t find this project in your dashboard."}
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
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>
    );
  }

  const registerHref = `/home/${project.id}/students/${project.id}`;

  return (
    <main className="min-h-[calc(100vh-72px)] w-full px-1.5 py-5 text-white sm:px-3 sm:py-7">
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">
        {/* Project heading and add student action */}
        <section className="flex flex-col gap-4 rounded-[24px] border border-white/[0.07] bg-gradient-to-br from-[#172943] via-[#101e32] to-[#0b1422] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <Users size={21} className="text-blue-300" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                Student directory
              </p>

              <h1 className="mt-1 truncate text-lg font-bold tracking-tight sm:text-xl">
                {project.title}
              </h1>

              <p className="mt-1 text-xs text-slate-400">
                {students.length}{" "}
                {students.length === 1 ? "student" : "students"} registered
              </p>
            </div>
          </div>

          {/* Always visible, even when students already exist */}
          <Link
            href={registerHref}
            className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-[#3b82f6] px-5 py-3 text-xs font-bold text-white shadow-[0_8px_24px_rgba(37,99,235,0.24)] transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-400"
          >
            <UserPlus size={16} />
            Add student
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </section>

        {/* Search */}
        {students.length > 0 && (
          <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-slate-400">
              <Users size={15} className="text-blue-400" />
              Showing {filteredStudents.length} of {students.length} students
            </p>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, index or email..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0b1422] pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </section>
        )}

        {/* Empty directory */}
        {students.length === 0 ? (
          <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#172943] via-[#101e32] to-[#0b1422] px-6 py-14 text-center sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/15 blur-[90px]" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10">
              <GraduationCap size={29} className="text-blue-300" />
            </div>

            <h2 className="relative mt-6 text-xl font-semibold sm:text-2xl">
              No students yet
            </h2>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Add your first student to start building your directory.
            </p>

            <Link
              href={registerHref}
              className="group relative mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-xs font-bold text-white shadow-[0_8px_24px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-400"
            >
              <UserPlus size={16} />
              Add your first student
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </section>
        ) : filteredStudents.length === 0 ? (
          <section className="rounded-2xl border border-white/[0.06] bg-[#0b1422] px-6 py-12 text-center">
            <Search size={25} className="mx-auto text-slate-500" />

            <h2 className="mt-4 text-base font-semibold">
              No students found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Try another name, index number, or email.
            </p>
          </section>
        ) : (
          <section className="flex flex-col gap-4">
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
    <article className="group relative isolate grid min-w-0 grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-[24px] border border-white/[0.07] bg-gradient-to-br from-[#172943] via-[#101e32] to-[#0b1422] shadow-[0_12px_35px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:shadow-[0_18px_45px_rgba(37,99,235,0.12)] sm:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-[220px_minmax(0,1fr)]">
      {/* Full-height profile photo */}
      <div className="relative min-h-[250px] overflow-hidden bg-[#172943] sm:min-h-[270px]">
        {image ? (
          <img
            src={image}
            alt={`${student.full_name ?? "Student"} profile`}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#28558a] via-[#183253] to-[#101e32]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200/25 bg-blue-300/10 text-xl font-bold tracking-wider text-blue-100 sm:h-20 sm:w-20 sm:text-2xl">
              {initials || <UserRound size={30} />}
            </div>
          </div>
        )}

        {/* Long blue-black gradient blending into the card */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#101e32]/20 to-[#101e32]/90" />

        {/* Soft lower gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#101e32]/70 to-transparent sm:hidden" />

        <div className="absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#10213a]/75 px-2 py-1 text-[9px] font-semibold text-blue-100 backdrop-blur-md sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
          Student
        </div>
      </div>

      {/* Student information */}
      <div className="relative flex min-w-0 flex-col justify-center p-3 sm:p-5 lg:p-6">
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-blue-500/[0.08] blur-[60px]" />

        <div className="relative min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300 sm:text-[10px]">
            Student profile
          </p>

          <h3 className="mt-1.5 break-words text-base font-extrabold leading-tight tracking-tight text-white sm:mt-2 sm:text-xl lg:text-2xl">
            {student.full_name || "Unnamed student"}
          </h3>

          <div className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-lg border border-blue-400/15 bg-blue-500/[0.08] px-2 py-1 sm:mt-3 sm:px-2.5">
            <GraduationCap size={12} className="shrink-0 text-blue-300" />
            <span className="truncate text-[10px] font-semibold text-blue-100 sm:text-xs">
              {student.index_number || "Index number not added"}
            </span>
          </div>
        </div>

        {/* Essential student details */}
        <div className="relative mt-4 grid min-w-0 grid-cols-1 gap-x-5 gap-y-3 sm:mt-5 sm:grid-cols-2 sm:gap-y-4">
          {student.email_address && (
            <StudentInfo
              icon={<Mail size={14} />}
              label="Email address"
              value={student.email_address}
            />
          )}

          {student.location && (
            <StudentInfo
              icon={<MapPin size={14} />}
              label="Location"
              value={student.location}
            />
          )}

          {student.gender && (
            <StudentInfo
              icon={<UserRound size={14} />}
              label="Gender"
              value={student.gender}
            />
          )}

          {student.mother_contact && (
            <StudentInfo
              icon={<Phone size={14} />}
              label="Parent / emergency contact"
              value={student.mother_contact}
              important
            />
          )}
        </div>

        <div className="relative mt-4 h-px w-full bg-gradient-to-r from-blue-400/35 via-blue-300/10 to-transparent sm:mt-5" />
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
    <div className="flex min-w-0 items-start gap-2.5">
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${
          important
            ? "border-blue-400/20 bg-blue-500/10 text-blue-300"
            : "border-white/[0.06] bg-white/[0.035] text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[9px] font-medium sm:text-[10px] ${
            important ? "text-blue-200/80" : "text-slate-500"
          }`}
        >
          {label}
        </p>

        <p
          className={`mt-1 break-words text-[10px] leading-4 sm:text-xs sm:leading-5 ${
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
