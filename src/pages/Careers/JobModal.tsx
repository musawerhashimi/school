import {
  Briefcase,
  Calendar,
  Check,
  Clock,
  DollarSign,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { departments } from "../../data/carierr";
import type { JobPosting } from "../../entities/carierr";
import { useTranslation } from "react-i18next";
import InfoItem from "./InfoCard";
interface InfoItemProps {
  job: JobPosting;
  currentLang: string;
  onClose: () => void;
  onApply: (job: JobPosting) => void;
}
// Job Detail Modal
export default function JobDetailModal({
  job,
  currentLang,
  onClose,
  onApply,
}: InfoItemProps) {
  const department = departments.find((d) => d.id === job.department_id);
  const { t } = useTranslation();
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {job.title[currentLang as keyof typeof job.title]}
            </h2>
            <p className="text-text-secondary">
              {department?.name[currentLang as keyof typeof department.name]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem
              icon={<Clock />}
              label={t("career.detail.type")}
              value={job.type}
            />
            <InfoItem
              icon={<MapPin />}
              label={t("career.detail.location")}
              value={t("career.card.onsite")}
            />
            <InfoItem
              icon={<DollarSign />}
              label={t("career.detail.salary")}
              value={job.salary}
            />
            <InfoItem
              icon={<Briefcase />}
              label={t("career.detail.department")}
              value={
                department?.name[currentLang as keyof typeof department.name] ||
                ""
              }
            />
            <InfoItem
              icon={<Users />}
              label={t("career.detail.gender")}
              value={t(`career.card.gender.${job.gender.toLowerCase()}`)}
            />
            <InfoItem
              icon={<Users />}
              label={t("career.detail.positions")}
              value={job.number_of_job.toString()}
            />
            <InfoItem
              icon={<Calendar />}
              label={t("career.detail.deadline")}
              value={new Date(job.deadline).toLocaleDateString()}
            />
            <InfoItem
              icon={<Calendar />}
              label={t("career.detail.posted")}
              value={new Date(job.postedDate).toLocaleDateString()}
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              {t("career.detail.descriptionTitle")}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {job.description[currentLang as keyof typeof job.description]}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              {t("career.detail.requirementsTitle")}
            </h3>
            <div className="flex items-start gap-2 text-text-secondary">
              <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <span className="leading-relaxed">
                {job.requirements[currentLang as keyof typeof job.requirements]}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => onApply(job)}
              disabled={new Date(job.deadline) < new Date()}
              className={`w-full py-3 rounded-lg transition-colors font-medium text-lg ${
                new Date(job.deadline) < new Date()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {new Date(job.deadline) < new Date()
                ? t("career.card.expired")
                : t("career.detail.applyButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
