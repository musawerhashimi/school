import React from "react";
import { useTranslation } from "react-i18next";
import type { NewsCategory } from "../../../../entities/NewsType";

interface CategoryFilterProps {
  categories: NewsCategory[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  className = "",
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div className={`relative ${className}`}>
      <select
        value={selectedCategory || ""}
        onChange={(e) => {
          const value = e.target.value;
          onCategoryChange(value ? parseInt(value) : null);
        }}
        className="input-field pr-10 py-3 w-full bg-surface border-border focus:border-primary transition-colors duration-300 appearance-none cursor-pointer"
      >
        <option value="">
          {t("news.allCategories") || t("events.allCategories")}
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name[lang]}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
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
  );
};
