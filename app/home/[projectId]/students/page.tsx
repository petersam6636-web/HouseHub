import { Suspense } from "react";
import Header from "@/components/Header";
import StudentPage from "@/components/student/StudentPage";

export default function StudentsRoute() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="min-h-[calc(100vh-72px)] w-full px-3 py-6 text-white sm:px-5 sm:py-8 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-center justify-center text-sm text-slate-400">
              Loading students...
            </div>
          </main>
        }
      >
        <StudentPage />
      </Suspense>
    </>
  );
}