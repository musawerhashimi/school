import { Calendar, Users, Trophy } from "lucide-react";
import { sportCategories } from "../../../data/sportsTeams.data";
import type { SportsTeam, LanguageType } from "../../../entities/sportsTeams";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
  team: SportsTeam;
  lang: LanguageType;
}

export default function TeamCard({ team, lang }: TeamCardProps) {
  const category = sportCategories.find((cat) => cat.id === team.categoryId);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105">
      {/* Team Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={team.image}
          alt={team.name[lang]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-lg">
            {category?.name[lang]}
          </span>
        </div>

        {/* Team Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1">
            {team.name[lang]}
          </h3>
          <div className="flex items-center text-white/90 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {t("sportsTeams.establishedIn")} {team.establishedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <p className="text-text-secondary mb-4 line-clamp-3">
          {team.description[lang]}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-text-secondary">
            <Users className="w-5 h-5 mr-2 text-primary" />
            <div>
              <p className="text-xs text-text-secondary">
                {t("sportsTeams.members")}
              </p>
              <p className="font-semibold text-text-primary">
                {team.members.length}
              </p>
            </div>
          </div>
          <div className="flex items-center text-text-secondary">
            <Trophy className="w-5 h-5 mr-2 text-accent" />
            <div>
              <p className="text-xs text-text-secondary">
                {t("sportsTeams.achievements")}
              </p>
              <p className="font-semibold text-text-primary">
                {team.achievements.length}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          className="w-full py-3 bg-surface hover:bg-primary text-text-primary hover:text-white font-semibold rounded-xl transition-all duration-300 group-hover:bg-primary group-hover:text-white"
          onClick={() => navigate("/sports-teams/" + team.id)}
        >
          {t("sportsTeams.viewDetails")}
        </button>
      </div>
    </div>
  );
}
