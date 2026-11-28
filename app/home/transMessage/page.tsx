"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  HandCoins,
  Loader2,
  MessageCircle,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";

import Header from "@/components/Header";
import { fetchProjectForUser } from "@/lib/projectService";
import { supabase } from "@/lib/supabase-client";
import useApp from "@/lib/useApp";
import type { Transaction, TransactionState } from "@/types";

type DeleteConfirmation =
  | { kind: "single"; transactionId: string }
  | { kind: "all" };

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
  const { projects, setProjects, authenticatedId } = useApp();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] =
    useState<string | null>(null);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [notice, setNotice] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

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

  function setProjectTransactions(nextTransactions: Transaction[]) {
    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject.id !== project.id
          ? currentProject
          : {
              ...currentProject,
              students: currentProject.students.map(
                (currentStudent) =>
                  currentStudent.id !== student.id
                    ? currentStudent
                    : {
                        ...currentStudent,
                        transactions: nextTransactions,
                      }
              ),
            }
      )
    );
  }

  async function refreshProject() {
    if (!authenticatedId) {
      throw new Error("Sign in again before deleting transactions.");
    }

    const refreshedProject = await fetchProjectForUser(
      authenticatedId,
      project.id
    );

    if (!refreshedProject) {
      throw new Error("The project could not be refreshed.");
    }

    setProjects((currentProjects) =>
      currentProjects.map((currentProject) =>
        currentProject.id === refreshedProject.id
          ? refreshedProject
          : currentProject
      )
    );
  }

  async function deleteTransaction(transactionId: string) {
    if (deletingTransactionId || isDeletingAll) return;

    setDeletingTransactionId(transactionId);
    setOpenMenuId(null);
    setNotice(null);
    let deleted = false;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId)
        .eq("student_id", student.id)
        .select("id");

      if (error) throw error;
      if (!data?.length) {
        throw new Error("The transaction could not be deleted.");
      }

      deleted = true;
      await refreshProject();
      setNotice({
        kind: "success",
        message: "Transaction deleted and project refreshed.",
      });
    } catch (error) {
      console.error("Unable to delete and refresh transaction data.", error);

      if (deleted) {
        setProjectTransactions(
          (student.transactions ?? []).filter(
            (transaction) => transaction.id !== transactionId
          )
        );
        setNotice({
          kind: "success",
          message:
            "Transaction deleted. The project refresh failed, so the history was updated locally.",
        });
      } else {
        setNotice({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "The transaction could not be deleted.",
        });
      }
    } finally {
      setDeletingTransactionId(null);
    }
  }

  async function deleteAllTransactions() {
    if (deletingTransactionId || isDeletingAll) return;

    setIsDeletingAll(true);
    setOpenMenuId(null);
    setNotice(null);
    let deleted = false;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .delete()
        .eq("student_id", student.id)
        .select("id");

      if (error) throw error;
      if (!data?.length) {
        throw new Error("No transactions were deleted.");
      }

      deleted = true;
      await refreshProject();
      setNotice({
        kind: "success",
        message: `Deleted ${data.length} transactions and refreshed the project.`,
      });
    } catch (error) {
      console.error("Unable to delete and refresh all transaction data.", error);

      if (deleted) {
        setProjectTransactions([]);
        setNotice({
          kind: "success",
          message:
            "Transactions deleted. The project refresh failed, so the history was cleared locally.",
        });
      } else {
        setNotice({
          kind: "error",
          message:
            error instanceof Error
              ? error.message
              : "The transactions could not be deleted.",
        });
      }
    } finally {
      setIsDeletingAll(false);
    }
  }

  async function confirmDelete() {
    if (!deleteConfirmation || isConfirmingDelete) return;

    setIsConfirmingDelete(true);

    try {
      if (deleteConfirmation.kind === "all") {
        await deleteAllTransactions();
      } else {
        await deleteTransaction(deleteConfirmation.transactionId);
      }
    } finally {
      setDeleteConfirmation(null);
      setIsConfirmingDelete(false);
    }
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

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {transactions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmation({ kind: "all" });
                    setNotice(null);
                  }}
                  disabled={
                    Boolean(deletingTransactionId) || isDeletingAll
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-400/15 bg-red-500/[0.07] px-3 py-2 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Delete all transactions for this student"
                >
                  {isDeletingAll ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  <span>{isDeletingAll ? "Deleting" : "Delete all"}</span>
                </button>
              )}
              <div className="hidden size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300 sm:flex">
                <Clock3 size={19} />
              </div>
            </div>
          </header>

          {notice && (
            <div
              role={notice.kind === "error" ? "alert" : "status"}
              aria-live="polite"
              className={`flex items-start gap-3 rounded-2xl border p-4 text-sm ${
                notice.kind === "error"
                  ? "border-red-400/20 bg-red-500/[0.07] text-red-300"
                  : "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300"
              }`}
            >
              {notice.kind === "error" ? (
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              )}
              <p>{notice.message}</p>
            </div>
          )}

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
                            <div className="flex items-center gap-2">
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
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenuId((openId) =>
                                      openId === transaction.id
                                        ? null
                                        : transaction.id
                                    )
                                  }
                                  disabled={
                                    Boolean(deletingTransactionId) ||
                                    isDeletingAll
                                  }
                                  aria-label="Transaction actions"
                                  aria-expanded={
                                    openMenuId === transaction.id
                                  }
                                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {openMenuId === transaction.id && (
                                  <div className="absolute right-0 top-full z-30 mt-1 min-w-36 rounded-xl border border-white/[0.1] bg-[#101827] p-1.5 shadow-xl shadow-black/40">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        {
                                          setOpenMenuId(null);
                                          setDeleteConfirmation({
                                            kind: "single",
                                            transactionId: transaction.id,
                                          });
                                          setNotice(null);
                                        }
                                      }
                                      disabled={
                                        Boolean(
                                          deletingTransactionId
                                        ) || isDeletingAll
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                                    >
                                      {deletingTransactionId ===
                                      transaction.id ? (
                                        <Loader2
                                          size={14}
                                          className="animate-spin"
                                        />
                                      ) : (
                                        <Trash2 size={14} />
                                      )}
                                      {deletingTransactionId ===
                                      transaction.id
                                        ? "Deleting"
                                        : "Delete"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
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

      {deleteConfirmation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/75 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isConfirmingDelete
            ) {
              setDeleteConfirmation(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-transactions-title"
            className="w-full max-w-md rounded-3xl border border-blue-400/20 bg-[#0B1220] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.65)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
                  <Trash2 size={19} />
                </div>
                <div>
                  <h2
                    id="delete-transactions-title"
                    className="text-base font-semibold"
                  >
                    {deleteConfirmation.kind === "all"
                      ? "Delete all transactions?"
                      : "Delete this transaction?"}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    {deleteConfirmation.kind === "all"
                      ? `This will remove all ${transactions.length} transaction records for ${student.full_name}. The student's balance will remain unchanged.`
                      : `This will remove this transaction record for ${student.full_name}. The student's balance will remain unchanged.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close delete confirmation"
                disabled={isConfirmingDelete}
                onClick={() => setDeleteConfirmation(null)}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isConfirmingDelete}
                onClick={() => setDeleteConfirmation(null)}
                className="h-10 rounded-xl border border-blue-400/20 bg-blue-500/[0.08] px-4 text-sm font-medium text-blue-200 transition hover:bg-blue-500/[0.14] disabled:opacity-50"
              >
                No, keep it
              </button>
              <button
                type="button"
                disabled={isConfirmingDelete}
                onClick={() => void confirmDelete()}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConfirmingDelete && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                {isConfirmingDelete ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
