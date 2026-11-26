
"use client";

import Link from "next/link";
import useApp from "@/lib/useApp";
import {
  Plus,
  CalendarDays,
  Users,
  ArrowUpRight,
  Wallet,
  Building2,
  GraduationCap,
  TrendingDown,
  Layers3,
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
      (amountTotal, amount) =>
        amountTotal + getAmountValue(amount),
      0
    );

    return total + studentAmount;
  }, 0);
}

function isCountableExpense(transaction: Transaction) {
  return (
    transaction.state === "withdraw" &&
    (transaction.status === "completed" ||
      transaction.status === null)
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
  const radius = 43;
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
    <div className="relative h-[150px] w-[150px] shrink-0">
      {/* Soft chart glow */}
      <div className="absolute inset-4 rounded-full bg-blue-500/10 blur-2xl" />

      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full -rotate-90"
        role="img"
        aria-label={`Project balance ${formatMoney(balance)}. Expenses ${formatMoney(expenses)}.`}
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />

        {/* Remaining balance */}
        {balance > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#38BDF8"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${balanceLength} ${circumference}`}
            strokeDashoffset={-expenseLength}
            className="transition-all duration-1000 ease-out"
          />
        )}

        {/* Expenses */}
        {expenses > 0 && (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${expenseLength} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />
        )}
      </svg>

      {/* Chart center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Balance
        </span>

        <span
          className={`mt-1 max-w-[112px] truncate text-center text-sm font-bold tracking-tight ${
            balance < 0 ? "text-rose-400" : "text-white"
          }`}
          title={formatMoney(balance)}
        >
          {formatMoney(balance)}
        </span>

        <span className="mt-1 text-[9px] text-slate-500">
          Remaining funds
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

  const expensePercentage =
    totalAmount > 0
      ? Math.min((expenses / totalAmount) * 100, 100)
      : expenses > 0
        ? 100
        : 0;

  return (
    <Link
      href={`/home/${project.id}`}
      className="group relative block min-w-0 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0A1220] transition-all duration-500 hover:-translate-y-1.5 hover:border-blue-400/30 hover:shadow-[0_24px_80px_-30px_rgba(37,99,235,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* Futuristic background effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/[0.07] blur-[90px] transition duration-700 group-hover:bg-blue-500/[0.16]" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.045] via-transparent to-sky-500/[0.025]" />

      {/* Top accent line */}
      <div className="absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-5 sm:p-6">
        {/* Project header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111D30] shadow-inner">
              {project.logo_image ? (
                <img
                  src={project.logo_image}
                  alt={`${project.school_name} logo`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Building2
                    size={21}
                    className="text-blue-400"
                  />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                Academic project
              </p>

              <h3 className="truncate text-base font-semibold tracking-tight text-white transition-colors group-hover:text-blue-100">
                {project.title}
              </h3>

              <p className="mt-1 truncate text-xs text-slate-400">
                {project.school_name}
              </p>
            </div>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition-all duration-300 group-hover:border-blue-400/25 group-hover:bg-blue-500/10 group-hover:text-blue-300">
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>

        {/* Project metadata */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="inline-flex min-w-0 items-center gap-1.5 rounded-lg border border-blue-400/[0.12] bg-blue-500/[0.07] px-2.5 py-1.5 transition-colors group-hover:border-blue-400/25 group-hover:bg-blue-500/[0.12]">
            <CalendarDays
              size={13}
              className="shrink-0 text-sky-300"
            />

            <span className="truncate text-sm font-bold tracking-tight text-sky-300">
              {project.academic_year}
            </span>
          </div>

          <div className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-400/[0.12] bg-blue-500/[0.07] px-2.5 py-1.5 transition-colors group-hover:border-blue-400/25 group-hover:bg-blue-500/[0.12]">
            <Users
              size={13}
              className="shrink-0 text-sky-300"
            />

            <span className="text-sm font-bold tracking-tight text-sky-300">
              {studentCount.toLocaleString("en-GH")}
            </span>
          </div>
        </div>

        {/* Main financial panel */}
        <div className="relative mt-5 overflow-hidden rounded-[22px] border border-blue-400/[0.12] bg-[#080F1B]/80 p-4 sm:p-5">
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-sky-500/[0.06] blur-3xl" />

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Donut chart */}
            <div className="flex flex-col items-center">
              <BalanceDonut
                totalAmount={totalAmount}
                expenses={expenses}
                balance={balance}
              />

              <div className="mt-1 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  <span className="text-[9px] text-slate-500">
                    Expenses
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span className="text-[9px] text-slate-500">
                    Balance
                  </span>
                </div>
              </div>
            </div>

            {/* Financial values */}
            <div className="w-full min-w-0 space-y-4 sm:flex-1 sm:pl-3">
              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400/[0.09] text-sky-400">
                    <Wallet size={14} />
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Total amount
                  </span>
                </div>

                <p
                  className="truncate text-lg font-bold tracking-tight text-white"
                  title={formatMoney(totalAmount)}
                >
                  {formatMoney(totalAmount)}
                </p>
              </div>

              <div className="h-px w-full bg-white/[0.06]" />

              <div>
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/[0.09] text-blue-400">
                    <TrendingDown size={14} />
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Total expenses
                  </span>
                </div>

                <p
                  className="truncate text-lg font-bold tracking-tight text-white"
                  title={formatMoney(expenses)}
                >
                  {formatMoney(expenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Expense progress */}
          <div className="relative mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-500">
                Funds used
              </span>

              <span className="text-[10px] font-semibold text-blue-300">
                {expensePercentage.toFixed(1)}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 to-sky-400 transition-all duration-1000 ease-out"
                style={{
                  width: `${expensePercentage}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom project summary */}
      </div>
    </Link>
  );
}

export default function ProjectsCard() {
  const { projects } = useApp();

  const projectList = projects ?? [];

  return (
    <section className="w-full">
      {/* Section header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Layers3
              size={15}
              className="text-blue-400"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              Workspace
            </span>
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-white">
            Your Projects
          </h2>

          <p className="mt-1.5 text-xs text-slate-400">
            Your academic projects, students and finances.
          </p>
        </div>

        <Link
          href="/home/create"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-950/25 transition-all hover:bg-blue-500 active:scale-[0.97]"
        >
          <Plus size={15} />
          Add Project
        </Link>
      </div>

      {/* Responsive project grid */}
      {projectList.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {projectList.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A1220]/80 px-6 py-12 text-center">
          <div className="pointer-events-none absolute -top-20 h-48 w-48 rounded-full bg-blue-500/[0.08] blur-[80px]" />

          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08]">
            <GraduationCap
              size={27}
              className="text-blue-400"
            />
          </div>

          <h3 className="relative mt-5 text-base font-semibold text-white">
            Your workspace is waiting
          </h3>

          <p className="relative mt-2 max-w-sm text-xs leading-6 text-slate-400">
            Create your first academic project to organize students,
            monitor funds and manage school activities.
          </p>

          <Link
            href="/home/create"
            className="relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 active:scale-[0.98]"
          >
            <Plus size={15} />
            Create your first project
          </Link>
        </div>
      )}
    </section>
  );
}
