// components/competitions/CompetitionFilters.tsx
import { ChevronDown, Search } from "lucide-react";
import type {
  CompetitionCategory,
  CompetitionStatus,
} from "../../../entities/Competition";
import { competitionCategories } from "../../../data/competitions";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CompetitionFiltersProps {
  search: string;
  category: CompetitionCategory | "all";
  status: CompetitionStatus | "all";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CompetitionCategory | "all") => void;
  onStatusChange: (value: CompetitionStatus | "all") => void;
}

const CompetitionFilters: React.FC<CompetitionFiltersProps> = ({
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}) => {
  const { t } = useTranslation();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const statuses: Array<CompetitionStatus | "all"> = [
    "all",
    "upcoming",
    "ongoing",
    "completed",
  ];

  // Get category by value (can be number or string depending on your type)
  const getCategoryById = (categoryValue: CompetitionCategory | "all") => {
    if (categoryValue === "all") return null;
    return competitionCategories.find(
      (cat) => String(cat.id) === String(categoryValue),
    );
  };

  const handleCategorySelect = (categoryId: CompetitionCategory | "all") => {
    onCategoryChange(categoryId);
    setIsCategoryDropdownOpen(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder={t("competitions.search.placeholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-12 pr-4"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t("competitions.filters.category")}
          </label>
          <div className="relative">
            <button
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className={`w-full px-6 py-2.5 rounded-full font-medium transition-all flex items-center justify-between gap-2 ${
                category !== "all"
                  ? "bg-primary-dark text-white shadow-md"
                  : "bg-card text-text-secondary border border-border hover:border-primary"
              }`}
            >
              <span>
                {category !== "all"
                  ? getCategoryById(category)?.name
                  : t("library.action.allCategories")}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isCategoryDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-card rounded-2xl shadow-xl border border-border py-2 z-20 max-h-64 overflow-y-auto">
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={`w-full px-4 py-2.5 text-left hover:bg-surface-hover font-medium ${
                    category === "all" ? "bg-surface text-primary" : ""
                  }`}
                >
                  {t("library.action.allCategories")}
                </button>
                <div className="border-t border-border my-1" />
                {competitionCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      handleCategorySelect(
                        cat.id as unknown as CompetitionCategory,
                      )
                    }
                    className={`w-full px-4 py-2.5 text-left hover:bg-surface-hover flex items-center gap-2 ${
                      category === cat.id ? "bg-surface text-primary" : ""
                    }`}
                  >
                    <span className="font-medium">{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {t("competitions.filters.status")}
          </label>
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as CompetitionStatus | "all")
            }
            className="input-field"
          >
            {statuses.map((stat) => (
              <option key={stat} value={stat}>
                {t(`competitions.status.${stat}`)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CompetitionFilters;
