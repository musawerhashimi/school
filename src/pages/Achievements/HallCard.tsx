import { useTranslation } from "react-i18next";
import type { HallOfFameHonoree } from "./Api/awardService";
import { Award, Calendar } from "lucide-react";

interface HallCardProps {
  honoree: HallOfFameHonoree;
  lang: "en" | "da" | "pa";
}

// Honoree Card Component
export default function HonoreeCard({ honoree, lang }: HallCardProps) {
  const { t } = useTranslation();

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-xl mb-6 aspect-[4/5] bg-surface">
        <img
          src={honoree.image}
          alt={honoree.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Year Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
            <Calendar className="w-4 h-4" />
            {honoree.year}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow-lg ${
              honoree.honoree_type === "student"
                ? "bg-secondary text-white"
                : "bg-accent text-text-primary"
            }`}
          >
            <Award className="w-4 h-4" />
            {t(`hallOfFame.type.${honoree.honoree_type}`)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
          {honoree.name}
        </h3>

        <p className="text-primary font-semibold mb-3 text-lg">
          🏆{honoree.achievement[lang]}
        </p>

        <p className="text-text-secondary leading-relaxed line-clamp-4">
          {honoree.description[lang]}
        </p>
      </div>
    </div>
  );
}
