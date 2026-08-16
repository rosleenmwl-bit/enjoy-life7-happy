import type { ScoredActivity } from "@/lib/scoring/engine";

export function RecommendationCard({ result }: { result: ScoredActivity }) {
  const { activity } = result;
  return (
    <article className="recommendation-card">
      <div className="score-block">
        <span className={`score-ring score-${result.tier}`}>{result.score}</span>
        <div>
          <p>EnjoyLife Score</p>
          <strong>{result.label}</strong>
        </div>
      </div>
      <div className="recommendation-content">
        <div className="recommendation-heading">
          <span className="activity-icon" aria-hidden="true">{activity.icon}</span>
          <div><p className="eyebrow">{activity.category}</p><h2>{activity.name}</h2></div>
        </div>
        <p className="recommendation-explanation">{result.explanation}</p>
        <dl className="recommendation-facts">
          <div><dt>Duration</dt><dd>{activity.typical_duration_mins} min</dd></div>
          <div><dt>Walking</dt><dd>{activity.walking_distance_m} m</dd></div>
          <div><dt>Cost</dt><dd>{activity.typical_cost_high === 0 ? "Free" : `$${activity.typical_cost_low}–$${activity.typical_cost_high}`}</dd></div>
          <div><dt>Effort</dt><dd>{activity.physical_effort}/5</dd></div>
          <div><dt>Parking</dt><dd>{activity.has_parking ? "Available" : "Limited"}</dd></div>
          <div><dt>Transport</dt><dd>{activity.public_transport_access}</dd></div>
          <div><dt>Toilets</dt><dd>{activity.has_toilets ? "Onsite" : "Nearby"}</dd></div>
          <div><dt>Seating</dt><dd>{activity.has_seating ? "Available" : "Limited"}</dd></div>
        </dl>
      </div>
    </article>
  );
}
