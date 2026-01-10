import { BookOpen, Award, ChevronRight } from "lucide-react";
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
    <div
      className="fixed inset-0 bg-white/30 backdrop-blur-lg flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">
                <img src={program.image} alt={program.title} />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
                <p className="opacity-90">{program.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-primary hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Program Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Grade Levels:</span>
                  <span className="font-semibold text-text-primary">
                    {program.grades}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="font-semibold text-text-primary">
                    {program.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Students:</span>
                  <span className="font-semibold text-text-primary">
                    {program.students}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Teaching Staff:</span>
                  <span className="font-semibold text-text-primary">
                    {program.teachers} Teachers
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                Program Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {program.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary bg-opacity-10 text-text-primary font-semibold rounded-lg border border-primary border-opacity-20"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Program Highlights
            </h3>
            <ul className="space-y-3">
              {program.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </div>
                  <span className="text-text-primary">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Enroll Now
            </button>
            <button className="flex-1 bg-surface text-text-primary border border-border py-3 rounded-lg font-semibold hover:bg-card transition-colors">
              Download Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
