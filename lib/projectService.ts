import type { ProjectWithRelations } from "@/types";
import { supabase } from "@/lib/supabase-client";

export async function fetchProjectsForUser(
  userId: string
): Promise<ProjectWithRelations[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*, students(*, semester_jobs(*)), daily_jobs(*), part_time_jobs(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ProjectWithRelations[];
}
