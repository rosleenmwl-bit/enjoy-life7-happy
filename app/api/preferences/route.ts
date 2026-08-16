import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/data/audit";
import { createPreference, type PreferenceInput } from "@/lib/data/preferences";
import { ACTIVITY_CATEGORIES } from "@/lib/types";

function isValidPreference(input: unknown): input is PreferenceInput {
  if (!input || typeof input !== "object") return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.location_text === "string" &&
    value.location_text.trim().length >= 2 &&
    typeof value.mood_category === "string" &&
    ACTIVITY_CATEGORIES.includes(value.mood_category as never) &&
    typeof value.available_time_mins === "number" &&
    typeof value.budget_per_person === "number" &&
    typeof value.walking_distance_m === "number" &&
    ["relaxed", "moderate", "active"].includes(String(value.preferred_pace)) &&
    ["car", "public", "walk"].includes(String(value.preferred_transport)) &&
    ["solo", "couple", "family", "friends"].includes(String(value.group_type)) &&
    ["indoor", "outdoor", "either"].includes(String(value.indoor_outdoor_pref))
  );
}

export async function POST(request: Request) {
  try {
    const input: unknown = await request.json();
    if (!isValidPreference(input)) {
      return NextResponse.json(
        { error: "Please complete every required preference." },
        { status: 400 },
      );
    }

    const preference = await createPreference(input);
    await createAuditLog({
      action: "preference_saved",
      entityType: "preference",
      entityId: preference.id,
      details: { anonymous_demo: true },
    });
    return NextResponse.json({ preference });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save preferences." },
      { status: 500 },
    );
  }
}
