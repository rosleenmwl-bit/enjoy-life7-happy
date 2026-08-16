import type { Preference } from "@/lib/types";
import type { PlanBuildOptions } from "@/lib/planner/builder";

export const ADJUSTMENTS = {
  cheaper: { label: "Make it cheaper", icon: "💰" },
  relaxing: { label: "More relaxing", icon: "🫖" },
  walking: { label: "Less walking", icon: "🚶" },
  indoor: { label: "More indoors", icon: "🏠" },
  nature: { label: "More nature", icon: "🌿" },
  cafes: { label: "More cafes", icon: "☕" },
  photography: { label: "More photography", icon: "📷" },
  travelling: { label: "Less travelling", icon: "📍" },
  surprise: { label: "Surprise me", icon: "✨" },
} as const;

export type AdjustmentType = keyof typeof ADJUSTMENTS;

export function isAdjustment(value: unknown): value is AdjustmentType {
  return typeof value === "string" && value in ADJUSTMENTS;
}

export function applyAdjustment(
  preference: Preference,
  adjustment: AdjustmentType,
): { preference: Preference; buildOptions: PlanBuildOptions } {
  const next = {
    ...preference,
    food_preferences: { ...preference.food_preferences },
  };
  const buildOptions: PlanBuildOptions = {};

  switch (adjustment) {
    case "cheaper":
      next.budget_per_person = Math.max(
        15,
        Math.round(preference.budget_per_person * 0.65),
      );
      buildOptions.preferCheaper = true;
      break;
    case "relaxing":
      next.preferred_pace = "relaxed";
      break;
    case "walking":
      next.walking_distance_m = Math.max(
        200,
        Math.round(preference.walking_distance_m * 0.6),
      );
      buildOptions.preferLessWalking = true;
      break;
    case "indoor":
      next.indoor_outdoor_pref = "indoor";
      buildOptions.preferIndoor = true;
      break;
    case "nature":
      next.mood_category = "Nature & Outdoors";
      break;
    case "cafes":
      next.mood_category = "Eat & Cafe";
      break;
    case "photography":
      next.mood_category = "Explore & Photograph";
      break;
    case "travelling":
      buildOptions.lessTravel = true;
      break;
    case "surprise":
      buildOptions.surprise = true;
      break;
  }

  return { preference: next, buildOptions };
}
