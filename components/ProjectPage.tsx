"use client";

import { useMemo, useState } from "react";
import useApp from "@/lib/useApp";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type TaskFilter = "all" | "active" | "empty";

export default function ProjectPage() {
  const { projects } = useApp();

  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.school_name?.toLowerCase().includes(query) ||
        project.academic_year?.toLowerCase().includes(query) ||
        project.location?.toLowerCase().includes(query);

      const hasTasks = project.students?.some(
        (student) => (student.semester_jobs?.length || 0) > 0
      );

      const matchesFilter =
        taskFilter === "all" ||
        (taskFilter === "active" && hasTasks) ||
        (taskFilter === "empty" && !hasTasks);

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, taskFilter]);

  const formatDate = (date: string | null) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="w-full py-4 text-white sm:py-6">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <section>
          {/* Empty state */}
          {projects.length === 0 ? (
            <div className="relative flex min-h-[390px] flex-col items-center justify-center px-5 py-16 text-center">
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
                  Your academic workspace is waiting. Create your first
                  school project to organize students, semester jobs and
                  everyday academic activities.
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
          ) : filteredProjects.length === 0 ? (
            /* No search results */
            <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-14 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center text-slate-500">
                <Search size={20} />
              </div>

              <p className="text-sm font-semibold text-slate-200">
                No matching projects
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Try another search or change your task filter.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setTaskFilter("all");
                }}
                className="mt-4 text-xs font-medium text-blue-400 transition hover:text-blue-300"
              >
                Clear filters
              </button>
            </div>
          ) : (
            /* Projects table */
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Project / School
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Academic year
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Students
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Academic tasks
                    </th>

                    <th className="px-4 py-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Job assignments
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => {
                    const students = project.students || [];

                    const semesterJobs = students.flatMap(
                      (student) => student.semester_jobs || []
                    );

                    const hasTasks = semesterJobs.length > 0;

                    const dailyAssignments = semesterJobs.filter(
                      (job) => job.job_type === "daily"
                    ).length;

                    const partTimeAssignments = semesterJobs.filter(
                      (job) => job.job_type === "part_time"
                    ).length;

                    return (
                      <tr
                        key={project.id}
                        className="group transition-colors duration-300"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden">
                              {project.logo_image ? (
                                <img
                                  src={project.logo_image}
                                  alt={project.school_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <GraduationCap
                                  size={19}
                                  className="text-blue-300"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[200px] truncate text-xs font-semibold text-slate-100 transition group-hover:text-blue-300">
                                {project.title}
                              </p>

                              <p className="mt-1 max-w-[200px] truncate text-[10px] text-slate-500">
                                {project.school_name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <CalendarDays
                              size={13}
                              className="text-blue-400/70"
                            />
                            <span className="text-[11px] text-slate-300">
                              {project.academic_year}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1.5">
                            <Users size={12} className="text-blue-400" />
                            <span className="text-[11px] font-semibold text-slate-200">
                              {students.length}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {hasTasks ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5">
                              <CheckCircle2
                                size={11}
                                className="text-blue-400"
                              />

                              <span className="text-[10px] font-medium text-blue-300">
                                Available
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5">
                              <XCircle
                                size={11}
                                className="text-slate-500"
                              />

                              <span className="text-[10px] font-medium text-slate-400">
                                Not created
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] text-slate-300">
                              {semesterJobs.length} assignments
                            </span>

                            <div className="flex items-center gap-2 text-[9px] text-slate-500">
                              <span>{dailyAssignments} daily</span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <span>{partTimeAssignments} part-time</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="text-[10px] text-slate-500">
                            {formatDate(project.created_at)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Table footer */}
          {filteredProjects.length > 0 && (
            <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-[10px] text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {filteredProjects.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-300">
                  {projects.length}
                </span>{" "}
                projects
              </p>

              <span className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Live workspace data
              </span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}