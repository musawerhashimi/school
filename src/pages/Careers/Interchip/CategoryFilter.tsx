import React from "react";
import { useTranslation } from "react-i18next";
import type { InternshipCategory } from "../../../entities/intership";

interface CategoryFilterProps {
  categories: InternshipCategory[];
  selectedCategory: string;
  onChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onChange,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div>
      <label className="block text-sm font-semibold text-text-primary mb-3">
        {t("internships.filter.label")}
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onChange("all")}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            selectedCategory === "all"
              ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
              : "bg-card border border-border text-text-secondary hover:border-primary hover:text-primary hover:shadow-md"
          }`}
        >
          {t("internships.filter.all")}
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === category.id
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                : "bg-card border border-border text-text-secondary hover:border-primary hover:text-primary hover:shadow-md"
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
