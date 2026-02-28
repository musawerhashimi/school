import {
  X,
  Star,
  Upload,
  User,
  Briefcase,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TestimonialType } from "../../entities/Testimonial";
import CommunityService from "./Api/TestmonialService";

interface FormDataType {
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface FormErrors {
  name?: string;
  role?: string;
  image?: string;
  content?: string;
  rating?: string;
}

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareStoryModal({
  isOpen,
  onClose,
}: ShareStoryModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    role: "",
    content: "",
    rating: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        t("testimonials.modal.errors.nameRequired") || "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        t("testimonials.modal.errors.nameMin") ||
        "Name must be at least 2 characters";
    }

    if (!formData.role.trim()) {
      newErrors.role =
        t("testimonials.modal.errors.roleRequired") || "Role is required";
    }

    if (!imageFile) {
      newErrors.image =
        t("testimonials.modal.errors.imageRequired") || "Please upload a photo";
    }

    if (!formData.content.trim()) {
      newErrors.content =
        t("testimonials.modal.errors.contentRequired") || "Story is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content =
        t("testimonials.modal.errors.contentMin") ||
        "Story must be at least 10 characters";
    }

    if (formData.rating === 0) {
      newErrors.rating =
        t("testimonials.modal.errors.ratingRequired") ||
        "Please select a rating";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Build FormData for multipart/form-data (image upload)
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("role", formData.role);
      payload.append("content", formData.content);
      payload.append("rating", String(formData.rating));
      if (imageFile) {
        payload.append("image", imageFile);
      }

      // Use the CORRECT endpoint: /cms/testimonials/ (plural)
      // CommunityService.submitTestimonial should POST to /cms/testimonials/
      await CommunityService.submitTestimonial(
        payload as unknown as Omit<TestimonialType, "id">,
      );

      setIsSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setFormData({ name: "", role: "", content: "", rating: 0 });
        setImageFile(null);
        setImagePreview("");
        setErrors({});
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (error: unknown) {
      console.error(t("Error submitting testimonial:"), error);
      const err = error as {
        response?: { status?: number; data?: unknown };
        message?: string;
      };
      if (err.response) {
        alert(
          `Server error ${err.response.status}: ${JSON.stringify(err.response.data)}`,
        );
      } else {
        alert(err.message || t("Something went wrong. Please try again."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", role: "", content: "", rating: 0 });
      setImageFile(null);
      setImagePreview("");
      setErrors({});
      setIsSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-[var(--color-border)]">
        {/* Success Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[var(--color-card)] rounded-2xl">
            <div className="flex flex-col items-center gap-4 text-center px-8">
              <CheckCircle
                size={64}
                className="text-green-500 animate-bounce"
              />
              <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                {t("testimonials.modal.successTitle") || "Thank you!"}
              </h3>
              <p className="text-[var(--color-text-secondary)]">
                {t("testimonials.modal.successMessage")}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              {t("testimonials.modal.title") || "Share Your Story"}
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {t("testimonials.modal.subtitle")}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              {t("testimonials.modal.fields.image") || "Your Photo"} *
            </label>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2 cursor-pointer transition-all hover:opacity-80 ${
                  errors.image
                    ? "border-red-500"
                    : "border-[var(--color-primary)]"
                } ${!imagePreview ? "bg-[var(--color-surface)] flex items-center justify-center" : ""}`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-[var(--color-muted)]" />
                )}
              </div>

              {/* Upload button */}
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <Upload size={16} />
                  {imageFile ? "Change Photo" : "Upload Photo"}
                </button>
                {imageFile && (
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)] truncate max-w-xs">
                    {imageFile.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  JPG, PNG, WEBP up to 5MB
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {errors.image && (
              <p className="mt-1.5 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Name & Role Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
              >
                {t("testimonials.modal.fields.name") || "Full Name"} *
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                    errors.name
                      ? "border-red-500"
                      : "border-[var(--color-border)]"
                  } text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all`}
                  placeholder={
                    t("testimonials.modal.placeholders.name") || "Ahmad Ali"
                  }
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
              >
                {t("testimonials.modal.fields.role") || "Your Role"} *
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
                />
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                    errors.role
                      ? "border-red-500"
                      : "border-[var(--color-border)]"
                  } text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all`}
                  placeholder={
                    t("testimonials.modal.placeholders.role") ||
                    "Parent / Student"
                  }
                />
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              {t("testimonials.modal.fields.rating") || "Rating"} *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= (hoveredStar || formData.rating)
                        ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
                        : "fill-transparent text-[var(--color-muted)]"
                    }`}
                  />
                </button>
              ))}
              {formData.rating > 0 && (
                <span className="ml-2 self-center text-sm text-[var(--color-text-secondary)]">
                  {
                    ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      formData.rating
                    ]
                  }
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Story / Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
            >
              {t("testimonials.modal.fields.content") || "Your Story"} *
            </label>
            <div className="relative">
              <MessageSquare
                size={16}
                className="absolute left-3 top-3.5 text-[var(--color-muted)]"
              />
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                maxLength={500}
                className={`w-full pl-9 pr-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                  errors.content
                    ? "border-red-500"
                    : "border-[var(--color-border)]"
                } text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none`}
                placeholder={
                  t("testimonials.modal.placeholders.content") ||
                  "Share your experience with us..."
                }
              />
            </div>
            <div className="flex justify-between mt-1">
              {errors.content ? (
                <p className="text-sm text-red-500">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-[var(--color-muted)]">
                {formData.content.length}/500
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] text-sm font-semibold hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
            >
              {t("testimonials.modal.buttons.cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  {t("testimonials.modal.buttons.submitting") ||
                    "Submitting..."}
                </>
              ) : (
                t("testimonials.modal.buttons.submit") || "Submit Story"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
