
"use client";

import Link from "next/link";
import useApp from "@/lib/useApp";
import {
  Plus,
  MapPin,
  CalendarDays,
  Users,
  GraduationCap,
  ArrowUpRight,
  Wallet,
  TrendingDown,
  Building2,
} from "lucide-react";

import type {
  ProjectWithRelations,
  Amount,
  Transaction,
} from "@/types";

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 2,
});

function formatMoney(value: number) {
  return currencyFormatter.format(value);
}

function getAmountValue(amount: Amount) {
  const value = amount.amount;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function getProjectTotalAmount(project: ProjectWithRelations) {
  return project.students.reduce((total, student) => {
    const studentAmount = student.amounts.reduce(
      (amountTotal, amount) => amountTotal + getAmountValue(amount),
      0
    );

    return total + studentAmount;
  }, 0);
}

function isCountableExpense(transaction: Transaction) {
  if (transaction.state !== "withdraw") {
    return false;
  }

  return (
    transaction.status === "completed" ||
    transaction.status === null
  );
}

function getProjectExpenses(project: ProjectWithRelations) {
  return project.students.reduce((total, student) => {
    const studentExpenses = student.transactions.reduce(
      (expenseTotal, transaction) => {
        if (!isCountableExpense(transaction)) {
          return expenseTotal;
        }

        return expenseTotal + (transaction.amount ?? 0);
      },
      0
    );

    return total + studentExpenses;
  }, 0);
}

function formatDate(date: string | null) {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BalanceDonut({
  totalAmount,
  expenses,
  balance,
}: {
  totalAmount: number;
  expenses: number;
  balance: number;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  const expenseRatio =
    totalAmount > 0
      ? Math.min(expenses / totalAmount, 1)
      : expenses > 0
        ? 1
        : 0;

  const expenseLength = circumference * expenseRatio;
  const balanceLength = circumference - expenseLength;

  return (
    <div className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full -rotate-90 overflow-visible"
        aria-label={`Expenses ${formatMoney(expenses)}, balance ${formatMoney(balance)}`}
      >
        {/* Background ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="9"
        />

        {/* Balance ring */}
        {balance > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${balanceLength} ${circumference}`}
            strokeDashoffset={-expenseLength}
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Expense ring */}
        {expenses > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={`${expenseLength} ${circumference}`}
            className="transition-all duration-700 ease-out"
          />
        )}
      </svg>

      {/* Center balance */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
          Balance
        </span>

        <span
          className={`mt-1 max-w-[90px] truncate text-sm font-bold ${
            balance < 0 ? "text-rose-400" : "text-white"
          }`}
          title={formatMoney(balance)}
        >
          {formatMoney(balance)}
        </span>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const totalAmount = getProjectTotalAmount(project);
  const expenses = getProjectExpenses(project);
  const balance = totalAmount - expenses;

  const studentCount = project.students.length;

  return (
    <Link
      href={`/home/projects/${project.id}`}
      className="group relative block min-w-0 overflow-hidden rounded-[26px] border border-white/[0.07] bg-[#0B1220] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30 hover:bg-[#0D1728] hover:shadow-[0_20px_60px_-25px_rgba(37,99,235,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Decorative futuristic glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/[0.07] blur-[70px] transition-all duration-500 group-hover:bg-blue-500/[0.15]" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.035] via-transparent to-transparent opacity-70" />

      <div className="relative">
        {/* Project identity */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-400/15 bg-blue-500/[0.08]">
              {project.logo_image ? (
                <img
                  src={project.logo_image}
                  alt={`${project.school_name} logo`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2
                  size={21}
                  className="text-blue-400"
                />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-blue-200">
                {project.title}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-400">
                {project.school_name}
              </p>
            </div>
          </div>

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-slate-500 transition-all group-hover:border-blue-400/20 group-hover:bg-blue-500/10 group-hover:text-blue-300">
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Location and academic year */}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex min-w-0 items-center gap-1.5 text-xs text-slate-400">
            <MapPin size={13} className="shrink-0 text-blue-400" />
            <span className="truncate">
              {project.location || "Location not set"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CalendarDays
              size={13}
              className="shrink-0 text-blue-400"
            />
            <span>{project.academic_year}</span>
          </div>
        </div>

        {/* Student count */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/[0.05] bg-white/[0.025] px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/[0.09] text-blue-400">
              <Users size={15} />
            </div>

            <div>
              <p className="text-[10px] text-slate-500">
                Registered students
              </p>

              <p className="mt-0.5 text-sm font-semibold text-white">
                {studentCount.toLocaleString("en-GH")}
              </p>
            </div>
          </div>

          <GraduationCap
            size={18}
            className="text-slate-600"
          />
        </div>

        {/* Financial overview */}
        <div className="mt-5 border-t border-white/[0.06] pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Financial overview
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Project funds
              </p>
            </div>

            <Wallet size={16} className="text-blue-400" />
          </div>

          <div className="flex items-center gap-4">
            <BalanceDonut
              totalAmount={totalAmount}
              expenses={expenses}
              balance={balance}
            />

            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  <span className="text-[10px] text-slate-500">
                    Total amount
                  </span>
                </div>

                <p
                  className="truncate text-sm font-semibold text-white"
                  title={formatMoney(totalAmount)}
                >
                  {formatMoney(totalAmount)}
                </p>
              </div>

              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] text-slate-500">
                    Total expenses
                  </span>
                </div>

                <p
                  className="truncate text-sm font-semibold text-white"
                  title={formatMoney(expenses)}
                >
                  {formatMoney(expenses)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action hint */}
        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <span className="text-[10px] text-slate-500">
            Created {formatDate(project.created_at)}
          </span>

          <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-400 transition-all group-hover:gap-2.5">
            View project
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsCard() {
  const { projects } = useApp();

  const projectList = projects ?? [];

  return (
    <section className="w-full">
      {/* Section heading */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Your Projects
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Your academic projects at a glance.
          </p>
        </div>

        <Link
          href="/home/create"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 active:scale-[0.98]"
        >
          <Plus size={15} />
          Add Project
        </Link>
      </div>

      {projectList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
          {projectList.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[26px] border border-white/[0.06] bg-[#0B1220]/70 px-6 py-12 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08]">
            <GraduationCap
              size={25}
              className="text-blue-400"
            />
          </div>

          <h3 className="text-sm font-semibold text-white">
            No projects yet
          </h3>

          <p className="mt-2 max-w-xs text-xs leading-5 text-slate-400">
            Create your first academic project to manage students
            and keep track of project funds.
          </p>

          <Link
            href="/home/create"
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus size={15} />
            Create Project
          </Link>
        </div>
      )}
    </section>
  );
}
