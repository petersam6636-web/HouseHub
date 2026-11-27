"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  ShieldCheck,
  LockKeyhole,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import Header from "@/components/Header";
import useApp from "@/lib/useApp";
import { supabase } from "@/lib/supabase-client";
import type {
  Transaction,
  StudentDetailsWithRelations,
} from "@/types";

type TransactionAction = "deposit" | "withdraw";

const money = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);

const completed = (transaction: Transaction) =>
  transaction.status === "completed";

const transactionAmount = (transaction: Transaction) =>
  Number(transaction.amount ?? 0);

function getBalance(transactions: Transaction[]) {
  return transactions.reduce((balance, transaction) => {
    if (!completed(transaction)) return balance;

    const amount = transactionAmount(transaction);

    if (transaction.state === "deposit") return balance + amount;
    if (transaction.state === "withdraw") return balance - amount;

    return balance;
  }, 0);
}

function BalanceChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const chartData = useMemo(() => {
    const items = transactions
      .filter(
        (transaction) =>
          completed(transaction) &&
          (transaction.state === "deposit" ||
            transaction.state === "withdraw")
      )
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );

    let runningBalance = 0;

    return items.map((transaction) => {
      const amount = transactionAmount(transaction);
      runningBalance +=
        transaction.state === "deposit" ? amount : -amount;

      const date = new Date(transaction.created_at);

      return {
        balance: runningBalance,
        label: date.toLocaleDateString("en-GH", {
          day: "numeric",
          month: "short",
        }),
      };
    });
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              Balance history
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Completed deposits and withdrawals
            </p>
          </div>

          <div className="rounded-xl border border-blue-400/15 bg-blue-500/10 p-3 text-blue-400">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#080D18] text-slate-500">
            <Wallet size={24} />
          </div>
          <h3 className="font-semibold text-white">
            No balance history yet
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Completed deposits and withdrawals will appear here
            when this student has transaction activity.
          </p>
        </div>
      </section>
    );
  }

  const width = 760;
  const height = 300;
  const left = 86;
  const right = 24;
  const top = 24;
  const bottom = 42;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const values = chartData.map((item) => item.balance);
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(0, ...values);
  const rawRange = rawMax - rawMin || 1;
  const padding = rawRange * 0.12;
  const min = rawMin - padding;
  const max = rawMax + padding;
  const range = max - min || 1;

  const getX = (index: number) =>
    chartData.length === 1
      ? left + plotWidth / 2
      : left + (index / (chartData.length - 1)) * plotWidth;

  const getY = (value: number) =>
    top + ((max - value) / range) * plotHeight;

  const points = chartData.map((item, index) => ({
    x: getX(index),
    y: getY(item.balance),
    balance: item.balance,
    label: item.label,
  }));

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];

  const areaPath = [
    linePath,
    `L ${last.x} ${top + plotHeight}`,
    `L ${first.x} ${top + plotHeight}`,
    "Z",
  ].join(" ");

  const ticks = Array.from(
    { length: 5 },
    (_, index) => max - (index / 4) * range
  );

  const dateIndexes = Array.from(
    new Set([
      0,
      Math.floor((chartData.length - 1) / 2),
      chartData.length - 1,
    ])
  );

  const latestBalance = chartData[chartData.length - 1].balance;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
      <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-blue-500/15 bg-blue-500/10 text-blue-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Balance history
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Completed deposits and withdrawals
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-[#080D18] px-4 py-3 sm:min-w-48">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
            Current balance
          </p>
          <p className="mt-1 text-xl font-bold tracking-tight text-white">
            {money(latestBalance)}
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="Student balance history chart"
            className="h-auto w-full"
          >
            <defs>
              <linearGradient
                id="studentBalanceArea"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient
                id="studentBalanceLine"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>

            {ticks.map((value, index) => {
              const y = top + (index / 4) * plotHeight;
              return (
                <g key={index}>
                  <line
                    x1={left}
                    x2={width - right}
                    y1={y}
                    y2={y}
                    stroke="rgba(148,163,184,0.12)"
                    strokeDasharray="4 6"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x={left - 12}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748B"
                    fontSize="11"
                  >
                    {money(value)}
                  </text>
                </g>
              );
            })}

            <path d={areaPath} fill="url(#studentBalanceArea)" />

            <path
              d={linePath}
              fill="none"
              stroke="url(#studentBalanceLine)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />

            <circle
              cx={last.x}
              cy={last.y}
              r="7"
              fill="#0B1220"
              stroke="#60A5FA"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <circle cx={last.x} cy={last.y} r="2.5" fill="#BFDBFE" />

            {dateIndexes.map((index, position) => {
              const point = points[index];
              if (!point) return null;

              const anchor =
                position === 0
                  ? "start"
                  : position === dateIndexes.length - 1
                    ? "end"
                    : "middle";

              return (
                <text
                  key={`${index}-${position}`}
                  x={point.x}
                  y={height - 12}
                  textAnchor={anchor}
                  fill="#64748B"
                  fontSize="11"
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-5 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-500">
              Student balance
            </span>
          </div>
          <span className="text-[11px] text-slate-600">
            {chartData.length} transaction{chartData.length === 1 ? "" : "s"} plotted
          </span>
        </div>
      </div>
    </section>
  );
}

export default function StudentTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studentId = searchParams.get("studentId");
  const projectId = searchParams.get("projectId");

  const { projects, setProjects } = useApp();

  const project = projects.find(
    (item) => item.id === projectId
  );

  const student = project?.students?.find(
    (item) => item.id === studentId
  );

  const [action, setAction] =
    useState<TransactionAction | null>(null);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const transactions = useMemo(() => {
    return [...(student?.transactions ?? [])].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );
  }, [student?.transactions]);

  const balance = getBalance(transactions);

  const deposits = transactions
    .filter(
      (transaction) =>
        completed(transaction) &&
        transaction.state === "deposit"
    )
    .reduce(
      (total, transaction) =>
        total + transactionAmount(transaction),
      0
    );

  const withdrawals = transactions
    .filter(
      (transaction) =>
        completed(transaction) &&
        transaction.state === "withdraw"
    )
    .reduce(
      (total, transaction) =>
        total + transactionAmount(transaction),
      0
    );

  const openTransaction = (nextAction: TransactionAction) => {
    setAction(nextAction);
    setAmount("");
    setDescription("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  const closeTransaction = () => {
    if (loading) return;

    setAction(null);
    setPassword("");
    setError("");
  };

  const goBack = () => {
    router.push(
      `/home/students/view?id=${studentId}&projectId=${projectId}`
    );
  };

  const submitTransaction = async () => {
    if (!student || !project || !action) return;

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (action === "withdraw" && parsedAmount > balance) {
      setError("The student does not have enough balance.");
      return;
    }

    if (!password.trim()) {
      setError("Enter the student's password to authorize.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * SECURITY:
       * The Edge Function must verify the password securely,
       * validate the project/student relationship, and insert
       * the transaction server-side.
       *
       * Never compare student.password in this component.
       */

      const { data, error: functionError } =
        await supabase.functions.invoke(
          "student-transaction",
          {
            body: {
              studentId: student.id,
              projectId: project.id,
              action,
              amount: parsedAmount,
              description: description.trim(),
              password,
            },
          }
        );

      if (functionError) {
        throw new Error(
          functionError.message ||
            "Could not authorize the transaction."
        );
      }

      if (!data?.transaction) {
        throw new Error(
          data?.error || "Transaction was not completed."
        );
      }

      const newTransaction =
        data.transaction as Transaction;

      setProjects((previousProjects) =>
        previousProjects.map((item) => {
          if (item.id !== project.id) return item;

          return {
            ...item,
            students: item.students.map(
              (studentItem: StudentDetailsWithRelations) => {
                if (studentItem.id !== student.id) {
                  return studentItem;
                }

                return {
                  ...studentItem,
                  transactions: [
                    newTransaction,
                    ...studentItem.transactions,
                  ],
                };
              }
            ),
          };
        })
      );

      setSuccess(
        action === "deposit"
          ? "Deposit completed successfully."
          : "Withdrawal completed successfully."
      );

      setAction(null);
      setPassword("");
      setAmount("");
      setDescription("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!studentId || !projectId || !project || !student) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#05070D] px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0B1220] p-7 text-center">
          <AlertCircle
            className="mx-auto mb-4 text-blue-400"
            size={34}
          />

          <h2 className="text-lg font-semibold text-white">
            Student not found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            The student or project could not be found.
            Please return to the student dashboard.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-[#05070D] text-white">
      <Header />

      <main className="px-3 py-5 sm:px-5 sm:py-7">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <header className="flex items-center justify-between gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#0B1220] px-3 py-2.5 text-sm text-slate-300 transition hover:border-blue-500/30 hover:text-white"
            >
              <ArrowLeft size={17} />
              <span className="hidden sm:inline">
                Student details
              </span>
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-blue-500/15 bg-blue-500/[0.07] px-3 py-2">
              <ShieldCheck size={16} className="text-blue-400" />
              <span className="text-xs font-medium text-blue-300">
                Secure transactions
              </span>
            </div>
          </header>

          {/* Student profile */}
          <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B1220]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.16),transparent_55%)]" />
            <div className="absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/[0.06] blur-3xl" />

            <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:min-h-[230px] lg:flex-row lg:items-center lg:gap-8 lg:p-9">
              {/* Student identity */}
              <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
                <div className="size-20 shrink-0 overflow-hidden rounded-3xl border border-blue-400/20 bg-blue-500/10 sm:size-24 lg:size-28">
                  {student.profile_image ? (
                    <img
                      src={student.profile_image}
                      alt={student.full_name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-2xl font-bold text-blue-300 sm:text-3xl">
                      {student.full_name
                        .trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part.charAt(0).toUpperCase())
                        .join("")}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
                      Student account
                    </span>

                    {student.index_number && (
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] text-slate-400">
                        {student.index_number}
                      </span>
                    )}
                  </div>

                  <h1 className="break-words text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {student.full_name}
                  </h1>

                  <p className="mt-2 truncate text-sm text-slate-400">
                    {project.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Secure student transactions
                  </p>
                </div>
              </div>

              {/* Available balance */}
              <div className="flex min-h-[150px] w-full shrink-0 flex-col justify-center rounded-3xl border border-blue-400/15 bg-[#080D18]/90 px-5 py-6 sm:px-7 lg:min-h-[175px] lg:w-[340px] lg:px-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <Wallet size={17} className="text-blue-400" />
                  Available balance
                </div>

                <p className="mt-4 break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {money(balance)}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-400" />
                  <p className="text-xs text-slate-500">
                    Based on completed transactions
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-300">
              <CheckCircle2 size={18} />
              {success}
              <button
                onClick={() => setSuccess("")}
                className="ml-auto text-blue-300/70 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          )}

          {/* Summary */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0B1220] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <ArrowDownLeft size={19} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total deposits</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {money(deposits)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0B1220] p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-500/10 p-2.5 text-slate-300">
                  <ArrowUpRight size={19} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total withdrawals</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {money(withdrawals)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Secure transaction actions */}
          <section className="mx-auto w-full max-w-3xl">
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold text-white">
                Manage student funds
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose an action to securely manage this student&apos;s balance.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => openTransaction("deposit")}
                className="group flex min-h-[72px] flex-1 items-center justify-center gap-3 rounded-2xl border border-blue-500/25 bg-blue-600 px-6 py-4 text-center transition duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-950/30 active:translate-y-0"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white/15 text-white">
                  <ArrowDownLeft size={21} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold text-white">
                    Deposit money
                  </span>
                  <span className="mt-1 block text-xs text-blue-100/80">
                    Add funds to the balance
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => openTransaction("withdraw")}
                className="group flex min-h-[72px] flex-1 items-center justify-center gap-3 rounded-2xl border border-white/[0.09] bg-[#0B1220] px-6 py-4 text-center transition duration-200 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-[#101B2D] active:translate-y-0"
              >
                <span className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#080D18] text-blue-300 transition group-hover:border-blue-500/30">
                  <ArrowUpRight size={21} />
                </span>
                <span className="text-left">
                  <span className="block text-sm font-bold text-white">
                    Withdraw money
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    Withdraw from available funds
                  </span>
                </span>
              </button>
            </div>
          </section>

          {/* Chart */}
          <BalanceChart transactions={transactions} />

          {/* Transaction activity */}
          <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Transaction activity
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Every deposit and withdrawal recorded
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-[#080D18] p-2.5 text-slate-400">
                <Clock3 size={18} />
              </div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {transactions.filter(
                (transaction) =>
                  transaction.state === "deposit" ||
                  transaction.state === "withdraw"
              ).length === 0 ? (
                <div className="px-5 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#080D18] text-slate-500">
                    <Wallet size={24} />
                  </div>

                  <h3 className="font-semibold text-white">
                    No transactions yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm text-slate-400">
                    Deposits and withdrawals will appear here
                    with their dates and transaction details.
                  </p>
                </div>
              ) : (
                transactions
                  .filter(
                    (transaction) =>
                      transaction.state === "deposit" ||
                      transaction.state === "withdraw"
                  )
                  .map((transaction) => {
                    const isDeposit =
                      transaction.state === "deposit";

                    const isCompleted =
                      transaction.status === "completed";

                    return (
                      <article
                        key={transaction.id}
                        className="flex gap-3 p-4 transition hover:bg-white/[0.015] sm:gap-4 sm:p-5"
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isDeposit
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-slate-500/10 text-slate-300"
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft size={20} />
                          ) : (
                            <ArrowUpRight size={20} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-white">
                              {isDeposit
                                ? "Money deposited"
                                : "Money withdrawn"}
                            </p>

                            <p
                              className={`text-sm font-bold ${
                                isDeposit
                                  ? "text-blue-400"
                                  : "text-slate-200"
                              }`}
                            >
                              {isDeposit ? "+" : "-"}
                              {money(transactionAmount(transaction))}
                            </p>
                          </div>

                          <p className="mt-1 break-words text-sm text-slate-400">
                            {transaction.description ||
                              "No description provided"}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span>
                              {new Date(
                                transaction.created_at
                              ).toLocaleString("en-GH", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>

                            <span>•</span>

                            <span
                              className={
                                isCompleted
                                  ? "text-blue-400"
                                  : "text-slate-400"
                              }
                            >
                              {transaction.status || "Unknown status"}
                            </span>
                          </div>

                          {transaction.reference && (
                            <p className="mt-2 break-all text-[11px] text-slate-600">
                              Ref: {transaction.reference}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })
              )}
            </div>
          </section>
        </div>

        {/* Transaction authorization modal */}
        {action && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B1220] shadow-2xl shadow-black/50">
              <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {action === "deposit"
                      ? "Deposit money"
                      : "Withdraw money"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {student.full_name}
                  </p>
                </div>

                <button
                  onClick={closeTransaction}
                  disabled={loading}
                  className="rounded-xl border border-white/[0.07] bg-[#080D18] p-2 text-slate-400 transition hover:text-white disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-3">
                  <p className="text-xs text-slate-400">
                    Current available balance
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {money(balance)}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Amount (GHS)
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(event) =>
                      setAmount(event.target.value)
                    }
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-300">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    rows={3}
                    placeholder={
                      action === "deposit"
                        ? "Reason for this deposit..."
                        : "Reason for this withdrawal..."
                    }
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                  />
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-[#080D18] p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <LockKeyhole
                      size={17}
                      className="text-blue-400"
                    />

                    <p className="text-sm font-semibold text-white">
                      Student authorization
                    </p>
                  </div>

                  <p className="mb-3 text-xs leading-5 text-slate-400">
                    Ask the student to enter their password
                    to authorize this transaction.
                  </p>

                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Student password"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0B1220] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] p-3 text-xs text-red-300">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={closeTransaction}
                    disabled={loading}
                    className="flex-1 rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:text-white disabled:opacity-40"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitTransaction}
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Processing
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} />
                        Authorize
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-[11px] leading-5 text-slate-500">
                  The transaction will only be recorded after
                  the student&apos;s password is verified.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}