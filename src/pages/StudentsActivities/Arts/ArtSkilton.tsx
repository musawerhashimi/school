// --- Internal Skeleton Components ---
export const CulturalEventSkeleton = () => (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-pulse">
    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full"></div>
    <div className="flex flex-col justify-center space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-4"></div>
    </div>
  </div>
);

export const HighlightSkeleton = () => (
  <div className="flex flex-col space-y-3 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);
