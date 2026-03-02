import { useTranslation } from "react-i18next";
import type { Achievement } from "./Api/awardService";
import { Trophy, Award } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div className="bg-primary text-white p-3 rounded-lg group-hover:scale-110 transition-transform">
          <Trophy className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
              {achievement.title[lang]}
            </h3>
            <span className="text-sm font-medium text-text-secondary bg-surface px-3 py-1 rounded-full">
              {achievement.date}
            </span>
          </div>
          <p className="text-text-secondary mb-3">
            {achievement.description[lang]}
          </p>
          {achievement.recipient && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-text-primary font-medium">
                {achievement.recipient}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
