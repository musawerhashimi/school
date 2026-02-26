import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { InternshipCategory } from "../../../entities/intership";
import { useInternship } from "../Api/useCareers";
import { formatLocalDateTime } from "@/utils/formatLocalDateTime";

interface InternshipModalProps {
  internshipId: number;
  onClose: () => void;
  categories?: InternshipCategory[];
}

const InternshipModal: React.FC<InternshipModalProps> = ({
  internshipId,
  onClose,
  categories = [],
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  // Fetch detailed internship data from the detail endpoint
  const { data: internship, isLoading, error } = useInternship(internshipId);

  // Use category from detail response, or fallback to finding from categories array
  const category =
    internship?.category ||
    categories.find((cat) => cat.id === internship?.categoryId);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-label="Close modal"
        />
        <div className="relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !internship) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-label="Close modal"
        />
        <div className="relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in p-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-600 font-semibold mb-2">
              Failed to load internship details
            </p>
            <button onClick={onClose} className="btn-primary px-6 py-2">
              {t("internships.details.close")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div className="relative bg-card rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header with Image */}
        <div className="relative h-64 bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
          {internship.image && (
            <img
              src={internship.image}
              alt={internship.title[lang]}
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-colors duration-200"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-white/90 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                <span>{category?.name[lang]}</span>
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {internship.title[lang]}
            </h2>
            <p className="text-white/90 text-lg font-medium">
              {internship.organization[lang]}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-16rem)] scrollbar-hide">
          <div className="p-8 space-y-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-info-soft rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-info"
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
                <p className="text-xs text-muted mb-1">
                  {t("internships.details.duration")}
                </p>
                <p className="font-bold text-text-primary">
                  {internship.duration} Day
                </p>
              </div>

              <div className="bg-success-soft rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-success"
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
                <p className="text-xs text-muted mb-1">
                  {t("internships.details.location")}
                </p>
                <p className="font-bold text-text-primary text-sm">
                  {internship.location[lang]}
                </p>
              </div>

              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-muted mb-1">
                  {t("internships.details.startDate")}
                </p>
                <p className="font-bold text-text-primary text-sm">
                  {formatLocalDateTime(internship.startDate)}
                </p>
              </div>

              <div className="bg-warning-soft rounded-xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-muted mb-1">
                  {t("internships.details.deadline")}
                </p>
                <p className="font-bold text-text-primary text-sm">
                  {formatLocalDateTime(internship.applicationDeadline)}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                {t("internships.details.description")}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {internship.description?.[lang]}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-secondary rounded-full" />
                {t("internships.details.requirements")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-text-secondary">
                    {internship.requirements?.[lang]}
                  </span>
                </li>
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                {t("internships.details.benefits")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-text-secondary">
                    {internship.benefits?.[lang]}
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="bg-surface rounded-xl p-6 border-2 border-primary/20">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {t("internships.details.contact")}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted">
                      {t("internships.details.email")}
                    </p>
                    <a
                      href={`mailto:${internship.contactEmail}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {internship.contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted">
                      {t("internships.details.phone")}
                    </p>
                    <a
                      href={`tel:${internship.contactPhone}`}
                      className="text-primary font-semibold hover:underline"
                    >
                      {internship.contactPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="btn-primary px-8 py-3 text-lg"
              >
                {t("internships.details.close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipModal;
