import type { Preference } from "@/lib/types";
import type { ScoredActivity } from "@/lib/scoring/engine";

export type PlannedSlot = {
  activityId: string;
  slotLabel: "morning" | "lunch" | "afternoon";
  sortOrder: number;
  startTime: string;
  endTime: string;
  travelTimeMins: number;
  notes: string;
};

export type PlanBuildOptions = {
  rainExpected?: boolean;
  preferCheaper?: boolean;
  preferLessWalking?: boolean;
  preferIndoor?: boolean;
  lessTravel?: boolean;
  surprise?: boolean;
};

export function buildDayPlan(
  scored: ScoredActivity[],
  preference: Preference,
  options: PlanBuildOptions = {},
): PlannedSlot[] {
  const recommended = scored.filter((item) => item.score >= 55);
  let pool = [...(recommended.length >= 3 ? recommended : scored)];
  if (options.rainExpected || options.preferIndoor) {
    const indoor = pool.filter(
      (item) => item.activity.indoor_outdoor !== "outdoor",
    );
    if (indoor.length >= 3) pool = indoor;
  }
  if (options.preferCheaper && options.preferLessWalking) {
    pool.sort(
      (a, b) =>
        a.activity.typical_cost_high + a.activity.walking_distance_m / 5 -
          (b.activity.typical_cost_high + b.activity.walking_distance_m / 5) ||
        b.score - a.score,
    );
  } else if (options.preferCheaper) {
    pool.sort(
      (a, b) =>
        a.activity.typical_cost_high - b.activity.typical_cost_high ||
        b.score - a.score,
    );
  } else if (options.preferLessWalking) {
    pool.sort(
      (a, b) =>
        a.activity.walking_distance_m - b.activity.walking_distance_m ||
        b.score - a.score,
    );
  }
  if (options.surprise && pool.length > 4) {
    pool = [...pool.slice(2), ...pool.slice(0, 2)];
  }
  const cafe =
    [...pool]
      .filter((item) => item.activity.category === "Eat & Cafe")
      .sort(
        (a, b) =>
          a.activity.typical_cost_high - b.activity.typical_cost_high,
      )[0] ?? pool[1];
  const mainActivities = pool.filter(
    (item) => item.activity.id !== cafe?.activity.id,
  );
  const morning = mainActivities[0] ?? pool[0];
  const afternoon = mainActivities[1] ?? pool[2] ?? pool[0];

  if (!morning || !cafe || !afternoon) {
    throw new Error("There are not enough activities to build a complete day.");
  }

  const paceNote =
    preference.preferred_pace === "relaxed"
      ? "A gentle start with time to settle in"
      : "A bright start to the day";
  const rainNote = options.rainExpected
    ? "Kept indoors because rain is possible. "
    : "";
  const travelTimes = options.lessTravel ? [8, 10, 8] : [15, 20, 15];

  return [
    {
      activityId: morning.activity.id,
      slotLabel: "morning",
      sortOrder: 1,
      startTime: "09:30",
      endTime: "11:30",
      travelTimeMins: travelTimes[0],
      notes: `${rainNote}${paceNote}. Allow a 15-minute arrival buffer.`,
    },
    {
      activityId: cafe.activity.id,
      slotLabel: "lunch",
      sortOrder: 2,
      startTime: "12:00",
      endTime: "13:30",
      travelTimeMins: travelTimes[1],
      notes: "A relaxed lunch with at least 30 minutes to rest before the afternoon.",
    },
    {
      activityId: afternoon.activity.id,
      slotLabel: "afternoon",
      sortOrder: 3,
      startTime: "14:00",
      endTime: "16:00",
      travelTimeMins: travelTimes[2],
      notes: `${rainNote}An unhurried finish, with a comfort break whenever you need one.`,
    },
  ];
}
