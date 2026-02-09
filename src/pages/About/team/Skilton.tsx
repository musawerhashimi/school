// Skeleton Components
export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse ">
      <div className="bg-gradient-to-r from-surface to-card pb-20 pt-5 mt-20">
        <div className="container mx-auto px-4">
          <div className="h-6 w-32 bg-border/50 rounded mb-6" />

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-48 h-48 rounded-2xl bg-border/50" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 bg-border/50 rounded" />
              <div className="h-6 w-48 bg-border/50 rounded" />
              <div className="flex gap-3">
                <div className="h-10 w-32 bg-border/50 rounded-lg" />
                <div className="h-10 w-32 bg-border/50 rounded-lg" />
              </div>
              <div className="h-10 w-10 bg-border/50 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="h-8 w-24 bg-border/50 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-border/50 rounded" />
              <div className="h-4 w-full bg-border/50 rounded" />
              <div className="h-4 w-3/4 bg-border/50 rounded" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border/50">
            <div className="h-8 w-32 bg-border/50 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-border/50 rounded" />
              <div className="h-4 w-5/6 bg-border/50 rounded" />
              <div className="h-4 w-4/5 bg-border/50 rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card p-6 rounded-xl border border-border/50"
            >
              <div className="h-6 w-24 bg-border/50 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-border/50 rounded" />
                <div className="h-4 w-3/4 bg-border/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
