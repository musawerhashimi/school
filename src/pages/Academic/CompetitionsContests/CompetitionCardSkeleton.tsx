// components/competitions/CompetitionCardSkeleton.tsx

const CompetitionCardSkeleton: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-surface" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Category badge */}
        <div className="h-6 w-24 bg-surface rounded-full" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 bg-surface rounded w-3/4" />
          <div className="h-6 bg-surface rounded w-1/2" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-surface rounded w-full" />
          <div className="h-4 bg-surface rounded w-5/6" />
        </div>

        {/* Meta info */}
        <div className="space-y-3 pt-2">
          <div className="h-4 bg-surface rounded w-2/3" />
          <div className="h-4 bg-surface rounded w-1/2" />
        </div>

        {/* Button */}
        <div className="h-12 bg-surface rounded-lg w-full" />
      </div>
    </div>
  );
};

export default CompetitionCardSkeleton;
