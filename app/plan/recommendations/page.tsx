import Link from "next/link";
import { redirect } from "next/navigation";
import { PlanDayButton } from "@/components/PlanDayButton";
import { RecommendationCard } from "@/components/RecommendationCard";
import { createAuditLog } from "@/lib/data/audit";
import { listActivities } from "@/lib/data/activities";
import { getPreferenceById } from "@/lib/data/preferences";
import { scoreActivities } from "@/lib/scoring/engine";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage({
  searchParams,
}: {
  searchParams: Promise<{ preferenceId?: string }>;
}) {
  const { preferenceId } = await searchParams;
  if (!preferenceId) redirect("/plan/onboarding");

  const [preference, activities] = await Promise.all([
    getPreferenceById(preferenceId),
    listActivities(),
  ]);
  if (!preference) redirect("/plan/onboarding");

  const scored = scoreActivities(activities, preference);
  const recommended = scored.filter((item) => item.score >= 55);
  const usedFallback = recommended.length < 3;
  const results = (usedFallback ? scored : recommended).slice(0, 5);

  await createAuditLog({
    action: "recommendations_viewed",
    entityType: "preference",
    entityId: preference.id,
    details: { shown: results.length, relaxed_criteria: usedFallback },
  });

  return (
    <main className="page-shell recommendations-page">
      <section className="recommendations-intro">
        <div>
          <p className="eyebrow">Chosen around your comfort</p>
          <h1>Your best matches for today</h1>
          <p>Sorted from strongest match, using your pace, walking, cost, facilities, and mood.</p>
        </div>
        <Link className="secondary-button" href="/plan/onboarding">Change answers</Link>
      </section>
      {usedFallback ? (
        <div className="fallback-note" role="status">
          <strong>We’ve relaxed your criteria to find some options.</strong>
          <span>These are the best available matches, with any trade-offs reflected in their scores.</span>
        </div>
      ) : null}
      <div className="recommendation-list">
        {results.map((result) => <RecommendationCard key={result.activity.id} result={result} />)}
      </div>
      <PlanDayButton preferenceId={preference.id} />
    </main>
  );
}
