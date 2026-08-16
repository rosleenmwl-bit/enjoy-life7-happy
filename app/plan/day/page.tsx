import Link from "next/link";
import { redirect } from "next/navigation";
import { AdjustButtons } from "@/components/AdjustButtons";
import { getPlanById } from "@/lib/data/plans";

export const dynamic = "force-dynamic";

export default async function DayPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string; adjusted?: string }>;
}) {
  const { planId, adjusted } = await searchParams;
  if (!planId) redirect("/plan/onboarding");
  const result = await getPlanById(planId);
  if (!result) redirect("/plan/onboarding");

  const totalCost = result.items.reduce(
    (sum, item) => sum + (item.activity?.typical_cost_high ?? 0),
    0,
  );
  const totalWalking = result.items.reduce(
    (sum, item) => sum + (item.activity?.walking_distance_m ?? 0),
    0,
  );
  const totalTravel = result.items.reduce(
    (sum, item) => sum + item.travel_time_mins,
    0,
  );

  return (
    <main className="page-shell plan-page">
      <section className="plan-heading">
        <p className="eyebrow">Made for an unhurried pace</p>
        <h1>Your EnjoyLife Day</h1>
        <p>{result.plan.ai_narrative}</p>
        {adjusted ? (
          <span className="adjusted-badge">✓ Plan refreshed</span>
        ) : null}
      </section>

      <section
        className={`weather-card ${result.plan.weather_summary ? "" : "weather-unavailable"}`}
      >
        <span className="weather-icon" aria-hidden="true">
          {result.plan.weather_summary ? "🌤️" : "🌫️"}
        </span>
        <div>
          <p className="eyebrow">Today’s weather</p>
          <h2>
            {result.plan.weather_summary
              ? "Weather-aware planning"
              : "Weather unavailable"}
          </h2>
          <p>
            {result.plan.weather_summary ??
              "Weather unavailable — plan generated without weather adjustments."}
          </p>
        </div>
      </section>

      <div className="timeline">
        {result.items.map((item) => (
          <article className="timeline-item" key={item.id}>
            <div className="timeline-time">
              <strong>{item.start_time}</strong>
              <span>{item.end_time}</span>
            </div>
            <span className="timeline-dot" aria-hidden="true" />
            <div className="timeline-card">
              <p className="eyebrow">{item.slot_label}</p>
              <h2>
                {item.activity?.icon} {item.activity?.name}
              </h2>
              <p>{item.notes}</p>
              <div className="timeline-meta">
                <span>🚗 {item.travel_time_mins} min travel</span>
                <span>🚶 {item.activity?.walking_distance_m} m walking</span>
                <span>
                  💳 {item.activity?.typical_cost_high === 0
                    ? "Free"
                    : `Up to $${item.activity?.typical_cost_high}`}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="plan-totals" aria-label="Plan totals">
        <div>
          <span>Total activity cost</span>
          <strong>Up to ${totalCost}</strong>
        </div>
        <div>
          <span>Total walking</span>
          <strong>{totalWalking} m</strong>
        </div>
        <div>
          <span>Total travel</span>
          <strong>{totalTravel} min</strong>
        </div>
      </section>

      <AdjustButtons planId={result.plan.id} />
      <div className="plan-footer-actions">
        <Link
          className="secondary-button"
          href={`/plan/recommendations?preferenceId=${result.plan.preference_id}`}
        >
          Back to matches
        </Link>
        <Link className="primary-button" href="/plan/onboarding">
          Plan another day
        </Link>
      </div>
    </main>
  );
}
