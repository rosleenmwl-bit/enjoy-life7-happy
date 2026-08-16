# EnjoyLife — Data Model

## activities
| Field | Type | Notes |
|------|------|-------|
| id | uuid PK | |
| user_id | uuid nullable | owner (for lock-down) |
| name | text | e.g. "Riverside Cafe Brunch" |
| category | text | one of 9 categories |
| icon | text | emoji |
| description | text | human-readable summary |
| location_text | text | address/area |
| lat / lng | numeric | coordinates (later: Maps) |
| indoor_outdoor | text | indoor / outdoor / either |
| physical_effort | numeric 1–5 | 1 = minimal |
| walking_distance_m | numeric | total walking in metres |
| has_stairs | boolean | |
| has_seating | boolean | |
| has_toilets | boolean | |
| has_parking | boolean | |
| public_transport_access | text | good / moderate / limited |
| typical_cost_low | numeric | AUD |
| typical_cost_high | numeric | AUD |
| typical_duration_mins | numeric | |
| ai_summary | text | AI-generated description |
| ai_summary_source | text | model name or 'manual' |
| ai_summary_confidence | numeric | 0–1 |
| ai_summary_review_status | text | unreviewed / approved / rejected |
| created_at | timestamptz | |

## preferences
| Field | Type | Notes |
|------|------|-------|
| id | uuid PK | |
| user_id | uuid nullable | |
| location_text | text | user's area |
| lat / lng | numeric | |
| mood_category | text | preferred activity type |
| available_time_mins | numeric | e.g. 480 (full day) |
| budget_per_person | numeric | AUD |
| preferred_pace | text | relaxed / moderate / active |
| walking_distance_m | numeric | comfort ceiling |
| preferred_transport | text | car / public / walk |
| group_type | text | solo / couple / family / friends |
| indoor_outdoor_pref | text | indoor / outdoor / either |
| comfort_notes | text | free text |
| food_preferences | jsonb | dietary, meal prefs |
| created_at | timestamptz | |

## daily_plans
| Field | Type | Notes |
|------|------|-------|
| id | uuid PK | |
| user_id | uuid nullable | |
| preference_id | uuid | FK to preferences |
| plan_date | date | |
| weather_summary | text | AI/external data |
| weather_source | text | |
| weather_confidence | numeric | |
| weather_review_status | text | unreviewed / approved |
| ai_narrative | text | generated day summary |
| ai_narrative_source | text | |
| ai_narrative_confidence | numeric | |
| ai_narrative_review_status | text | |
| created_at | timestamptz | |

## plan_items
| Field | Type | Notes |
|------|------|-------|
| id | uuid PK | |
| user_id | uuid nullable | |
| plan_id | uuid | FK to daily_plans |
| activity_id | uuid | FK to activities |
| slot_label | text | morning / lunch / afternoon / tea / evening |
| sort_order | numeric | |
| start_time | text | "09:00" |
| end_time | text | "10:30" |
| travel_time_mins | numeric | |
| notes | text | |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|------|------|-------|
| id | uuid PK | |
| user_id | uuid nullable | |
| action | text | plan_generated / plan_adjusted / preference_saved |
| entity_type | text | plan / preference / activity |
| entity_id | uuid | |
| details | jsonb | adjustment type, old/new values |
| created_at | timestamptz | |

## Relationships
- `daily_plans.preference_id` → `preferences.id`
- `plan_items.plan_id` → `daily_plans.id`
- `plan_items.activity_id` → `activities.id`

## RLS Notes
- v1: all tables permissive (read + write for anonymous) — demo-first
- Lock-down sprint: replace with `auth.uid() = user_id` owner policies; activities remain publicly readable

## AI Fields Convention
Every AI-generated value stores: `value` + `source` (model/manual) + `confidence` (0–1) + `review_status` (unreviewed/approved/rejected).