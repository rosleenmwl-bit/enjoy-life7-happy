# EnjoyLife — Security

## Secret Handling
- OpenAI API key, Google Maps API key, Weather API key: stored in Vercel environment variables, accessed only in server-side API routes or server components.
- **Never** exposed to the client bundle. No keys in `NEXT_PUBLIC_*`.
- All AI/map/weather calls go through Next.js server routes (`app/api/`).

## Permission Model
- **v1 (demo-first):** All tables have permissive RLS policies — anonymous visitors can browse, onboard, and generate plans. No login wall. Seeded demo data is publicly readable.
- **Lock-down sprint:** Replace permissive policies with owner-scoped: `auth.uid() = user_id` for preferences, daily_plans, plan_items, and audit_logs. Activities remain publicly readable (catalog). Anonymous users can still browse the catalog but cannot save preferences or plans.
- Agent (AI) inherits the calling user's permissions — it can only read/write what the user can.

## Approved-Tools Rule
- AI code may only call named tools: `generate_narrative`, `generate_card_explanation`, `extract_keywords`.
- No raw `run_any`, `send_any`, or arbitrary function execution.
- No AI tool may delete data, modify activity attributes, or send external messages.

## Audit Principle
- Every plan generation, plan adjustment, and preference save writes an `audit_logs` row.
- Audit logs are append-only — no update or delete path.
- At lock-down, audit logs are owner-scoped (`auth.uid() = user_id`).

## Data Integrity
- Preferences and plans are linked by `preference_id` and `plan_id` foreign keys.
- AI-generated fields always carry `source`, `confidence`, and `review_status` — making it clear what is AI-drafted vs human-verified.
- All truth is server-derived (database state), surviving refresh, identical on every device.