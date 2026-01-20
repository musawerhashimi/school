// src/pages/SportsTeams.tsx

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { LanguageType } from "../../../entities/sportsTeams";
import { sportCategories, sportsTeams } from "../../../data/sportsTeams.data";
import PageHeader from "../../../components/layout/PageHeader";
import TeamCard from "./TeamCard";

export default function SportsTeamsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LanguageType;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTeams = useMemo(() => {
    if (selectedCategory === "all") {
      return sportsTeams;
    }
    return sportsTeams.filter((team) => team.categoryId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        breadcrumb={[]}
        title={t("sportsTeams.pageTitle")}
        subtitle={t("sportsTeams.pageDescription")}
        image="images/slide4.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-lg scale-105"
                  : "bg-card text-text-secondary border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {t("sportsTeams.allCategories")}
            </button>
            {sportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-card text-text-secondary border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {category.name[lang]}
              </button>
            ))}
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              {t("sportsTeams.noTeamsFound")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
