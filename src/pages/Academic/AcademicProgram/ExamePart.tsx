import { useState } from "react";
import {
  Calendar,
  Clock,
  Download,
  ChevronRight,
  FileText,
} from "lucide-react";
import { examSchedule } from "../../../data/exam_schedule";
import SectionHeading from "./SectionHeading";

export default function ExamScheduleComponent() {
  const [activeTab] = useState("exams");

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {activeTab === "exams" && (
          <div>
            <SectionHeading
              title="Examination Schedule"
              subtitle="Important dates for all examinations in the academic year 2024-25"
            />
            <div className="space-y-6">
              {examSchedule.map((exam, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header Section with Gradient */}
                  <div className="bg-gradient-to-r from-primary to-secondary p-6">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {exam.exam_title}
                        </h3>
                      </div>
                      <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Download Timetable
                      </button>
                    </div>
                  </div>

                  {/* Body Section */}
                  <div className="p-6 bg-surface">
                    {/* Date and Duration Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-primary transition-colors">
                        <div className="bg-primary p-2 rounded-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary font-semibold uppercase">
                            Start Date
                          </p>
                          <p className="text-text-primary font-bold">
                            {exam.start_date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-secondary transition-colors">
                        <div className="bg-secondary p-2 rounded-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary font-semibold uppercase">
                            End Date
                          </p>
                          <p className="text-text-primary font-bold">
                            {exam.end_date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-accent transition-colors">
                        <div className="bg-accent p-2 rounded-lg">
                          <Clock className="w-6 h-6 text-text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary font-semibold uppercase">
                            Duration
                          </p>
                          <p className="text-text-primary font-bold">
                            {exam.duration}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-info-soft p-5 rounded-lg border-l-4 border-primary">
                      <h4 className="text-sm font-semibold text-text-primary uppercase mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Exam Description
                      </h4>
                      <p className="text-text-secondary leading-relaxed">
                        {exam.exam_description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Exam Guidelines Section */}
            <div className="mt-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-7 h-7" />
                Exam Guidelines
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">
                    Students must arrive 15 minutes before the exam start time
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">
                    Bring valid student ID card and admit card to the
                    examination hall
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">
                    Electronic devices are strictly prohibited in the exam hall
                  </span>
                </li>
                <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">
                    Results will be published within 2 weeks after exam
                    completion
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
