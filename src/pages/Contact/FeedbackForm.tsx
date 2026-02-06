import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import PageHeader from "../../components/layout/PageHeader";

// Zod Schema
const feedbackSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t("feedback.validation.name")),
    email: z.string().email(t("feedback.validation.email")),
    message: z.string().min(10, t("feedback.validation.message")),
  });

type FeedbackFormData = z.infer<ReturnType<typeof feedbackSchema>>;

export default function FeedbackForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    try {
      await new Promise((res) => setTimeout(res, 1000));
      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.contact.feedbackForm"), path: "" },
        ]}
        title={t("nav.contact.feedbackForm")}
        subtitle={t("feedback.subtitle")}
        image="images/feedback.jpeg"
      />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              {t("feedback.title")}
            </h2>
            <p className="text-text-secondary">{t("feedback.subtitle")}</p>
          </div>

          {/* Alerts */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-success-soft border border-success rounded-xl flex items-center gap-3 text-success">
              <CheckCircle className="w-5 h-5" />
              <span>{t("feedback.success")}</span>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-error-soft border border-error rounded-xl flex items-center gap-3 text-error">
              <AlertCircle className="w-5 h-5" />
              <span>{t("feedback.error")}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                {t("feedback.fields.name.label")} *
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder={t("feedback.fields.name.placeholder")}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                {t("feedback.fields.email.label")} *
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder={t("feedback.fields.email.placeholder")}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                {t("feedback.fields.message.label")} *
              </label>
              <textarea
                {...register("message")}
                rows={5}
                className="w-full px-4 py-3 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                placeholder={t("feedback.fields.message.placeholder")}
              />
              {errors.message && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("feedback.submitting")}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t("feedback.submit")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
