import type { ProjectWithRelations } from "@/types";
import { supabase } from "@/lib/supabase-client";
export { getErrorMessage } from "@/lib/errorMessage";

const projectRelations = `
  *,
  daily_jobs (*),
  part_time_jobs (*),
  students:student_details (
    id,
    project_id,
    full_name,
    index_number,
    email_address,
    NHI_image,
    NHI_number,
    birth_cer_image,
    mother_name,
    father_name,
    mother_contact,
    father_contact,
    emergency_number,
    location,
    gender,
    profile_image,
    created_at,
    amounts (*),
    transactions (*),
    products (*),
    fees:student_fees (*),
    messages:student_messages (*),
    feedback:student_feedback (*),
    semester_jobs:student_semester_jobs (*),
    part_time_jobs:student_part_time_jobs (*)
  )
`;

export async function fetchProjectsForUser(
  userId: string
): Promise<ProjectWithRelations[]> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectRelations)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ProjectWithRelations[];
}

export async function fetchProjectForUser(
  userId: string,
  projectId: string
): Promise<ProjectWithRelations | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(projectRelations)
    .eq("user_id", userId)
    .eq("id", projectId)
    .maybeSingle();

  if (error) throw error;

  return data as ProjectWithRelations | null;
}
