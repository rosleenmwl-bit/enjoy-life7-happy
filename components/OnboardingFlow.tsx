"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ACTIVITY_CATEGORIES } from "@/lib/types";

type Answers = {
  location_text: string;
  mood_category: string;
  available_time_mins: number;
  budget_per_person: number;
  preferred_pace: string;
  walking_distance_m: number;
  preferred_transport: string;
  group_type: string;
  indoor_outdoor_pref: string;
  comfort_notes: string;
  food_preference: string;
};

const initialAnswers: Answers = {
  location_text: "Kuala Lumpur",
  mood_category: "Nature & Outdoors",
  available_time_mins: 480,
  budget_per_person: 60,
  preferred_pace: "relaxed",
  walking_distance_m: 800,
  preferred_transport: "car",
  group_type: "couple",
  indoor_outdoor_pref: "either",
  comfort_notes: "Prefer flat paths with seating",
  food_preference: "No dietary restrictions",
};

const steps = [
  { key: "location_text", eyebrow: "Your starting point", title: "Where would you like to spend the day?", help: "A suburb, town, or familiar landmark is perfect.", type: "text" },
  { key: "mood_category", eyebrow: "Today’s mood", title: "What sounds enjoyable today?", help: "Choose the feeling you would most like your day to have.", options: ACTIVITY_CATEGORIES },
  { key: "available_time_mins", eyebrow: "Time available", title: "How much time do you have?", help: "We will leave breathing room between each stop.", options: [[240, "Half day · 4 hours"], [360, "Easy day · 6 hours"], [480, "Full day · 8 hours"]] },
  { key: "budget_per_person", eyebrow: "Your budget", title: "What feels comfortable per person?", help: "Free activities can still be included at every level.", options: [[25, "Up to $25"], [40, "Up to $40"], [60, "Up to $60"], [100, "Up to $100"]] },
  { key: "preferred_pace", eyebrow: "Pace", title: "How active should the day feel?", help: "There is no wrong answer—choose what feels good today.", options: [["relaxed", "Relaxed"], ["moderate", "Moderate"], ["active", "Active"]] },
  { key: "walking_distance_m", eyebrow: "Walking comfort", title: "How much walking feels comfortable?", help: "This is the total walking at each main activity.", options: [[300, "A little · up to 300 m"], [800, "Gentle · up to 800 m"], [1500, "Comfortable · up to 1.5 km"], [3000, "Plenty · up to 3 km"]] },
  { key: "preferred_transport", eyebrow: "Getting around", title: "How would you prefer to travel?", help: "We consider parking and public transport access.", options: [["car", "By car"], ["public", "Public transport"], ["walk", "Mostly walking"]] },
  { key: "group_type", eyebrow: "Your company", title: "Who is joining you?", help: "This helps us choose the right atmosphere.", options: [["solo", "Just me"], ["couple", "As a couple"], ["family", "With family"], ["friends", "With friends"]] },
  { key: "indoor_outdoor_pref", eyebrow: "Setting", title: "Would you rather be indoors or outdoors?", help: "We can mix both when you have no preference.", options: [["indoor", "Mostly indoors"], ["outdoor", "Mostly outdoors"], ["either", "A mix of both"]] },
  { key: "comfort_notes", eyebrow: "Comfort", title: "Anything that would make the day easier?", help: "For example: flat paths, regular seating, no stairs, or nearby toilets.", type: "textarea" },
  { key: "food_preference", eyebrow: "Food", title: "Any food preferences for the day?", help: "We will use this when choosing a relaxed lunch stop.", options: ["No dietary restrictions", "Vegetarian", "Vegan", "Gluten-free", "Light meals preferred"] },
] as const;

export function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const step = steps[stepIndex];
  const value = answers[step.key as keyof Answers];

  function updateValue(next: string | number) {
    setAnswers((current) => ({ ...current, [step.key]: next }));
    setError("");
  }

  function canContinue() {
    return typeof value === "number" || String(value).trim().length >= 2;
  }

  async function next() {
    if (!canContinue()) {
      setError("Please add an answer before continuing.");
      return;
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex((current) => current + 1);
      return;
    }

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location_text: answers.location_text,
          mood_category: answers.mood_category,
          available_time_mins: answers.available_time_mins,
          budget_per_person: answers.budget_per_person,
          preferred_pace: answers.preferred_pace,
          walking_distance_m: answers.walking_distance_m,
          preferred_transport: answers.preferred_transport,
          group_type: answers.group_type,
          indoor_outdoor_pref: answers.indoor_outdoor_pref,
          comfort_notes: answers.comfort_notes,
          food_preferences: { dietary: answers.food_preference },
          lat: 3.139,
          lng: 101.6869,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save your answers.");
      router.push(`/plan/recommendations?preferenceId=${result.preference.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your answers.");
      setSaving(false);
    }
  }

  return (
    <section className="onboarding-card" aria-labelledby="question-title">
      <div className="progress-copy">
        <span>Question {stepIndex + 1} of {steps.length}</span>
        <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="question-wrap" key={step.key}>
        <p className="eyebrow">{step.eyebrow}</p>
        <h1 id="question-title">{step.title}</h1>
        <p className="question-help">{step.help}</p>

        {"options" in step ? (
          <div className="answer-options">
            {step.options.map((option) => {
              const optionValue = Array.isArray(option) ? option[0] : option;
              const optionLabel = Array.isArray(option) ? option[1] : option;
              return (
                <button
                  type="button"
                  className={`answer-option ${value === optionValue ? "answer-option-selected" : ""}`}
                  aria-pressed={value === optionValue}
                  key={String(optionValue)}
                  onClick={() => updateValue(optionValue)}
                >
                  <span>{String(optionLabel)}</span>
                  <span aria-hidden="true">{value === optionValue ? "✓" : "○"}</span>
                </button>
              );
            })}
          </div>
        ) : step.type === "textarea" ? (
          <textarea
            className="large-input"
            rows={4}
            value={String(value)}
            onChange={(event) => updateValue(event.target.value)}
            autoFocus
          />
        ) : (
          <input
            className="large-input"
            value={String(value)}
            onChange={(event) => updateValue(event.target.value)}
            autoFocus
          />
        )}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
      </div>
      <div className="onboarding-actions">
        <button
          className="secondary-button"
          type="button"
          disabled={stepIndex === 0 || saving}
          onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
        >
          Back
        </button>
        <button className="primary-button" type="button" disabled={saving} onClick={next}>
          {saving ? "Finding your matches…" : stepIndex === steps.length - 1 ? "See my matches" : "Continue"}
        </button>
      </div>
    </section>
  );
}
