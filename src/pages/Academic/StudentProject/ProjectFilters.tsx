// src/components/studentProjects/ProjectFilters.tsx
import { useTranslation } from "react-i18next";
import type { ProjectFilters as IProjectFilters } from "../../../entities/StudentProject";
import {
  projectCategories,
  availableYears,
  availableGrades,
} from "../../../data/studenProject";

interface ProjectFiltersProps {
  filters: IProjectFilters;
  onFiltersChange: (filters: IProjectFilters) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { t } = useTranslation();

  const handleFilterChange = (key: keyof IProjectFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      category: "",
      grade: "",
      year: "",
      search: "",
      sortBy: "newest",
    });
  };

  const hasActiveFilters =
    filters.category || filters.grade || filters.year || filters.search;

  return (
    <div className="bg-surface rounded-xl p-6 border border-border md:mx-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder={t("studentProjects.filters.search")}
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="input-field"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="input-field"
          >
            <option value="">{t("studentProjects.filters.category")}</option>
            <option value="">{t("studentProjects.filters.all")}</option>
            {projectCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {t(`studentProjects.categories.${category.id}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="input-field"
          >
            <option value="">{t("studentProjects.filters.year")}</option>
            <option value="">{t("studentProjects.filters.all")}</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange("grade", e.target.value)}
            className="input-field"
          >
            <option value="">{t("studentProjects.filters.grade")}</option>
            <option value="">{t("studentProjects.filters.all")}</option>
            {availableGrades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort and Reset */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <label className="text-sm text-text-secondary">
            {t("studentProjects.filters.sortBy")}:
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange("sortBy", "newest")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.sortBy === "newest"
                  ? "bg-primary text-white"
                  : "bg-background text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {t("studentProjects.filters.newest")}
            </button>
            <button
              onClick={() => handleFilterChange("sortBy", "oldest")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.sortBy === "oldest"
                  ? "bg-primary text-white"
                  : "bg-background text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {t("studentProjects.filters.oldest")}
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-background text-text-secondary hover:bg-surface-hover transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t("studentProjects.filters.reset")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectFilters;
