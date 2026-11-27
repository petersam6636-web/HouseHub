"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  MapPin,
  Users,
  UserPlus,
  UserRound,
  ArrowUpRight,
  Phone,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  ProjectWithRelations,
  StudentDetailsWithRelations,
} from "@/types";
import useApp from "@/lib/useApp";
import {
  fetchProjectForUser,
  getErrorMessage,
} from "@/lib/projectService";

// Prevent creating a new empty array on every render.
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

    if (!query) {
      return students;
    }

    return students.filter(
      (student: StudentDetailsWithRelations) => {
        const fullName = student.full_name?.toLowerCase() ?? "";
        const indexNumber =
          student.index_number?.toLowerCase() ?? "";
        const email = student.email_address?.toLowerCase() ?? "";

        return (
          fullName.includes(query) ||
          indexNumber.includes(query) ||
          email.includes(query)
        );
      }
    );
  }, [students, search]);

  if (isLoading && !project) {
    return (
      <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-center justify-center">
          <section className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#101B2D] to-[#0B1220] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="mt-4 text-lg font-semibold text-white">
              Loading students
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Please wait while we load your project.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-center justify-center">
          <section className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/[0.07] bg-gradient-to-br from-[#101B2D] to-[#0B1220] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.10] blur-[70px]" />
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>

            <p className="relative mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Project unavailable
            </p>
            <h1 className="relative mt-2 text-lg font-semibold text-white">
              {loadError ? "Unable to open project" : "Project not found"}
            </h1>
            <p className="relative mt-2 text-sm leading-6 text-slate-400">
              {loadError ??
                "We couldn’t find this project in your dashboard."}
            </p>

            {loadError && (
              <button
                type="button"
                onClick={() => setReloadKey((current) => current + 1)}
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
        </div>
      </main>
    );
  }

  const registerHref = `/home/${project.id}/students/${project.id}`;

  return (
    <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-7 pb-10">
        {students.length > 0 && (
          <section className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-[#080f1b]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/[0.08]">
                <Users size={19} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {students.length}{" "}
                  {students.length === 1 ? "Student" : "Students"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Registered in {project.title}
                </p>
              </div>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students..."
                className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#050b14] pl-9 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition-colors focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
          </section>
        )}

        {students.length === 0 ? (
          <section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#080f1b] px-6 py-14 text-center sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/[0.10] blur-[90px]" />
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/[0.08]">
              <GraduationCap size={29} className="text-blue-400" />
            </div>
            <h2 className="relative mt-6 text-xl font-semibold text-white sm:text-2xl">
              No students yet
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Add your first student to start building your directory.
            </p>
            <Link
              href={registerHref}
              className="group relative mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
            >
              <UserPlus size={16} />
              Add student
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
              Try another name, index number, or email.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map(
              (student: StudentDetailsWithRelations) => (
                <StudentCard key={student.id} student={student} />
              )
            )}
          </section>
        )}
      </div>
    </main>
  );
}

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

        {/* Student label */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050b14]/60 px-3 py-1.5 text-[10px] font-medium text-slate-200 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Student
        </div>

        {/* Name and index */}
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
              <p className="text-[10px] text-slate-500">
                Parent contact
              </p>

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