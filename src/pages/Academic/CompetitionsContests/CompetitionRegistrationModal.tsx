// components/competitions/CompetitionRegistrationModal.tsx
import { useState } from "react";
import { X, Plus, Trash2, CheckCircle } from "lucide-react";
import type { Competition } from "../../../entities/Competition";
import { useTranslation } from "react-i18next";

interface CompetitionRegistrationModalProps {
  competition: Competition;
  isOpen: boolean;
  onClose: () => void;
}

interface TeamMember {
  name: string;
  studentId: string;
  grade: string;
}

export default function CompetitionRegistrationModal({
  competition,
  isOpen,
  onClose,
}: CompetitionRegistrationModalProps) {
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    grade: "",
    email: "",
    phone: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    additionalInfo: "",
    termsAgree: false,
  });
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\d\s+()-]+$/.test(phone) && phone.replace(/\D/g, "").length >= 9;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = t(
        "competitions.registration.validation.required",
      );
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = t("competitions.registration.validation.required");
    }
    if (!formData.grade.trim()) {
      newErrors.grade = t("competitions.registration.validation.required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("competitions.registration.validation.required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("competitions.registration.validation.email");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("competitions.registration.validation.required");
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = t("competitions.registration.validation.phone");
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = t("competitions.registration.validation.required");
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = t(
        "competitions.registration.validation.required",
      );
    } else if (!validatePhone(formData.parentPhone)) {
      newErrors.parentPhone = t("competitions.registration.validation.phone");
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = t(
        "competitions.registration.validation.required",
      );
    } else if (!validateEmail(formData.parentEmail)) {
      newErrors.parentEmail = t("competitions.registration.validation.email");
    }
    if (!formData.termsAgree) {
      newErrors.termsAgree = t(
        "competitions.registration.validation.termsRequired",
      );
    }

    if (competition.isTeamEvent && competition.teamSize) {
      const totalMembers = teamMembers.length + 1;
      if (
        totalMembers < competition.teamSize.min ||
        totalMembers > competition.teamSize.max
      ) {
        newErrors.teamSize = t(
          "competitions.registration.validation.teamSize",
          {
            min: competition.teamSize.min,
            max: competition.teamSize.max,
          },
        );
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Registration submitted:", {
        ...formData,
        competitionId: competition.id,
        teamMembers: competition.isTeamEvent ? teamMembers : undefined,
      });

      setIsSubmitted(true);
    }
  };

  const addTeamMember = () => {
    if (
      competition.teamSize &&
      teamMembers.length < competition.teamSize.max - 1
    ) {
      setTeamMembers([...teamMembers, { name: "", studentId: "", grade: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string,
  ) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleClose = () => {
    setFormData({
      studentName: "",
      studentId: "",
      grade: "",
      email: "",
      phone: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      additionalInfo: "",
      termsAgree: false,
    });
    setTeamMembers([]);
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 text-center animate-scale-in">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">
            {t("competitions.registration.successTitle")}
          </h3>
          <p className="text-text-secondary mb-6">
            {t("competitions.registration.successMessage")}
          </p>
          <button onClick={handleClose} className="btn-primary w-full">
            {t("competitions.registration.close")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl max-w-3xl w-full my-8 animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {t("competitions.registration.title")}
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {competition.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {t("competitions.registration.studentInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.studentName")} *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className={`input-field ${errors.studentName ? "border-error" : ""}`}
                />
                {errors.studentName && (
                  <p className="text-error text-xs mt-1">
                    {errors.studentName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.studentId")} *
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                  className={`input-field ${errors.studentId ? "border-error" : ""}`}
                />
                {errors.studentId && (
                  <p className="text-error text-xs mt-1">{errors.studentId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.grade")} *
                </label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({ ...formData, grade: e.target.value })
                  }
                  className={`input-field ${errors.grade ? "border-error" : ""}`}
                />
                {errors.grade && (
                  <p className="text-error text-xs mt-1">{errors.grade}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.email")} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`input-field ${errors.email ? "border-error" : ""}`}
                />
                {errors.email && (
                  <p className="text-error text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.phone")} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={`input-field ${errors.phone ? "border-error" : ""}`}
                />
                {errors.phone && (
                  <p className="text-error text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">
              {t("competitions.registration.parentInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.parentName")} *
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) =>
                    setFormData({ ...formData, parentName: e.target.value })
                  }
                  className={`input-field ${errors.parentName ? "border-error" : ""}`}
                />
                {errors.parentName && (
                  <p className="text-error text-xs mt-1">{errors.parentName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.parentPhone")} *
                </label>
                <input
                  type="tel"
                  value={formData.parentPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, parentPhone: e.target.value })
                  }
                  className={`input-field ${errors.parentPhone ? "border-error" : ""}`}
                />
                {errors.parentPhone && (
                  <p className="text-error text-xs mt-1">
                    {errors.parentPhone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  {t("competitions.registration.parentEmail")} *
                </label>
                <input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, parentEmail: e.target.value })
                  }
                  className={`input-field ${errors.parentEmail ? "border-error" : ""}`}
                />
                {errors.parentEmail && (
                  <p className="text-error text-xs mt-1">
                    {errors.parentEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {competition.isTeamEvent && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("competitions.registration.teamInfo")}
                </h3>
                {competition.teamSize &&
                  teamMembers.length < competition.teamSize.max - 1 && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="btn-secondary text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {t("competitions.registration.addMember")}
                    </button>
                  )}
              </div>

              {errors.teamSize && (
                <p className="text-error text-sm mb-4">{errors.teamSize}</p>
              )}

              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-primary">
                        {t("competitions.registration.teamMember")} {index + 2}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-error hover:text-error/80 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder={t("competitions.registration.studentName")}
                        value={member.name}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder={t("competitions.registration.studentId")}
                        value={member.studentId}
                        onChange={(e) =>
                          updateTeamMember(index, "studentId", e.target.value)
                        }
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder={t("competitions.registration.grade")}
                        value={member.grade}
                        onChange={(e) =>
                          updateTeamMember(index, "grade", e.target.value)
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("competitions.registration.additionalInfo")}
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) =>
                setFormData({ ...formData, additionalInfo: e.target.value })
              }
              placeholder={t(
                "competitions.registration.additionalInfoPlaceholder",
              )}
              rows={4}
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAgree}
                onChange={(e) =>
                  setFormData({ ...formData, termsAgree: e.target.checked })
                }
                className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-secondary">
                {t("competitions.registration.termsAgree")} *
              </span>
            </label>
            {errors.termsAgree && (
              <p className="text-error text-xs mt-1">{errors.termsAgree}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-border text-text-primary rounded-xl hover:bg-surface transition-colors"
            >
              {t("competitions.registration.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 btn-primary"
            >
              {t("competitions.registration.submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
