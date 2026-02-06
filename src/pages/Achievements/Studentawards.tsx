import { useState } from "react";
import { Trophy, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/layout/PageHeader";
import StatCard from "./Stat";
import { awardCategories, achievements } from "../../data/awardAchivement";

import CTASection from "../../components/CTASection";
import AchievementCard from "./StudentAchiveCard";

export default function StudentAwards() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );

  // Filter only Student achievements
  const studentAchievements = achievements.filter(
    (achievement) => achievement.typel === "Student",
  );

  const filteredAchievements = studentAchievements.filter((achievement) => {
    const categoryMatch =
      selectedCategory === "all" ||
      achievement.category_id === selectedCategory;
    return categoryMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title={t("studentAwards.pageTitle")}
        subtitle={t("studentAwards.pageSubtitle")}
        image="images/student.jpeg"
        breadcrumb={[
          { name: t("studentAwards.breadcrumb.home"), path: "/" },
          { name: t("nav.achievements.studentAchievements"), path: "" },
        ]}
      />

      {/* Stats Section */}
      <section className="py-4 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatCard />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Text */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t("studentAwards.badge")}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              {t("studentAwards.mainTitle")}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {t("studentAwards.mainDescription")}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-3">
                {t("studentAwards.filterByCategory")}
              </label>
              <div className="overflow-x-auto scrollbar-hide pb-2">
                <div className="flex gap-2 min-w-min">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      selectedCategory === "all"
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface text-text-secondary hover:bg-card border border-border"
                    }`}
                  >
                    <span>{t("studentAwards.allCategories")}</span>
                  </button>
                  {awardCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedCategory === category.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-surface text-text-secondary hover:bg-card border border-border"
                      }`}
                    >
                      <span>{category.name[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-text-secondary">
              {t("studentAwards.showing")}{" "}
              <span className="font-semibold text-text-primary">
                {filteredAchievements.length}
              </span>{" "}
              {filteredAchievements.length !== 1
                ? t("studentAwards.achievements")
                : t("studentAwards.achievement")}
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {t("studentAwards.noAchievements")}
              </h3>
              <p className="text-text-secondary">
                {t("studentAwards.tryAdjusting")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
