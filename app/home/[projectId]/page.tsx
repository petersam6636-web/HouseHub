import ProjectDetailsPage from "@/components/project/ProjectDetailsPage";

type ProjectDetailsRouteProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailsRoute({
  params,
}: ProjectDetailsRouteProps) {
  const { projectId } = await params;
  return <ProjectDetailsPage projectId={projectId} />;
}
