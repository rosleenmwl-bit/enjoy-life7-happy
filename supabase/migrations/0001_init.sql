create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  category text not null,
  icon text not null default '✨',
  description text,
  location_text text,
  lat numeric,
  lng numeric,
  indoor_outdoor text default 'either',
  physical_effort numeric default 1,
  walking_distance_m numeric default 0,
  has_stairs boolean default false,
  has_seating boolean default true,
  has_toilets boolean default true,
  has_parking boolean default true,
  public_transport_access text default 'moderate',
  typical_cost_low numeric default 0,
  typical_cost_high numeric default 20,
  typical_duration_mins numeric default 120,
  ai_summary text,
  ai_summary_source text,
  ai_summary_confidence numeric,
  ai_summary_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  location_text text,
  lat numeric,
  lng numeric,
  mood_category text,
  available_time_mins numeric default 480,
  budget_per_person numeric default 50,
  preferred_pace text default 'relaxed',
  walking_distance_m numeric default 500,
  preferred_transport text default 'car',
  group_type text default 'solo',
  indoor_outdoor_pref text default 'either',
  comfort_notes text,
  food_preferences jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists daily_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  preference_id uuid,
  plan_date date,
  weather_summary text,
  weather_source text,
  weather_confidence numeric,
  weather_review_status text default 'unreviewed',
  ai_narrative text,
  ai_narrative_source text,
  ai_narrative_confidence numeric,
  ai_narrative_review_status text default 'unreviewed',
  created_at timestamptz not null default now()
);

create table if not exists plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  plan_id uuid,
  activity_id uuid,
  slot_label text not null,
  sort_order numeric default 0,
  start_time text,
  end_time text,
  travel_time_mins numeric default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table activities enable row level security;
alter table preferences enable row level security;
alter table daily_plans enable row level security;
alter table plan_items enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

drop policy if exists "preferences_v1_read" on preferences;
create policy "preferences_v1_read" on preferences for select using (true);
drop policy if exists "preferences_v1_write" on preferences;
create policy "preferences_v1_write" on preferences for all using (true) with check (true);

drop policy if exists "daily_plans_v1_read" on daily_plans;
create policy "daily_plans_v1_read" on daily_plans for select using (true);
drop policy if exists "daily_plans_v1_write" on daily_plans;
create policy "daily_plans_v1_write" on daily_plans for all using (true) with check (true);

drop policy if exists "plan_items_v1_read" on plan_items;
create policy "plan_items_v1_read" on plan_items for select using (true);
drop policy if exists "plan_items_v1_write" on plan_items;
create policy "plan_items_v1_write" on plan_items for all using (true) with check (true);

drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into activities (name, category, icon, description, location_text, indoor_outdoor, physical_effort, walking_distance_m, has_stairs, has_seating, has_toilets, has_parking, public_transport_access, typical_cost_low, typical_cost_high, typical_duration_mins, ai_summary, ai_summary_source, ai_summary_confidence, ai_summary_review_status)
values
('Riverside Cafe Brunch', 'Eat & Cafe', '☕', 'Quiet riverside cafe with outdoor seating, full breakfast menu, and gentle morning ambience.', 'Riverside Walk, Perth', 'either', 1, 100, false, true, true, true, 'good', 12, 25, 90, 'Gentle riverside brunch spot with easy parking, seating, and relaxed pace ideal for morning socialising.', 'manual', 1.0, 'approved'),
('Kings Park Botanical Walk', 'Nature & Outdoors', '🌿', 'Flat, paved loop through native gardens with benches every 200m and city views.', 'Kings Park, Perth', 'outdoor', 2, 800, false, true, true, true, 'moderate', 0, 0, 120, 'Accessible botanical walk with frequent seating, toilets, and parking. Best in cool morning hours.', 'manual', 0.95, 'approved'),
('Art Gallery Quiet Hour', 'Create & Learn', '🎨', 'Guided quiet viewing session with seated commentary and lift access to all floors.', 'Art Gallery of WA, Perth', 'indoor', 1, 200, false, true, true, true, 'good', 15, 18, 90, 'Seated, low-effort cultural experience with full accessibility and comfortable pacing.', 'manual', 0.9, 'approved'),
('Fremantle Photography Stroll', 'Explore & Photograph', '📸', 'Guided photo walk through historic Fremantle with rest stops and cafe finish.', 'Fremantle, Perth', 'outdoor', 2, 1200, true, true, true, false, 'good', 10, 15, 150, 'Leisurely photography walk with historic interest, rest stops, and cafe endpoint.', 'manual', 0.85, 'approved'),
('Day Spa Relaxation Session', 'Wellness & Relax', '💆', '60-minute relaxation massage with quiet lounge, tea service, and easy parking.', 'Subiaco, Perth', 'indoor', 1, 50, false, true, true, true, 'moderate', 45, 75, 90, 'Low-effort wellness session with comfortable facilities and no walking required.', 'manual', 1.0, 'approved'),
('Community Choir Sing-Along', 'Meet & Connect', '🤝', 'Weekly community singing group, seated, no experience needed, tea and biscuits after.', 'Leederville Town Hall, Perth', 'indoor', 1, 50, false, true, true, false, 'moderate', 5, 5, 120, 'Social seated activity with gentle engagement and post-session refreshments.', 'manual', 0.8, 'approved')
on conflict do nothing;

insert into preferences (location_text, mood_category, available_time_mins, budget_per_person, preferred_pace, walking_distance_m, preferred_transport, group_type, indoor_outdoor_pref, comfort_notes, food_preferences)
values
('Perth CBD, Perth', 'Nature & Outdoors', 480, 60, 'relaxed', 800, 'car', 'couple', 'either', 'Prefer flat paths with seating', '{"dietary": "no restrictions", "meal_pref": "light lunch"}')
on conflict do nothing;

insert into daily_plans (plan_date, weather_summary, weather_source, weather_confidence, weather_review_status, ai_narrative, ai_narrative_source, ai_narrative_confidence, ai_narrative_review_status)
values
('2025-01-15', 'Sunny morning 24°C, light cloud afternoon 27°C, no rain expected', 'openweather', 0.9, 'approved', 'A gentle day starting with a riverside brunch, a relaxed botanical walk, and a quiet afternoon at the art gallery. No rush — plenty of time to sit and enjoy each stop.', 'manual', 0.85, 'approved')
on conflict do nothing;

insert into plan_items (plan_id, activity_id, slot_label, sort_order, start_time, end_time, travel_time_mins, notes)
select dp.id, a.id, 'morning', 1, '09:00', '10:30', 15, 'Start the day gently with brunch by the river'
from daily_plans dp, activities a
where a.name = 'Riverside Cafe Brunch'
limit 1
on conflict do nothing;

insert into plan_items (plan_id, activity_id, slot_label, sort_order, start_time, end_time, travel_time_mins, notes)
select dp.id, a.id, 'afternoon', 2, '13:00', '14:30', 20, 'Quiet hour session — seated viewing with commentary'
from daily_plans dp, activities a
where a.name = 'Art Gallery Quiet Hour'
limit 1
on conflict do nothing;