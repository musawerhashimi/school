import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Internship } from "../../../entities/intership";
import { internshipCategories, internshipsData } from "../../../data/intership";
import PageHeader from "../../../components/layout/PageHeader";

import CategoryFilter from "./CategoryFilter";
import InternshipCard from "./InternshipCard";
import HowToApplySection from "./HowToApplySection";
import InternshipModal from "./InternshipModal";
import IntroSection from "./IntroSection";
import BenefitsSection from "./Benefitsection";
import SearchBar from "./SearchBar";

const InternshipsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null);

  // Filter internships based on search and category
  const filteredInternships = useMemo(() => {
    return internshipsData.filter((internship) => {
      const matchesSearch =
        searchQuery === "" ||
        internship.title[lang]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        internship.organization[lang]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        internship.description[lang]
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        internship.categoryId === selectedCategory;

      return matchesSearch && matchesCategory && internship.isActive;
    });
  }, [searchQuery, selectedCategory, lang]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        breadcrumb={[
          {
            name: t("about.page.breadcrumb.home"),
            path: "/",
          },
          { name: t("nav.careers"), path: "/careers" },
          { name: t("nav.academics.internships"), path: "/internships" },
        ]}
        title={t("internships.pageTitle")}
        subtitle={t("internships.pageSubtitle")}
        image="/images/internship.jpeg"
      />

      {/* Introduction Section */}
      <IntroSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Main Content - Internship Listings */}
      <section className="py-4 bg-surface">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Search and Filter Controls */}
          <div className="mb-12 space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 max-w-6xl">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("internships.search.placeholder")}
                />
              </div>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={internshipCategories}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-text-secondary text-sm">
              {filteredInternships.length}{" "}
              {filteredInternships.length === 1
                ? t("opportunity")
                : t("opportunities")}{" "}
              {t("found")}
            </p>
          </div>

          {/* Internship List */}
          {filteredInternships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onClick={() => setSelectedInternship(internship)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-hover mb-6">
                <svg
                  className="w-10 h-10 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("internships.noResults")}
              </h3>
              <p className="text-text-secondary">
                {t("internships.noResultsDesc")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How to Apply Section */}
      <HowToApplySection />

      {/* Modal for internship details */}
      {selectedInternship && (
        <InternshipModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </div>
  );
};

export default InternshipsPage;
