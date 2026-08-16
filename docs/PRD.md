# EnjoyLife — Product Requirements

## Problem
Active retirees (55+) want to enjoy their day but waste time searching for activities that match their energy, budget, mobility, and mood. Existing apps are either travel booking sites, medical tools, or social networks — none simply answer: **"What would I enjoy doing today?"**

## Target User
Active retiree, 55+. Comfortable with smartphones but not tech-savvy. Values calm pacing, comfort, and affordability. Not seeking medical, travel-booking, or social-media features.

## Core Objects
- **Activity** — catalog entry with suitability attributes (effort, walking, cost, facilities, indoor/outdoor, duration)
- **Preference Set** — answers from 11-question onboarding (location, mood, time, budget, pace, walking, transport, group, indoor/outdoor, comfort, food)
- **Daily Plan** — timeline of 2–3 main activities + meals/rest, weather-adapted
- **Plan Item** — one slot in a daily plan (morning/lunch/afternoon/tea/evening)

## MVP (v1) Checklist
- [ ] Activity catalog seeded with 6+ realistic entries across all 9 categories
- [ ] Browse page with category filter chips, suitability details per card
- [ ] 11-question onboarding, one question per screen, stores a preference set
- [ ] Suitability scoring engine (rule-based, 0–100) with 4 match tiers
- [ ] Recommendation cards: score, label, explanation, duration/walking/cost/facilities
- [ ] Daily plan generator: morning + lunch + afternoon + optional tea/evening
- [ ] "Your EnjoyLife Day" timeline view with travel time, rest, buffer
- [ ] 9 AI adjustment buttons (cheaper, more relaxing, less walking, etc.) that regenerate
- [ ] Weather integration that adapts plan (not just displays)
- [ ] All screens viewable without login (seeded demo data)
- [ ] Loading / empty / partial / error states on every screen

## Non-Goals (v1)
- No user accounts or saved history (later sprint)
- No community forums, social feeds, or messaging
- No admin panel for activity management
- No payment processing or bookings
- No medical or accessibility certification

## Success Criteria
A first-time visitor with no account completes the 11-question onboarding, sees 3+ scored recommendation cards with explanations, generates a daily plan with morning/lunch/afternoon slots, taps "Make it cheaper," and sees the plan regenerate with lower-cost alternatives — all without logging in.