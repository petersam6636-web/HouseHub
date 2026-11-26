import type { ProjectWithRelations } from "@/types";
import { supabase } from "@/lib/supabase-client";

export async function fetchProjectsForUser(
  userId: string
): Promise<ProjectWithRelations[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((project) => ({
    ...project,
    students: [],
    daily_jobs: [],
    part_time_jobs: [],
  })) as ProjectWithRelations[];
}
