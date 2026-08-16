import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/data/audit";
import { listActivities } from "@/lib/data/activities";
import { createPlanRecord, getPlanById } from "@/lib/data/plans";
import { createPreference, getPreferenceById } from "@/lib/data/preferences";
import { applyAdjustment, ADJUSTMENTS, isAdjustment } from "@/lib/planner/adjustments";
import { buildDayPlan } from "@/lib/planner/builder";
import { scoreActivities } from "@/lib/scoring/engine";
import { getWeatherForecast } from "@/lib/weather/adapter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      planId?: string;
      adjustment?: unknown;
    };
    if (!body.planId || !isAdjustment(body.adjustment)) {
      return NextResponse.json(
        { error: "Choose a valid plan adjustment." },
        { status: 400 },
      );
    }

    const currentPlan = await getPlanById(body.planId);
    if (!currentPlan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }
    const currentPreference = await getPreferenceById(
      currentPlan.plan.preference_id,
    );
    if (!currentPreference) {
      return NextResponse.json(
        { error: "Plan preferences not found." },
        { status: 404 },
      );
    }

    const adjusted = applyAdjustment(currentPreference, body.adjustment);
    const preference = await createPreference({
      location_text: adjusted.preference.location_text,
      lat: adjusted.preference.lat,
      lng: adjusted.preference.lng,
      mood_category: adjusted.preference.mood_category,
      available_time_mins: adjusted.preference.available_time_mins,
      budget_per_person: adjusted.preference.budget_per_person,
      preferred_pace: adjusted.preference.preferred_pace,
      walking_distance_m: adjusted.preference.walking_distance_m,
      preferred_transport: adjusted.preference.preferred_transport,
      group_type: adjusted.preference.group_type,
      indoor_outdoor_pref: adjusted.preference.indoor_outdoor_pref,
      comfort_notes: adjusted.preference.comfort_notes,
      food_preferences: adjusted.preference.food_preferences,
    });

    const [activities, weather] = await Promise.all([
      listActivities(),
      getWeatherForecast(preference),
    ]);
    const scored = scoreActivities(activities, preference);
    const slots = buildDayPlan(scored, preference, {
      ...adjusted.buildOptions,
      preferCheaper:
        adjusted.buildOptions.preferCheaper ||
        preference.budget_per_person <= 40,
      preferIndoor:
        adjusted.buildOptions.preferIndoor ||
        preference.indoor_outdoor_pref === "indoor",
      rainExpected: weather?.rainExpected,
    });
    const adjustmentDetails = ADJUSTMENTS[body.adjustment];
    const plan = await createPlanRecord({
      preference,
      slots,
      weatherSummary: weather?.summary,
      weatherSource: weather?.source,
      narrative: `Your day has been refreshed to feel ${adjustmentDetails.label.toLowerCase()}, while keeping the rest of your choices in place.`,
    });

    await createAuditLog({
      action: "plan_adjusted",
      entityType: "plan",
      entityId: plan.id,
      details: {
        adjustment: body.adjustment,
        previous_plan_id: body.planId,
        previous_preference_id: currentPreference.id,
        preference_id: preference.id,
        old_budget: currentPreference.budget_per_person,
        new_budget: preference.budget_per_person,
        old_walking_m: currentPreference.walking_distance_m,
        new_walking_m: preference.walking_distance_m,
      },
    });
    if (weather) {
      await createAuditLog({
        action: "weather_applied",
        entityType: "plan",
        entityId: plan.id,
        details: {
          source: weather.source,
          rain_expected: weather.rainExpected,
          precipitation_probability: weather.precipitationProbability,
        },
      });
    }

    return NextResponse.json({ planId: plan.id });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not adjust your day.",
      },
      { status: 500 },
    );
  }
}
