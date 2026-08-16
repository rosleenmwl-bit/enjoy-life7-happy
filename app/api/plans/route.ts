import { NextResponse } from "next/server";
import { createAuditLog } from "@/lib/data/audit";
import { listActivities } from "@/lib/data/activities";
import { createPlanRecord } from "@/lib/data/plans";
import { getPreferenceById } from "@/lib/data/preferences";
import { buildDayPlan } from "@/lib/planner/builder";
import { scoreActivities } from "@/lib/scoring/engine";
import { getWeatherForecast } from "@/lib/weather/adapter";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { preferenceId?: string };
    if (!body.preferenceId) {
      return NextResponse.json({ error: "A preference set is required." }, { status: 400 });
    }

    const [preference, activities] = await Promise.all([
      getPreferenceById(body.preferenceId),
      listActivities(),
    ]);
    if (!preference) {
      return NextResponse.json({ error: "Preference set not found." }, { status: 404 });
    }

    const scored = scoreActivities(activities, preference);
    const weather = await getWeatherForecast(preference);
    const slots = buildDayPlan(scored, preference, {
      rainExpected: weather?.rainExpected,
    });
    const plan = await createPlanRecord({
      preference,
      slots,
      weatherSummary: weather?.summary,
      weatherSource: weather?.source,
    });
    await createAuditLog({
      action: "plan_generated",
      entityType: "plan",
      entityId: plan.id,
      details: {
        preference_id: preference.id,
        weather_applied: Boolean(weather),
        rain_adaptation: weather?.rainExpected ?? false,
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
      { error: error instanceof Error ? error.message : "Could not build your day." },
      { status: 500 },
    );
  }
}
