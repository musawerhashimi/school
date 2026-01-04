import { Target, Lightbulb, Heart, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

// Skeleton Loader Component
function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent animate-shimmer"></div>
      <div className="w-16 h-16 bg-gray-200 rounded-xl mb-6 animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
      </div>
    </div>
  );
}

export default function MissionVisionSection() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const missionVisionData = [
    {
      icon: Target,
      title: t("about.mission.title"),
      description: t("about.mission.description"),
      gradient: "from-blue-500 via-indigo-600 to-purple-600",
      bgGlow: "bg-blue-500/10",
    },
    {
      icon: Lightbulb,
      title: t("about.vision.title"),
      description: t("about.vision.description"),
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bgGlow: "bg-orange-500/10",
    },
    {
      icon: Heart,
      title: t("about.values.title"),
      points: [
        t("about.values.point1"),
        t("about.values.point2"),
        t("about.values.point3"),
        t("about.values.point4"),
        t("about.values.point5"),
      ],
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGlow: "bg-pink-500/10",
    },
  ];

  return (
    <section className="py-20 bg-background dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-primary text-4xl md:text-5xl font-bold   mb-4">
            {t("about.ourfoundation")}
          </h2>
          <p className="text-secondary max-w-2xl mx-auto">
            {t("about.description")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(0)
                .map((_, index) => <CardSkeleton key={index} />)
            : missionVisionData.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 ${item.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  ></div>

                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[1px]">
                    <div
                      className={`w-full h-full bg-white dark:bg-gray-800 rounded-2xl`}
                    ></div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-lg`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Points */}
                    {item.points && (
                      <ul className="space-y-3">
                        {item.points.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start space-x-3 group/item"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300" />
                            <span className="text-gray-600 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">
                              {point}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}
