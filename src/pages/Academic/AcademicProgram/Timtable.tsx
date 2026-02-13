import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, User, FileDown, ChevronDown } from "lucide-react";
import PageHeader from "../../../components/layout/PageHeader";
import { classtimetable, days } from "../../../data/classtimetable";
import type {
  ClassTimetable,
  Day,
  TimetableCell,
} from "../../../entities/classtimetable";
import generateSubjectColor from "../../../utils/generateSubjectColor";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";

function getCell(
  data: ClassTimetable,
  day: Day,
  period: number,
): TimetableCell | undefined {
  return data.timetable.find(
    (cell) => cell.day === day && cell.period === period,
  );
}

// Get all timetables for a specific class ID
function getTimetablesByClassId(classId: string): ClassTimetable[] {
  return classtimetable.filter((cls) => cls.id.toString() === classId);
}

export default function TimetableTemplate() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const matchingTimetables = id ? getTimetablesByClassId(id) : classtimetable;

  const [activeClass, setActiveClass] = useState<string>(
    matchingTimetables.length > 0
      ? `${matchingTimetables[0].id}${matchingTimetables[0].sub_id}`
      : `${classtimetable[0].id}${classtimetable[0].sub_id}`,
  );

  useEffect(() => {
    if (matchingTimetables.length > 0) {
      setActiveClass(
        `${matchingTimetables[0].id}${matchingTimetables[0].sub_id}`,
      );
    }
  }, [id]);

  // Handle PDF generation
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const currentClassData = matchingTimetables.find(
        (cls) => `${cls.id}${cls.sub_id}` === activeClass,
      );

      if (!currentClassData) {
        throw new Error("Class data not found");
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const periods = currentClassData.periods;
      const subjects = currentClassData.subjects;

      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      // Title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${t("academic.timetable.class")} ${currentClassData.id}/${currentClassData.sub_id} - ${t("academic.timetable.weeklyTimetable")}`,
        pageWidth / 2,
        15,
        { align: "center" },
      );

      // Calculate table dimensions
      const startY = 25;
      const tableWidth = pageWidth - margin * 2;
      const columnWidth = tableWidth / (days.length + 1);
      const rowHeight = 12;

      // Draw header row
      let currentY = startY;

      // Set header style
      pdf.setFillColor(11, 122, 75); // Primary color
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");

      // Time column header
      pdf.rect(margin, currentY, columnWidth, rowHeight, "F");

      pdf.text(
        t("academic.timetable.time"),
        margin + columnWidth / 2,
        currentY + 8,
        {
          align: "center",
        },
      );

      // Day headers
      days.forEach((day, idx) => {
        const x = margin + columnWidth * (idx + 1);
        pdf.rect(x, currentY, columnWidth, rowHeight, "F");
        pdf.text(day, x + columnWidth / 2, currentY + 8, { align: "center" });
      });

      currentY += rowHeight;

      // Draw data rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);

      periods.forEach((period, periodIdx) => {
        // Alternate row colors
        if (periodIdx % 2 === 0) {
          pdf.setFillColor(246, 251, 248); // Surface color
          pdf.rect(margin, currentY, tableWidth, rowHeight, "F");
        }

        // Time column
        pdf.setFillColor(236, 245, 240);
        pdf.rect(margin, currentY, columnWidth, rowHeight, "F");
        pdf.setTextColor(11, 122, 75);
        pdf.setFont("helvetica", "bold");
        pdf.text(`P${period.id}`, margin + 5, currentY + 5);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text(`${period.start}-${period.end}`, margin + 5, currentY + 9);
        pdf.setFontSize(8);

        // Draw vertical line after time column
        pdf.setDrawColor(209, 231, 221);
        pdf.line(
          margin + columnWidth,
          currentY,
          margin + columnWidth,
          currentY + rowHeight,
        );

        // Day columns
        days.forEach((day, dayIdx) => {
          const cell = getCell(currentClassData, day, period.id);
          const x = margin + columnWidth * (dayIdx + 1);

          // Draw cell border
          pdf.setDrawColor(209, 231, 221);
          pdf.rect(x, currentY, columnWidth, rowHeight);

          if (cell) {
            pdf.setTextColor(6, 78, 59);
            pdf.setFont("helvetica", "bold");

            // Subject name (truncate if too long)

            const subjectName = subjects[cell.subject] || cell.subject;
            const truncatedSubject =
              subjectName.length > 15
                ? subjectName.substring(0, 12) + "..."
                : subjectName;

            pdf.text(truncatedSubject, x + 2, currentY + 5);

            // Teacher name
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(7);
            pdf.setTextColor(75, 107, 95);
            const truncatedTeacher =
              cell.teacher.length > 18
                ? cell.teacher.substring(0, 15) + "..."
                : cell.teacher;
            pdf.text(truncatedTeacher, x + 2, currentY + 9);
            pdf.setFontSize(8);
          } else {
            pdf.setTextColor(157, 181, 170);
            pdf.text("-", x + columnWidth / 2, currentY + 7, {
              align: "center",
            });
          }
        });

        currentY += rowHeight;
      });

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: "center" },
      );

      const fileName = `Timetable_Class_${currentClassData.id}_${currentClassData.sub_id}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (matchingTimetables.length === 0) {
    return (
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <PageHeader
          title={t("academic.timetable.title")}
          subtitle={t("academic.timetable.subtitle")}
          image="/images/timetable.jpg"
          breadcrumb={[
            { name: t("nav.home"), path: "/" },
            { name: t("nav.academicPrograms"), path: "/academic-programs" },
            { name: t("nav.classTimetables"), path: "" },
          ]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--color-error)" }}
            >
              {t("academic.timetable.classNotFound")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {t("academic.timetable.noTimetableFor")} {id}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <PageHeader
        title={t("academic.timetable.title")}
        subtitle={t("academic.timetable.subtitle")}
        image="/images/timetable.jpg"
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.academics.programs"), path: "/academic-programs" },
          { name: t("nav.academics.schedules"), path: "" },
        ]}
      />

      <style>{`
        .glass-card {
          background: var(--color-card);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-border);
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .custom-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--color-card);
          border: 2px solid var(--color-border);
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          z-index: 50;
          min-width: 200px;
        }

        .dropdown-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-primary);
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background: var(--color-surface-hover);
        }

        .dropdown-item.active {
          background: var(--color-primary);
          color: white;
          font-weight: 600;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {matchingTimetables.map((currentClass) => {
          const classId = `${currentClass.id}${currentClass.sub_id}`;
          if (activeClass !== classId) return null;

          const periods = currentClass.periods;
          const subjects = currentClass.subjects;

          return (
            <div
              key={classId}
              className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 hover-lift animate-fade-in"
            >
              {/* Card Header */}
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6"
                style={{ borderBottom: `2px solid var(--color-border)` }}
              >
                <div>
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {t("academic.timetable.class")} {currentClass.id}/
                    {currentClass.sub_id}
                  </h2>
                  <p
                    className="flex items-center gap-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {t("academic.timetable.weeklySchedule")} •{" "}
                      {periods.length} {t("academic.timetable.periodsDaily")}
                    </span>
                  </p>
                </div>

                {/* Download Section with Dropdown */}
                <div className="flex items-center gap-3">
                  {/* Class Selector Dropdown */}
                  <div className="custom-dropdown">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-3 md:px-5 py-2.5  rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-primary)",
                        color: "var(--color-text-primary)",
                      }}
                    >
                      <span>
                        {t("academic.timetable.class")} {currentClass.id}/
                        {currentClass.sub_id}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {showDropdown && (
                      <div className="dropdown-menu">
                        {matchingTimetables.map((cls) => {
                          const clsId = `${cls.id}${cls.sub_id}`;
                          const isActive = activeClass === clsId;
                          return (
                            <div
                              key={clsId}
                              className={`dropdown-item ${isActive ? "active" : ""}`}
                              onClick={() => {
                                setActiveClass(clsId);
                                setShowDropdown(false);
                              }}
                            >
                              {t("academic.timetable.class")} {cls.id}/
                              {cls.sub_id}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                      color: "white",
                    }}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {t("academic.timetable.generating")}
                      </>
                    ) : (
                      <>
                        <FileDown className="w-5 h-5" />
                        {t("academic.timetable.downloadPdf")}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Timetable Content */}
              <div>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr
                        style={{
                          background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                        }}
                      >
                        <th
                          className="p-4 text-left font-semibold rounded-tl-xl"
                          style={{
                            borderColor: "var(--color-primary-dark)",
                            color: "white",
                            border: "1px solid",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {t("academic.timetable.time")}
                          </div>
                        </th>
                        {days.map((day, idx) => (
                          <th
                            key={day}
                            className={`p-4 text-center font-semibold ${idx === days.length - 1 ? "rounded-tr-xl" : ""}`}
                            style={{
                              borderColor: "var(--color-primary-dark)",
                              color: "white",
                              border: "1px solid",
                            }}
                          >
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((period) => (
                        <tr
                          key={period.id}
                          className="transition-colors"
                          style={{
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--color-surface-hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <td
                            className="p-4 font-semibold border"
                            style={{
                              backgroundColor: "var(--color-surface)",
                              borderColor: "var(--color-border)",
                              color: "var(--color-text-primary)",
                            }}
                          >
                            <div className="flex flex-col">
                              <span
                                className="text-sm"
                                style={{ color: "var(--color-primary)" }}
                              >
                                {t("academic.timetable.period")} {period.id}
                              </span>
                              <span
                                className="text-xs"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                {period.start} – {period.end}
                              </span>
                            </div>
                          </td>
                          {days.map((day) => {
                            const cell = getCell(currentClass, day, period.id);
                            return (
                              <td
                                key={day}
                                className="p-3 border"
                                style={{ borderColor: "var(--color-border)" }}
                              >
                                {cell ? (
                                  <div
                                    className={`rounded-lg p-3 border-2 ${generateSubjectColor(
                                      cell.subject,
                                    )} transition-all hover:scale-105 hover:shadow-md`}
                                  >
                                    <div className="font-bold text-sm mb-1">
                                      {subjects[cell.subject] || cell.subject}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs opacity-75">
                                      <User className="w-3 h-3" />
                                      {cell.teacher}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="text-center text-2xl"
                                    style={{ color: "var(--color-muted)" }}
                                  >
                                    —
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-6">
                  {days.map((day) => (
                    <div
                      key={day}
                      className="rounded-xl overflow-hidden shadow-lg"
                      style={{
                        backgroundColor: "var(--color-card)",
                        border: `2px solid var(--color-border)`,
                      }}
                    >
                      <div
                        className="p-4"
                        style={{
                          background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`,
                          color: "white",
                        }}
                      >
                        <h3 className="font-bold text-lg">{day}</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {periods.map((period) => {
                          const cell = getCell(currentClass, day, period.id);
                          return (
                            <div
                              key={period.id}
                              className="flex items-start gap-3 p-3 rounded-lg border"
                              style={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                              }}
                            >
                              <div
                                className="flex-shrink-0 rounded-lg p-2 text-center min-w-[60px]"
                                style={{
                                  backgroundColor: "var(--color-primary)",
                                  color: "white",
                                }}
                              >
                                <div className="text-xs font-semibold">
                                  P{period.id}
                                </div>
                                <div className="text-[10px]">
                                  {period.start}
                                </div>
                              </div>
                              {cell ? (
                                <div className="flex-1">
                                  <div
                                    className="font-bold mb-1"
                                    style={{
                                      color: "var(--color-text-primary)",
                                    }}
                                  >
                                    {subjects[cell.subject] || cell.subject}
                                  </div>
                                  <div
                                    className="flex items-center gap-1 text-xs"
                                    style={{ color: "var(--color-primary)" }}
                                  >
                                    <User className="w-3 h-3" />
                                    {cell.teacher}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="flex-1 text-sm"
                                  style={{ color: "var(--color-muted)" }}
                                >
                                  {t("academic.timetable.noClass")}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
