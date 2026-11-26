
"use client";

import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  Layers3,
  MessageCircle,
  Package,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";

import type { ProjectWithRelations } from "@/types";
import ProjectCharts from './ProjectCharts';

type Props = {
  project: ProjectWithRelations;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(value);

const number = (value: number) =>
  new Intl.NumberFormat("en-GH").format(value);

function isValidDate(value: string | null | undefined) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function isToday(value: string | null | undefined) {
  if (!isValidDate(value)) return false;

  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-[24px] border border-white/[0.07] bg-[#0B1424] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-colors hover:border-blue-400/[0.16] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function CardHeading({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {description && (
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/[0.12] bg-blue-500/[0.08]">
        <Icon size={16} className="text-blue-400" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
  accent = "blue",
  detail,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: "blue" | "cyan" | "indigo";
  detail?: string;
}) {
  const accentClasses = {
    blue: "bg-blue-500/[0.10] text-blue-400 border-blue-400/[0.12]",
    cyan: "bg-cyan-500/[0.08] text-cyan-300 border-cyan-400/[0.12]",
    indigo: "bg-indigo-500/[0.08] text-indigo-300 border-indigo-400/[0.12]",
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>

          {detail && (
            <p className="mt-2 text-[10px] leading-4 text-slate-500">
              {detail}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentClasses[accent]}`}
        >
          <Icon size={18} />
        </div>
      </div>
    </Card>
  );
}

export default function ProjectDashboardBento({ project }: Props) {
  const students = project.students ?? [];
  const dailyJobs = project.daily_jobs ?? [];
  const partTimeJobs = project.part_time_jobs ?? [];

  const transactions = students.flatMap(
    (student) => student.transactions ?? []
  );

  const fees = students.flatMap(
    (student) => student.fees ?? []
  );

  const products = students.flatMap(
    (student) => student.products ?? []
  );

  const messages = students.flatMap(
    (student) => student.messages ?? []
  );

  const feedback = students.flatMap(
    (student) => student.feedback ?? []
  );

  const amounts = students.flatMap(
    (student) => student.amounts ?? []
  );

  const semesterAssignments = students.flatMap(
    (student) => student.semester_jobs ?? []
  );

  const partTimeAssignments = students.flatMap(
    (student) => student.part_time_jobs ?? []
  );

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "completed"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "pending"
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "failed"
  );

  const cancelledTransactions = transactions.filter(
    (transaction) => transaction.status === "cancelled"
  );

  const completedDeposits = completedTransactions
    .filter((transaction) => transaction.state === "deposit")
    .reduce(
      (total, transaction) => total + (transaction.amount ?? 0),
      0
    );

  const completedWithdrawals = completedTransactions
    .filter((transaction) => transaction.state === "withdraw")
    .reduce(
      (total, transaction) => total + (transaction.amount ?? 0),
      0
    );

  const completedLoans = completedTransactions
    .filter((transaction) => transaction.state === "loan")
    .reduce(
      (total, transaction) => total + (transaction.amount ?? 0),
      0
    );

  const completedTransfers = completedTransactions
    .filter((transaction) => transaction.state === "transfer")
    .reduce(
      (total, transaction) => total + (transaction.amount ?? 0),
      0
    );

  const totalCompletedTransactionAmount =
    completedTransactions.reduce(
      (total, transaction) => total + (transaction.amount ?? 0),
      0
    );

  const totalFeeAmount = fees.reduce(
    (total, fee) => total + (Number(fee.amount) || 0),
    0
  );

  const totalProductValue = products.reduce(
    (total, product) =>
      total +
      (Number(product.price) || 0) *
        (Number(product.quantity) || 0),
    0
  );

  const totalProductQuantity = products.reduce(
    (total, product) =>
      total + (Number(product.quantity) || 0),
    0
  );

  const unreadMessages = messages.filter(
    (message) => !message.is_read
  );

  const todayMessages = messages.filter((message) =>
    isToday(message.created_at)
  );

  const todayFeedback = feedback.filter((item) =>
    isToday(item.feedback_date)
  );

  const todayJobs = dailyJobs.filter((job) => {
    if (!job.start_time) return false;

    return true;
  });

  const maleStudents = students.filter(
    (student) => student.gender?.toLowerCase() === "male"
  ).length;

  const femaleStudents = students.filter(
    (student) => student.gender?.toLowerCase() === "female"
  ).length;

  const otherGenderStudents =
    students.length - maleStudents - femaleStudents;

  const relatedRecords =
    amounts.length +
    transactions.length +
    products.length +
    fees.length +
    messages.length +
    feedback.length +
    semesterAssignments.length +
    partTimeAssignments.length;

  const profileCompletionCount = students.filter(
    (student) =>
      Boolean(student.email_address) &&
      Boolean(student.profile_image)
  ).length;

  const totalJobs = dailyJobs.length + partTimeJobs.length;

  return (
    <div className="mt-6 space-y-4 sm:mt-7">
      {/* Section heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-blue-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
              Dashboard analytics
            </p>
          </div>

          <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            Project insights
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            A complete overview of your school project.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/[0.12] bg-blue-500/[0.06] px-3 py-2 text-[10px] font-medium text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          Live project data
        </div>
      </div>

      {/* Primary metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total students"
          value={number(students.length)}
          icon={Users}
          detail={`${number(maleStudents)} male · ${number(femaleStudents)} female`}
        />

        <Metric
          label="Total jobs"
          value={number(totalJobs)}
          icon={BriefcaseBusiness}
          accent="cyan"
          detail={`${number(dailyJobs.length)} daily · ${number(partTimeJobs.length)} part-time`}
        />

        <Metric
          label="Total transactions"
          value={number(transactions.length)}
          icon={Wallet}
          accent="indigo"
          detail={`${number(completedTransactions.length)} completed`}
        />

        <Metric
          label="Related records"
          value={number(relatedRecords)}
          icon={Layers3}
          detail="All student-related records"
        />
      </div>

      {/* Main Bento layout */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Student analytics */}
        <Card className="lg:col-span-7">
          <CardHeading
            title="Student overview"
            description="Enrollment and student profile information"
            icon={Users}
          />

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500">Male</p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(maleStudents)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500">Female</p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(femaleStudents)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500">Other / unset</p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(otherGenderStudents)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500">Profiles complete</p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(profileCompletionCount)}
              </p>
            </div>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${
                  students.length > 0
                    ? (profileCompletionCount / students.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            Profile completion checks for an email address and profile image.
          </p>
        </Card>

        {/* Finance overview */}
        <Card className="lg:col-span-5">
          <CardHeading
            title="Financial overview"
            description="Recorded transaction activity"
            icon={CircleDollarSign}
          />

          <div className="mt-5 rounded-2xl border border-blue-400/[0.10] bg-blue-500/[0.06] p-4">
            <p className="text-[10px] font-medium text-slate-400">
              Completed transaction amount
            </p>

            <p className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {money(totalCompletedTransactionAmount)}
            </p>

            <p className="mt-2 text-[10px] text-slate-500">
              Based on transactions marked completed.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <ArrowDownLeft size={13} className="text-blue-400" />
                Deposits
              </div>
              <p className="mt-2 text-sm font-semibold text-white">
                {money(completedDeposits)}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <ArrowUpRight size={13} className="text-cyan-400" />
                Withdrawals
              </div>
              <p className="mt-2 text-sm font-semibold text-white">
                {money(completedWithdrawals)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Loans</p>
              <p className="mt-2 text-sm font-semibold text-white">
                {money(completedLoans)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Transfers</p>
              <p className="mt-2 text-sm font-semibold text-white">
                {money(completedTransfers)}
              </p>
            </div>
          </div>
        </Card>

        {/* Transaction status */}
        <Card className="lg:col-span-4">
          <CardHeading
            title="Transaction status"
            description="Current processing overview"
            icon={Receipt}
          />

          <div className="mt-5 space-y-3">
            {[
              {
                label: "Completed",
                value: completedTransactions.length,
                color: "bg-blue-400",
              },
              {
                label: "Pending",
                value: pendingTransactions.length,
                color: "bg-cyan-400",
              },
              {
                label: "Failed",
                value: failedTransactions.length,
                color: "bg-slate-500",
              },
              {
                label: "Cancelled",
                value: cancelledTransactions.length,
                color: "bg-indigo-400",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${item.color}`}
                  />
                  <span className="text-xs text-slate-400">
                    {item.label}
                  </span>
                </div>

                <span className="text-xs font-semibold text-white">
                  {number(item.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Fees */}
        <Card className="lg:col-span-4">
          <CardHeading
            title="Student fees"
            description="Assigned fees across students"
            icon={FileText}
          />

          <p className="mt-5 text-2xl font-bold tracking-tight text-white">
            {money(totalFeeAmount)}
          </p>

          <p className="mt-2 text-[10px] text-slate-500">
            Total recorded fee amount
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-slate-400">
              Fee records
            </span>

            <span className="text-sm font-semibold text-white">
              {number(fees.length)}
            </span>
          </div>
        </Card>

        {/* Products */}
        <Card className="lg:col-span-4">
          <CardHeading
            title="Student products"
            description="Recorded product information"
            icon={Package}
          />

          <p className="mt-5 text-2xl font-bold tracking-tight text-white">
            {money(totalProductValue)}
          </p>

          <p className="mt-2 text-[10px] text-slate-500">
            Total recorded product value
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-slate-400">
              Total quantity
            </span>

            <span className="text-sm font-semibold text-white">
              {number(totalProductQuantity)}
            </span>
          </div>
        </Card>

        {/* Jobs */}
        <Card className="lg:col-span-6">
          <CardHeading
            title="Jobs & assignments"
            description="Available jobs and student participation"
            icon={BriefcaseBusiness}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
              <Clock3 size={16} className="text-blue-400" />
              <p className="mt-3 text-2xl font-bold text-white">
                {number(dailyJobs.length)}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Daily jobs
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
              <CalendarClock size={16} className="text-cyan-300" />
              <p className="mt-3 text-2xl font-bold text-white">
                {number(partTimeJobs.length)}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Part-time jobs
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-slate-400">
              Student job assignments
            </span>

            <span className="text-sm font-semibold text-white">
              {number(
                semesterAssignments.length +
                  partTimeAssignments.length
              )}
            </span>
          </div>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-6">
          <CardHeading
            title="Student communication"
            description="Messages and recent communication activity"
            icon={MessageCircle}
          />

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-slate-500">
                Total messages
              </p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(messages.length)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500">
                Unread
              </p>
              <p className="mt-2 text-xl font-bold text-blue-400">
                {number(unreadMessages.length)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-500">
                Today
              </p>
              <p className="mt-2 text-xl font-bold text-white">
                {number(todayMessages.length)}
              </p>
            </div>
          </div>

          {unreadMessages.length > 0 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-400/[0.10] bg-blue-500/[0.05] px-3 py-2.5">
              <MessageCircle size={14} className="text-blue-400" />
              <p className="text-[10px] text-blue-200">
                {number(unreadMessages.length)} unread messages need attention.
              </p>
            </div>
          )}
        </Card>

        {/* Feedback */}
        <Card className="lg:col-span-4">
          <CardHeading
            title="Student feedback"
            description="Feedback activity"
            icon={CheckCircle2}
          />

          <p className="mt-5 text-2xl font-bold text-white">
            {number(feedback.length)}
          </p>

          <p className="mt-2 text-[10px] text-slate-500">
            Total feedback records
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-slate-400">
              Submitted today
            </span>

            <span className="text-sm font-semibold text-white">
              {number(todayFeedback.length)}
            </span>
          </div>
        </Card>

        {/* Related data */}
        <Card className="lg:col-span-4">
          <CardHeading
            title="Project activity"
            description="All related student records"
            icon={Activity}
          />

          <p className="mt-5 text-2xl font-bold text-white">
            {number(relatedRecords)}
          </p>

          <p className="mt-2 text-[10px] text-slate-500">
            Combined related records
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="text-xs text-slate-400">
              Student records
            </span>

            <span className="text-sm font-semibold text-white">
              {number(students.length)}
            </span>
          </div>
        </Card>

        {/* Charts */}
        <ProjectCharts project={project} />
      </div>
    </div>
  );
}
