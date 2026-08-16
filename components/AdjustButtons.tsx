"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ADJUSTMENTS,
  type AdjustmentType,
} from "@/lib/planner/adjustments";

export function AdjustButtons({ planId }: { planId: string }) {
  const router = useRouter();
  const [active, setActive] = useState<AdjustmentType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setActive(null);
  }, [planId]);

  async function adjust(adjustment: AdjustmentType) {
    setActive(adjustment);
    setError("");
    try {
      const response = await fetch("/api/plans/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, adjustment }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Could not adjust your day.");
      }
      router.push(`/plan/day?planId=${result.planId}&adjusted=${adjustment}`);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not adjust your day.",
      );
      setActive(null);
    }
  }

  const adjustmentEntries = Object.entries(ADJUSTMENTS) as [
    AdjustmentType,
    (typeof ADJUSTMENTS)[AdjustmentType],
  ][];

  return (
    <section className="adjust-section" aria-labelledby="adjust-title">
      <div className="adjust-heading">
        <div>
          <p className="eyebrow">Shape it with one tap</p>
          <h2 id="adjust-title">Would you like anything different?</h2>
        </div>
        <p>We’ll keep your other choices in place.</p>
      </div>
      <div className="adjust-grid">
        {adjustmentEntries.map(([key, adjustment]) => (
          <button
            type="button"
            className="adjust-button"
            key={key}
            disabled={active !== null}
            onClick={() => adjust(key)}
          >
            <span aria-hidden="true">{adjustment.icon}</span>
            {active === key ? "Refreshing…" : adjustment.label}
          </button>
        ))}
      </div>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
