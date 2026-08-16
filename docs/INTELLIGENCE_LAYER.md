# EnjoyLife — Intelligence Layer

## Messy Inputs
Onboarding answers are free-form selections. The scoring engine normalizes them into comparable dimensions:
- mood_category → activity category match
- budget_per_person → cost band comparison
- walking_distance_m → walking comfort ceiling
- preferred_pace → duration/effort tolerance
- available_time_mins → total plan budget
- indoor_outdoor_pref → environment filter
- group_type → social-suitability weight
- comfort_notes → keyword extraction (seating, stairs, flat, toilet)

## Auto-Structure Example
```json
{
  "location": {"text": "Kuala Lumpur", "lat": 3.139, "lng": 101.6869},
  "mood_category": "Nature & Outdoors",
  "time_budget_mins": 480,
  "budget_aud": 60,
  "pace": "relaxed",
  "walking_ceiling_m": 800,
  "transport": "car",
  "group": "couple",
  "environment": "either",
  "comfort_keywords": ["flat", "seating"],
  "food": {"dietary": "none", "meal_pref": "light lunch"}
}
```

## Scoring Rules (v1 — rule-based, no AI)
Starting at 100, deduct points:
- **Walking exceeds ceiling:** -15 per 200m over
- **Cost high exceeds budget:** -10 (low exceeds: -5)
- **Physical effort > pace tolerance** (relaxed allows 1–2, moderate 1–3, active 1–5): -12
- **Category mismatch with mood:** -8
- **Indoor/outdoor mismatch:** -6
- **No parking + user drives:** -5
- **Has stairs + comfort notes mention stairs/flat:** -10
- **No seating + comfort notes mention seating:** -8
- **Duration exceeds available time / 3 (per-slot):** -5
- **No toilets + group needs (family/long duration):** -3

**Match tiers:**
- 85–100 🟢 Excellent Match
- 70–84 🟢 Good Match
- 55–69 🟡 Moderate Match
- <55 🔴 Not Recommended

## Events Tracked
- `preference_saved` — onboarding complete
- `recommendations_viewed` — scored list shown
- `plan_generated` — daily plan created
- `plan_adjusted` — adjustment button tapped (type logged in details)
- `weather_applied` — plan repositioned due to weather

## What Gets Ranked
All activities scored against current preference set. Ranked descending. Top 5 shown as recommendation cards. Plan builder picks from top-scored, grouping by proximity and slot fit.

## v1 vs Later
- **v1:** Pure rule-based scoring. Deterministic. No AI calls.
- **Later:** OpenAI generates personalized narrative explanations. Learning profile adjusts weights from past plan feedback. Weather + Maps APIs refine scores with real distances.
