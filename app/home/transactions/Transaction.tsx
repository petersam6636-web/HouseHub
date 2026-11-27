"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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

ChartJS.register(ArcElement, Tooltip, Legend);

type TransactionAction = "deposit" | "withdraw";

type StudentTransactionApiRequest = {
  studentId: string;
  projectId: string;
  action: TransactionAction;
  password: string;
  verifyOnly: boolean;
  amount?: number;
  description?: string;
};

type StudentTransactionApiResponse = {
  verified?: boolean;
  transaction?: Transaction;
  error?: string;
};

async function requestStudentTransaction(
  body: StudentTransactionApiRequest
): Promise<StudentTransactionApiResponse> {
  const response = await fetch("/api/student-transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result =
    (await response.json()) as StudentTransactionApiResponse;

  if (!response.ok) {
    throw new Error(
      result.error || "Could not process the transaction."
    );
  }

  return result;
}

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
  deposits,
  withdrawals,
  balance,
}: {
  deposits: number;
  withdrawals: number;
  balance: number;
}) {
  const chartData = {
    labels: ["Deposits", "Withdrawals"],
    datasets: [
      {
        data: [deposits, withdrawals],
        backgroundColor: [
          "rgba(52, 211, 153, 0.82)",
          "rgba(129, 140, 248, 0.82)",
        ],
        borderColor: ["#34D399", "#818CF8"],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94A3B8",
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#0B1424",
        borderColor: "rgba(96, 165, 250, 0.18)",
        borderWidth: 1,
        titleColor: "#FFFFFF",
        bodyColor: "#CBD5E1",
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) =>
            `${context.label}: ${money(Number(context.raw))}`,
        },
      },
    },
  };

  if (deposits === 0 && withdrawals === 0) {
    return (
      <section className="min-w-0 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
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

  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
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
            {money(balance)}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mx-auto h-64 w-full max-w-sm">
          <Doughnut
            data={chartData}
            options={chartOptions}
            aria-label="Completed deposits and withdrawals"
          />
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

  const [transactionStep, setTransactionStep] = useState<
    "password" | "details" | "verification"
  >("password");

  const [verificationSeconds, setVerificationSeconds] =
    useState(6);

  const verificationAttempt = useRef(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [transactionSuccess, setTransactionSuccess] =
    useState<{
      action: TransactionAction;
      amount: number;
    } | null>(null);

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
    verificationAttempt.current += 1;

    setAction(nextAction);
    setTransactionStep("password");
    setAmount("");
    setDescription("");
    setPassword("");
    setVerificationSeconds(6);
    setError("");
    setSuccess("");
    setTransactionSuccess(null);
  };

  const closeTransaction = () => {
    if (loading) return;

    verificationAttempt.current += 1;

    setAction(null);
    setTransactionStep("password");
    setPassword("");
    setError("");
  };

  const cancelPasswordVerification = () => {
    verificationAttempt.current += 1;

    setTransactionStep("password");
    setVerificationSeconds(6);
    setError("");
  };

  useEffect(() => {
    if (transactionStep !== "verification") return;

    const interval = window.setInterval(() => {
      setVerificationSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [transactionStep]);

  useEffect(() => {
    if (
      transactionStep !== "verification" ||
      verificationSeconds !== 0
    ) {
      return;
    }

    verificationAttempt.current += 1;

    setTransactionStep("password");
    setError(
      "Password verification timed out. Please try again."
    );
  }, [transactionStep, verificationSeconds]);

  useEffect(() => {
    if (!transactionSuccess) return;

    const timeout = window.setTimeout(() => {
      setTransactionSuccess(null);
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [transactionSuccess]);

  const verifyStudentPassword = async () => {
    if (!student || !project || !action) return;

    if (!password.trim()) {
      setError("Enter the student's password to continue.");
      return;
    }

    const attempt = ++verificationAttempt.current;

    setError("");
    setVerificationSeconds(6);
    setTransactionStep("verification");

    try {
      const data = await requestStudentTransaction({
        studentId: student.id,
        projectId: project.id,
        action,
        password,
        verifyOnly: true,
      });

      if (attempt !== verificationAttempt.current) return;

      if (data?.verified !== true) {
        throw new Error("This password is incorrect.");
      }

      setTransactionStep("details");
      setVerificationSeconds(6);
      setError("");
    } catch (err) {
      if (attempt !== verificationAttempt.current) return;

      setTransactionStep("password");
      setVerificationSeconds(6);

      setError(
        err instanceof Error
          ? err.message
          : "This password is incorrect."
      );
    }
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
      const data = await requestStudentTransaction({
        studentId: student.id,
        projectId: project.id,
        action,
        amount: parsedAmount,
        description: description.trim(),
        password,
        verifyOnly: false,
      });

      if (!data?.transaction) {
        throw new Error("Transaction was not completed.");
      }

      const newTransaction = data.transaction;

      // Use the server-returned transaction immediately,
      // then refresh the project and complete transaction history.
      let refreshedProject: Record<string, unknown> = {};

      let refreshedTransactions: Transaction[] = [
        newTransaction,
        ...transactions.filter(
          (transaction) => transaction.id !== newTransaction.id
        ),
      ];

      try {
        const [projectResult, transactionsResult] =
          await Promise.all([
            supabase
              .from("projects")
              .select("*")
              .eq("id", project.id)
              .single(),

            supabase
              .from("transactions")
              .select("*")
              .eq("student_id", student.id)
              .order("created_at", { ascending: false }),
          ]);

        if (!projectResult.error && projectResult.data) {
          refreshedProject =
            projectResult.data as Record<string, unknown>;
        }

        if (
          !transactionsResult.error &&
          transactionsResult.data
        ) {
          const databaseTransactions =
            transactionsResult.data as Transaction[];

          refreshedTransactions =
            databaseTransactions.some(
              (transaction) =>
                transaction.id === newTransaction.id
            )
              ? databaseTransactions
              : [newTransaction, ...databaseTransactions];
        }
      } catch (refreshError) {
        /*
         * The transaction has already been saved by the API.
         * Keep it in the UI if refresh fails
         * instead of inviting the housemaster to submit again.
         */
        console.error(
          "Could not refresh transaction data:",
          refreshError
        );
      }

      refreshedTransactions = [
        ...refreshedTransactions,
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );

      setProjects((previousProjects) =>
        previousProjects.map((item) => {
          if (item.id !== project.id) return item;

          return {
            ...item,
            ...refreshedProject,

            students: item.students.map(
              (
                studentItem: StudentDetailsWithRelations
              ) => {
                if (studentItem.id !== student.id) {
                  return studentItem;
                }

                return {
                  ...studentItem,
                  transactions: refreshedTransactions,
                };
              }
            ),
          };
        })
      );

      setTransactionSuccess({
        action,
        amount: parsedAmount,
      });

      setSuccess("");
      setAction(null);
      setTransactionStep("password");
      setPassword("");
      setAmount("");
      setDescription("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      if (
        /password|authoriz|verify|credential/i.test(message)
      ) {
        setTransactionStep("password");
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (
    !studentId ||
    !projectId ||
    !project ||
    !student
  ) {
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
        <div className="mx-auto max-w-6xl space-y-6">
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
              <ShieldCheck
                size={16}
                className="text-blue-400"
              />

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
                        .map((part) =>
                          part.charAt(0).toUpperCase()
                        )
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
                  <Wallet
                    size={17}
                    className="text-blue-400"
                  />

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

          {/* Secure transaction actions */}
          <section className="mx-auto w-full max-w-sm">
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => openTransaction("deposit")}
                className="group flex w-28 flex-col items-center gap-2 rounded-2xl py-3 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/[0.12] bg-emerald-500/[0.08] text-emerald-300 transition-colors group-hover:bg-emerald-500/[0.14]">
                  <ArrowDownLeft size={20} />
                </span>

                <span className="text-[10px] font-medium text-slate-400 group-hover:text-emerald-300">
                  Deposit money
                </span>
              </button>

              <button
                type="button"
                onClick={() => openTransaction("withdraw")}
                className="group flex w-28 flex-col items-center gap-2 rounded-2xl py-3 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/[0.12] bg-indigo-500/[0.08] text-indigo-300 transition-colors group-hover:bg-indigo-500/[0.14]">
                  <ArrowUpRight size={20} />
                </span>

                <span className="text-[10px] font-medium text-slate-400 group-hover:text-indigo-300">
                  Withdraw money
                </span>
              </button>
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
            <div className="flex min-h-[112px] items-center rounded-2xl border border-white/[0.07] bg-[#0B1220] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <ArrowDownLeft size={19} />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Total deposits
                  </p>

                  <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {money(deposits)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-[112px] items-center rounded-2xl border border-white/[0.07] bg-[#0B1220] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-500/10 p-2.5 text-slate-300">
                  <ArrowUpRight size={19} />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Total withdrawals
                  </p>

                  <p className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    {money(withdrawals)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <BalanceChart
              deposits={deposits}
              withdrawals={withdrawals}
              balance={balance}
            />

            {/* Transaction activity */}
            <section className="min-w-0 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B1220]">
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
                                {money(
                                  transactionAmount(transaction)
                                )}
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
                                {transaction.status ||
                                  "Unknown status"}
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
        </div>

        {/* Transaction authorization modal */}
        {action && transactionStep !== "verification" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
            <div
              className="w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B1220] shadow-2xl shadow-black/50"
              style={{
                animation: "transactionModalIn 200ms ease-out both",
              }}
            >
              <style>{`
                @keyframes transactionModalIn {
                  from { opacity: 0; transform: scale(0); }
                  to { opacity: 1; transform: scale(1); }
                }
              `}</style>

              <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {transactionStep === "password"
                      ? "Student authorization"
                      : action === "deposit"
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

              {transactionStep === "password" ? (
                <div
                  key="password-step"
                  className="space-y-4 p-5"
                  style={{
                    animation: "transactionModalIn 200ms ease-out both",
                  }}
                >
                  <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-3">
                    <p className="text-xs text-slate-400">
                      {action === "deposit"
                        ? "The housemaster is requesting to deposit money into your student account."
                        : "The housemaster is requesting to withdraw money from your student account."}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-blue-300">
                      Please enter your student password yourself
                      before continuing. This lets you see what
                      the password is being used to authorize.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-slate-300">
                      Student password
                    </label>

                    <input
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          void verifyStudentPassword();
                        }
                      }}
                      placeholder="Enter your student password"
                      className="w-full rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500/50"
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
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() =>
                        void verifyStudentPassword()
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      <ShieldCheck size={16} />
                      Continue
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key="details-step"
                  className="space-y-4 p-5"
                  style={{
                    animation: "transactionModalIn 200ms ease-out both",
                  }}
                >
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
                      onClick={() => {
                        setTransactionStep("password");
                        setError("");
                      }}
                      disabled={loading}
                      className="flex-1 rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:text-white disabled:opacity-40"
                    >
                      Back
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

                          {action === "deposit"
                            ? "Complete deposit"
                            : "Complete withdrawal"}
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-[11px] leading-5 text-slate-500">
                    The transaction is recorded only after
                    the amount and description are submitted.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction success popup - closes after 1.6 seconds */}
        {transactionSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
            <div
              className="w-full max-w-sm rounded-3xl border border-blue-500/20 bg-[#0B1220] p-6 text-center shadow-2xl shadow-black/50"
              style={{
                animation: "transactionModalIn 200ms ease-out both",
              }}
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <CheckCircle2 size={27} />
              </div>

              <h3 className="text-base font-bold text-white">
                {transactionSuccess.action === "deposit"
                  ? "Deposit successful"
                  : "Withdrawal successful"}
              </h3>

              <p className="mt-2 text-2xl font-bold text-white">
                {money(transactionSuccess.amount)}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {transactionSuccess.action === "deposit"
                  ? "The amount has been added to the student's balance."
                  : "The amount has been deducted from the student's balance."}
              </p>
            </div>
          </div>
        )}

        {/* Password verification popup */}
        {action && transactionStep === "verification" && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-5">
            <div
              className="w-full max-w-sm rounded-3xl border border-white/[0.1] bg-[#0B1220] p-6 text-center shadow-2xl shadow-black/50"
              style={{
                animation: "transactionModalIn 200ms ease-out both",
              }}
            >
              <style>{`
                @keyframes transactionModalIn {
                  from { opacity: 0; transform: scale(0); }
                  to { opacity: 1; transform: scale(1); }
                }
              `}</style>

              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Loader2
                  size={25}
                  className="animate-spin"
                />
              </div>

              <h3 className="text-base font-bold text-white">
                Verifying student password
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Please wait while we securely verify the password.
              </p>

              <p className="mt-4 text-xs font-medium text-blue-300">
                {verificationSeconds} seconds remaining
              </p>

              <button
                onClick={cancelPasswordVerification}
                className="mt-5 w-full rounded-xl border border-white/[0.08] bg-[#080D18] px-4 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
              >
                Cancel verification
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}