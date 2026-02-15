import { Users, Award, BookOpen, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHome } from "./Api/useHome";
import Loader from "../../components/Loader";

export default function StatsSection() {
  const { t } = useTranslation();
  const { homeData, isLoading, error } = useHome();

  const stat_section = homeData?.stats || {
    TotalEnrolledStudent: 0,
    TotalAward: 0,
    TotalAcadimicProgram: 0,
    TotalSportTeam: 0,
  };

  const data = [
    {
      icon: Users,
      value: stat_section.TotalEnrolledStudent,
      label: t("studentsEnrolledLabel"),
    },
    {
      icon: Award,
      value: stat_section.TotalAward,
      label: t("awardsWonLabel"),
    },
    {
      icon: BookOpen,
      value: stat_section.TotalAcadimicProgram,
      label: t("academicProgramsLabel"),
    },
    {
      icon: Trophy,
      value: stat_section.TotalSportTeam,
      label: t("sportsTeamsLabel"),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <Loader />
            <p className="mt-4 text-lg text-white">{t("Loading...")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("Error")}</h2>
            <p className="text-white/80 mb-4">
              {t("Failed to load stats data")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              {t("Try Again")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-12 h-12 mx-auto mb-3 text-white/90" />
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}+
              </div>
              <div className="text-white/90 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
