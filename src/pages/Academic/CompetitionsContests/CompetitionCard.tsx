import { Calendar, MapPin } from "lucide-react";
import type {
  Competition,
  CompetitionStatus,
} from "../../../entities/Competition";
import { competitionCategories } from "../../../data/competitions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { formatLocalDateTime } from "@/utils/formatLocalDateTime";

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  const navigate = useNavigate();

  const getStatus = (startDate: string): CompetitionStatus => {
    const today = new Date();
    const start = new Date(startDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    return today < start ? "upcoming" : "completed";
  };

  const status = getStatus(competition.startDate);

  const getStatusColor = (status: CompetitionStatus) => {
    switch (status) {
      case "upcoming":
        return "bg-info text-white";
      case "completed":
        return "bg-muted text-text-primary";
    }
  };

  const getCategoryName = () => {
    const category = competitionCategories.find(
      (cat) => Number(cat.id) === competition.category_id,
    );
    return category ? category.name[lang] : "Unknown";
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="relative h-48">
        <img
          src={competition.image}
          alt={competition.title[lang]}
          className="w-full h-full object-cover"
        />

        <span
          className={`absolute top-4 left-4 badge ${getStatusColor(status)}`}
        >
          {t(`competitions.status.${status}`)}
        </span>
      </div>

      <div className="p-6 space-y-4">
        <span className="badge bg-accent text-white">{getCategoryName()}</span>

        <h3 className="text-xl font-bold">{competition.title[lang]}</h3>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          {formatLocalDateTime(competition.startDate)}
        </div>

        {competition.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            {competition.location}
          </div>
        )}

        <button
          className="btn-primary w-full"
          onClick={() => navigate("/competitions-contests/" + competition.id)}
        >
          {t("competitions.card.viewDetails")}
        </button>
      </div>
    </div>
  );
}
