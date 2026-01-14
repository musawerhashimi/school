// src/pages/ProjectDetail.tsx

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  projectCategories,
  studentProjects,
} from "../../../data/studenProject";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);

  const project = studentProjects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Project Not Found
          </h2>
          <Link to="/student-projects" className="text-primary hover:underline">
            {t("studentProjects.detail.backToProjects")}
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-background md:mx-6">
      {/* Back Button */}
      <div className="ms-6 mt-16">
        <div className="container mx-auto px-4 pt-4">
          <button
            onClick={() => navigate("/student-projects")}
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("studentProjects.detail.backToProjects")}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 group">
              <img
                src={project.images[selectedImage]}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + project.images.length) %
                          project.images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-3 rounded-full shadow-lg transition-all"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage + 1) % project.images.length
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-text-primary p-3 rounded-full shadow-lg transition-all"
                  >
                    <svg
                      className="w-6 h-6"
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
                  </button>
                </>
              )}

              {/* Category Badge */}
              {category && (
                <div className="absolute top-6 left-6">
                  <span className={`badge badge-primary shadow-lg text-base`}>
                    <span className="mr-2">⭐</span>
                    {t(`studentProjects.categories.${project.category}`)}
                  </span>
                </div>
              )}
            </div>

            {/* Project Overview */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                {t("studentProjects.detail.overview")}
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                {project.description}
              </p>
            </div>

            {/* Awards Section */}
            {project.awards && project.awards.length > 0 && (
              <div className="card bg-warning-soft border-warning/30">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  {t("studentProjects.detail.awards")}
                </h3>
                <div className="space-y-2">
                  {project.awards.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-background/50 p-3 rounded-lg"
                    >
                      <span className="text-2xl">🥇</span>
                      <span className="text-text-primary font-medium">
                        {award}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Project Title */}
            <div className="card mb-6 bg-primary text-white">
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <div className="flex items-center gap-2 text-white/80">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(project.date)}
              </div>
            </div>

            {/* Project Team */}
            <div className="card mb-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                {t("studentProjects.detail.students")}
              </h3>
              <div className="space-y-3">
                {project.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 p-3 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-12 h-12 rounded-full border-2 border-primary"
                    />
                    <div>
                      <div className="font-semibold text-text-primary">
                        {student.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {student.grade}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Project Information
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    {t("studentProjects.detail.category")}
                  </div>
                  <div className="font-semibold text-text-primary">
                    ⭐ {t(`studentProjects.categories.${project.category}`)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    {t("studentProjects.detail.grade")}
                  </div>
                  <div className="font-semibold text-text-primary">
                    {project.grade}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">
                    {t("studentProjects.detail.date")}
                  </div>
                  <div className="font-semibold text-text-primary">
                    {formatDate(project.date)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
