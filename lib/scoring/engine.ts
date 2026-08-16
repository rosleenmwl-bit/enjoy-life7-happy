import type { Activity, Preference } from "@/lib/types";

export type MatchTier = "excellent" | "good" | "moderate" | "not-recommended";

export type ScoredActivity = {
  activity: Activity;
  score: number;
  tier: MatchTier;
  label: string;
  explanation: string;
  deductions: { reason: string; points: number }[];
};

const tierDetails: Record<MatchTier, { label: string }> = {
  excellent: { label: "Excellent Match" },
  good: { label: "Good Match" },
  moderate: { label: "Moderate Match" },
  "not-recommended": { label: "Not Recommended" },
};

function getTier(score: number): MatchTier {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  return "not-recommended";
}

function comfortIncludes(preference: Preference, terms: string[]) {
  const notes = (preference.comfort_notes ?? "").toLowerCase();
  return terms.some((term) => notes.includes(term));
}

export function scoreActivity(
  activity: Activity,
  preference: Preference,
): ScoredActivity {
  const deductions: { reason: string; points: number }[] = [];
  const addDeduction = (reason: string, points: number) =>
    deductions.push({ reason, points });

  const walkingOver = Math.max(
    0,
    activity.walking_distance_m - preference.walking_distance_m,
  );
  if (walkingOver > 0) {
    addDeduction("more walking than preferred", Math.ceil(walkingOver / 200) * 15);
  }

  if (activity.typical_cost_high > preference.budget_per_person) {
    addDeduction("top of the cost range is over budget", 10);
  } else if (activity.typical_cost_low > preference.budget_per_person) {
    addDeduction("cost is over budget", 5);
  }

  const effortLimit = { relaxed: 2, moderate: 3, active: 5 }[
    preference.preferred_pace
  ];
  if (activity.physical_effort > effortLimit) {
    addDeduction("more energetic than your preferred pace", 12);
  }

  if (
    preference.mood_category &&
    activity.category !== preference.mood_category
  ) {
    addDeduction("different from today’s main mood", 8);
  }

  if (
    preference.indoor_outdoor_pref !== "either" &&
    activity.indoor_outdoor !== "either" &&
    activity.indoor_outdoor !== preference.indoor_outdoor_pref
  ) {
    addDeduction("not your preferred setting", 6);
  }

  if (preference.preferred_transport === "car" && !activity.has_parking) {
    addDeduction("parking is limited", 5);
  }
  if (activity.has_stairs && comfortIncludes(preference, ["stairs", "flat"])) {
    addDeduction("includes stairs", 10);
  }
  if (!activity.has_seating && comfortIncludes(preference, ["seat", "rest"])) {
    addDeduction("seating is limited", 8);
  }
  if (activity.typical_duration_mins > preference.available_time_mins / 3) {
    addDeduction("longer than one comfortable day slot", 5);
  }
  if (
    !activity.has_toilets &&
    (preference.group_type === "family" || activity.typical_duration_mins >= 150)
  ) {
    addDeduction("toilets are not available onsite", 3);
  }

  const score = Math.max(
    0,
    100 - deductions.reduce((sum, deduction) => sum + deduction.points, 0),
  );
  const tier = getTier(score);
  const positives = [
    activity.walking_distance_m <= preference.walking_distance_m &&
      "walking is within your comfort range",
    activity.typical_cost_high <= preference.budget_per_person &&
      (activity.typical_cost_high === 0
        ? "it is free to enjoy"
        : "it fits your budget"),
    activity.has_seating && "seating is available",
    activity.has_toilets && "toilets are onsite",
    activity.category === preference.mood_category && "it matches today’s mood",
  ].filter(Boolean) as string[];

  const explanation = positives.length
    ? `A comfortable choice because ${positives.slice(0, 3).join(", ")}.`
    : "This is one of the closest available options for the preferences you chose.";

  return {
    activity,
    score,
    tier,
    label: tierDetails[tier].label,
    explanation,
    deductions,
  };
}

export function scoreActivities(activities: Activity[], preference: Preference) {
  return activities
    .map((activity) => scoreActivity(activity, preference))
    .sort((a, b) => b.score - a.score || a.activity.name.localeCompare(b.activity.name));
}
