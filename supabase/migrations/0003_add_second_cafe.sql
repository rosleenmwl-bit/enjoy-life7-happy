insert into activities (name, category, icon, description, location_text, lat, lng, indoor_outdoor, physical_effort, walking_distance_m, has_stairs, has_seating, has_toilets, has_parking, public_transport_access, typical_cost_low, typical_cost_high, typical_duration_mins, ai_summary, ai_summary_source, ai_summary_confidence, ai_summary_review_status)
select
  'Matilda Bay Tea House',
  'Eat & Cafe',
  '🫖',
  'A peaceful riverside tea stop with shaded seating, level access, and a simple light menu.',
  'Matilda Bay, Crawley',
  -31.979,
  115.821,
  'either',
  1,
  120,
  false,
  true,
  true,
  true,
  'moderate',
  8,
  18,
  75,
  'A calm, affordable tea stop with level access, riverside views, and comfortable seating.',
  'manual',
  1.0,
  'approved'
where not exists (
  select 1 from activities where name = 'Matilda Bay Tea House'
);
