export default function PageSkeleton() {
  return (
    <section className="page-skeleton">
      <div className="skeleton-title" />
      <div className="skeleton-rule" />
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div className="skeleton-card" key={i}>
            <div className="skeleton-img" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    </section>
  );
}