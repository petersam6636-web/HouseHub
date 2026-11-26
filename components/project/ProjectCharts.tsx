
"use client";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";
import type { ProjectWithRelations } from "@/types";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

type Props = {
  project: ProjectWithRelations;
};

const chartTextColor = "#94A3B8";
const chartGridColor = "rgba(148, 163, 184, 0.08)";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: chartTextColor,
        usePointStyle: true,
        pointStyle: "circle" as const,
        padding: 18,
        font: {
          size: 11,
          family: "Arial",
        },
      },
    },
    tooltip: {
      backgroundColor: "#0B1424",
      borderColor: "rgba(96,165,250,0.18)",
      borderWidth: 1,
      titleColor: "#FFFFFF",
      bodyColor: "#CBD5E1",
      padding: 12,
      cornerRadius: 12,
    },
  },
};

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-[24px] border border-white/[0.07] bg-[#0B1424] p-4 sm:p-5 ${className}`}
    >
      <div>
        <h3 className="text-sm font-semibold text-white">
          {title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-5 h-[250px] min-w-0">
        {children}
      </div>
    </section>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/[0.08] text-blue-400">
        <span className="text-lg">∅</span>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-300">
        No chart data available
      </p>

      <p className="mt-1 text-[10px] text-slate-500">
        Data will appear when records are added.
      </p>
    </div>
  );
}

export default function ProjectCharts({ project }: Props) {
  const students = project.students ?? [];

  const transactions = students.flatMap(
    (student) => student.transactions ?? []
  );

  const dailyJobs = project.daily_jobs ?? [];
  const partTimeJobs = project.part_time_jobs ?? [];

  const male = students.filter(
    (student) => student.gender?.toLowerCase() === "male"
  ).length;

  const female = students.filter(
    (student) => student.gender?.toLowerCase() === "female"
  ).length;

  const other = students.length - male - female;

  const genderData = {
    labels: ["Male", "Female", "Other / unset"],
    datasets: [
      {
        data: [male, female, other],
        backgroundColor: [
          "#3B82F6",
          "#06B6D4",
          "#6366F1",
        ],
        borderColor: "#0B1424",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const transactionStates = [
    "completed",
    "pending",
    "failed",
    "cancelled",
  ] as const;

  const transactionStateData = {
    labels: ["Completed", "Pending", "Failed", "Cancelled"],
    datasets: [
      {
        data: transactionStates.map(
          (state) =>
            transactions.filter(
              (transaction) => transaction.status === state
            ).length
        ),
        backgroundColor: [
          "#3B82F6",
          "#06B6D4",
          "#64748B",
          "#6366F1",
        ],
        borderColor: "#0B1424",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const jobLevels = Array.from(
    new Set([
      ...dailyJobs.map((job) => job.level),
      ...partTimeJobs.map((job) => job.level),
    ])
  ).filter(Boolean);

  const jobsByLevelData = {
    labels: jobLevels,
    datasets: [
      {
        label: "Daily jobs",
        data: jobLevels.map(
          (level) =>
            dailyJobs.filter((job) => job.level === level).length
        ),
        backgroundColor: "#3B82F6",
        borderRadius: 8,
        barThickness: 20,
      },
      {
        label: "Part-time jobs",
        data: jobLevels.map(
          (level) =>
            partTimeJobs.filter((job) => job.level === level).length
        ),
        backgroundColor: "#06B6D4",
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  };

  const now = new Date();

  const monthlyLabels = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - 5 + index,
      1
    );

    return date.toLocaleDateString("en", {
      month: "short",
      year: "2-digit",
    });
  });

  const monthlyTransactionData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Transactions",
        data: monthlyLabels.map((_, index) => {
          const date = new Date(
            now.getFullYear(),
            now.getMonth() - 5 + index,
            1
          );

          return transactions.filter((transaction) => {
            const createdAt = new Date(transaction.created_at);

            return (
              !Number.isNaN(createdAt.getTime()) &&
              createdAt.getFullYear() === date.getFullYear() &&
              createdAt.getMonth() === date.getMonth()
            );
          }).length;
        }),
        borderColor: "#60A5FA",
        backgroundColor: "rgba(59,130,246,0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#60A5FA",
      },
    ],
  };

  const axisOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        labels: chartOptions.plugins.legend.labels,
      },
    },
    scales: {
      x: {
        ticks: {
          color: chartTextColor,
          font: { size: 10 },
        },
        grid: {
          color: chartGridColor,
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: chartTextColor,
          precision: 0,
          font: { size: 10 },
        },
        grid: {
          color: chartGridColor,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const hasGenderData = students.length > 0;
  const hasTransactionData = transactions.length > 0;
  const hasJobLevelData = jobLevels.length > 0;

  return (
    <>
      <ChartCard
        title="Student demographics"
        description="Student distribution by gender"
        className="lg:col-span-6"
      >
        {hasGenderData ? (
          <Doughnut
            data={genderData}
            options={{
              ...chartOptions,
              cutout: "72%",
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: "bottom",
                  labels: chartOptions.plugins.legend.labels,
                },
              },
            }}
          />
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Transaction breakdown"
        description="Distribution by transaction status"
        className="lg:col-span-6"
      >
        {hasTransactionData ? (
          <Doughnut
            data={transactionStateData}
            options={{
              ...chartOptions,
              cutout: "72%",
              plugins: {
                ...chartOptions.plugins,
                legend: {
                  position: "bottom",
                  labels: chartOptions.plugins.legend.labels,
                },
              },
            }}
          />
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Jobs by level"
        description="Daily and part-time job distribution"
        className="lg:col-span-6"
      >
        {hasJobLevelData ? (
          <Bar
            data={jobsByLevelData}
            options={{
              ...axisOptions,
              scales: {
                ...axisOptions.scales,
                x: {
                  ...axisOptions.scales.x,
                  stacked: true,
                },
                y: {
                  ...axisOptions.scales.y,
                  stacked: true,
                },
              },
            }}
          />
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Transaction activity"
        description="Transactions recorded over the last six months"
        className="lg:col-span-6"
      >
        {hasTransactionData ? (
          <Line
            data={monthlyTransactionData}
            options={axisOptions}
          />
        ) : (
          <EmptyChart />
        )}
      </ChartCard>
    </>
  );
}