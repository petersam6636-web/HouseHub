import { Suspense } from "react";
import StudentPage from "@/components/student/StudentPage";

export default function StudentsRoute() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
          Loading students...
        </main>
      }
    >
      <StudentPage />
    </Suspense>
  );
}