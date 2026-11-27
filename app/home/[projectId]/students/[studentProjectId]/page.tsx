import { Suspense } from "react";
import Loading from "@/components/Loading";
import StudentRegisterPage from "@/components/students/StudentRegistration.";

type StudentRegistrationRouteProps = {
  params: Promise<{
    projectId: string;
    studentProjectId: string;
  }>;
};

export default function StudentRegistrationRoute({
  params,
}: StudentRegistrationRouteProps) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <Loading />
        </main>
      }
    >
      <StudentRegistrationContent params={params} />
    </Suspense>
  );
}

async function StudentRegistrationContent({
  params,
}: StudentRegistrationRouteProps) {
  const { projectId } = await params;

  return <StudentRegisterPage projectId={projectId} />;
}
