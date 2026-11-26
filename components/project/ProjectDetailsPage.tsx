"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Layers3,
  MapPin,
  Users,
} from "lucide-react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  fetchProjectForUser,
  getErrorMessage,
} from "@/lib/projectService";
import useApp from "@/lib/useApp";
import type { ProjectWithRelations } from "@/types";

type ProjectDetailsPageProps = {
  projectId: string;
};

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  const { projects, setProjects, authenticatedId } = useApp();
  const isValidProjectId =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      projectId
    );
  const cachedProject = useMemo(
    () => projects.find((project) => project.id === projectId) ?? null,
    [projects, projectId]
  );
  const [loadedProject, setLoadedProject] =
    useState<ProjectWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const project =
    cachedProject?.id === projectId
      ? cachedProject
      : loadedProject?.id === projectId
        ? loadedProject
        : null;

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      if (!isValidProjectId) {
        setLoadError("This project link is invalid.");
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
        console.error("Unable to load project details.", error);
        if (!cancelled) {
          setLoadError(
            getErrorMessage(error, "Unable to load project details.")
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProject();
    return () => {
      cancelled = true;
    };
  }, [
    authenticatedId,
    cachedProject,
    isValidProjectId,
    projectId,
    reloadKey,
    setProjects,
  ]);

  if (isLoading && !project) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] w-full">
          <Loading />
        </main>
      </>
    );
  }

  if (loadError || !project) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center px-5 py-12 text-center text-white">
          <p className="text-sm font-semibold text-slate-200">
            {loadError ?? "This project could not be found."}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            Try again
          </button>
          <Link
            href="/home/project"
            className="mt-4 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            Back to projects
          </Link>
        </main>
      </>
    );
  }

  const formatDate = (value: string | null) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not set";

  const relatedStudentRecords = project.students.reduce(
    (total, student) =>
      total +
      (student.amounts?.length ?? 0) +
      (student.transactions?.length ?? 0) +
      (student.products?.length ?? 0) +
      (student.fees?.length ?? 0) +
      (student.messages?.length ?? 0) +
      (student.feedback?.length ?? 0) +
      (student.semester_jobs?.length ?? 0) +
      (student.part_time_jobs?.length ?? 0),
    0
  );

  const stats = [
    {
      label: "Students",
      value: project.students.length,
      icon: Users,
    },
    {
      label: "Daily jobs",
      value: project.daily_jobs.length,
      icon: Clock3,
    },
    {
      label: "Part-time jobs",
      value: project.part_time_jobs.length,
      icon: BriefcaseBusiness,
    },
    {
      label: "Related records",
      value: relatedStudentRecords,
      icon: Layers3,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-72px)] w-full px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/home/project"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            All projects
          </Link>

          <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#101B2D] to-[#0B1220] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
              Project details
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {project.school_name}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" />
                {project.location || "Location not set"}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={14} className="text-blue-400" />
                {project.academic_year}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={14} className="text-blue-400" />
                Starts {formatDate(project.start_date)}
              </span>
            </div>
          </section>

          <section
            aria-label="Project overview"
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/[0.06] bg-[#0B1220]/80 p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{stat.label}</span>
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </>
  );
}
