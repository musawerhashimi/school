import React from "react";
import { useTranslation } from "react-i18next";
import type { Internship } from "../../../entities/intership";
import { internshipCategories } from "../../../data/intership";

interface InternshipCardProps {
  internship: Internship;
  onClick: () => void;
}

const InternshipCard: React.FC<InternshipCardProps> = ({
  internship,
  onClick,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const category = internshipCategories.find(
    (cat) => cat.id === internship.categoryId,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "fa-AF", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlineNear = () => {
    const deadline = new Date(internship.applicationDeadline);
    const today = new Date();
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* Category Badge & Deadline Warning */}
      <div className="relative">
        {internship.image && (
          <div className="h-48 overflow-hidden bg-surface">
            <img
              src={internship.image}
              alt={internship.title[lang]}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
            <span>{category?.name[lang]}</span>
          </span>
        </div>
        {isDeadlineNear() && (
          <div className="absolute top-4 right-4">
            <span className="bg-warning/90 backdrop-blur-sm text-text-primary px-3 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
              ⏰ {t("internships.card.deadline")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {internship.title[lang]}
          </h3>
          <p className="text-text-secondary text-sm font-medium">
            {internship.organization[lang]}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-info-soft flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-info"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">
                {t("internships.card.duration")}
              </p>
              <p className="font-medium text-text-primary">
                {internship.duration[lang]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-success-soft flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted">
                {t("internships.card.location")}
              </p>
              <p className="font-medium text-text-primary line-clamp-1">
                {internship.location[lang]}
              </p>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="text-text-secondary text-sm line-clamp-3 leading-relaxed">
          {internship.description[lang]}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted">
              {t("internships.card.deadline")}:
            </span>
            <span className="ml-2 font-semibold text-text-primary">
              {formatDate(internship.applicationDeadline)}
            </span>
          </div>

          <button className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all duration-300">
            <span>{t("internships.card.viewDetails")}</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
