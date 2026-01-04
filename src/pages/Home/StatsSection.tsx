import type { HomeStatsData } from "../../hooks/useHome";

export default function StatsSection({ stats }: { stats: HomeStatsData[] }) {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-12 h-12 mx-auto mb-3 text-white/90" />
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-white/90 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
