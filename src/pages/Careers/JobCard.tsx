import { useTranslation } from "react-i18next";
import type { JobPosting } from "../../entities/carierr";
import { departments } from "../../data/carierr";
import { useState } from "react";
import {
  Briefcase,
  Users,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  CheckCheck,
  Copy,
} from "lucide-react";

// Job Card Component
interface JobCardProps {
  job: JobPosting;
  currentLang: string;
  onViewDetails: (job: JobPosting) => void;
  onApply: (job: JobPosting) => void;
}
export default function JobCard({
  job,
  currentLang,
  onViewDetails,
  onApply,
}: JobCardProps) {
  const department = departments.find((d) => d.id === job.department_id);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  // Check if deadline has passed
  const isDeadlinePassed = new Date(job.deadline) < new Date();
  const isExpiringSoon =
    new Date(job.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const jobUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/careers?job=${job.id}`
      : "";
  const jobTitle = job.title[currentLang as keyof typeof job.title];

  const handleShare = (platform: string) => {
    const text = `${jobTitle} - ${department?.name[currentLang as keyof typeof department.name]}`;
    const url = jobUrl;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text} - ${url}`)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-text-primary">
                  {jobTitle}
                </h3>
                {job.number_of_job > 1 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <Users className="w-4 h-4" />
                    {job.number_of_job} {t("career.card.positions")}
                  </span>
                )}
                {isDeadlinePassed && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-error/10 text-error rounded-full text-sm font-medium">
                    {t("career.card.expired")}
                  </span>
                )}
                {!isDeadlinePassed && isExpiringSoon && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm font-medium">
                    {t("career.card.expiringSoon")}
                  </span>
                )}
              </div>
              <p className="text-text-secondary mt-1">
                {department?.name[currentLang as keyof typeof department.name]}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Clock className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <MapPin className="w-4 h-4" />
              <span>{t("career.card.onsite")}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <DollarSign className="w-4 h-4" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Users className="w-4 h-4" />
              <span>{t(`career.card.gender.${job.gender.toLowerCase()}`)}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary text-sm col-span-2">
              <Calendar className="w-4 h-4" />
              <span className={isDeadlinePassed ? "text-error" : ""}>
                {t("career.card.deadline")}:{" "}
                {new Date(job.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>

          <p className="text-text-secondary line-clamp-2 mb-4">
            {job.description[currentLang as keyof typeof job.description]}
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>
                {t("career.card.posted")}:{" "}
                {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted mr-1">
                {t("career.card.share")}:
              </span>
              <button
                onClick={() => handleShare("whatsapp")}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors group"
                title="Share on WhatsApp"
              >
                <svg
                  className="w-5 h-5 text-muted group-hover:text-[#25D366]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors group"
                title="Share on Facebook"
              >
                <svg
                  className="w-5 h-5 text-muted group-hover:text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors group"
                title="Share on X (Twitter)"
              >
                <svg
                  className="w-5 h-5 text-muted group-hover:text-[#000000]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors group relative"
                title="Copy link"
              >
                {copied ? (
                  <CheckCheck className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-muted group-hover:text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col gap-2">
          <button
            onClick={() => onViewDetails(job)}
            className="flex-1 md:flex-none px-6 py-2.5 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
          >
            {t("career.card.viewDetails")}
          </button>
          <button
            onClick={() => onApply(job)}
            disabled={isDeadlinePassed}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg transition-colors font-medium ${
              isDeadlinePassed
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {isDeadlinePassed
              ? t("career.card.expired")
              : t("career.card.applyNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
