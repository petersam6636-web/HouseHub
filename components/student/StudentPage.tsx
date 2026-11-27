
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
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
  Globe,
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
        console.error("Unable to load project students.", error);

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
        const name = student.full_name?.toLowerCase() ?? "";
        const index = student.index_number?.toLowerCase() ?? "";
        const email = student.email_address?.toLowerCase() ?? "";
        const location = student.location?.toLowerCase() ?? "";
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

  if (isLoading && !project) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] flex-col items-center justify-center px-3 py-4 text-white">
        <div className="w-full max-w-sm">
          {projectId && (
            <Link
              href={`/home/${projectId}`}
              className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to dashboard
            </Link>
          )}

          <section className="rounded-[28px] border border-blue-400/10 bg-gradient-to-br from-[#102440] via-[#0A192D] to-[#061020] p-7 text-center">
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
        </div>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] items-center justify-center px-3 py-4 text-white">
        <Link
          href={projectId ? `/home/${projectId}` : "/home/project"}
          className="fixed left-3 top-[88px] z-40 inline-flex h-10 items-center gap-2 rounded-xl border border-blue-400/15 bg-[#0A192D]/95 px-3 text-xs font-medium text-slate-300 shadow-lg backdrop-blur transition hover:border-blue-400/30 hover:text-white sm:left-6"
        >
          <ArrowLeft size={15} />
          {projectId ? "Back to dashboard" : "Back to projects"}
        </Link>

        <section className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-blue-400/10 bg-gradient-to-br from-[#102440] via-[#0A192D] to-[#061020] p-6 text-center sm:p-8">
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

        </section>
      </main>
    );
  }

  if (students.length === 0) {
    return (
      <main className="flex min-h-[calc(100dvh-72px)] w-full items-center justify-center overflow-hidden px-3 py-4 text-white sm:px-5">
        <Link
          href={`/home/${project.id}`}
          className="fixed left-3 top-[88px] z-40 inline-flex h-10 items-center gap-2 rounded-xl border border-blue-400/15 bg-[#0A192D]/95 px-3 text-xs font-medium text-slate-300 shadow-lg backdrop-blur transition hover:border-blue-400/30 hover:text-white sm:left-6"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        <div className="w-full max-w-[560px]">
          <section className="relative overflow-hidden rounded-[28px] border border-blue-400/[0.11] bg-gradient-to-br from-[#102440] via-[#0A192D] to-[#061020] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)] sm:rounded-[32px] sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-blue-400/[0.16] blur-[80px]" />

            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-blue-500/[0.10] blur-[80px]" />

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-blue-300/20 bg-blue-400/[0.10] text-blue-200 sm:h-16 sm:w-16">
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
                <Users size={13} className="text-blue-300" />
                No student profiles added yet
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-1.5 py-3 text-white sm:px-3 sm:py-5">
      <div className="mx-auto w-full max-w-6xl space-y-4">
        <Link
          href={`/home/${project.id}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to dashboard
        </Link>

        {/* Project heading */}
        <section className="flex items-center justify-between gap-3 rounded-[22px] border border-blue-400/[0.10] bg-gradient-to-r from-[#102440] via-[#0A192D] to-[#061020] p-5 sm:p-6">
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
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(37,99,235,0.2)] transition hover:bg-blue-500 sm:px-4"
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
              className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#0B1729] pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 transition focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </section>

        {/* Student cards */}
        {filteredStudents.length === 0 ? (
          <section className="flex min-h-[220px] flex-col items-center justify-center rounded-[24px] border border-white/[0.06] bg-gradient-to-br from-[#102440] to-[#061020] px-5 py-8 text-center">
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
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   HOUSEHUB STUDENT PROFILE CARD
   Navy + blue identity card
   Vertical below sm, horizontal from sm
========================================================= */

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

  const studentName = student.full_name || "Unnamed student";
  const studentLocation = student.location || "Location not provided";
  const emergencyContact = student.mother_contact || "";

  const emergencyPhone = emergencyContact.replace(/[^\d+]/g, "");

  const viewHref = `/home/students/view?id=${student.id}`;

  return (
    <article className="group relative isolate flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-blue-300/[0.12] bg-[#071426] shadow-[0_18px_55px_rgba(0,0,0,0.28)] transition duration-300 hover:border-blue-400/30 hover:shadow-[0_24px_65px_rgba(0,0,0,0.38)] sm:min-h-[470px] sm:flex-row">
      {/* Subtle blue atmosphere */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.10] blur-[75px]" />

      {/* Portrait section */}
      <div className="relative flex min-h-[230px] shrink-0 items-center justify-center overflow-hidden border-b border-blue-300/[0.08] bg-gradient-to-br from-[#102440] via-[#0B1B30] to-[#061020] sm:min-h-[330px] sm:w-[38%] sm:border-b-0 sm:border-r">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-blue-500/[0.12] blur-[55px]" />

        {/* Decorative outer ring */}
        <div className="absolute h-[174px] w-[174px] rotate-[-35deg] rounded-full border-[5px] border-blue-500 border-t-transparent shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-transform duration-500 group-hover:rotate-[-20deg] sm:h-[190px] sm:w-[190px]" />

        {/* Secondary ring */}
        <div className="absolute h-[154px] w-[154px] rounded-full border-[3px] border-blue-300/20 sm:h-[170px] sm:w-[170px]" />

        {/* Student portrait */}
        <div className="relative h-[142px] w-[142px] overflow-hidden rounded-full border-[5px] border-[#071426] bg-[#102440] shadow-[0_12px_35px_rgba(0,0,0,0.35)] sm:h-[158px] sm:w-[158px]">
          {image ? (
            <Image
              src={image}
              alt={`${studentName} profile`}
              fill
              sizes="(min-width: 640px) 160px, 145px"
              unoptimized
              className="object-cover object-center transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1D426F] via-[#123052] to-[#071426] text-3xl font-bold tracking-wider text-blue-100">
              {initials || <UserRound size={38} />}
            </div>
          )}
        </div>

        {/* Index badge */}
        {student.index_number && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-blue-300/20 bg-[#071426]/85 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-blue-100 backdrop-blur-xl sm:bottom-5">
            {student.index_number}
          </div>
        )}
      </div>

      {/* Information section */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col p-4 sm:justify-center sm:p-6">
        {/* Student identity */}
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.19em] text-blue-400">
              HouseHub student
            </p>

            <h2 className="mt-1.5 break-words text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
              {studentName}
            </h2>

            <p className="mt-1 text-[10px] font-medium text-slate-400">
              Student profile
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/[0.08] text-blue-300">
            <GraduationCap size={17} />
          </div>
        </div>

        {/* Student location */}
        <div className="mt-4 flex min-w-0 items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-500/[0.08] text-blue-300">
            <MapPin size={15} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Location
            </p>

            <p className="mt-1 break-words text-[12px] font-medium leading-5 text-slate-200">
              {studentLocation}
            </p>
          </div>
        </div>

        {/* Emergency contact */}
        <div className="mt-4 rounded-[17px] border border-blue-400/[0.18] bg-blue-500/[0.07] p-3.5">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0 text-blue-300" />

            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-200">
              Emergency contact
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-medium text-slate-400">
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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-300/20 bg-blue-500/15 text-blue-200 transition hover:bg-blue-500/30 hover:text-white"
              >
                <Phone size={15} />
              </a>
            )}
          </div>
        </div>

        {/* Additional student details */}
        <div className="mt-3 grid grid-cols-1 gap-2 min-[500px]:grid-cols-2">
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

        {/* View profile */}
        <Link
          href={viewHref}
          className="group/view mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 py-3 text-[12px] font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.20)] transition duration-300 hover:bg-blue-500 hover:shadow-[0_10px_30px_rgba(37,99,235,0.30)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071426]"
        >
          <Eye size={16} />
          View Profile
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
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-[14px] border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-300/[0.10] bg-blue-500/[0.06] text-blue-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-[10px] font-medium leading-[17px] text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}
