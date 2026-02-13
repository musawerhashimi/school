import {
  BookOpen,
  Award,
  ChevronRight,
  Users,
  Clock,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { Program } from "../../../entities/program";
import { useTranslation } from "react-i18next";

export default function ProgramDetailModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  if (!program) return null;

  return (
    <div className="min-h-screen mt-12 bg-background mx-2">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={onClose}
          className="my-4 group flex items-center gap-2 bg-primary/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:bg-secondary/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-0.5 transition-transform duration-300" />
          </div>
          <span className="text-primary font-medium text-sm tracking-wide">
            {t("academic.detail.back")}
          </span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 shadow-2xl">
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                    {t("academic.detail.featured")}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 leading-tight">
                  {program.title}
                </h1>
                <p className="text-primary/90 text-lg md:text-xl max-w-3xl">
                  {program.description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <GraduationCap className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {program.grades}
                </div>
                <div className="text-primary/80 text-sm">
                  {t("academic.detail.gradeLevels")}
                </div>
              </div>

              <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                <Clock className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {program.duration}
                </div>
                <div className="text-primary/80 text-sm">
                  {t("academic.detail.duration")}
                </div>
              </div>

              <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                <Users className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {program.students}
                </div>
                <div className="text-primary/80 text-sm">
                  {t("academic.detail.students")}
                </div>
              </div>

              <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                <Award className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {program.teachers}
                </div>
                <div className="text-primary/80 text-sm">
                  {t("academic.detail.teachers")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t("academic.detail.coreSubjects")}
                </h2>
              </div>

              <div className="space-y-2">
                {program.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {subject}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t("academic.detail.highlights")}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {program.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-purple-950 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                      <ChevronRight className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
