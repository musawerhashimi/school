// src/pages/StudentProjects.tsx

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import { studentProjects } from "../../../data/studenProject";
import RecentProjects from "./FeaturedProjects";
import ProjectCard from "./ProjectCard";
import ProjectFilters from "./ProjectFilters";
import type { ProjectFilters as IProjectFilters } from "../../../entities/StudentProject";
const StudentProjects: React.FC = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<IProjectFilters>({
    category: "",
    grade: "",
    year: "",
    search: "",
    sortBy: "newest",
  });

  // Get 4 most recent projects
  const recentProjects = useMemo(() => {
    return [...studentProjects]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, []);

  const filteredProjects = useMemo(() => {
    let filtered = [...studentProjects];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (project) => project.category === filters.category
      );
    }

    // Grade filter
    if (filters.grade) {
      filtered = filtered.filter((project) => project.grade === filters.grade);
    }

    // Year filter (extract from date)
    if (filters.year) {
      filtered = filtered.filter(
        (project) =>
          new Date(project.date).getFullYear() === parseInt(filters.year)
      );
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.students.some((student) =>
            student.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return filters.sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [filters]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("studentProjects.title")}
        subtitle={t("studentProjects.subtitle")}
        image={"images/project.jpg"}
        breadcrumb={[]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Recent Projects (4 Latest) */}
        {recentProjects.length > 0 && (
          <RecentProjects projects={recentProjects} />
        )}

        {/* Filters */}
        <div className="mb-8">
          <ProjectFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* All Projects Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-6 mx-8">
            📂{t("studentProjects.allProjects")}
          </h2>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/student-projects/${project.id}`}
                  className="block hover:scale-[1.02] transition-transform duration-300"
                >
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface rounded-xl">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                {t("studentProjects.noResults")}
              </h3>
              <p className="text-text-secondary">
                {t("studentProjects.noResultsDesc")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProjects;
