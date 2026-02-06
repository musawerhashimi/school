// src/pages/AlumniPage.tsx

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Search, Filter, Users } from "lucide-react";
import { alumniData, getGraduationYears } from "../../data/alumini";
import PageHeader from "../../components/layout/PageHeader";
import { AlumniCard } from "./AluminiCard";

export default function AlumniPage() {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const graduationYears = getGraduationYears();

  // Filter and search logic
  const filteredAlumni = useMemo(() => {
    return alumniData.filter((alumni) => {
      // Year filter
      const yearMatch =
        selectedYear === "all" ||
        alumni.graduatedYear === parseInt(selectedYear);

      // Search filter (searches in name and achievements)
      const searchMatch =
        searchQuery === "" ||
        alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alumni.achievements.some(
          (achievement) =>
            achievement.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            achievement.da.toLowerCase().includes(searchQuery.toLowerCase()) ||
            achievement.pa.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      return yearMatch && searchMatch;
    });
  }, [searchQuery, selectedYear]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        image="images/alumini.jpeg"
        title={t("alumni.pageTitle")}
        subtitle={t("alumni.pageSubtitle")}
        breadcrumb={[
          { name: t("common.home"), path: "/" },
          { name: t("alumni.pageTitle"), path: "/alumni" },
        ]}
      />

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Intro Section */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              {t("alumni.introTitle")}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t("alumni.introDescription")}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-card p-6 rounded-xl shadow-md mb-12 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  placeholder={t("alumni.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              {/* Year Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="input-field pl-12 appearance-none cursor-pointer"
                >
                  <option value="all">{t("alumni.filterAllYears")}</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year.toString()}>
                      {t("alumni.graduationYear")} {year}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-text-secondary"
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
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-text-secondary">
              {t("alumni.showingResults", { count: filteredAlumni.length })}
            </div>
          </div>

          {/* Alumni Grid */}
          {filteredAlumni.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAlumni.map((alumni) => (
                <AlumniCard key={alumni.id} alumni={alumni} />
              ))}
            </div>
          ) : (
            // No Results Message
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-surface rounded-full mb-4">
                <Users className="w-10 h-10 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("alumni.noResults")}
              </h3>
              <p className="text-text-secondary">
                {t("alumni.noResultsDescription")}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-3">{t("alumni.ctaTitle")}</h3>
            <p className="text-lg mb-6 opacity-90">
              {t("alumni.ctaDescription")}
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-surface transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {t("alumni.ctaButton")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
