import {
  Award,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import type { TeamMember } from "../../../entities/Teams";
import { useState, useEffect } from "react";
import { departments } from "../../../data/carierr";
import { useTranslation } from "react-i18next";
import ProfileSkeleton from "./Skilton";

type TeacherCardProps = {
  teacher: TeamMember;
  onBack: () => void;
};

export default function TeamProfile({ teacher, onBack }: TeacherCardProps) {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "en" | "da" | "pa";
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  // Get department name by ID
  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name[currentLang] : `Department ${deptId}`;
  };
  if (loading) {
    return <ProfileSkeleton />;
  }
  return (
    <div className="min-h-screen bg-background m-10">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-primary/10 via-surface to-secondary/10 text-text-primary  mt-20 relative overflow-hidden p-10 rounded-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={onBack}
            className="mb-6 text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t("Back to Team")}</span>
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
            <div className="relative">
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-48 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-text-primary">
                {teacher.name}
              </h1>
              <p className="text-xl text-text-secondary mb-4">
                {teacher.role[currentLang]}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20">
                  {getDepartmentName(teacher.department_id)}
                </span>
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-medium border border-secondary/20">
                  {teacher.experience[currentLang]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">About</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              {teacher.bio[currentLang]}
            </p>
          </div>

          {/* Education Section */}
          <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-text-primary">
              <Award className="w-6 h-6 text-primary" />
              {t("Education")}
            </h2>
            <ul className="space-y-4">
              {teacher.education.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-text-secondary"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-lg">{e[currentLang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {t("Contact Information")}
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${teacher.email}`}
                className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm break-all">{teacher.email}</span>
              </a>
              <a
                href={`tel:${teacher.phone}`}
                className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">{teacher.phone}</span>
              </a>
            </div>
          </div>

          {/* Subjects Card */}
          {teacher.type === "teacher" && (
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-text-primary">
                <BookOpen className="w-5 h-5 text-primary" />
                {t("Subjects")}
              </h3>
              <div className="space-y-2">
                {teacher.subjects.map((s, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-surface rounded-lg text-text-secondary border border-border/50"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joined Date Card */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-text-primary">
              <Calendar className="w-5 h-5 text-primary" />
              {t("Member Since")}
            </h3>
            <p className="text-lg font-medium text-text-secondary">
              {teacher.joinedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
