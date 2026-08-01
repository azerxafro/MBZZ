/** Skeleton shimmer cards shown while row data is loading */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
  </div>
);

export const RowSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="row-posters" style={{ pointerEvents: 'none' }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="hero hero-skeleton">
    <div className="hero-skeleton-bg skeleton-shimmer" />
    <div className="hero-content" style={{ zIndex: 2 }}>
      <div className="skeleton-line" style={{ width: 80, height: 14, marginBottom: 12 }} />
      <div className="skeleton-line" style={{ width: 340, height: 52, marginBottom: 20 }} />
      <div className="skeleton-line" style={{ width: 220, height: 40, marginBottom: 20 }} />
      <div className="skeleton-line" style={{ width: 380, height: 14, marginBottom: 8 }} />
      <div className="skeleton-line" style={{ width: 300, height: 14, marginBottom: 8 }} />
      <div className="skeleton-line" style={{ width: 260, height: 14 }} />
    </div>
  </div>
);

export default SkeletonCard;
