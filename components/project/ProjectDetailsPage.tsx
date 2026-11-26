
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  RefreshCw,
} from "lucide-react";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ProjectDashboardBento from "./ProjectDashboardBento";

import {
  fetchProjectForUser,
  getErrorMessage,
} from "@/lib/projectService";

import useApp from "@/lib/useApp";
import type { ProjectWithRelations } from "@/types";

type ProjectDetailsPageProps = {
  projectId: string;
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );

function formatDate(value: string | null) {
  if (!value) return "Not set";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProjectDetailsPage({
  projectId,
}: ProjectDetailsPageProps) {
  const { projects, setProjects, authenticatedId } = useApp();

  const isValidProjectId = isUuid(projectId);

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
          ...currentProjects.filter(
            (item) => item.id !== result.id
          ),
          result,
        ]);
      } catch (error) {
        console.error("Unable to load project details.", error);

        if (!cancelled) {
          setLoadError(
            getErrorMessage(
              error,
              "Unable to load project details."
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

        <main className="flex min-h-[calc(100vh-72px)] w-full flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <RefreshCw className="h-6 w-6 text-blue-400" />
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-200">
            {loadError ?? "This project could not be found."}
          </p>

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-500"
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

  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/home/project"
            className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition group-hover:-translate-x-0.5"
            />
            All projects
          </Link>

          {/* Keep the existing project identity header */}
          <section className="relative mt-5 overflow-hidden rounded-[28px] border border-blue-400/[0.12] bg-[#0B1424] shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-600/[0.12] blur-[100px]" />

            <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.7)]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                    Project overview
                  </p>
                </div>

                <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {project.title}
                </h1>

                <p className="mt-2 text-sm font-medium text-slate-300">
                  {project.school_name}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-400">
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
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                  {project.logo_image ? (
                    <img
                      src={project.logo_image}
                      alt={`${project.school_name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-300">
                      {project.school_name
                        .trim()
                        .charAt(0)
                        .toUpperCase() || "H"}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Academic year
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {project.academic_year}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* All dashboard cards and charts */}
          <ProjectDashboardBento project={project} />
        </div>
      </main>
    </>
  );
}
