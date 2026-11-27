
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Users,
  UserPlus,
  UserRound,
  Phone,
  Search,
  ShieldAlert,
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
          ...currentProjects.filter(
            (item) => item.id !== result.id
          ),
          result,
        ]);
      } catch (error) {
        console.error(
          "Unable to load project students.",
          error
        );

        if (!cancelled) {
          setLoadError(
            getErrorMessage(
              error,
              "Unable to load project students."
            )
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
        const name =
          student.full_name?.toLowerCase() ?? "";

        const index =
          student.index_number?.toLowerCase() ?? "";

        const email =
          student.email_address?.toLowerCase() ?? "";

        const location =
          student.location?.toLowerCase() ?? "";

        const emergencyContact =
          student.mother_contact?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          index.includes(query) ||
          email.includes(query) ||
          location.includes(query) ||
          emergencyContact.includes(query)
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
            <GraduationCap
              size={22}
              className="text-blue-300"
            />
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
            <GraduationCap
              size={22}
              className="text-blue-300"
            />
          </div>

          <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
            Project unavailable
          </p>

          <h1 className="relative mt-2 text-lg font-semibold">
            {loadError
              ? "Unable to open project"
              : "Project not found"}
          </h1>

          <p className="relative mt-2 text-sm leading-6 text-slate-400">
            {loadError ??
              "We couldn't find this project in your dashboard."}
          </p>

          {loadError && (
            <button
              type="button"
              onClick={() =>
                setReloadKey((value) => value + 1)
              }
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

  /* Empty directory */
  if (students.length === 0) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] w-full items-center justify-center overflow-hidden px-3 py-4 text-white sm:px-5">
        <section className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-blue-400/[0.11] bg-gradient-to-br from-[#111e30] via-[#0d1726] to-[#090f19] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:rounded-[32px] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/[0.18] blur-[80px]" />

          <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-blue-500/[0.10] blur-[80px]" />

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
              Start building your class directory by adding
              your first student. Their profile and essential
              information will appear here.
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
              <Users
                size={13}
                className="text-blue-300"
              />
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
        {/* Project heading */}
        <section className="flex items-center justify-between gap-3 rounded-[22px] border border-white/[0.07] bg-gradient-to-r from-[#172943] via-[#101e32] to-[#0b1422] p-3.5 sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <Users
                size={18}
                className="text-blue-300"
              />
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
                {students.length === 1
                  ? "student"
                  : "students"}
              </p>
            </div>
          </div>

          <Link
            href={registerHref}
            aria-label="Add student"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-3.5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(37,99,235,0.2)] transition hover:brightness-110 sm:px-4"
          >
            <UserPlus size={15} />

            <span className="hidden sm:inline">
              Add student
            </span>

            <span className="sm:hidden">Add</span>
          </Link>
        </section>

        {/* Search and count */}
        <section className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[11px] text-slate-400">
            <Users
              size={14}
              className="text-blue-400"
            />

            Showing {filteredStudents.length} of{" "}
            {students.length}
          </p>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search students..."
              className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#0b1422] pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </section>

        {/* Search results */}
        {filteredStudents.length === 0 ? (
          <section className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-white/[0.06] bg-gradient-to-br from-[#14243a] to-[#0b1422] px-5 py-8 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
              <Search size={19} />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-white">
              No students found
            </h2>

            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
              Try searching with another name, index number,
              email, location, or emergency contact.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                projectId={project.id}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   PREMIUM HOUSEHUB STUDENT CARD
   Full image + navy glassmorphism + blue accent
========================================================= */

function StudentCard({
  student,
  projectId,
}: {
  student: StudentDetailsWithRelations;
  projectId: string;
}) {
  const image = student.profile_image;

  const initials = (student.full_name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const studentName =
    student.full_name || "Unnamed student";

  const studentLocation =
    student.location || "Location not provided";

  const emergencyContact =
    student.mother_contact || "";

  const viewHref =
    `/home/${projectId}/students/view?id=${student.id}`;

  const emergencyPhone =
    emergencyContact.replace(/[^\d+]/g, "");

  return (
    <article className="group relative isolate flex min-h-[520px] min-w-0 flex-col overflow-hidden rounded-[30px] border border-white/[0.12] bg-[#07111f] shadow-[0_20px_60px_rgba(0,0,0,0.38)] transition duration-500 hover:-translate-y-1 hover:border-blue-400/30 hover:shadow-[0_28px_75px_rgba(0,0,0,0.48)] sm:min-h-[550px]">
      {/* Full-card background image */}
      <div className="absolute inset-0">
        {image ? (
          <Image
            src={image}
            alt={`${studentName} profile`}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover object-center transition duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#183b68] via-[#102746] to-[#07111f]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-300/20 bg-blue-200/[0.08] text-3xl font-bold tracking-wider text-blue-100 shadow-2xl backdrop-blur-xl">
              {initials || <UserRound size={36} />}
            </div>
          </div>
        )}
      </div>

      {/* Cinematic dark gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030812]/25 via-[#06101d]/5 via-[35%] to-[#030812]/95" />

      {/* HouseHub blue atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(37,99,235,0.24),transparent_60%)] opacity-90" />

      {/* Top glass badges */}
      <div className="relative z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#07111f]/55 px-3 py-2 shadow-lg backdrop-blur-2xl">
          <GraduationCap
            size={14}
            className="text-blue-300"
          />

          <span className="text-[10px] font-semibold tracking-wide text-white/90">
            Student profile
          </span>
        </div>

        {student.index_number && (
          <div className="max-w-[45%] truncate rounded-full border border-white/[0.14] bg-[#07111f]/55 px-3 py-2 text-[10px] font-semibold text-white/90 shadow-lg backdrop-blur-2xl">
            {student.index_number}
          </div>
        )}
      </div>

      {/* Bottom glass information panel */}
      <div className="relative z-10 mt-auto border-t border-white/[0.12] bg-gradient-to-b from-[#081321]/55 via-[#06101d]/80 to-[#030812]/95 px-4 pb-4 pt-6 backdrop-blur-[24px] sm:px-5 sm:pb-5 sm:pt-7">
        {/* Student name */}
        <div className="relative">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300">
                HouseHub student
              </p>

              <h2 className="mt-2 break-words text-[22px] font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-[25px]">
                {studentName}
              </h2>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/[0.10] text-blue-200 shadow-lg backdrop-blur-xl">
              <UserRound size={18} />
            </div>
          </div>

          {/* Student location */}
          <div className="mt-3 flex items-start gap-2.5">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/[0.10] text-blue-200">
              <MapPin size={14} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-blue-200/70">
                Location
              </p>

              <p className="mt-0.5 break-words text-[12px] font-medium leading-5 text-white/90">
                {studentLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="mt-4 overflow-hidden rounded-[18px] border border-blue-300/[0.18] bg-blue-500/[0.10] shadow-[0_8px_28px_rgba(0,0,0,0.16)] backdrop-blur-2xl">
          <div className="flex items-center gap-2 border-b border-blue-300/[0.10] px-3.5 py-2.5">
            <ShieldAlert
              size={14}
              className="shrink-0 text-blue-300"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-200">
              Emergency contact
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-medium text-blue-100/60">
                Parent / guardian
              </p>

              <p className="mt-1 break-words text-[13px] font-bold leading-5 text-white">
                {emergencyContact || "Not provided"}
              </p>
            </div>

            {emergencyContact && (
              <a
                href={`tel:${emergencyPhone}`}
                aria-label={`Call emergency contact ${emergencyContact}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/[0.14] text-blue-200 transition hover:bg-blue-400/25 hover:text-white"
              >
                <Phone size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Additional information */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <StudentInfo
            icon={<Mail size={13} />}
            label="Email address"
            value={student.email_address || "Not provided"}
          />

          <StudentInfo
            icon={<UserRound size={13} />}
            label="Gender"
            value={student.gender || "Not provided"}
          />
        </div>

        {/* View profile button */}
        <Link
          href={viewHref}
          className="group/view mt-5 inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-[12px] font-bold text-[#07111f] shadow-[0_8px_28px_rgba(0,0,0,0.22)] transition duration-300 hover:bg-blue-50 hover:shadow-[0_10px_35px_rgba(37,99,235,0.22)]"
        >
          <Eye size={16} />

          View

          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover/view:translate-x-1"
          />
        </Link>
      </div>
    </article>
  );
}

/* Student information item */
function StudentInfo({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-[15px] border border-white/[0.09] bg-white/[0.045] px-3 py-3 backdrop-blur-xl">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.045] text-blue-200/80">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-[10px] font-medium leading-[17px] text-white/90">
          {value}
        </p>
      </div>
    </div>
  );
}