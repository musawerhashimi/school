export default function BookSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="w-full h-80 bg-surface"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-surface rounded w-3/4"></div>
        <div className="h-4 bg-surface rounded w-1/2"></div>
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="h-4 bg-surface rounded w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-4 bg-surface rounded w-16"></div>
          <div className="h-4 bg-surface rounded w-16"></div>
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-surface rounded w-full"></div>
          <div className="h-10 bg-surface rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
