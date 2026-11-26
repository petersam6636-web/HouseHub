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
  FolderOpen,
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
        <section className="overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-gradient-to-br from-[#0D1523]/95 via-[#090F1A]/95 to-[#070B12]/95 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          {/* Table header */}
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-400/[0.14] bg-blue-500/[0.08] text-blue-300">
                  <FolderOpen size={15} />
                </div>

                <h2 className="text-sm font-semibold tracking-tight text-white">
                  Your projects
                </h2>

                <span className="rounded-md border border-blue-400/15 bg-blue-500/[0.07] px-2 py-0.5 text-[9px] font-semibold text-blue-300">
                  {projects.length}
                </span>
              </div>

              <p className="mt-2 text-[11px] text-slate-500">
                Manage school projects and monitor academic activities.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-9 pr-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-500/10 sm:w-[210px]"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-[#070C14] p-1">
                {(
                  [
                    { label: "All", value: "all" },
                    { label: "With tasks", value: "active" },
                    { label: "No tasks", value: "empty" },
                  ] as const
                ).map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTaskFilter(filter.value)}
                    className={`rounded-lg px-2.5 py-2 text-[10px] font-medium transition-all ${
                      taskFilter === filter.value
                        ? "bg-blue-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.2)]"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Empty state */}
          {projects.length === 0 ? (
            <div className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.09] blur-[90px]" />

              <div className="relative">
                <div className="relative mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[1.6rem] border border-blue-400/20 bg-gradient-to-br from-blue-500/[0.16] to-blue-600/[0.04] shadow-[0_0_45px_rgba(37,99,235,0.12)]">
                  <GraduationCap
                    size={32}
                    strokeWidth={1.5}
                    className="text-blue-300"
                  />

                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-xl border border-blue-400/20 bg-[#101B2D] text-blue-300">
                    <Plus size={14} />
                  </div>
                </div>

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.06] px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                    Workspace ready
                  </span>
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
                  className="group mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-[0_8px_30px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_12px_35px_rgba(37,99,235,0.32)]"
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
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-slate-500">
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
                  <tr className="border-b border-white/[0.05] bg-white/[0.015]">
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
                        className="group border-b border-white/[0.045] transition-colors duration-300 hover:bg-blue-500/[0.035]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-400/[0.14] bg-blue-500/[0.08]">
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
                          <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.025] px-2.5 py-1.5">
                            <Users size={12} className="text-blue-400" />
                            <span className="text-[11px] font-semibold text-slate-200">
                              {students.length}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {hasTasks ? (
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-2.5 py-1.5">
                              <CheckCircle2
                                size={11}
                                className="text-blue-400"
                              />

                              <span className="text-[10px] font-medium text-blue-300">
                                Available
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5">
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
            <div className="flex flex-col gap-2 border-t border-white/[0.05] bg-white/[0.012] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
                Live workspace data
              </span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}