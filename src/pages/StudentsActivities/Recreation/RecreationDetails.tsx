import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useRecreationalActivityById,
  useRecreationCategories,
} from "./Api/useRecreation";
import PageHeader from "../../../components/layout/PageHeader";
import CTASection from "../../../components/CTASection";
import { ArrowLeft, MapPin, Tag } from "lucide-react";

export default function RecreationalActivityDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language as "en" | "da" | "pa";

  const activityId = id ? parseInt(id, 10) : 0;

  const {
    data: activity,
    isLoading: isActivityLoading,
    error: activityError,
  } = useRecreationalActivityById(activityId);

  const { data: categories = [] } = useRecreationCategories();

  if (isActivityLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (activityError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Error loading activity
          </h2>
          <p className="text-text-secondary mb-6">{activityError.message}</p>
          <button
            onClick={() => navigate("/recreational-activities")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t("recreation.details.backToActivities")}
          </button>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            {t("recreation.details.notFound")}
          </h2>
          <button
            onClick={() => navigate("/recreational-activities")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t("recreation.details.backToActivities")}
          </button>
        </div>
      </div>
    );
  }

  const category = categories.find((cat) => cat.id === activity.categoryId);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          { name: t("recreation.details.breadcrumb.home"), path: "/" },
          {
            name: t("recreation.details.breadcrumb.activities"),
            path: "/recreational-activities",
          },
          { name: activity.title[lang], path: "" },
        ]}
        image={activity.image}
        subtitle={category?.name[lang] ?? ""}
        title={activity.title[lang]}
      />

      <section className="bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/recreational-activities")}
                className="group flex items-center gap-2 bg-primary px-4 py-2 rounded-xl border border-white/20 hover:bg-secondary hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                  <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
                </div>
                <span className="text-white font-medium text-sm tracking-wide">
                  {t("recreation.details.backToActivities")}
                </span>
              </button>
            </div>

            {/* Category Badge */}
            {category && (
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                  <Tag className="w-4 h-4" />
                  {category.name[lang]}
                </span>
              </div>
            )}

            {/* Activity Image */}
            <div className="rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src={activity.image}
                alt={activity.title[lang]}
                className="w-full h-72 object-cover"
              />
            </div>

            {/* Description */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                {t("recreation.details.about")}
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                {activity.description
                  ? activity.description[lang]
                  : activity.title[lang]}
              </p>
            </div>

            {/* Location & Category */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {t("recreation.details.location")}
                    </h3>
                    <p className="text-text-secondary">{activity.location}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-3">
                  <Tag className="w-6 h-6 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {t("recreation.details.category")}
                    </h3>
                    <p className="text-text-secondary">
                      {category?.name[lang] ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
