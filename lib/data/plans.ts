import { createClient } from "@/lib/supabase/server";
import type { DailyPlan, PlanItem, Preference } from "@/lib/types";
import type { PlannedSlot } from "@/lib/planner/builder";

export async function createPlanRecord(input: {
  preference: Preference;
  slots: PlannedSlot[];
  weatherSummary?: string | null;
  weatherSource?: string | null;
  narrative?: string;
}): Promise<DailyPlan> {
  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase
    .from("daily_plans")
    .insert({
      user_id: null,
      preference_id: input.preference.id,
      plan_date: new Date().toISOString().slice(0, 10),
      weather_summary: input.weatherSummary ?? null,
      weather_source: input.weatherSource ?? null,
      weather_confidence: input.weatherSummary ? 0.85 : null,
      weather_review_status: input.weatherSummary ? "approved" : "unreviewed",
      ai_narrative:
        input.narrative ??
        "A comfortable day with a gentle morning, a relaxed lunch, and an unhurried afternoon.",
      ai_narrative_source: "rule-based-v1",
      ai_narrative_confidence: 1,
      ai_narrative_review_status: "approved",
    })
    .select("*")
    .single();

  if (planError) throw new Error(`Could not create plan: ${planError.message}`);

  const { error: itemsError } = await supabase.from("plan_items").insert(
    input.slots.map((slot) => ({
      user_id: null,
      plan_id: plan.id,
      activity_id: slot.activityId,
      slot_label: slot.slotLabel,
      sort_order: slot.sortOrder,
      start_time: slot.startTime,
      end_time: slot.endTime,
      travel_time_mins: slot.travelTimeMins,
      notes: slot.notes,
    })),
  );

  if (itemsError) {
    await supabase.from("daily_plans").delete().eq("id", plan.id);
    throw new Error(`Could not create plan items: ${itemsError.message}`);
  }

  return plan as DailyPlan;
}

export async function getPlanById(
  id: string,
): Promise<{ plan: DailyPlan; items: PlanItem[] } | null> {
  const supabase = await createClient();
  const { data: plan, error: planError } = await supabase
    .from("daily_plans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (planError) throw new Error(`Could not load plan: ${planError.message}`);
  if (!plan) return null;

  const { data: items, error: itemsError } = await supabase
    .from("plan_items")
    .select("*")
    .eq("plan_id", id)
    .order("sort_order");

  if (itemsError) throw new Error(`Could not load plan items: ${itemsError.message}`);

  const activityIds = (items ?? [])
    .map((item) => item.activity_id as string | null)
    .filter((activityId): activityId is string => Boolean(activityId));
  const { data: activities, error: activitiesError } = activityIds.length
    ? await supabase.from("activities").select("*").in("id", activityIds)
    : { data: [], error: null };

  if (activitiesError) {
    throw new Error(`Could not load plan activities: ${activitiesError.message}`);
  }

  const activitiesById = new Map(
    (activities ?? []).map((activity) => [activity.id, activity]),
  );
  const hydratedItems = (items ?? []).map((item) => ({
    ...item,
    activity: item.activity_id ? activitiesById.get(item.activity_id) ?? null : null,
  }));

  return { plan: plan as DailyPlan, items: hydratedItems as PlanItem[] };
}
