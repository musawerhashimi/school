import { useTranslation } from "react-i18next";
import type { ProjectFilters as IProjectFilters } from "../../../entities/StudentProject";
import { projectCategories } from "../../../data/studenProject";

interface ProjectFiltersProps {
  filters: IProjectFilters;
  onFiltersChange: (filters: IProjectFilters) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa"; // ✅ FIX added

  const handleFilterChange = (key: keyof IProjectFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

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
                {category.name[lang]} {/* ✅ FIXED */}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
