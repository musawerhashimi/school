import { X, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  FormDataType,
  FormErrors,
  TestimonialType,
} from "../../entities/Testimonial";

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareStoryModal({
  isOpen,
  onClose,
}: ShareStoryModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    role: "",
    image: "",
    content: "",
    rating: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("testimonials.modal.errors.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("testimonials.modal.errors.nameMin");
    }

    if (!formData.role.trim()) {
      newErrors.role = t("testimonials.modal.errors.roleRequired");
    }

    if (!formData.image.trim()) {
      newErrors.image = t("testimonials.modal.errors.imageRequired");
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = t("testimonials.modal.errors.imageInvalid");
    }

    if (!formData.content.trim()) {
      newErrors.content = t("testimonials.modal.errors.contentRequired");
    } else if (formData.content.trim().length < 10) {
      newErrors.content = t("testimonials.modal.errors.contentMin");
    }

    if (formData.rating === 0) {
      newErrors.rating = t("testimonials.modal.errors.ratingRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle rating click
  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    if (errors.rating) {
      setErrors((prev) => ({
        ...prev,
        rating: undefined,
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would typically send the data to your backend
      const testimonialData: Omit<TestimonialType, "id"> = {
        name: formData.name,
        role: formData.role,
        image: formData.image,
        content: formData.content,
        rating: formData.rating,
      };

      console.log("Testimonial submitted:", testimonialData);

      // Reset form
      setFormData({
        name: "",
        role: "",
        image: "",
        content: "",
        rating: 0,
      });

      // Show success message (you might want to add a toast notification here)
      alert(t("testimonials.modal.successMessage"));

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert(t("testimonials.modal.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/30 backdrop-blur-md bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-card)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[100vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("testimonials.modal.title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
            >
              {t("testimonials.modal.fields.name")} *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                errors.name ? "border-red-500" : "border-[var(--color-border)]"
              } text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all`}
              placeholder={t("testimonials.modal.placeholders.name")}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
            >
              {t("testimonials.modal.fields.role")} *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                errors.role ? "border-red-500" : "border-[var(--color-border)]"
              } text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all`}
              placeholder={t("testimonials.modal.placeholders.role")}
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Image URL Field */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
            >
              {t("testimonials.modal.fields.image")} *
            </label>
            <input
              type="file"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                errors.image ? "border-red-500" : "border-[var(--color-border)]"
              } text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all`}
              placeholder={t("testimonials.modal.placeholders.image")}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Rating Field */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
              {t("testimonials.modal.fields.rating")} *
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= formData.rating
                        ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
                        : "fill-transparent text-[var(--color-muted)]"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Content Field */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2"
            >
              {t("testimonials.modal.fields.content")} *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className={`w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border ${
                errors.content
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none`}
              placeholder={t("testimonials.modal.placeholders.content")}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-semibold hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              {t("testimonials.modal.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? t("testimonials.modal.buttons.submitting")
                : t("testimonials.modal.buttons.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
