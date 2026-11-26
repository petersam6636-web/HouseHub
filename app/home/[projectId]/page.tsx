import { Suspense } from "react";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ProjectDetailsPage from "@/components/project/ProjectDetailsPage";

type ProjectDetailsRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default function ProjectDetailsRoute({
  params,
}: ProjectDetailsRouteProps) {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex min-h-[calc(100vh-72px)] w-full">
            <Loading />
          </main>
        </>
      }
    >
      <ProjectDetailsContent params={params} />
    </Suspense>
  );
}

async function ProjectDetailsContent({
  params,
}: ProjectDetailsRouteProps) {
  const { projectId } = await params;
  return <ProjectDetailsPage projectId={projectId} />;
}
