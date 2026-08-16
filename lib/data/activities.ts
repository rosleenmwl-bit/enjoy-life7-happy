import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/lib/types";

export async function listActivities(): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(`Could not load activities: ${error.message}`);
  }

  return (data ?? []) as Activity[];
}

export async function getActivityById(id: string): Promise<Activity | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load activity: ${error.message}`);
  }

  return data as Activity | null;
}
