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
import { useTranslation } from "react-i18next";

export default function ExamScheduleComponent() {
  const [activeTab] = useState("exams");
  const { t } = useTranslation();

  return (
    <div>
      {activeTab === "exams" && (
        <>
          <SectionHeading
            title={t("academic.exams.title")}
            subtitle={t("academic.exams.subtitle")}
          />
          <div className="space-y-6">
            {examSchedule.map((exam, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {exam.exam_title}
                      </h3>
                    </div>

                    <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-surface transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      {t("academic.exams.download")}
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 bg-surface">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Start Date */}
                    <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-primary transition-colors">
                      <div className="bg-primary p-2 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-semibold uppercase">
                          {t("academic.exams.startDate")}
                        </p>
                        <p className="text-text-primary font-bold">
                          {exam.start_date}
                        </p>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-secondary transition-colors">
                      <div className="bg-secondary p-2 rounded-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-semibold uppercase">
                          {t("academic.exams.endDate")}
                        </p>
                        <p className="text-text-primary font-bold">
                          {exam.end_date}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg hover:border-accent transition-colors">
                      <div className="bg-accent p-2 rounded-lg">
                        <Clock className="w-6 h-6 text-text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-semibold uppercase">
                          {t("academic.exams.duration")}
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
                      {t("academic.exams.description")}
                    </h4>
                    <p className="text-text-secondary leading-relaxed">
                      {exam.exam_description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines */}
          <div className="mt-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-7 h-7" />
              {t("academic.exams.guidelinesTitle")}
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">
                  {t("academic.exams.guideline1")}
                </span>
              </li>

              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">
                  {t("academic.exams.guideline2")}
                </span>
              </li>

              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">
                  {t("academic.exams.guideline3")}
                </span>
              </li>

              <li className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
                <ChevronRight className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <span className="text-lg">
                  {t("academic.exams.guideline4")}
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
