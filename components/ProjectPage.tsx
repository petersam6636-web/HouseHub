"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, GraduationCap, Plus } from "lucide-react";
import Loading from "@/components/Loading";
import ProjectsCard from "@/components/project/ProjectsCard";
import {
  fetchProjectsForUser,
  getErrorMessage,
} from "@/lib/projectService";
import useApp from "@/lib/useApp";

export default function ProjectPage() {
  const { projects, setProjects, authenticatedId } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      if (!authenticatedId) {
        setProjects([]);
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const userProjects = await fetchProjectsForUser(authenticatedId);
        if (!cancelled) setProjects(userProjects);
      } catch (error) {
        console.error("Unable to load projects.", error);
        if (!cancelled) {
          setLoadError(
            getErrorMessage(error, "Unable to load projects. Please try again.")
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadProjects();
    return () => {
      cancelled = true;
    };
  }, [authenticatedId, reloadKey, setProjects]);

  return (
    <main className="flex min-h-[calc(100vh-72px)] w-full py-4 text-white sm:py-6">
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <Loading />
        ) : loadError ? (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-14 text-center">
            <AlertCircle size={24} className="text-red-400" />
            <p className="mt-4 text-sm font-semibold text-slate-200">
              Projects couldn&apos;t be loaded
            </p>
            <p className="mt-2 max-w-md text-xs leading-5 text-slate-500">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((current) => current + 1)}
              className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Try again
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-16 text-center">
            <div className="relative">
              <div className="relative mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[1.6rem] border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.16] to-blue-600/[0.04] shadow-[0_0_45px_rgba(37,99,235,0.12)]">
                <GraduationCap
                  size={32}
                  strokeWidth={1.5}
                  className="text-blue-300"
                />
                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center text-blue-300">
                  <Plus size={14} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-[-0.04em] text-white sm:text-2xl">
                No projects yet.
              </h3>
              <p className="mx-auto mt-3 max-w-[340px] text-xs leading-6 text-slate-500 sm:text-[13px]">
                Your academic workspace is waiting. Create your first school
                project to organize students, semester jobs and everyday
                academic activities.
              </p>

              <Link
                href="/home/create"
                className="group mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
              >
                <Plus size={15} />
                Create your first project
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        ) : (
          <ProjectsCard />
        )}
      </div>
    </main>
  );
}
