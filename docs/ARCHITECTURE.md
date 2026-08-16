# EnjoyLife — Architecture

## Stack
- **Frontend:** Next.js 14 (App Router, React, TypeScript)
- **Database/Auth:** Supabase (Postgres, RLS)
- **AI:** OpenAI API (server-side routes only)
- **Maps:** Google Maps/Places API (later sprint)
- **Weather:** OpenWeather or similar (server-side)
- **Hosting:** Vercel

## Build Sequence
- **Now:** DB schema → data-access layer → activity catalog & browse → onboarding flow → rule-based scoring engine → recommendation cards → daily plan generator → AI adjustment buttons → weather adaptation
- **Next:** Google Maps real distances & restaurant suggestions → OpenAI narrative generation → save preferences per user → learning from past plans
- **Later:** User accounts with history → per-user data isolation → community-contributed activities

## Key Action Flow (one user journey)
1. Visitor lands on browse page (sees seeded activities) — no login wall
2. Starts onboarding → answers 11 questions one per screen → preference set stored
3. Scoring engine rates all activities against preferences → produces 0–100 scores
4. Top-scored activities render as recommendation cards with explanations
5. User taps "Plan My Day" → plan generator picks activities for morning/afternoon slots, adds lunch/tea, inserts travel & rest
6. Weather fetched → outdoor activities repositioned if rain forecast
7. User taps adjustment button (e.g. "Less walking") → preferences modified → plan regenerated
8. Every plan generation and adjustment is logged

## Responsive Nav Shell
Left sidebar on desktop (sections: Browse, Plan My Day, About), collapses to hamburger on mobile. Current section highlighted. Keyboard accessible.

## Layer Plan
1. **Data first** — schema, seed data, data-access layer (all reads/writes via `lib/data/`)
2. **App logic** — onboarding state, scoring engine, plan builder, adjustment handler
3. **Smart features** — weather adaptation, OpenAI narratives, learning profile (later)

The core (browse, onboard, score, plan) runs entirely with rule-based logic — no AI calls required. AI enriches narratives and future personalization.

## Repo Structure
```
src/
  app/
    page.tsx                 # Browse / home
    plan/
      onboarding/page.tsx    # 11-question flow
      recommendations/page.tsx
      day/page.tsx            # Daily plan timeline
    layout.tsx               # Nav shell
  components/
    ActivityCard.tsx
    RecommendationCard.tsx
    PlanTimeline.tsx
    OnboardingStep.tsx
    AdjustButton.tsx
    Nav.tsx
  lib/
    data/                    # All DB reads/writes
      activities.ts
      preferences.ts
      plans.ts
      audit.ts
    scoring/                 # Suitability engine
      engine.ts
    planner/                 # Daily plan builder
      builder.ts
    ai/                      # OpenAI calls (server-only)
      narratives.ts
    weather/
      adapter.ts
  __tests__/
    scoring.test.ts
    planner.test.ts
```

## Module Map
| Module | Responsibility | Owns | Build Order |
|--------|---------------|------|-------------|
| `data` | All DB access | activities, preferences, plans, plan_items, audit_logs | 1st |
| `activities` | Browse & filter catalog | activity list view, category filters | 2nd |
| `onboarding` | Capture preferences | preference set state, step flow | 3rd |
| `scoring` | Suitability scoring (0–100) | score calculation, match tiers | 4th |
| `planner` | Build daily plan timeline | plan + plan_items generation | 5th |
| `adjust` | Regenerate plan with tweaks | adjustment button handlers | 6th |
| `weather` | Adapt plan to forecast | weather fetch, plan reordering | 7th |
| `ai` | OpenAI narratives | text generation for cards/plans | Later |