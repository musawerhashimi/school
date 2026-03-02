import { useState, useEffect } from "react";
import { Trophy, Medal, Star, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { awardService, type AwardStats } from "./Api/awardService";

const getStatConfig = () => [
  {
    icon: Trophy,
    valueKey: "TotalAwards",
    labelKey: "stats.totalAwards",
    gradient: "from-amber-500 to-yellow-600",
    bgGradient: "from-amber-50 to-yellow-50",
    darkBgGradient: "from-amber-900/20 to-yellow-900/20",
  },
  {
    icon: Medal,
    valueKey: "NationalAwards",
    labelKey: "stats.nationalRecognitions",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-50 to-indigo-50",
    darkBgGradient: "from-blue-900/20 to-indigo-900/20",
  },
  {
    icon: Star,
    valueKey: "InternationalAwards",
    labelKey: "stats.internationalAwards",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-50",
    darkBgGradient: "from-purple-900/20 to-pink-900/20",
  },
  {
    icon: Users,
    valueKey: "StudentAchievers",
    labelKey: "stats.studentAchievers",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-50 to-teal-50",
    darkBgGradient: "from-emerald-900/20 to-teal-900/20",
  },
];

export default function StatCard() {
  const { t } = useTranslation();
  const statConfig = getStatConfig();

  const [stats, setStats] = useState<AwardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await awardService.getStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Set default values on error
        setStats({
          TotalAwards: 0,
          InternationalAwards: 0,
          StudentAchievers: 0,
          NationalAwards: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16" aria-label={t("stats.sectionLabel")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16" aria-label={t("stats.sectionLabel")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {statConfig.map((stat, index) => {
          const IconComponent = stat.icon;
          const value = stats?.[stat.valueKey as keyof AwardStats] || 0;

          return (
            <article
              key={stat.valueKey}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Background gradient effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Animated corner accent */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 dark:opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 -translate-y-16 translate-x-16`}
              />

              <div className="relative z-10">
                {/* Icon container with gradient border */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                  />
                  <div
                    className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.gradient} p-[2px] group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full rounded-2xl bg-primary dark:bg-gray-800 flex items-center justify-center">
                      <IconComponent
                        className={`w-9 h-9 bg-gradient-to-br ${stat.gradient} bg-clip-text text-white`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Value with counter animation */}
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 tabular-nums tracking-tight">
                  {value?.toLocaleString() || "0"}

                  <span
                    className={`inline-block ml-1 text-3xl bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    +
                  </span>
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-nowrap font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {t(stat.labelKey)}
                </div>

                {/* Bottom accent line */}
                <div
                  className={`mt-6 h-1 w-0 group-hover:w-full mx-auto bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500`}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
