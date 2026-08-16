import Link from "next/link";
import { BrowseCatalog } from "@/components/BrowseCatalog";
import { listActivities } from "@/lib/data/activities";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activities = await listActivities();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-main">
          <p className="eyebrow">Kuala Lumpur ideas, chosen around you</p>
          <h1>What would you enjoy doing today?</h1>
          <p className="hero-copy">
            Tell us what feels right and we’ll shape a comfortable day around your
            pace, budget, walking preference, and mood.
          </p>
        </div>
        <div className="hero-aside">
          <div
            className="hero-heart"
            aria-label="Enjoy Life. Make the Most out of Every Day."
          >
            <svg viewBox="0 0 240 210" aria-hidden="true">
              <defs>
                <linearGradient id="heart-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffd9e8" />
                  <stop offset="1" stopColor="#ef8fba" />
                </linearGradient>
              </defs>
              <path
                d="M120 198C100 179 35 130 23 83C13 43 39 18 70 17C94 16 110 29 120 47C130 29 146 16 170 17C201 18 227 43 217 83C205 130 140 179 120 198Z"
                fill="url(#heart-fill)"
                stroke="#df78a8"
                strokeWidth="4"
              />
              <path
                d="M48 51C69 28 95 37 105 51"
                fill="none"
                stroke="rgba(255,255,255,.72)"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="hero-heart-copy" aria-hidden="true">
              <strong>Enjoy Life</strong>
              <span>Make the Most</span>
              <span>out of Every Day</span>
            </div>
          </div>
          <p className="hero-heart-caption">
            Are you ready to start<br />enjoy life again?
          </p>
          <Link href="/plan/onboarding" className="primary-button hero-button">
            Plan my day <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="browse-title" className="browse-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse at your own pace</p>
            <h2 id="browse-title">Ideas for a lovely day</h2>
          </div>
          <p>{activities.length} local options</p>
        </div>
        {activities.length > 0 ? (
          <BrowseCatalog activities={activities} />
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">🌱</span>
            <h2>Fresh ideas are on the way</h2>
            <p>We could not find any activities yet. Please try again shortly.</p>
          </div>
        )}
      </section>
    </main>
  );
}
