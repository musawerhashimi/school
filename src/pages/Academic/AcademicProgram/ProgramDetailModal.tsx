import {
  BookOpen,
  Award,
  ChevronRight,
  Users,
  Clock,
  GraduationCap,
  Download,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import type { Program } from "../../../entities/program";

export default function ProgramDetailModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  if (!program) return null;

  return (
    <div className="min-h-screen mt-16 bg-background">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={onClose}
          className="group flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Programs</span>
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/70 via-secondary/80 to-accent/60 shadow-2xl">
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wider">
                    Featured Program
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                  {program.title}
                </h1>
                <p className="text-white/90 text-lg md:text-xl max-w-3xl">
                  {program.description}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <GraduationCap className="w-6 h-6 text-white mb-2" />
                <div className="text-2xl font-bold text-white">
                  {program.grades}
                </div>
                <div className="text-white/80 text-sm">Grade Levels</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Clock className="w-6 h-6 text-white mb-2" />
                <div className="text-2xl font-bold text-white">
                  {program.duration}
                </div>
                <div className="text-white/80 text-sm">Duration</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Users className="w-6 h-6 text-white mb-2" />
                <div className="text-2xl font-bold text-white">
                  {program.students}
                </div>
                <div className="text-white/80 text-sm">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <Award className="w-6 h-6 text-white mb-2" />
                <div className="text-2xl font-bold text-white">
                  {program.teachers}
                </div>
                <div className="text-white/80 text-sm">Teachers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Subjects */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-800 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Core Subjects
                </h2>
              </div>
              <div className="space-y-2">
                {program.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-8 h-8 from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

          {/* Right Column - Highlights & Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Program Highlights */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Program Highlights
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

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                Ready to Get Started?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="group relative overflow-hidden bg-gradient-to-r from-primary to-secondary text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Enroll Now
                  </span>
                </button>
                <button className="group flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-border py-4 px-6 rounded-xl font-semibold hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-lg">
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  Download Syllabus
                </button>
              </div>
              <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-6">
                Have questions? Contact our admissions team for more information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
