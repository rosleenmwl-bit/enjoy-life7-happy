import assert from "node:assert/strict";
import test from "node:test";
import { applyAdjustment } from "../lib/planner/adjustments.ts";
import { buildDayPlan } from "../lib/planner/builder.ts";
import { scoreActivities, scoreActivity } from "../lib/scoring/engine.ts";
import type { Activity, Preference } from "../lib/types.ts";

const preference: Preference = {
  id: "preference-1",
  user_id: null,
  location_text: "Perth CBD",
  lat: -31.95,
  lng: 115.86,
  mood_category: "Nature & Outdoors",
  available_time_mins: 480,
  budget_per_person: 60,
  preferred_pace: "relaxed",
  walking_distance_m: 800,
  preferred_transport: "car",
  group_type: "couple",
  indoor_outdoor_pref: "either",
  comfort_notes: "Flat paths with seating",
  food_preferences: { dietary: "none" },
  created_at: "2026-08-17T00:00:00.000Z",
};

function activity(
  id: string,
  name: string,
  category: string,
  cost: number,
  walking: number,
  indoorOutdoor: Activity["indoor_outdoor"] = "indoor",
): Activity {
  return {
    id,
    user_id: null,
    name,
    category,
    icon: "✨",
    description: name,
    location_text: "Perth",
    lat: null,
    lng: null,
    indoor_outdoor: indoorOutdoor,
    physical_effort: 1,
    walking_distance_m: walking,
    has_stairs: false,
    has_seating: true,
    has_toilets: true,
    has_parking: true,
    public_transport_access: "good",
    typical_cost_low: Math.max(0, cost - 5),
    typical_cost_high: cost,
    typical_duration_mins: 90,
    ai_summary: null,
    ai_summary_source: "manual",
    ai_summary_confidence: 1,
    ai_summary_review_status: "approved",
    created_at: "2026-08-17T00:00:00.000Z",
  };
}

const activities = [
  activity("nature", "Garden Walk", "Nature & Outdoors", 0, 800, "outdoor"),
  activity("gallery", "Art Gallery", "Create & Learn", 40, 250),
  activity("choir", "Community Choir", "Meet & Connect", 5, 50),
  activity("cafe", "Cafe", "Eat & Cafe", 25, 100, "either"),
  activity("museum", "Museum", "History & Culture", 15, 300),
];

test("walking above the comfort ceiling lowers the suitability score", () => {
  const longWalk = activity(
    "long-walk",
    "Long Walk",
    "Nature & Outdoors",
    0,
    1200,
    "outdoor",
  );
  const result = scoreActivity(longWalk, preference);
  assert.equal(result.score, 70);
  assert.equal(result.deductions[0]?.reason, "more walking than preferred");
});

test("cheaper adjustment lowers both budget and generated plan cost", () => {
  const normalScored = scoreActivities(activities, preference);
  const normalPlan = buildDayPlan(normalScored, preference);
  const adjusted = applyAdjustment(preference, "cheaper");
  const cheaperScored = scoreActivities(activities, adjusted.preference);
  const cheaperPlan = buildDayPlan(
    cheaperScored,
    adjusted.preference,
    adjusted.buildOptions,
  );
  const costs = new Map(activities.map((item) => [item.id, item.typical_cost_high]));
  const total = (slots: { activityId: string }[]) =>
    slots.reduce((sum, slot) => sum + (costs.get(slot.activityId) ?? 0), 0);

  assert.equal(adjusted.preference.budget_per_person, 39);
  assert.ok(total(cheaperPlan) < total(normalPlan));
  assert.equal(adjusted.preference.group_type, preference.group_type);
});

test("rain adaptation selects indoor or flexible activities", () => {
  const scored = scoreActivities(activities, preference);
  const plan = buildDayPlan(scored, preference, { rainExpected: true });
  const byId = new Map(activities.map((item) => [item.id, item]));
  assert.ok(
    plan.every(
      (slot) => byId.get(slot.activityId)?.indoor_outdoor !== "outdoor",
    ),
  );
});

test("less travelling reduces displayed travel time", () => {
  const scored = scoreActivities(activities, preference);
  const normal = buildDayPlan(scored, preference);
  const adjusted = applyAdjustment(preference, "travelling");
  const shorter = buildDayPlan(scored, adjusted.preference, adjusted.buildOptions);
  const minutes = (slots: { travelTimeMins: number }[]) =>
    slots.reduce((sum, slot) => sum + slot.travelTimeMins, 0);
  assert.ok(minutes(shorter) < minutes(normal));
});

test("less walking after cheaper preserves the lower budget and shortens the plan", () => {
  const cheaper = applyAdjustment(preference, "cheaper");
  const cheaperScored = scoreActivities(activities, cheaper.preference);
  const cheaperPlan = buildDayPlan(
    cheaperScored,
    cheaper.preference,
    cheaper.buildOptions,
  );
  const walking = applyAdjustment(cheaper.preference, "walking");
  const walkingScored = scoreActivities(activities, walking.preference);
  const walkingPlan = buildDayPlan(walkingScored, walking.preference, {
    ...walking.buildOptions,
    preferCheaper: walking.preference.budget_per_person <= 40,
  });
  const distances = new Map(
    activities.map((item) => [item.id, item.walking_distance_m]),
  );
  const totalWalking = (slots: { activityId: string }[]) =>
    slots.reduce(
      (sum, slot) => sum + (distances.get(slot.activityId) ?? 0),
      0,
    );

  assert.equal(walking.preference.budget_per_person, 39);
  assert.ok(totalWalking(walkingPlan) < totalWalking(cheaperPlan));
});
