"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PlanDayButton({ preferenceId }: { preferenceId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createPlan() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferenceId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not build your day.");
      router.push(`/plan/day?planId=${result.planId}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not build your day.");
      setLoading(false);
    }
  }

  return (
    <div className="plan-cta">
      <button className="primary-button" type="button" onClick={createPlan} disabled={loading}>
        {loading ? "Building your gentle day…" : "Plan my day →"}
      </button>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  );
}
