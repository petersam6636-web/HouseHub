
"use client";

import { useMemo, useState } from "react";
import useApp from "@/lib/useApp";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Users,
  Wallet,
  BriefcaseBusiness,
  Layers3,
  FolderOpen,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type TaskFilter = "all" | "active" | "empty";

export default function ProjectPage() {
  const { projects } = useApp();

  const [search, setSearch] = useState("");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");

  const projectStats = useMemo(() => {
    const totalStudents = projects.reduce(
      (total, project) => total + (project.students?.length || 0),
      0
    );

    const projectsWithTasks = projects.filter((project) =>
      project.students?.some(
        (student) => (student.semester_jobs?.length || 0) > 0
      )
    ).length;

    const totalAssignments = projects.reduce(
      (total, project) =>
        total +
        (project.students?.reduce(
          (studentTotal, student) =>
            studentTotal + (student.semester_jobs?.length || 0),
          0
        ) || 0),
      0
    );

    return {
      totalProjects: projects.length,
      totalStudents,
      projectsWithTasks,
      projectsWithoutTasks: projects.length - projectsWithTasks,
      totalAssignments,
    };
  }, [projects]);

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
    <main className="relative min-h-screen w-full overflow-hidden bg-[#05070D] px-1.5 py-5 text-white md:px-3 md:py-8">

      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-[45%] h-[450px] w-[450px] rounded-full bg-blue-600/[0.10] blur-[140px]" />
        <div className="absolute right-[-180px] top-[35%] h-[350px] w-[350px] rounded-full bg-blue-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-180px] left-[-100px] h-[350px] w-[350px] rounded-full bg-blue-700/[0.07] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.018)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1500px]">

        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5">
              <Sparkles size={12} className="text-blue-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                HouseHub workspace
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.045em] sm:text-3xl">
              Projects
              <span className="ml-2 text-blue-400">.</span>
            </h1>

            <p className="mt-2 max-w-lg text-xs leading-6 text-slate-500 sm:text-sm">
              Manage your school projects, monitor academic activities and
              keep track of student assignments in one place.
            </p>
          </div>

          <Link
            href="/home/project/create"
            className="group inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-[0_8px_25px_rgba(37,99,235,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-500"
          >
            <Plus size={15} />
            Create project
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Overview cards */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {/* Projects */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#101A2B] to-[#080E19] p-4 transition-all hover:border-blue-400/20 sm:p-5">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.09] blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                <FolderOpen size={17} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                Overview
              </span>
            </div>

            <div className="relative mt-5">
              <p className="text-2xl font-bold tracking-tight">
                {projectStats.totalProjects}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Total projects
              </p>
            </div>
          </div>

          {/* Students */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#101A2B] to-[#080E19] p-4 transition-all hover:border-blue-400/20 sm:p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
              <Users size={17} />
            </div>

            <div className="mt-5">
              <p className="text-2xl font-bold tracking-tight">
                {projectStats.totalStudents}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Registered students
              </p>
            </div>
          </div>

          {/* Active academic tasks */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#101A2B] to-[#080E19] p-4 transition-all hover:border-blue-400/20 sm:p-5">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.08] blur-3xl" />

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
              <ClipboardList size={17} />
            </div>

            <div className="relative mt-5">
              <p className="text-2xl font-bold tracking-tight">
                {projectStats.projectsWithTasks}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Projects with assignments
              </p>
            </div>
          </div>

          {/* Assignments */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#101A2B] to-[#080E19] p-4 transition-all hover:border-blue-400/20 sm:p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
              <Layers3 size={17} />
            </div>

            <div className="mt-5">
              <p className="text-2xl font-bold tracking-tight">
                {projectStats.totalAssignments}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Student assignments
              </p>
            </div>
          </div>
        </div>

        {/* Academic task overview */}
        <div className="mb-7 overflow-hidden rounded-2xl border border-blue-400/[0.12] bg-gradient-to-br from-[#101B2E] via-[#0B1321] to-[#080E19] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300">
                <GraduationCap size={19} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Academic task overview
                </h2>
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  Check which projects currently have student semester
                  assignments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[280px]">
              <div className="rounded-xl border border-blue-400/10 bg-blue-500/[0.06] px-3 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-400" />
                  <span className="text-[10px] text-slate-400">
                    With tasks
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold">
                  {projectStats.projectsWithTasks}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
                <div className="flex items-center gap-2">
                  <XCircle size={13} className="text-slate-500" />
                  <span className="text-[10px] text-slate-400">
                    Without tasks
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold">
                  {projectStats.projectsWithoutTasks}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Projects table container */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#090F19]/90 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">

          {/* Table header */}
          <div className="flex flex-col gap-4 border-b border-white/[0.06] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-white">
                Your projects
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                Explore and monitor your academic workspaces.
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
                  className="h-10 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-9 pr-3 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-500/10 sm:w-[220px]"
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
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                <FolderOpen size={25} />
              </div>

              <h3 className="text-sm font-semibold text-white">
                No projects yet
              </h3>

              <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500">
                You haven't created a project yet. Create your first school
                project to start managing students and academic activities.
              </p>

              <Link
                href="/home/project/create"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                <Plus size={14} />
                Create your first project
              </Link>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
              <Search size={23} className="mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-200">
                No matching projects
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try changing your search or filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setTaskFilter("all");
                }}
                className="mt-4 inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300"
              >
                <XCircle size={13} />
                Clear filters
              </button>
            </div>
          ) : (
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
                        {/* Project information */}
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

                        {/* Academic year */}
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

                        {/* Students */}
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.025] px-2.5 py-1.5">
                            <Users size={12} className="text-blue-400" />
                            <span className="text-[11px] font-semibold text-slate-200">
                              {students.length}
                            </span>
                          </div>
                        </td>

                        {/* Academic tasks */}
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

                        {/* Job assignments */}
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

                        {/* Created */}
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

              <div className="flex items-center gap-2 text-[10px] text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />
                Live application data
              </div>
            </div>
          )}
        </section>

        {/* Bottom information */}
        <div className="mt-5 flex flex-col gap-2 px-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-slate-600">
            HouseHub · Academic management workspace
          </p>

          <p className="flex items-center gap-1.5 text-[10px] text-slate-600">
            <Clock3 size={11} />
            Project information from your workspace
          </p>
        </div>
      </div>
    </main>
  );
}
