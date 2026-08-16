export default function Loading() {
  return (
    <main className="page-shell" aria-label="Loading activities">
      <div className="skeleton" style={{ minHeight: 330 }} />
      <div className="browse-section">
        <div className="activity-grid">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="skeleton" key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
