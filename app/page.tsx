import Link from "next/link";
import { BrowseCatalog } from "@/components/BrowseCatalog";
import { listActivities } from "@/lib/data/activities";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activities = await listActivities();

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Perth ideas, chosen around you</p>
          <h1>What would you enjoy doing today?</h1>
          <p className="hero-copy">
            Tell us what feels right and we’ll shape a comfortable day around your
            pace, budget, walking preference, and mood.
          </p>
        </div>
        <Link href="/plan/onboarding" className="primary-button hero-button">
          Plan my day <span aria-hidden="true">→</span>
        </Link>
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
