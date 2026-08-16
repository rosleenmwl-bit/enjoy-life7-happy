import { createClient } from "@/lib/supabase/server";
import type { Preference } from "@/lib/types";

export type PreferenceInput = Omit<
  Preference,
  "id" | "user_id" | "created_at" | "lat" | "lng"
> & {
  lat?: number | null;
  lng?: number | null;
};

export async function createPreference(input: PreferenceInput): Promise<Preference> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preferences")
    .insert({ ...input, user_id: null })
    .select("*")
    .single();

  if (error) throw new Error(`Could not save preferences: ${error.message}`);
  return data as Preference;
}

export async function getPreferenceById(id: string): Promise<Preference | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Could not load preferences: ${error.message}`);
  return data as Preference | null;
}
