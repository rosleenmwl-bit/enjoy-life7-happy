import type { Activity } from "@/lib/types";

function formatCost(activity: Activity) {
  if (activity.typical_cost_high === 0) return "Free";
  if (activity.typical_cost_low === activity.typical_cost_high) {
    return `$${activity.typical_cost_high}`;
  }
  return `$${activity.typical_cost_low}–$${activity.typical_cost_high}`;
}

export function ActivityCard({ activity }: { activity: Activity }) {
  const facilities = [
    activity.has_seating && "Seating",
    activity.has_toilets && "Toilets",
    activity.has_parking && "Parking",
  ].filter(Boolean);

  return (
    <article className="activity-card">
      <div className="activity-card-top">
        <span className="activity-icon" aria-hidden="true">
          {activity.icon}
        </span>
        <span className="category-label">{activity.category}</span>
      </div>
      <div>
        <h2>{activity.name}</h2>
        <p className="location">{activity.location_text}</p>
      </div>
      <p className="activity-description">{activity.description}</p>
      <dl className="activity-facts">
        <div>
          <dt>Time</dt>
          <dd>{activity.typical_duration_mins} min</dd>
        </div>
        <div>
          <dt>Walking</dt>
          <dd>{activity.walking_distance_m} m</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{formatCost(activity)}</dd>
        </div>
        <div>
          <dt>Effort</dt>
          <dd>{activity.physical_effort}/5</dd>
        </div>
      </dl>
      <div className="facility-list" aria-label="Available facilities">
        {facilities.map((facility) => (
          <span key={String(facility)}>✓ {facility}</span>
        ))}
        <span>✓ {activity.indoor_outdoor}</span>
      </div>
    </article>
  );
}
