import { useState } from "react";
import type { JobPosting } from "../../entities/carierr";
import { useTranslation } from "react-i18next";
import { Check, X, Send } from "lucide-react";
interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  resume: File | null;
}

// Application Form Modal
interface ApplicationForm {
  job: JobPosting;
  currentLang: string;
  onClose: () => void;
  onSubmit: () => void;
  submitted: boolean;
}
export default function ApplicationFormModal({
  job,
  currentLang,
  onClose,
  onSubmit,
  submitted,
}: ApplicationForm) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    education: "",
    coverLetter: "",
    resume: null,
  });
  const { t } = useTranslation();
  const [errors, setErrors] = useState<
    Partial<Record<keyof ApplicationFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = t("career.form.errors.fullNameRequired");
    if (!formData.email.trim())
      newErrors.email = t("career.form.errors.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t("career.form.errors.emailInvalid");
    if (!formData.phone.trim())
      newErrors.phone = t("career.form.errors.phoneRequired");
    if (!formData.experience)
      newErrors.experience = t("career.form.errors.experienceRequired");
    if (!formData.education)
      newErrors.education = t("career.form.errors.educationRequired");
    if (!formData.coverLetter.trim())
      newErrors.coverLetter = t("career.form.errors.coverLetterRequired");
    if (!formData.resume)
      newErrors.resume = t("career.form.errors.resumeRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            {t("career.form.success.title")}
          </h3>
          <p className="text-text-secondary">
            {t("career.form.success.message")}{" "}
            {job.title[currentLang as keyof typeof job.title]}{" "}
            {t("career.form.success.message2")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {t("career.form.title")}
            </h2>
            <p className="text-text-secondary">
              {job.title[currentLang as keyof typeof job.title]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("career.form.fullName")} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-background border ${errors.fullName ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder={t("career.form.fullNamePlaceholder")}
              />
              {errors.fullName && (
                <p className="text-error text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("career.form.email")} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-background border ${errors.email ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder={t("career.form.emailPlaceholder")}
              />
              {errors.email && (
                <p className="text-error text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("career.form.phone")} *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-background border ${errors.phone ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
                placeholder={t("career.form.phonePlaceholder")}
              />
              {errors.phone && (
                <p className="text-error text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("career.form.experience")} *
              </label>
              <select
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className={`w-full px-4 py-2.5 bg-background border ${errors.experience ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
              >
                <option value="">{t("career.form.selectExperience")}</option>
                <option value="0-1">{t("career.form.experience01")}</option>
                <option value="2-5">{t("career.form.experience25")}</option>
                <option value="6-10">{t("career.form.experience610")}</option>
                <option value="10+">{t("career.form.experience10plus")}</option>
              </select>
              {errors.experience && (
                <p className="text-error text-sm mt-1">{errors.experience}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("career.form.education")} *
            </label>
            <select
              value={formData.education}
              onChange={(e) =>
                setFormData({ ...formData, education: e.target.value })
              }
              className={`w-full px-4 py-2.5 bg-background border ${errors.education ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary`}
            >
              <option value="">{t("career.form.selectEducation")}</option>
              <option value="high-school">{t("career.form.highSchool")}</option>
              <option value="bachelors">{t("career.form.bachelors")}</option>
              <option value="masters">{t("career.form.masters")}</option>
              <option value="phd">{t("career.form.phd")}</option>
            </select>
            {errors.education && (
              <p className="text-error text-sm mt-1">{errors.education}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("career.form.coverLetter")} *
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              rows={6}
              className={`w-full px-4 py-2.5 bg-background border ${errors.coverLetter ? "border-error" : "border-border"} rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary resize-none`}
              placeholder={t("career.form.coverLetterPlaceholder")}
            />
            {errors.coverLetter && (
              <p className="text-error text-sm mt-1">{errors.coverLetter}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t("career.form.resume")} *
            </label>
            <div
              className={`border-2 border-dashed ${errors.resume ? "border-error" : "border-border"} rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer`}
            >
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    resume: e.target.files?.[0] || null,
                  })
                }
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Send className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-text-primary font-medium">
                  {formData.resume
                    ? formData.resume.name
                    : t("career.form.uploadResume")}
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  {t("career.form.resumeFormat")}
                </p>
              </label>
            </div>
            {errors.resume && (
              <p className="text-error text-sm mt-1">{errors.resume}</p>
            )}
          </div>

          <div className="pt-4 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface-hover transition-colors font-medium"
            >
              {t("career.form.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              {t("career.form.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
