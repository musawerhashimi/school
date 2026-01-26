import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  recreationalActivities,
  recreationCategories,
} from "../../../data/recishnal";
import type { RecreationalActivity } from "../../../entities/Recreation";
import PageHeader from "../../../components/layout/PageHeader";
import CTASection from "../../../components/CTASection";

export default function RecreationalActivities() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredActivities =
    selectedCategory === "all"
      ? recreationalActivities
      : recreationalActivities.filter(
          (activity) => activity.categoryId === selectedCategory,
        );

  const selectedCategoryName =
    selectedCategory === "all"
      ? t("recreation.filter.allActivities")
      : recreationCategories.find((cat) => cat.id === selectedCategory)?.name[
          lang
        ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[]}
        image="images/slide1.jpg"
        subtitle={t("recreation.hero.subtitle")}
        title={t("recreation.hero.title")}
      />

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-text-primary text-center mb-8">
              {t("recreation.filter.title")}
            </h2>

            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {/* All Activities Button */}
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border"
                }`}
              >
                {t("recreation.filter.allActivities")}
              </button>

              {/* Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-6 py-3 rounded-xl font-medium transition-all duration-300 bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary border border-border flex items-center gap-2"
                >
                  <span>
                    {selectedCategory === "all"
                      ? t("recreation.filter.selectCategory")
                      : selectedCategoryName}
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-fade-in">
                    {recreationCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-6 py-3 text-left transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "bg-primary text-white"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                      >
                        {category.name[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  lang={lang}
                  index={index}
                  onNavigate={() =>
                    navigate(`/recreational-activities/${activity.id}`)
                  }
                />
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                  {t("recreation.noActivities.title")}
                </h3>
                <p className="text-text-secondary">
                  {t("recreation.noActivities.message")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}

const ActivityCard: React.FC<{
  activity: RecreationalActivity;
  lang: "en" | "da" | "pa";
  index: number;
  onNavigate: () => void;
}> = ({ activity, lang, index, onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div
      className="card group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-48 -m-6 mb-4 overflow-hidden rounded-t-xl">
        <img
          src={activity.image}
          alt={activity.title[lang]}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {activity.title[lang]}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-text-secondary line-clamp-3">
          {activity.description[lang]}
        </p>

        <div className="flex items-center gap-2 text-text-secondary">
          <svg
            className="w-5 h-5 text-primary"
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
          <span className="text-sm">{activity.location}</span>
        </div>

        <button
          onClick={onNavigate}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-300 group-hover:shadow-lg"
        >
          {t("recreation.card.learnMore")}
        </button>
      </div>
    </div>
  );
};
