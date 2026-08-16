# EnjoyLife — Agentic Layer

## Draftable Actions (low risk — auto)
- **Score activities** — calculate suitability scores for all catalog activities against preferences. Auto, no approval.
- **Generate recommendation explanation** — produce "Why you'll enjoy it" text. Draft stored, shown immediately, reviewable.
- **Generate plan narrative** — "Your EnjoyLife Day" summary text. Draft stored with source/confidence/review_status.
- **Tag comfort keywords** — extract from free-text comfort notes. Auto.

## Executable After Approval (medium risk — light approval)
- **Regenerate plan with adjustment** — user taps adjustment button (e.g. "Less walking"), engine modifies preferences and rebuilds plan. User sees result before saving. Implicit approval (user initiated).
- **Reposition activities for weather** — weather adapter reorders outdoor/indoor slots. Shown in plan, user can accept or regenerate.

## Human-Only Actions (critical — never automated)
- **Delete an activity** from the catalog.
- **Delete a saved plan or preference set.**
- **Modify activity suitability attributes** (effort, walking, facilities) — these drive scores; only human-edited.

## Named Tools
No raw execution. The AI module may only call:
- `generate_narrative(preference_set, plan_items) → text`
- `generate_card_explanation(activity, preference_set, score) → text`
- `extract_keywords(text) → string[]`

All return drafts with `source`, `confidence`, `review_status`. No tool sends messages, makes purchases, or deletes data.

## Audit Log Fields
Every draftable and executable action logs:
- `action` — verb (e.g. `plan_adjusted`)
- `entity_type` + `entity_id` — what was affected
- `details` — JSON: adjustment type, old/new preference values, weather data used
- `user_id` — who triggered it
- `created_at`

## v1 vs Later
- **v1:** Rule-based scoring + plan generation (no AI calls). Adjustment buttons modify preferences and re-run rules. Audit logs for plan_generated and plan_adjusted.
- **Later:** OpenAI narratives (draftable, auto). Learning profile updates from feedback (medium risk). Weather API calls (executable, auto).