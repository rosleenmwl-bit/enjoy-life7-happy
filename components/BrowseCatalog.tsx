"use client";

import { useMemo, useState } from "react";
import { ActivityCard } from "@/components/ActivityCard";
import { ACTIVITY_CATEGORIES, type Activity } from "@/lib/types";

export function BrowseCatalog({ activities }: { activities: Activity[] }) {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () =>
      category === "All"
        ? activities
        : activities.filter((activity) => activity.category === category),
    [activities, category],
  );

  return (
    <>
      <div className="filter-row" aria-label="Filter activities by category">
        {["All", ...ACTIVITY_CATEGORIES].map((item) => (
          <button
            type="button"
            key={item}
            className={`filter-chip ${category === item ? "filter-chip-active" : ""}`}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="activity-grid" aria-live="polite">
          {filtered.map((activity) => (
            <ActivityCard activity={activity} key={activity.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state" role="status">
          <span aria-hidden="true">🍃</span>
          <h2>Nothing in this category yet</h2>
          <p>Try another category, or return to the full collection.</p>
          <button className="secondary-button" type="button" onClick={() => setCategory("All")}>
            Browse all activities
          </button>
        </div>
      )}
    </>
  );
}
