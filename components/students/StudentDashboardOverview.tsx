
"use client";

import type { ReactNode } from "react";
import type { StudentDetailsWithRelations } from "@/types";
import {
  Wallet,
  CheckCircle2,
  Clock3,
  MessageCircle,
  AlertCircle,
  UserRound,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  CreditCard,
  Package,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";

type Props = {
  student: StudentDetailsWithRelations;
};

function money(value: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(value);
}

function dateLabel(value: string | null | undefined) {
  if (!value) return "Not provided";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.07] bg-[#0b1424] p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: string | null | undefined;
  icon?: ReactNode;
  href?: string;
}) {
  const displayValue = value?.trim() || "Not provided";

  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      {href && displayValue !== "Not provided" ? (
        <a
          href={href}
          className="max-w-[60%] break-words text-right text-xs font-medium text-blue-400 transition hover:text-blue-300"
        >
          {displayValue}
        </a>
      ) : (
        <span className="max-w-[60%] break-words text-right text-xs font-medium text-slate-200">
          {displayValue}
        </span>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  color = "blue",
}: {
  label: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  color?: "blue" | "cyan" | "indigo" | "slate";
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-400",
    cyan: "bg-sky-500/10 text-sky-400",
    indigo: "bg-indigo-500/10 text-indigo-400",
    slate: "bg-slate-500/10 text-slate-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0b1424] p-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`flex size-9 items-center justify-center rounded-xl ${colors[color]}`}>
          {icon}
        </span>
      </div>

      <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default function StudentDashboardOverview({ student }: Props) {
  const transactions = student.transactions ?? [];
  const fees = student.fees ?? [];
  const messages = student.messages ?? [];
  const products = student.products ?? [];

  const completedTransactions = transactions.filter(
    (item) => item.status === "completed",
  );

  const pendingTransactions = transactions.filter(
    (item) => item.status === "pending",
  );

  const unreadMessages = messages.filter(
    (item) => !item.is_read && item.sender_role === "student",
  );

  const completedVolume = completedTransactions.reduce(
    (sum, item) => sum + Math.abs(item.amount ?? 0),
    0,
  );

  const assignedFees = fees.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const productValue = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const overdueFees = fees.filter((fee) => {
    if (!fee.due_date) return false;

    const dueDate = new Date(fee.due_date);

    return (
      !Number.isNaN(dueDate.getTime()) &&
      dueDate.getTime() < Date.now()
    );
  });

  const recentActivity = [
    ...transactions.map((item) => ({
      id: item.id,
      title: `${item.state.replace("_", " ")} transaction`,
      description:
        item.description ||
        (item.amount !== null ? money(item.amount) : "Transaction record"),
      date: item.created_at,
      type: "transaction",
    })),
    ...messages.map((item) => ({
      id: item.id,
      title: item.sender_role === "student" ? "Student message" : "Housemaster message",
      description: item.message,
      date: item.created_at,
      type: "message",
    })),
    ...student.feedback.map((item) => ({
      id: item.id,
      title: "Feedback recorded",
      description: "Student feedback entry",
      date: item.feedback_date || item.created_at,
      type: "feedback",
    })),
    ...products.map((item) => ({
      id: item.id,
      title: "Product recorded",
      description: `${item.product_info} · ${item.quantity} item(s)`,
      date: item.date || item.created_at,
      type: "product",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="space-y-5">
      {/* Key student statistics */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Completed activity"
          value={completedTransactions.length}
          description={money(completedVolume)}
          icon={<CheckCircle2 size={18} />}
          color="cyan"
        />

        <StatCard
          label="Pending transactions"
          value={pendingTransactions.length}
          description="Awaiting attention"
          icon={<Clock3 size={18} />}
          color="indigo"
        />

        <StatCard
          label="Unread messages"
          value={unreadMessages.length}
          description="Messages from student"
          icon={<MessageCircle size={18} />}
          color="blue"
        />

        <StatCard
          label="Fees assigned"
          value={money(assignedFees)}
          description={`${fees.length} fee record(s)`}
          icon={<Wallet size={18} />}
          color="slate"
        />
      </div>

      {/* Important alerts */}
      {(overdueFees.length > 0 ||
        pendingTransactions.length > 0 ||
        unreadMessages.length > 0) && (
        <section className="rounded-3xl border border-blue-400/15 bg-blue-500/[0.06] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={17} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              Items to review
            </h2>
          </div>

          <div className="space-y-2">
            {pendingTransactions.length > 0 && (
              <p className="text-xs leading-5 text-slate-300">
                <span className="font-semibold text-blue-300">
                  {pendingTransactions.length}
                </span>{" "}
                pending transaction(s) need review.
              </p>
            )}

            {unreadMessages.length > 0 && (
              <p className="text-xs leading-5 text-slate-300">
                <span className="font-semibold text-blue-300">
                  {unreadMessages.length}
                </span>{" "}
                unread student message(s).
              </p>
            )}

            {overdueFees.length > 0 && (
              <p className="text-xs leading-5 text-slate-300">
                <span className="font-semibold text-blue-300">
                  {overdueFees.length}
                </span>{" "}
                fee record(s) have passed their due date. Confirm payment
                status before treating them as unpaid.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Personal information and emergency contacts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Student information" icon={<UserRound size={17} />}>
          <InfoRow
            label="Full name"
            value={student.full_name}
          />
          <InfoRow
            label="Index number"
            value={student.index_number}
          />
          <InfoRow
            label="Gender"
            value={student.gender}
          />
          <InfoRow
            label="Location"
            value={student.location}
            icon={<MapPin size={13} />}
          />
          <InfoRow
            label="Email"
            value={student.email_address}
            icon={<Mail size={13} />}
            href={
              student.email_address
                ? `mailto:${student.email_address}`
                : undefined
            }
          />
          <InfoRow
            label="Registered"
            value={dateLabel(student.created_at)}
            icon={<CalendarDays size={13} />}
          />
        </Card>

        <Card title="Emergency & family contacts" icon={<Phone size={17} />}>
          <InfoRow
            label="Emergency number"
            value={student.emergency_number}
            href={
              student.emergency_number
                ? `tel:${student.emergency_number}`
                : undefined
            }
          />
          <InfoRow
            label="Mother"
            value={student.mother_name}
          />
          <InfoRow
            label="Mother's contact"
            value={student.mother_contact}
            href={
              student.mother_contact
                ? `tel:${student.mother_contact}`
                : undefined
            }
          />
          <InfoRow
            label="Father"
            value={student.father_name}
          />
          <InfoRow
            label="Father's contact"
            value={student.father_contact}
            href={
              student.father_contact
                ? `tel:${student.father_contact}`
                : undefined
            }
          />
        </Card>
      </div>

      {/* Other student records */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card title="Products" icon={<Package size={17} />}>
          <p className="text-xl font-bold text-white">
            {products.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Recorded value: {money(productValue)}
          </p>
        </Card>

        <Card title="Feedback" icon={<ClipboardList size={17} />}>
          <p className="text-xl font-bold text-white">
            {student.feedback.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Feedback records
          </p>
        </Card>

        <Card title="Work assignments" icon={<GraduationCap size={17} />}>
          <p className="text-xl font-bold text-white">
            {student.semester_jobs.length + student.part_time_jobs.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Semester and part-time job records
          </p>
        </Card>
      </div>

      {/* Recent activity */}
      <Card title="Recent activity" icon={<CalendarDays size={17} />}>
        {recentActivity.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] px-4 py-8 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
              <CalendarDays size={18} />
            </div>
            <p className="text-sm font-medium text-slate-300">
              No activity yet
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Student records will appear here as activity is added.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentActivity.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-start gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/[0.03]"
              >
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <ArrowUpRight size={15} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold capitalize text-slate-200">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 break-words text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span className="shrink-0 text-[10px] text-slate-600">
                  {dateLabel(item.date)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}