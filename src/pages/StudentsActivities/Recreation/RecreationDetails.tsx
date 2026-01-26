import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  recreationalActivities,
  recreationCategories,
} from "../../../data/recishnal";
import PageHeader from "../../../components/layout/PageHeader";
import CTASection from "../../../components/CTASection";
import { ArrowLeft } from "lucide-react";

export default function RecreationalActivityDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language as "en" | "da" | "pa";

  const activity = recreationalActivities.find((act) => act.id === id);

  if (!activity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
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

  const category = recreationCategories.find(
    (cat) => cat.id === activity.categoryId,
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[
          t("recreation.details.breadcrumb.home"),
          t("recreation.details.breadcrumb.activities"),
          activity.title[lang],
        ]}
        image={activity.image}
        subtitle={category?.name[lang] || ""}
        title={activity.title[lang]}
      />

      <section className=" bg-background">
        <div className="relative container mx-auto px-4 py-20">
          {/* Professional Back Button */}
          <div className="absolute top-0 md:left-40 ">
            <button
              onClick={() => navigate("/recreational-activities")}
              className=" my-2 group flex items-center gap-2 bg-primary px-2 py-2 rounded-xl border border-white/20 hover:bg-secondary hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
              </div>
              <span className="text-white font-medium text-sm tracking-wide">
                {t("recreation.details.backToActivities")}
              </span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                {category?.name[lang]}
              </span>
            </div>

            {/* Description */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                {t("recreation.details.about")}
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                {activity.description[lang]}
              </p>
            </div>

            {/* Location & Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-primary mt-1"
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
                  <svg
                    className="w-6 h-6 text-primary mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">
                      {t("recreation.details.category")}
                    </h3>
                    <p className="text-text-secondary">
                      {category?.name[lang]}
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
