
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
  RefreshCw,
} from "lucide-react";

import { useApp } from "@/lib/useApp";
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

    let balance = 0;

    return [
      { balance: 0, label: "Start" },
      ...items.map((transaction) => {
        const amount = transactionAmount(transaction);

        balance +=
          transaction.state === "deposit" ? amount : -amount;

        return {
          balance,
          label: new Date(transaction.created_at).toLocaleDateString(
            "en-GH",
            { day: "numeric", month: "short" }
          ),
        };
      }),
    ];
  }, [transactions]);

  const values = chartData.map((item) => item.balance);
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = max - min || 1;

  const points = chartData.map((item, index) => {
    const x =
      chartData.length === 1
        ? 0
        : (index / (chartData.length - 1)) * 100;

    const y = 100 - ((item.balance - min) / range) * 100;

    return `${x},${y}`;
  });

  const latestBalance = values[values.length - 1] ?? 0;

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#080D18] p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Balance history
          </p>

          <p className="mt-1 text-xl font-bold text-white">
            {money(latestBalance)}
          </p>
        </div>

        <div className="rounded-xl border border-blue-400/15 bg-blue-500/10 p-2.5 text-blue-400">
          <TrendingUp size={19} />
        </div>
      </div>

      <div className="relative h-40 w-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
        >
          {[25, 50, 75].map((line) => (
            <line
              key={line}
              x1="0"
              x2="100"
              y1={line}
              y2={line}
              stroke="rgba(148,163,184,0.12)"
              strokeDasharray="2 3"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mt-3 flex justify-between text-xs text-slate-500">
        <span>{chartData[0]?.label}</span>
        <span>{chartData[chartData.length - 1]?.label}</span>
      </div>
    </div>
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
    <main className="min-h-screen bg-[#05070D] px-3 py-4 text-white sm:px-5 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-5">
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
        <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
          <div className="h-1 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-400/20 bg-blue-500/10">
                {student.profile_image ? (
                  <img
                    src={student.profile_image}
                    alt={student.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-blue-400">
                    {student.full_name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  {student.full_name}
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                  {student.index_number || "No index number"}
                </p>

                <p className="mt-1 truncate text-xs text-slate-500">
                  {project.name}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#080D18] px-5 py-4 sm:min-w-56">
              <p className="text-xs font-medium text-slate-400">
                Available balance
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-white">
                {money(balance)}
              </p>

              <p className="mt-1 text-xs text-blue-400">
                Based on completed transactions
              </p>
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

        {/* Deposit / Withdraw */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => openTransaction("deposit")}
            className="group flex items-center justify-between rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/15 to-[#0B1220] p-5 text-left transition hover:border-blue-400/50 hover:bg-blue-500/10"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Deposit money
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Add money to the student's balance
              </p>
            </div>

            <div className="rounded-xl bg-blue-600 p-3 text-white transition group-hover:scale-105">
              <ArrowDownLeft size={21} />
            </div>
          </button>

          <button
            onClick={() => openTransaction("withdraw")}
            className="group flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0B1220] p-5 text-left transition hover:border-blue-500/30"
          >
            <div>
              <p className="text-sm font-semibold text-white">
                Withdraw money
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Withdraw from the available balance
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#080D18] p-3 text-slate-300 transition group-hover:border-blue-500/30 group-hover:text-blue-400">
              <ArrowUpRight size={21} />
            </div>
          </button>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0B1220] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                <ArrowDownLeft size={19} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Total deposits
                </p>
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
                <p className="text-xs text-slate-400">
                  Total withdrawals
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {money(withdrawals)}
                </p>
              </div>
            </div>
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
                the student's password is verified.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
