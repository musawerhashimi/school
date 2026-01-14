// src/components/studentProjects/RecentProjects.tsx

import { Link } from "react-router-dom";
import type { StudentProject } from "../../../entities/StudentProject";
import { useTranslation } from "react-i18next";
import { projectCategories } from "../../../data/studenProject";

interface RecentProjectsProps {
  projects: StudentProject[];
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 md:mx-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="text-4xl">📂</div>
        <h2 className="text-3xl font-bold text-text-primary">
          {t("studentProjects.recent")}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project) => {
          const category = projectCategories.find(
            (c) => c.id === project.category
          );

          return (
            <Link
              key={project.id}
              to={`/student-projects/${project.id}`}
              className="group"
            >
              <div className="card overflow-hidden hover:shadow-2xl transition-all duration-300 h-full">
                {/* Large Image */}
                <div className="relative h-64 -m-6 mb-6 overflow-hidden rounded-t-xl">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Category and Awards on Image */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {category && (
                      <span className={`badge badge-secondary shadow-lg`}>
                        <span className="mr-1">⭐</span>
                        {t(`studentProjects.categories.${project.category}`)}
                      </span>
                    )}
                    {project.awards && project.awards.length > 0 && (
                      <span className="badge bg-accent text-text-primary shadow-lg font-semibold">
                        🏆 {project.awards.length} Awards
                      </span>
                    )}
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <p className="text-text-secondary mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Students with Avatars */}
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center">
                        {project.students.slice(0, 4).map((student, index) => (
                          <div
                            key={student.id}
                            className="relative"
                            style={{ marginLeft: index > 0 ? "-12px" : "0" }}
                          >
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full border-2 border-card shadow-md"
                              title={student.name}
                            />
                          </div>
                        ))}
                        {project.students.length > 4 && (
                          <div className="w-10 h-10 rounded-full bg-primary text-white text-sm flex items-center justify-center border-2 border-card shadow-md -ml-3">
                            +{project.students.length - 4}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {project.students.length > 1
                            ? `${project.students.length} ${t(
                                "studentProjects.card.collaborators"
                              )}`
                            : project.students[0].name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {project.grade}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-text-secondary">
                      {new Date(project.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="text-primary font-semibold group-hover:gap-3 flex items-center gap-2 transition-all">
                      {t("studentProjects.card.viewDetails")}
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentProjects;
