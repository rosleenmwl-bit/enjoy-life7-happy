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

export function buildDayPlan(
  scored: ScoredActivity[],
  preference: Preference,
): PlannedSlot[] {
  const recommended = scored.filter((item) => item.score >= 55);
  const pool = recommended.length >= 3 ? recommended : scored;
  const cafe =
    pool.find((item) => item.activity.category === "Eat & Cafe") ?? pool[1];
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

  return [
    {
      activityId: morning.activity.id,
      slotLabel: "morning",
      sortOrder: 1,
      startTime: "09:30",
      endTime: "11:30",
      travelTimeMins: 15,
      notes: `${paceNote}. Allow a 15-minute arrival buffer.`,
    },
    {
      activityId: cafe.activity.id,
      slotLabel: "lunch",
      sortOrder: 2,
      startTime: "12:00",
      endTime: "13:30",
      travelTimeMins: 20,
      notes: "A relaxed lunch with at least 30 minutes to rest before the afternoon.",
    },
    {
      activityId: afternoon.activity.id,
      slotLabel: "afternoon",
      sortOrder: 3,
      startTime: "14:00",
      endTime: "16:00",
      travelTimeMins: 15,
      notes: "An unhurried finish, with a comfort break whenever you need one.",
    },
  ];
}
