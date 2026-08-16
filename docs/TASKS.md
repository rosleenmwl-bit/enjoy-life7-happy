# EnjoyLife — Task Plan

## Sprint 1: Foundation — Schema + Activity Catalog + Browse
**Goal:** App renders with seeded activities, viewable by anyone, no login.
- [ ] Create Supabase tables: activities, preferences, daily_plans, plan_items, audit_logs (run migration SQL)
- [ ] Build `lib/data/` layer: activities.ts (list, getById, filter), plans.ts, preferences.ts, audit.ts
- [ ] Seed 6 realistic demo activities across 6+ categories with full suitability attributes
- [ ] Build browse page (`/`) with category filter chips and ActivityCard component
- [ ] Build responsive nav shell (sidebar desktop / hamburger mobile)
- [ ] Loading skeleton, empty state (no activities match filter), error state
**Definition of Done:** An anonymous visitor opens the app, sees 6 activity cards with icons, filters by category, and each card shows suitability details (effort, walking, cost, facilities).

## Sprint 2: Core Engine — Onboarding + Scoring + Recommendations ← **v1 functional milestone**
**Goal:** User answers questions, gets scored recommendations.
- [ ] Build 11-step onboarding flow (`/plan/onboarding`), one question per screen, progress indicator
- [ ] Store completed preference set in `preferences` table
- [ ] Implement scoring engine in `lib/scoring/engine.ts` (rule-based, 0–100, 4 tiers)
- [ ] Build `/plan/recommendations` page: top 5 scored activities as RecommendationCard (score, label, explanation, duration/walking/cost/facilities)
- [ ] "Plan My Day" button on recommendations page
- [ ] Empty state: no activities score ≥55 → show relaxed-criteria fallback message
- [ ] Log `preference_saved` and `recommendations_viewed` to audit_logs
**Definition of Done:** A visitor completes 11 questions, sees 3+ recommendation cards with EnjoyLife Scores and explanations, and can tap "Plan My Day."

## Sprint 3: Daily Plans + AI Adjustments + Weather
**Goal:** Full end-to-end plan generation with adjustments.
- [ ] Build plan generator in `lib/planner/builder.ts`: morning + lunch + afternoon + optional tea/evening, travel time, rest, buffer, no backtracking
- [ ] Build `/plan/day` page: "Your EnjoyLife Day" timeline with slot cards, travel time, rest periods
- [ ] Implement 9 adjustment buttons (cheaper, more relaxing, less walking, more indoor, more nature, more cafes, more photography, less travelling, surprise me)
- [ ] Adjustment modifies preference set, re-scores, regenerates plan, preserves other prefs
- [ ] Integrate weather API (server-side), adapt plan: move outdoor activities if rain forecast
- [ ] Log `plan_generated`, `plan_adjusted`, `weather_applied` to audit_logs
- [ ] Handle no-weather-data state (plan generates without weather adaptation)
**Definition of Done:** A visitor with a preference set sees a daily plan timeline, taps "Make it cheaper," and the plan regenerates with lower-cost activities. Weather is shown and the plan adapts if rain is forecast.

## Sprint 4: Lock It Down — Auth + Per-User Data
**Goal:** Real users can save and access their own data privately.
- [ ] Add Supabase auth: signup, login, logout screens
- [ ] Replace v1 permissive RLS with owner-scoped policies on preferences, daily_plans, plan_items, audit_logs
- [ ] Activities remain publicly readable; user-created activities are owner-scoped
- [ ] Link preferences and plans to `auth.uid()` on creation
- [ ] Anonymous users can browse catalog but cannot save preferences/plans
- [ ] Verify: owner sees only their plans; anonymous sees only catalog
**Definition of Done:** A logged-in user's plans and preferences are visible only to them. Anonymous visitors can still browse the activity catalog.

## Text Gantt
```
Sprint 1: Foundation        |==========|
Sprint 2: Core Engine       |          |==========|
Sprint 3: Plans+Adjust+Weather |                |==========|
Sprint 4: Lock Down         |                      |==========|
                            S1    S2    S3    S4
```
**v1 functional milestone:** End of Sprint 2 (onboarding → scored recommendations → Plan My Day ready).
**Full success scenario:** End of Sprint 3 (complete plan with adjustments and weather).