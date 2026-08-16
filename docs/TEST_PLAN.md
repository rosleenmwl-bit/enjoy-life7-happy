# EnjoyLife — Test Plan

## v1 Success Scenario (end of Sprint 3)
1. Open app in browser (not logged in) → browse page loads with 6 activity cards
2. Tap "Start" or "Plan My Day" → onboarding begins
3. Answer all 11 questions (one per screen): Kuala Lumpur, Nature & Outdoors, 8 hours, $60, relaxed, 800m, car, couple, either, prefer flat paths with seating, no dietary restrictions
4. Complete onboarding → redirected to recommendations page
5. Verify: 3+ recommendation cards visible, each with EnjoyLife Score (0–100), match label, explanation text, duration, walking distance, cost, parking, transport, toilets, effort level
6. Verify: cards sorted by score descending; top card shows 🟢 Excellent or Good Match
7. Tap "Plan My Day" → daily plan page loads with "Your EnjoyLife Day" timeline
8. Verify: timeline shows morning activity + lunch + afternoon activity, with travel times and rest/buffer noted
9. Tap "💰 Make it cheaper" → plan regenerates
10. Verify: new plan shows lower-cost activities, other preferences preserved
11. Tap "🚶 Less walking" → plan regenerates with shorter walking distances
12. Verify: weather summary shown on plan; if rain forecast, outdoor activity moved to morning or replaced
13. Verify: no login wall at any point during this flow

## Empty State Tests
- **No matching activities:** Set preferences so all activities score <55 → verify fallback message: "We've relaxed your criteria to find some options" with best-available matches shown
- **No activities in category:** Filter to a category with no seeded activities → verify empty state with friendly message and suggestion to browse all

## Error State Tests
- **Database unreachable:** Stop Supabase connection → browse page shows error state with retry button, not a blank screen or crash
- **Weather API failure:** Simulate weather API timeout → plan generates without weather adaptation, shows "Weather unavailable — plan generated without weather adjustments"
- **Onboarding incomplete:** Navigate directly to `/plan/recommendations` without completing onboarding → redirect to onboarding step 1

## Loading State Tests
- Browse page initial load → skeleton cards shown before data renders
- Recommendations page after onboarding → loading indicator while scoring engine runs
- Plan page after tapping "Plan My Day" → timeline skeleton while plan builds

## Lock-Down Tests (Sprint 4)
- Sign up as new user → complete onboarding → generate plan → log out → log in → verify plans and preferences persist and are visible
- Log in as user A → create plan → log out → log in as user B → verify user A's plans are NOT visible
- Anonymous visit → browse catalog works → attempt to save preference → redirect to login
