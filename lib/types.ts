export const ACTIVITY_CATEGORIES = [
  "Eat & Cafe",
  "Nature & Outdoors",
  "Create & Learn",
  "Explore & Photograph",
  "Wellness & Relax",
  "Meet & Connect",
  "History & Culture",
  "Music & Shows",
  "Markets & Shopping",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

export type Activity = {
  id: string;
  user_id: string | null;
  name: string;
  category: string;
  icon: string;
  description: string | null;
  location_text: string | null;
  lat: number | null;
  lng: number | null;
  indoor_outdoor: "indoor" | "outdoor" | "either";
  physical_effort: number;
  walking_distance_m: number;
  has_stairs: boolean;
  has_seating: boolean;
  has_toilets: boolean;
  has_parking: boolean;
  public_transport_access: "good" | "moderate" | "limited";
  typical_cost_low: number;
  typical_cost_high: number;
  typical_duration_mins: number;
  ai_summary: string | null;
  ai_summary_source: string | null;
  ai_summary_confidence: number | null;
  ai_summary_review_status: string | null;
  created_at: string;
};

export type Preference = {
  id: string;
  user_id: string | null;
  location_text: string | null;
  lat: number | null;
  lng: number | null;
  mood_category: string | null;
  available_time_mins: number;
  budget_per_person: number;
  preferred_pace: "relaxed" | "moderate" | "active";
  walking_distance_m: number;
  preferred_transport: "car" | "public" | "walk";
  group_type: "solo" | "couple" | "family" | "friends";
  indoor_outdoor_pref: "indoor" | "outdoor" | "either";
  comfort_notes: string | null;
  food_preferences: Record<string, string>;
  created_at: string;
};

export type DailyPlan = {
  id: string;
  user_id: string | null;
  preference_id: string;
  plan_date: string;
  weather_summary: string | null;
  weather_source: string | null;
  weather_confidence: number | null;
  weather_review_status: string | null;
  ai_narrative: string | null;
  ai_narrative_source: string | null;
  ai_narrative_confidence: number | null;
  ai_narrative_review_status: string | null;
  created_at: string;
};

export type PlanItem = {
  id: string;
  user_id: string | null;
  plan_id: string;
  activity_id: string | null;
  slot_label: string;
  sort_order: number;
  start_time: string | null;
  end_time: string | null;
  travel_time_mins: number;
  notes: string | null;
  created_at: string;
  activity?: Activity | null;
};
