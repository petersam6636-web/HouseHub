"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Clock3,
  HandCoins,
  MessageCircle,
} from "lucide-react";

import Header from "@/components/Header";
import useApp from "@/lib/useApp";
import type { Transaction, TransactionState } from "@/types";

const money = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);

function getTransactionPresentation(state: TransactionState) {
  switch (state) {
    case "deposit":
      return {
        title: "Money deposited",
        Icon: ArrowDownLeft,
        accent: "emerald",
      };
    case "withdraw":
      return {
        title: "Money withdrawn",
        Icon: ArrowUpRight,
        accent: "indigo",
      };
    case "transfer":
      return {
        title: "Transfer",
        Icon: ArrowLeftRight,
        accent: "blue",
      };
    case "loan":
      return {
        title: "Loan",
        Icon: HandCoins,
        accent: "amber",
      };
    case "message":
      return {
        title: "Message",
        Icon: MessageCircle,
        accent: "blue",
      };
    default:
      return {
        title: "Transaction",
        Icon: Clock3,
        accent: "blue",
      };
  }
}

function formatTransactionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TransactionMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-[#05070D]">
          <Header />
          <main className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-slate-400">
            Loading transaction history...
          </main>
        </div>
      }
    >
      <TransactionMessagesContent />
    </Suspense>
  );
}

function TransactionMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const projectId = searchParams.get("projectId");
  const { projects } = useApp();

  const project = projects.find((item) => item.id === projectId);
  const student = project?.students.find(
    (item) => item.id === studentId
  );
  const transactions = useMemo(
    () =>
      [...(student?.transactions ?? [])].sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      ),
    [student?.transactions]
  );
  const backHref = studentId && projectId
    ? `/home/transactions?studentId=${studentId}&projectId=${projectId}`
    : "/home/transactions";

  if (!student || !project) {
    return (
      <div className="min-h-dvh bg-[#05070D] text-white">
        <Header />
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
          <section className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0B1220] p-7 text-center">
            <AlertCircle
              className="mx-auto mb-4 text-blue-400"
              size={34}
            />
            <h1 className="text-lg font-semibold">
              Transaction history unavailable
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The student or project could not be found. Return to
              the transaction page and try again.
            </p>
            <Link
              href={backHref}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <ArrowLeft size={16} />
              Back to transactions
            </Link>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#05070D] text-white">
      <Header />

      <main className="px-3 py-5 sm:px-5 sm:py-7">
        <div className="mx-auto max-w-3xl space-y-6">
          <header className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push(backHref)}
              aria-label="Back to student transactions"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0B1220] text-slate-300 transition hover:border-blue-500/30 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  Transaction history
                </h1>
                <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-2.5 py-1 text-[10px] font-medium text-blue-300">
                  {transactions.length} records
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-400">
                {student.full_name} <span className="text-slate-600">·</span>{" "}
                {project.title}
              </p>
            </div>

            <div className="hidden size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300 sm:flex">
              <Clock3 size={19} />
            </div>
          </header>

          {transactions.length === 0 ? (
            <section className="rounded-3xl border border-white/[0.08] bg-[#0B1220] px-5 py-14 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#080D18] text-slate-500">
                <MessageCircle size={24} />
              </div>
              <h2 className="font-semibold text-white">
                No transaction messages yet
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                The student&apos;s transaction activity will appear
                here when records are available.
              </p>
            </section>
          ) : (
            <section
              aria-label="All student transactions"
              className="space-y-3"
            >
              {transactions.map((transaction: Transaction) => {
                const presentation = getTransactionPresentation(
                  transaction.state
                );
                const Icon = presentation.Icon;
                const isDeposit = transaction.state === "deposit";
                const isWithdrawal =
                  transaction.state === "withdraw";
                const amount =
                  transaction.amount === null
                    ? null
                    : Number(transaction.amount);
                const status = transaction.status ?? "unknown";
                const statusClass =
                  status === "completed"
                    ? "border-emerald-400/15 bg-emerald-500/[0.07] text-emerald-300"
                    : status === "pending"
                      ? "border-amber-400/15 bg-amber-500/[0.07] text-amber-300"
                      : "border-white/[0.08] bg-white/[0.04] text-slate-400";
                const iconClass =
                  presentation.accent === "emerald"
                    ? "border-emerald-400/15 bg-emerald-500/[0.08] text-emerald-300"
                    : presentation.accent === "indigo"
                      ? "border-indigo-400/15 bg-indigo-500/[0.08] text-indigo-300"
                      : presentation.accent === "amber"
                        ? "border-amber-400/15 bg-amber-500/[0.08] text-amber-300"
                        : "border-blue-400/15 bg-blue-500/[0.08] text-blue-300";

                return (
                  <article
                    key={transaction.id}
                    className="rounded-3xl border border-white/[0.08] bg-[#0B1220] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] sm:p-5"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border ${iconClass}`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h2 className="text-sm font-semibold text-white">
                              {presentation.title}
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatTransactionDate(
                                transaction.created_at
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {amount !== null && (
                              <p
                                className={`text-sm font-bold ${
                                  isDeposit
                                    ? "text-emerald-300"
                                    : isWithdrawal
                                      ? "text-indigo-300"
                                      : "text-white"
                                }`}
                              >
                                {isDeposit
                                  ? "+"
                                  : isWithdrawal
                                    ? "-"
                                    : ""}
                                {money(Math.abs(amount))}
                              </p>
                            )}
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${statusClass}`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 max-w-[95%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-[#080D18] px-4 py-3">
                          <p className="break-words text-sm leading-6 text-slate-300">
                            {transaction.description?.trim() ||
                              "No additional details were provided."}
                          </p>
                        </div>

                        {transaction.reference && (
                          <p className="mt-3 break-all text-[11px] text-slate-600">
                            Reference: {transaction.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
