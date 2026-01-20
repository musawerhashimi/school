// components/competitions/CompetitionCard.tsx
import { Calendar, MapPin, Users } from "lucide-react";
import type { Competition } from "../../../entities/Competition";
import { competitionCategories } from "../../../data/competitions";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface CompetitionCardProps {
  competition: Competition;
}

export default function CompetitionCard({ competition }: CompetitionCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-info text-white";
      case "ongoing":
        return "bg-success text-white";
      case "completed":
        return "bg-muted text-text-primary";
      default:
        return "bg-muted text-text-primary";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Truncate description to approximately 2 lines (around 100 characters)
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Get category name by ID
  const getCategoryName = () => {
    const category = competitionCategories.find(
      (cat) => cat.id === competition.category_id,
    );
    return category ? category.name : "Unknown";
  };

  const spotsLeft =
    competition.maxParticipants && competition.currentParticipants
      ? competition.maxParticipants - competition.currentParticipants
      : null;

  const isRegistrationOpen =
    competition.status !== "completed" &&
    new Date(competition.registrationDeadline) > new Date();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={competition.image}
          alt={competition.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`badge ${getStatusColor(competition.status)} px-3 py-1`}
          >
            {t(`competitions.status.${competition.status}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category Badge */}
        <span className="badge bg-accent text-white inline-block">
          {getCategoryName()}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
          {competition.title}
        </h3>

        {/* Description - Using both line-clamp and manual truncation as fallback */}
        <p
          className="text-text-secondary text-sm line-clamp-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {truncateDescription(competition.description, 120)}
        </p>

        {/* Meta Information */}
        <div className="space-y-2 text-sm text-text-secondary">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{formatDate(competition.startDate)}</span>
          </div>

          {competition.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{competition.location}</span>
            </div>
          )}

          {spotsLeft !== null && spotsLeft > 0 && isRegistrationOpen && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-warning font-medium">
                {spotsLeft} {t("competitions.card.spotsLeft")}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className="w-full btn-primary mt-4 flex items-center justify-center gap-2 group-hover:bg-primary-dark"
          onClick={() => navigate("/competitions-contests/" + competition.id)}
        >
          {competition.status === "completed"
            ? t("competitions.card.viewDetails")
            : isRegistrationOpen
              ? t("competitions.card.register")
              : t("competitions.card.viewDetails")}
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
