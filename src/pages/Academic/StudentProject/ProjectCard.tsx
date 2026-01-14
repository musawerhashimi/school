// src/components/studentProjects/ProjectCard.tsx

import { useTranslation } from "react-i18next";
import type { StudentProject } from "../../../entities/StudentProject";
import { projectCategories } from "../../../data/studenProject";

interface ProjectCardProps {
  project: StudentProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { t } = useTranslation();

  const category = projectCategories.find((c) => c.id === project.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="card group cursor-pointer overflow-hidden h-full flex flex-col md:mx-6">
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-xl -m-6 mb-4">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className={`badge badge-secondary shadow-lg`}>
              <span className="mr-1">⭐</span>
              {t(`studentProjects.categories.${project.category}`)}
            </span>
          </div>
        )}

        {/* Awards Badge */}
        {project.awards && project.awards.length > 0 && (
          <div className="absolute top-4 right-4">
            <span className="badge bg-accent text-text-primary shadow-lg">
              🏆 {project.awards.length}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        {/* Students */}
        <div className="mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-text-secondary">
              {project.students.length > 1
                ? t("studentProjects.card.collaborators")
                : t("studentProjects.card.by")}
              :
            </span>
            <div className="flex items-center gap-1">
              {project.students.slice(0, 3).map((student, index) => (
                <div
                  key={student.id}
                  className="relative"
                  style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                >
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-full border-2 border-card"
                    title={student.name}
                  />
                </div>
              ))}
              {project.students.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-card -ml-2">
                  +{project.students.length - 3}
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {project.students
              .slice(0, 2)
              .map((s) => s.name)
              .join(", ")}
            {project.students.length > 2 && ` +${project.students.length - 2}`}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex flex-col">
            <span className="text-xs text-text-secondary">{project.grade}</span>
            <span className="text-xs text-text-secondary">
              {formatDate(project.date)}
            </span>
          </div>

          <div className="text-primary font-medium text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
            {t("studentProjects.card.viewDetails")}
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
