"use client";

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import Header from "@/components/Header";
import StudentDashboardOverview from "@/components/students/StudentDashboardOverview";
import useApp from "@/lib/useApp";
import {
  fetchProjectForUser,
  getErrorMessage,
} from "@/lib/projectService";
import type {
  Amount,
  ProjectWithRelations,
  Transaction,
} from "@/types";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(value);
}

function getAmountValue(amount: Amount) {
  const value = amount.amount;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getTransactionTime(transaction: Transaction) {
  const timestamp = new Date(transaction.created_at).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function Section({
  id,
  title,
  description,
  icon: Icon,
  action,
  children,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-3xl border border-white/[0.07] bg-[#0B1424] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/[0.12] bg-blue-500/[0.08]">
            <Icon size={17} className="text-blue-300" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.02] px-4 py-6 text-center text-xs text-slate-500">
      {children}
    </p>
  );
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const studentId = searchParams.get("id");
  const { projects, setProjects, authenticatedId } = useApp();

  const cachedProject = useMemo(
    () => projects.find((item) => item.id === projectId),
    [projects, projectId],
  );
  const [loadedProject, setLoadedProject] =
    useState<ProjectWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      if (!projectId || !studentId) {
        setLoadError("The student or project ID is missing from this link.");
        setIsLoading(false);
        return;
      }

      if (cachedProject) {
        setLoadError(null);
        setIsLoading(false);
        return;
      }

      if (!authenticatedId) {
        setLoadError("Sign in to view this student dashboard.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const project = await fetchProjectForUser(authenticatedId, projectId);

        if (cancelled) return;
        if (!project) {
          setLoadError("This project could not be found.");
          setIsLoading(false);
          return;
        }

        setLoadedProject(project);
        setProjects((current) => [
          ...current.filter((item) => item.id !== project.id),
          project,
        ]);
        setIsLoading(false);
      } catch (error) {
        if (cancelled) return;
        setLoadError(
          getErrorMessage(error, "Unable to load this project."),
        );
        setIsLoading(false);
      }
    }

    void loadProject();
    return () => {
      cancelled = true;
    };
  }, [
    authenticatedId,
    cachedProject,
    projectId,
    setProjects,
    studentId,
  ]);

  const project =
    cachedProject ??
    (loadedProject?.id === projectId ? loadedProject : null);
  const student = project?.students.find((item) => item.id === studentId);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 text-sm text-slate-400">
          Loading student dashboard...
        </main>
      </>
    );
  }

  if (loadError || !projectId || !studentId || !project || !student) {
    const message =
      loadError ??
      (!student ? "This student could not be found in the selected project." : "");

    return (
      <>
        <Header />
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0B1424] p-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10">
              <Users size={21} className="text-blue-300" aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-lg font-semibold text-white">
              Student dashboard unavailable
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">{message}</p>
            <Link
              href="/home"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  const transactions = student.transactions ?? [];
  const messages = student.messages ?? [];
  const unreadMessages = messages.filter((message) => !message.is_read);
  const jobs = [
    ...(student.semester_jobs ?? []).map((job) => ({
      id: job.id,
      type: "Semester job",
      level: job.level,
      semester: job.semester,
      year: job.academic_year,
    })),
    ...(student.part_time_jobs ?? []).map((job) => ({
      id: job.id,
      type: "Part-time job",
      level: job.level,
      semester: job.semester,
      year: job.academic_year,
    })),
  ];

  const studentBalance = (student.amounts ?? []).reduce(
    (total, amount) => total + getAmountValue(amount),
    0,
  );
  const withdrawnMoney = transactions
    .filter(
      (transaction) =>
        transaction.state === "withdraw" &&
        (transaction.status === "completed" || transaction.status === null),
    )
    .reduce(
      (total, transaction) => total + Math.abs(transaction.amount ?? 0),
      0,
    );
  const transactionHref = `/home/transactions?studentId=${encodeURIComponent(student.id)}&projectId=${encodeURIComponent(project.id)}`;
  const latestTransactions = [...transactions]
    .sort((left, right) => getTransactionTime(right) - getTransactionTime(left))
    .slice(0, 5);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-72px)] w-full px-3 py-5 text-white sm:px-5 sm:py-7 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href={`/home/${project.id}/students?id=${project.id}`}
            className="group inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
              aria-hidden="true"
              className="transition group-hover:-translate-x-0.5"
            />
            All students
          </Link>

          <section className="relative mt-4 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#14243A] via-[#0D1728] to-[#080E19] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/[0.10] blur-3xl" />
            <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10 text-2xl font-bold text-blue-200 sm:size-24 sm:text-3xl">
                {getInitials(student.full_name)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                  Student profile
                </p>
                <h1 className="mt-2 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {student.full_name}
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  {student.index_number || "Index number not assigned"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.gender && (
                    <span className="rounded-full border border-blue-400/15 bg-blue-500/[0.08] px-3 py-1.5 text-[11px] text-blue-200">
                      {student.gender}
                    </span>
                  )}
                  {student.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-300">
                      <MapPin size={12} aria-hidden="true" />
                      {student.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:flex-col">
                {student.email_address && (
                  <a
                    href={`mailto:${student.email_address}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:border-blue-400/30 hover:bg-blue-500/10"
                  >
                    <Mail size={14} aria-hidden="true" />
                    Email student
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                )}
                {student.emergency_number && (
                  <a
                    href={`tel:${student.emergency_number}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-blue-500"
                  >
                    <Phone size={14} aria-hidden="true" />
                    Emergency contact
                  </a>
                )}
              </div>
            </div>

            <div className="relative flex flex-wrap gap-x-5 gap-y-2.5 border-t border-white/[0.06] px-5 py-3.5 text-[11px] text-slate-400 sm:px-7">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={14} className="text-blue-400" aria-hidden="true" />
                Registered {formatDate(student.created_at)}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-blue-400" aria-hidden="true" />
                {project.school_name}
              </span>
            </div>
          </section>

          <StudentDashboardOverview
            transactionHref={transactionHref}
            transactionCount={transactions.length}
            studentBalance={formatMoney(studentBalance)}
            withdrawnMoney={formatMoney(withdrawnMoney)}
            unreadMessageCount={unreadMessages.length}
          />

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Section
              id="transactions"
              title="Recent transactions"
              description="Latest financial activity for this student."
              icon={Wallet}
              action={
                <Link
                  href={transactionHref}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-blue-500 sm:text-xs"
                >
                  View transactions
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              }
            >
              {latestTransactions.length ? (
                <div className="divide-y divide-white/[0.06]">
                  {latestTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold capitalize text-white">
                          {transaction.state}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-xs font-semibold text-white">
                          {transaction.amount === null
                            ? "—"
                            : formatMoney(transaction.amount)}
                        </p>
                        <p className="mt-1 text-[10px] capitalize text-slate-500">
                          {transaction.status ?? "Unspecified"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState>No transactions have been recorded yet.</EmptyState>
              )}
            </Section>

            <Section
              id="jobs"
              title="Jobs"
              description="Current student job assignments."
              icon={BriefcaseBusiness}
            >
              {jobs.length ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {jobs.map((job) => (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <p className="text-xs font-semibold text-white">
                        {job.type}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {job.level} · {job.semester} · {job.year}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState>No job assignments have been recorded yet.</EmptyState>
              )}
            </Section>

            <Section
              id="products"
              title="Products"
              description="Products recorded for this student."
              icon={Package}
            >
              {student.products.length ? (
                <div className="space-y-2">
                  {student.products.map((product) => (
                    <article
                      key={product.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white">
                          {product.product_info}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          Quantity: {product.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs font-semibold text-white">
                        {formatMoney(
                          (Number(product.price) || 0) *
                            (Number(product.quantity) || 0),
                        )}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState>No products have been recorded yet.</EmptyState>
              )}
            </Section>

            <Section
              id="chat"
              title="Chat"
              description="Messages exchanged with this student."
              icon={MessageCircle}
            >
              {messages.length ? (
                <div className="space-y-2">
                  {[...messages]
                    .sort(
                      (left, right) =>
                        new Date(right.created_at).getTime() -
                        new Date(left.created_at).getTime(),
                    )
                    .slice(0, 5)
                    .map((message) => (
                      <article
                        key={message.id}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold text-white">
                            {message.sender_name}
                          </p>
                          <time className="shrink-0 text-[10px] text-slate-500">
                            {formatDate(message.created_at)}
                          </time>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-slate-300">
                          {message.message}
                        </p>
                      </article>
                    ))}
                </div>
              ) : (
                <EmptyState>No messages have been recorded yet.</EmptyState>
              )}
            </Section>

            <Section
              id="feedback"
              title="Feedback"
              description="Feedback records associated with this student."
              icon={CheckCircle2}
            >
              {student.feedback.length ? (
                <div className="space-y-2">
                  {student.feedback.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                    >
                      <span className="text-xs font-medium text-slate-200">
                        Student feedback
                      </span>
                      <time className="shrink-0 text-[10px] text-slate-500">
                        {formatDate(item.feedback_date)}
                      </time>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState>No feedback has been recorded yet.</EmptyState>
              )}
            </Section>

            <Section
              id="cart"
              title="Cart"
              description="Items currently in the student's cart."
              icon={ShoppingCart}
            >
              <EmptyState>
                Cart items are not available for this student yet.
              </EmptyState>
            </Section>

            <Section
              id="saved"
              title="Saved"
              description="Products saved by the student."
              icon={Bookmark}
            >
              <EmptyState>
                Saved products are not available for this student yet.
              </EmptyState>
            </Section>

            <Section
              id="student-details"
              title="Student details"
              description="Contact and registration information."
              icon={UserRound}
            >
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Detail label="Email" value={student.email_address} icon={Mail} />
                <Detail
                  label="Location"
                  value={student.location}
                  icon={MapPin}
                />
                <Detail
                  label="Emergency contact"
                  value={student.emergency_number}
                  icon={Phone}
                />
                <Detail
                  label="Index number"
                  value={student.index_number}
                  icon={ShieldCheck}
                />
                <Detail
                  label="Mother / guardian"
                  value={student.mother_name}
                  icon={Users}
                />
                <Detail
                  label="Father / guardian"
                  value={student.father_name}
                  icon={Users}
                />
                <Detail
                  label="Student balance"
                  value={formatMoney(studentBalance)}
                  icon={CircleDollarSign}
                />
                <Detail
                  label="Job assignments"
                  value={String(jobs.length)}
                  icon={Clock3}
                />
              </div>
            </Section>
          </div>
        </div>
      </main>
    </>
  );
}

function Detail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | null | undefined;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <Icon size={13} className="text-blue-300" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 break-words text-xs font-semibold text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 text-sm text-slate-400">
            Loading student dashboard...
          </main>
        </>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
