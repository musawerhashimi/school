import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { articles, newsCategories } from "../../../data/news";
import { CategoryFilter } from "./components/CategoryFilter";
import { NewsCard } from "./components/NewsCard";
import { SearchBar } from "./components/SearchBar";

export const NewsListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Filter and search logic
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category_id === selectedCategory,
      );
    }

    // Search by title and excerpt
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title[lang].toLowerCase().includes(query) ||
          article.excerpt[lang].toLowerCase().includes(query) ||
          article.content[lang].toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, lang]);

  // Separate featured and regular articles
  const featuredArticles = filteredArticles.filter(
    (article) => article.featured,
  );
  const regularArticles = filteredArticles.filter(
    (article) => !article.featured,
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-secondary my-12 text-center p-4 rounded-md animate-fade-in">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            {t("news.title")}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {t("news.subtitle")}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-slide-up">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("news.search")}
            />
          </div>
          <div className="md:w-64">
            <CategoryFilter
              categories={newsCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Featured News Section */}
        {featuredArticles.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              {t("news.featuredNews")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  categories={newsCategories}
                  featured={index === 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular News Section */}
        {regularArticles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary rounded-full"></span>
              {t("news.latestUpdates")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  categories={newsCategories}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-surface rounded-2xl border border-border">
              <svg
                className="w-24 h-24 text-muted mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("news.noResults")}
              </h3>
              <p className="text-text-secondary">{t("news.noResultsDesc")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
