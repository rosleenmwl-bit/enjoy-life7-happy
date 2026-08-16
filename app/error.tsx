"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell">
      <div className="empty-state" role="alert">
        <span aria-hidden="true">🌦️</span>
        <h1>We could not load today’s ideas</h1>
        <p>Your plans are safe. Please check your connection and try once more.</p>
        <button className="primary-button" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
