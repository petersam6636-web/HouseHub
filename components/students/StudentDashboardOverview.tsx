
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  MessageCircle,
  Package,
  Wallet,
  X,
} from "lucide-react";

import type {
  StudentDetailsWithRelations,
  Transaction,
} from "@/types";

type StudentDashboardOverviewProps = {
  student: StudentDetailsWithRelations;
};

type MetricType =
  | "balance"
  | "withdrawals"
  | "messages"
  | "fees";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  amount?: number;
  icon: React.ReactNode;
  color: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(value);

const formatDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTransactionLabel = (state: Transaction["state"]) => {
  switch (state) {
    case "deposit":
      return "Deposit";
    case "withdraw":
      return "Withdrawal";
    case "loan":
      return "Loan";
    case "transfer":
      return "Transfer";
    case "message":
      return "Message";
    default:
      return "Transaction";
  }
};

function MetricCard({
  title,
  value,
  icon,
  iconColor,
  iconBackground,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBackground: string;
}) {
  return (
    <div className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 sm:text-sm">
            {title}
          </p>

          <p className="mt-2 break-words text-base font-bold tracking-tight text-white sm:text-2xl">
            {value}
          </p>
        </div>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  icon,
  children,
  action,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-800/80 bg-[#0b1220] p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            {icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-white">{title}</h3>

            {description && (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function DetailRow({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 py-3 last:border-b-0">
      <span className="text-sm text-slate-400">{label}</span>

      <span
        className={`break-words text-right text-sm font-medium text-slate-200 ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

function TransactionRow({
  transaction,
}: {
  transaction: Transaction;
}) {
  const isDeposit = transaction.state === "deposit";
  const isWithdrawal = transaction.state === "withdraw";

  const amountColor = isDeposit
    ? "text-emerald-400"
    : isWithdrawal
      ? "text-blue-400"
      : "text-slate-200";

  const Icon = isDeposit
    ? ArrowDownLeft
    : isWithdrawal
      ? ArrowUpRight
      : CreditCard;

  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/70 text-slate-300">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-200">
          {getTransactionLabel(transaction.state)}
        </p>

        <p className="mt-1 truncate text-xs text-slate-500">
          {transaction.description || "No description"}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {formatDateTime(transaction.created_at)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className={`text-sm font-semibold ${amountColor}`}>
          {formatCurrency(transaction.amount ?? 0)}
        </p>

        <p className="mt-1 text-[11px] capitalize text-slate-500">
          {transaction.status || "Unknown"}
        </p>
      </div>
    </div>
  );
}

function MetricDetailsModal({
  type,
  student,
  balance,
  totalDeposits,
  totalWithdrawals,
  completedTransactions,
  onClose,
}: {
  type: MetricType;
  student: StudentDetailsWithRelations;
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  completedTransactions: Transaction[];
  onClose: () => void;
}) {
  const title =
    type === "balance"
      ? "Student balance"
      : type === "withdrawals"
        ? "Withdrawal history"
        : type === "messages"
          ? "Unread messages"
          : "Assigned fees";

  const transactionsForModal =
    type === "balance"
      ? completedTransactions.filter(
          (transaction) =>
            transaction.state === "deposit" ||
            transaction.state === "withdraw",
        )
      : completedTransactions.filter(
          (transaction) => transaction.state === "withdraw",
        );

  const unreadMessages = student.messages.filter(
    (message) =>
      !message.is_read &&
      message.sender_role === "house_master",
  );

  const totalFees = student.fees.reduce(
    (total, fee) => total + Number(fee.amount || 0),
    0,
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-metric-modal-title"
        className="flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1220] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-5">
          <div>
            <h2
              id="student-metric-modal-title"
              className="font-semibold text-white"
            >
              {title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {student.full_name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {type === "balance" && (
            <>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-slate-400">
                  Current calculated balance
                </p>

                <p className="mt-2 break-words text-3xl font-bold text-white">
                  {formatCurrency(balance)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Completed deposits minus completed withdrawals
                </p>
              </div>

              <div className="mt-4">
                <DetailRow
                  label="Completed deposits"
                  value={formatCurrency(totalDeposits)}
                  valueClassName="text-emerald-400"
                />

                <DetailRow
                  label="Completed withdrawals"
                  value={formatCurrency(totalWithdrawals)}
                  valueClassName="text-blue-400"
                />

                <DetailRow
                  label="Current balance"
                  value={formatCurrency(balance)}
                  valueClassName="font-bold text-white"
                />
              </div>

              <h3 className="mt-5 text-sm font-semibold text-white">
                Balance transactions
              </h3>

              <div className="mt-2 divide-y divide-slate-800/70">
                {transactionsForModal.length > 0 ? (
                  transactionsForModal.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <p className="py-6 text-center text-sm text-slate-500">
                    No completed balance transactions yet.
                  </p>
                )}
              </div>
            </>
          )}

          {type === "withdrawals" && (
            <>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-slate-400">
                  Total completed withdrawals
                </p>

                <p className="mt-2 break-words text-3xl font-bold text-white">
                  {formatCurrency(totalWithdrawals)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {transactionsForModal.length} completed withdrawal
                  {transactionsForModal.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="mt-4 divide-y divide-slate-800/70">
                {transactionsForModal.length > 0 ? (
                  transactionsForModal.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No completed withdrawals recorded.
                  </p>
                )}
              </div>
            </>
          )}

          {type === "messages" && (
            <div className="divide-y divide-slate-800/70">
              {unreadMessages.length > 0 ? (
                unreadMessages.map((message) => (
                  <div key={message.id} className="py-4 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">
                        {message.sender_name}
                      </p>

                      <span className="shrink-0 text-xs text-slate-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-400">
                      {message.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-sm text-slate-500">
                  No unread messages.
                </p>
              )}
            </div>
          )}

          {type === "fees" && (
            <>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs text-slate-400">
                  Total assigned fees
                </p>

                <p className="mt-2 break-words text-3xl font-bold text-white">
                  {formatCurrency(totalFees)}
                </p>
              </div>

              <div className="mt-4 divide-y divide-slate-800/70">
                {student.fees.length > 0 ? (
                  student.fees.map((fee) => (
                    <div key={fee.id} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200">
                            {fee.fee_name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {fee.academic_year} · {fee.semester}
                          </p>

                          {fee.due_date && (
                            <p className="mt-1 text-xs text-slate-500">
                              Due {formatDate(fee.due_date)}
                            </p>
                          )}
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-white">
                          {formatCurrency(Number(fee.amount || 0))}
                        </p>
                      </div>

                      {fee.description && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {fee.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No fees have been assigned.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardOverview({
  student,
}: StudentDashboardOverviewProps) {
  const [activeMetric, setActiveMetric] =
    useState<MetricType | null>(null);

  const transactions = student.transactions ?? [];
  const messages = student.messages ?? [];
  const fees = student.fees ?? [];
  const products = student.products ?? [];
  const feedback = student.feedback ?? [];
  const semesterJobs = student.semester_jobs ?? [];
  const partTimeJobs = student.part_time_jobs ?? [];

  const completedTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === "completed",
      ),
    [transactions],
  );

  const totalDeposits = useMemo(
    () =>
      completedTransactions
        .filter((transaction) => transaction.state === "deposit")
        .reduce(
          (total, transaction) =>
            total + Math.abs(Number(transaction.amount ?? 0)),
          0,
        ),
    [completedTransactions],
  );

  const totalWithdrawals = useMemo(
    () =>
      completedTransactions
        .filter((transaction) => transaction.state === "withdraw")
        .reduce(
          (total, transaction) =>
            total + Math.abs(Number(transaction.amount ?? 0)),
          0,
        ),
    [completedTransactions],
  );

  const currentBalance = totalDeposits - totalWithdrawals;

  const unreadMessages = messages.filter(
    (message) =>
      !message.is_read &&
      message.sender_role === "house_master",
  );

  const totalFees = fees.reduce(
    (total, fee) => total + Number(fee.amount || 0),
    0,
  );

  const totalProductValue = products.reduce(
    (total, product) =>
      total +
      Number(product.price || 0) *
        Number(product.quantity || 0),
    0,
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending",
  );

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const transactionItems: ActivityItem[] = transactions.map(
      (transaction) => {
        const isDeposit = transaction.state === "deposit";
        const isWithdrawal = transaction.state === "withdraw";

        return {
          id: `transaction-${transaction.id}`,
          title: getTransactionLabel(transaction.state),
          description:
            transaction.description ||
            `${transaction.status || "Unknown"} transaction`,
          date: transaction.created_at,
          amount: transaction.amount ?? undefined,
          icon: isDeposit ? (
            <ArrowDownLeft className="size-4" />
          ) : isWithdrawal ? (
            <ArrowUpRight className="size-4" />
          ) : (
            <CreditCard className="size-4" />
          ),
          color: isDeposit
            ? "text-emerald-400 bg-emerald-500/10"
            : isWithdrawal
              ? "text-blue-400 bg-blue-500/10"
              : "text-slate-400 bg-slate-800",
        };
      },
    );

    const messageItems: ActivityItem[] = messages.map((message) => ({
      id: `message-${message.id}`,
      title: "Message",
      description: message.message,
      date: message.created_at,
      icon: <MessageCircle className="size-4" />,
      color: "text-blue-400 bg-blue-500/10",
    }));

    const productItems: ActivityItem[] = products.map((product) => ({
      id: `product-${product.id}`,
      title: "Product recorded",
      description: product.product_info,
      date: product.created_at,
      amount:
        Number(product.price || 0) *
        Number(product.quantity || 0),
      icon: <Package className="size-4" />,
      color: "text-slate-300 bg-slate-800",
    }));

    const feeItems: ActivityItem[] = fees.map((fee) => ({
      id: `fee-${fee.id}`,
      title: "Fee assigned",
      description: fee.fee_name,
      date: fee.created_at,
      amount: fee.amount,
      icon: <FileText className="size-4" />,
      color: "text-blue-400 bg-blue-500/10",
    }));

    const feedbackItems: ActivityItem[] = feedback.map((item) => ({
      id: `feedback-${item.id}`,
      title: "Feedback recorded",
      description: "Student feedback",
      date: item.created_at,
      icon: <MessageCircle className="size-4" />,
      color: "text-slate-300 bg-slate-800",
    }));

    return [
      ...transactionItems,
      ...messageItems,
      ...productItems,
      ...feeItems,
      ...feedbackItems,
    ]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      )
      .slice(0, 6);
  }, [transactions, messages, products, fees, feedback]);

  const overdueFees = fees.filter((fee) => {
    if (!fee.due_date) return false;

    const dueDate = new Date(fee.due_date);

    return (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate.getTime() < Date.now()
    );
  });

  return (
    <div className="space-y-5">
      {/* Four student metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        <MetricCard
          title="Current Balance"
          value={formatCurrency(currentBalance)}
          icon={<Wallet className="size-5" />}
          iconColor="text-blue-400"
          iconBackground="bg-blue-500/10"
        />

        <MetricCard
          title="Total Withdrawals"
          value={formatCurrency(totalWithdrawals)}
          icon={<ArrowUpRight className="size-5" />}
          iconColor="text-blue-400"
          iconBackground="bg-blue-500/10"
        />

        <MetricCard
          title="Unread Messages"
          value={String(unreadMessages.length)}
          icon={<MessageCircle className="size-5" />}
          iconColor="text-sky-400"
          iconBackground="bg-sky-500/10"
        />

        <MetricCard
          title="Fees Assigned"
          value={formatCurrency(totalFees)}
          icon={<FileText className="size-5" />}
          iconColor="text-indigo-400"
          iconBackground="bg-indigo-500/10"
        />
      </div>

      {/* Alerts */}
      {(pendingTransactions.length > 0 ||
        unreadMessages.length > 0 ||
        overdueFees.length > 0) && (
        <SectionCard
          title="Attention required"
          description="Important student records to review"
          icon={<Bell className="size-4" />}
        >
          <div className="space-y-3">
            {pendingTransactions.length > 0 && (
              <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-blue-400" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">
                    {pendingTransactions.length} pending transaction
                    {pendingTransactions.length === 1 ? "" : "s"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review the student&apos;s transaction records.
                  </p>
                </div>
              </div>
            )}

            {unreadMessages.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveMetric("messages")}
                className="flex w-full items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-left transition hover:bg-blue-500/10"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-blue-400" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-200">
                    {unreadMessages.length} unread message
                    {unreadMessages.length === 1 ? "" : "s"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Open the messages to review them.
                  </p>
                </div>

                <ChevronRight className="size-4 shrink-0 text-slate-500" />
              </button>
            )}

            {overdueFees.length > 0 && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/30 p-3">
                <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200">
                    {overdueFees.length} fee record
                    {overdueFees.length === 1 ? "" : "s"} past due date
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Check payment records before treating these fees as unpaid.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Student information */}
      <SectionCard
        title="Student information"
        description="Personal and emergency contact details"
        icon={<FileText className="size-4" />}
      >
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
          <DetailRow
            label="Full name"
            value={student.full_name || "Not provided"}
          />

          <DetailRow
            label="Index number"
            value={student.index_number || "Not provided"}
          />

          <DetailRow
            label="Email address"
            value={student.email_address || "Not provided"}
          />

          <DetailRow
            label="Gender"
            value={student.gender || "Not provided"}
          />

          <DetailRow
            label="Location"
            value={student.location || "Not provided"}
          />

          <DetailRow
            label="Emergency number"
            value={student.emergency_number || "Not provided"}
            valueClassName="text-blue-400"
          />

          <DetailRow
            label="Mother's name"
            value={student.mother_name || "Not provided"}
          />

          <DetailRow
            label="Mother's contact"
            value={student.mother_contact || "Not provided"}
          />

          <DetailRow
            label="Father's name"
            value={student.father_name || "Not provided"}
          />

          <DetailRow
            label="Father's contact"
            value={student.father_contact || "Not provided"}
          />

          <DetailRow
            label="Student since"
            value={formatDate(student.created_at)}
          />
        </div>
      </SectionCard>

      {/* Student records summary */}
      <SectionCard
        title="Student records"
        description="Other records connected to this student"
        icon={<BriefcaseBusiness className="size-4" />}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Products</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {products.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatCurrency(totalProductValue)}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Feedback</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {feedback.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Recorded entries
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-500">Work assignments</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {semesterJobs.length + partTimeJobs.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Semester and part-time
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Recent activity */}
      <SectionCard
        title="Recent activity"
        description="Latest records across the student's account"
        icon={<Clock3 className="size-4" />}
      >
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-slate-800/70">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                >
                  {activity.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {activity.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {formatDateTime(activity.date)}
                  </p>
                </div>

                {activity.amount !== undefined && (
                  <p className="shrink-0 text-right text-xs font-medium text-slate-300">
                    {formatCurrency(activity.amount)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-800/70 text-slate-500">
              <CheckCircle2 className="size-5" />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-300">
              No activity yet
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Student records will appear here when available.
            </p>
          </div>
        )}
      </SectionCard>

      {/* Interactive metric details */}
      {activeMetric && (
        <MetricDetailsModal
          type={activeMetric}
          student={student}
          balance={currentBalance}
          totalDeposits={totalDeposits}
          totalWithdrawals={totalWithdrawals}
          completedTransactions={completedTransactions}
          onClose={() => setActiveMetric(null)}
        />
      )}
    </div>
  );
}
