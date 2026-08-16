import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">About EnjoyLife</p>
          <h1>A thoughtful companion for unhurried days.</h1>
          <p className="hero-copy">
            EnjoyLife considers comfort, walking, cost, travel, facilities, and
            weather—then offers ideas you can shape, never orders you must follow.
          </p>
        </div>
        <Link className="primary-button hero-button" href="/plan/onboarding">
          Plan a day
        </Link>
      </section>
    </main>
  );
}
