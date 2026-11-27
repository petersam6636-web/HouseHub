
"use client";

import type { Transaction } from "@/types";

type StudentChartsProps = {
  transactions: Transaction[];
};

const BLUE = "#3b82f6";
const CYAN = "#38bdf8";

const transactionLabels: Record<string, string> = {
  loan: "Loans",
  deposit: "Deposits",
  transfer: "Transfers",
  withdraw: "Withdrawals",
  message: "Messages",
};

function getMonthlyTransactions(transactions: Transaction[]) {
  const now = new Date();

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (5 - index),
      1,
    );

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      amount: 0,
      count: 0,
    };
  });

  transactions.forEach((transaction) => {
    const date = new Date(transaction.created_at);

    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const month = months.find((item) => item.key === key);

    if (!month) return;

    if (
      transaction.status === "completed" &&
      transaction.amount !== null
    ) {
      month.amount += Math.abs(transaction.amount);
    }

    month.count += 1;
  });

  return months;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(value);
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/[0.07] bg-[#0b1424] p-4 sm:p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      {children}
    </section>
  );
}

export default function StudentCharts({
  transactions,
}: StudentChartsProps) {
  const monthly = getMonthlyTransactions(transactions);

  const maxAmount = Math.max(
    ...monthly.map((item) => item.amount),
    1,
  );

  const transactionTypes = [
    "loan",
    "deposit",
    "transfer",
    "withdraw",
    "message",
  ].map((state) => ({
    state,
    label: transactionLabels[state],
    count: transactions.filter(
      (transaction) => transaction.state === state,
    ).length,
  }));

  const totalTypes = Math.max(
    transactionTypes.reduce((sum, item) => sum + item.count, 0),
    1,
  );

  const colors = [
    "#3b82f6",
    "#38bdf8",
    "#818cf8",
    "#60a5fa",
    "#64748b",
  ];

  const gradientParts: string[] = [];
  let currentPercent = 0;

  transactionTypes.forEach((item, index) => {
    if (item.count === 0) return;

    const percent = (item.count / totalTypes) * 100;

    gradientParts.push(
      `${colors[index]} ${currentPercent}% ${currentPercent + percent}%`,
    );

    currentPercent += percent;
  });

  const doughnutBackground =
    gradientParts.length > 0
      ? `conic-gradient(${gradientParts.join(", ")})`
      : "conic-gradient(#1e293b 0% 100%)";

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        title="Financial activity"
        description="Completed transaction amounts over the last 6 months"
      >
        <div className="mb-4">
          <p className="text-2xl font-bold tracking-tight text-white">
            {formatMoney(
              monthly.reduce((sum, item) => sum + item.amount, 0),
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Completed transaction volume
          </p>
        </div>

        <div className="flex h-44 items-end gap-3">
          {monthly.map((month) => {
            const height =
              month.amount > 0
                ? Math.max((month.amount / maxAmount) * 100, 5)
                : 3;

            return (
              <div
                key={month.key}
                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="flex h-36 w-full items-end justify-center">
                  <div
                    title={formatMoney(month.amount)}
                    className="w-full max-w-10 rounded-t-xl transition-all duration-500"
                    style={{
                      height: `${height}%`,
                      background:
                        "linear-gradient(to top, #2563eb, #38bdf8)",
                      opacity: month.amount > 0 ? 1 : 0.25,
                    }}
                  />
                </div>

                <span className="text-[10px] font-medium text-slate-500">
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>
      </ChartCard>

      <ChartCard
        title="Transaction breakdown"
        description="How the student's recorded transactions are distributed"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="relative size-36 shrink-0">
            <div
              className="size-full rounded-full"
              style={{ background: doughnutBackground }}
            />

            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-[#0b1424]">
              <span className="text-2xl font-bold text-white">
                {transactions.length}
              </span>
              <span className="text-[10px] text-slate-500">
                Records
              </span>
            </div>
          </div>

          <div className="w-full space-y-3">
            {transactionTypes.map((item, index) => (
              <div
                key={item.state}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="truncate text-xs text-slate-400">
                    {item.label}
                  </span>
                </div>

                <span className="text-xs font-semibold tabular-nums text-white">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>

      <ChartCard
        title="Monthly transaction records"
        description="Number of transactions recorded each month"
      >
        <div className="space-y-4">
          {monthly.map((month) => (
            <div key={month.key}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {month.label}
                </span>
                <span className="text-xs font-semibold text-white">
                  {month.count}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      month.count > 0
                        ? Math.max(
                            (month.count /
                              Math.max(
                                ...monthly.map((item) => item.count),
                                1,
                              )) *
                              100,
                            3,
                          )
                        : 0
                    }%`,
                    background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <ChartCard
        title="Transaction status"
        description="Current state of the student's transaction records"
      >
        <div className="space-y-4">
          {[
            {
              label: "Completed",
              status: "completed",
              color: "#38bdf8",
            },
            {
              label: "Pending",
              status: "pending",
              color: "#818cf8",
            },
            {
              label: "Failed",
              status: "failed",
              color: "#64748b",
            },
            {
              label: "Cancelled",
              status: "cancelled",
              color: "#475569",
            },
          ].map((item) => {
            const count = transactions.filter(
              (transaction) => transaction.status === item.status,
            ).length;

            const percentage =
              transactions.length > 0
                ? (count / transactions.length) * 100
                : 0;

            return (
              <div key={item.status}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {count}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}
