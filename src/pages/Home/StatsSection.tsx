import { Users, Award, BookOpen, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { stat_section } from "../../data/home";

export default function StatsSection() {
  const { t } = useTranslation();

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
