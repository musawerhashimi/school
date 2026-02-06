import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

// Zod Schema for Contact Form Validation
const contactFormSchema = (t: any) =>
  z.object({
    name: z
      .string()
      .min(2, t("contact.form.validation.name.min"))
      .max(100, t("contact.form.validation.name.max")),
    email: z.string().email(t("contact.form.validation.email.invalid")),
    phone: z
      .string()
      .min(10, t("contact.form.validation.phone.min"))
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .min(10, t("contact.form.validation.message.min"))
      .max(1000, t("contact.form.validation.message.max")),
  });

type ContactFormData = z.infer<ReturnType<typeof contactFormSchema>>;

// API call function using fetch
const submitContactForm = async (data: ContactFormData): Promise<void> => {
  const response = await fetch("/api/contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }

  return response.json();
};

// Main Contact Us Component
export default function ContactUs() {
  const { t } = useTranslation();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactForm(data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header Section */}
      <div className=" bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t("contact.title")}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-primary hover:-translate-y-1">
            <div className="inline-flex p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <MapPin size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              {t("contact.info.address.title")}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {t("contact.info.address.line1")}
              <br />
              {t("contact.info.address.line2")}
            </p>
          </div>

          <div className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-secondary hover:-translate-y-1">
            <div className="inline-flex p-4 bg-gradient-to-br from-secondary to-success rounded-xl text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Phone size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              {t("contact.info.phone.title")}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {t("contact.info.phone.main")}
              <br />
              {t("contact.info.phone.fax")}
            </p>
          </div>

          <div className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-accent hover:-translate-y-1">
            <div className="inline-flex p-4 bg-gradient-to-br from-accent to-warning rounded-xl text-text-primary mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Mail size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">
              {t("contact.info.email.title")}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {t("contact.info.email.info")}
              <br />
              {t("contact.info.email.support")}
            </p>
          </div>
        </div>

        {/* Office Hours - MOBILE RESPONSIVE */}
        <div className="bg-gradient-to-r from-info-soft via-success-soft to-info-soft rounded-2xl p-6 md:p-10 mb-16 border border-border shadow-md">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0 self-start md:self-auto">
              <div className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white shadow-lg inline-flex">
                <Clock size={32} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">
                {t("contact.hours.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <p className="font-bold text-text-primary mb-3 text-base md:text-lg flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 bg-success rounded-full flex-shrink-0"></span>
                    <span>{t("contact.hours.schoolDays")}</span>
                  </p>
                  <p className="text-text-secondary mb-1 text-sm md:text-base">
                    {t("contact.hours.classes")}
                  </p>
                  <p className="text-text-secondary text-sm md:text-base">
                    {t("contact.hours.office")}
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                  <p className="font-bold text-text-primary mb-3 text-base md:text-lg flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 bg-error rounded-full flex-shrink-0"></span>
                    <span>{t("contact.hours.weekends")}</span>
                  </p>
                  <p className="text-text-secondary mb-2 text-sm md:text-base">
                    {t("contact.hours.closed")}
                  </p>
                  <p className="text-xs md:text-sm text-muted italic">
                    {t("contact.hours.emergency")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Location Showcase */}
        <div className="bg-gradient-to-br from-primary via-secondary to-primary-dark rounded-3xl p-1 mb-16 shadow-2xl">
          <div className="bg-surface rounded-[22px] p-6 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mb-4 shadow-lg">
                <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                {t("contact.school.title")}
              </h2>
              <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
                {t("contact.school.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* School Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-info-soft to-success-soft rounded-2xl p-6 border border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-primary" />
                    {t("contact.school.fullAddress")}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-base md:text-lg">
                    {t("contact.school.addressLine1")}
                    <br />
                    {t("contact.school.addressLine2")}
                    <br />
                    {t("contact.school.addressLine3")}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-success-soft to-info-soft rounded-2xl p-6 border border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    {t("contact.school.directions.title")}
                  </h3>
                  <ul className="space-y-3 text-text-secondary">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>{t("contact.school.directions.step1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>{t("contact.school.directions.step2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>{t("contact.school.directions.step3")}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-warning-soft to-warning-soft/50 rounded-2xl p-6 border border-border">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {t("contact.school.landmarks.title")}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t("contact.school.landmarks.description")}
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-card h-[400px] md:h-[600px] lg:h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.4167449894896!2d69.17151631521563!3d34.555349880467085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16eb2f3c6c5e7%3A0x7f3b3c3c3c3c3c3c!2sKabul%2C%20Afghanistan!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("contact.school.mapTitle")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-card rounded-3xl shadow-2xl p-6 md:p-12 mb-16 border border-border">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              {t("contact.form.title")}
            </h2>
            <p className="text-base md:text-lg text-text-secondary">
              {t("contact.form.subtitle")}
            </p>
          </div>

          {submitStatus === "success" && (
            <div className="mb-8 p-5 bg-success-soft border-2 border-success rounded-xl flex items-center gap-4 text-success shadow-sm">
              <CheckCircle size={24} className="flex-shrink-0" />
              <span className="font-medium">
                {t("contact.form.successMessage")}
              </span>
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-8 p-5 bg-error-soft border-2 border-error rounded-xl flex items-center gap-4 text-error shadow-sm">
              <AlertCircle size={24} className="flex-shrink-0" />
              <span className="font-medium">
                {t("contact.form.errorMessage")}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  {t("contact.form.fields.name.label")} *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-primary placeholder-muted"
                  placeholder={t("contact.form.fields.name.placeholder")}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  {t("contact.form.fields.email.label")} *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-primary placeholder-muted"
                  placeholder={t("contact.form.fields.email.placeholder")}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-text-primary mb-2"
                >
                  {t("contact.form.fields.phone.label")}
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  id="phone"
                  className="w-full px-5 py-4 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-primary placeholder-muted"
                  placeholder={t("contact.form.fields.phone.placeholder")}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-error flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-text-primary mb-2"
              >
                {t("contact.form.fields.message.label")} *
              </label>
              <textarea
                {...register("message")}
                id="message"
                rows={6}
                className="w-full px-5 py-4 bg-surface border-2 border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-text-primary placeholder-muted resize-none"
                placeholder={t("contact.form.fields.message.placeholder")}
              />
              {errors.message && (
                <p className="mt-2 text-sm text-error flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("contact.form.submitting")}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t("contact.form.submit")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
