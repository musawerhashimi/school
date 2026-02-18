
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useState } from "react";
import { Clock, User, FileDown, ChevronDown,Map } from "lucide-react";

import { days, classTimetable } from "../../../data/classtimetable";
import { useParams } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import type {
  ClassTimetable,
  Day,
  TimetableCell,
} from "@/entities/classtimetable";

export default function TimetablePage() {
  const params = useParams();
  const classId = params.id as string;

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter the array correctly
  function getTimetablesByClassId(classId: string): ClassTimetable[] {
    return classTimetable.filter(
      (item) => item.class_id.toString() === classId
    );
  }

  const timetableData = getTimetablesByClassId(classId);

  // State to track selected subclass index
  const [selectedSubclassIndex, setSelectedSubclassIndex] = useState(0);

  function getCell(
    data: ClassTimetable,
    day: Day,
    period: number
  ): TimetableCell | undefined {
    return data.timetable.find(
      (cell) => cell.day.id === day.id && cell.period === period
    );
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const data = timetableData[selectedSubclassIndex];
      const pdf = new jsPDF();

      const tableHead = [["Period", ...days.map((day) => day.name[lang])]];

      const tableBody = data.periods.map((period) => {
        const row = [`${period.start} - ${period.end}`];

        days.forEach((day) => {
          const cell = getCell(data, day, period.id);

          if (cell) {
            row.push(`${cell.subject.name[lang]}\n${cell.teacher.name[lang]}`);
          } else {
            row.push("-");
          }
        });

        return row;
      });

      autoTable(pdf, {
        head: tableHead,
        body: tableBody,
        styles: { fontSize: 8 },
      });

      pdf.save(`class-${classId}-subclass-${data.sub_id}-timetable.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!timetableData.length) {
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--color-error)" }}
            >
              {t("academic.timetable.classNotFound")}
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              {t("academic.timetable.noTimetableFor")} {classId}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get the currently selected subclass data
  const data = timetableData[selectedSubclassIndex];

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
        <div className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 hover-lift animate-fade-in">
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
                {t("academic.timetable.class")} {data.class_id}/{data.sub_id}
              </h2>
              <p
                className="flex items-center gap-2"
                style={{ color: "var(--color-primary)" }}
              >
                <Clock className="w-4 h-4" />
                <span>
                  {t("academic.timetable.weeklySchedule")} • {data.periods.length}{" "}
                  {t("academic.timetable.periodsDaily")}
                </span>
              </p>
            </div>

            {/* Download Section with Dropdown */}
            <div className="flex items-center gap-3">
              {/* Subclass Selector Dropdown - Only show if multiple subclasses */}
              {timetableData.length > 1 && (
                <div className="custom-dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 md:px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border-2"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-primary)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <span>
                      {t("academic.timetable.class")} {data.class_id}/{data.sub_id}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showDropdown && (
                    <div className="dropdown-menu">
                      {timetableData.map((item, index) => {
                        const isActive = selectedSubclassIndex === index;
                        return (
                          <div
                            key={index}
                            className={`dropdown-item ${isActive ? "active" : ""}`}
                            onClick={() => {
                              setSelectedSubclassIndex(index);
                              setShowDropdown(false);
                            }}
                          >
                            {t("academic.timetable.class")} {item.class_id}/{item.sub_id}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

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
                        key={day.id}
                        className={`p-4 text-center font-semibold ${idx === days.length - 1 ? "rounded-tr-xl" : ""}`}
                        style={{
                          borderColor: "var(--color-primary-dark)",
                          color: "white",
                          border: "1px solid",
                        }}
                      >
                        {day.name[lang]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.periods.map((period) => (
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
                        e.currentTarget.style.backgroundColor = "transparent";
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
                        const cell = getCell(data, day, period.id);
                        return (
                          <td
                            key={day.id}
                            className="p-3 border"
                            style={{ borderColor: "var(--color-border)" }}
                          >
                            {cell ? (
                              <div
                                className="rounded-lg p-3 border-2 transition-all hover:scale-105 hover:shadow-md"
                                style={{
                                  backgroundColor: "var(--color-surface)",
                                  borderColor: "var(--color-primary)",
                                }}
                              >
                                <div
                                  className="font-bold text-sm mb-1 text-center"
                                  style={{ color: "var(--color-text-primary)" }}
                                >
                                  {cell.subject.name[lang]}
                                </div>
                                <div
                                  className=" gap-1 text-xs mb-1 text-center"
                                  style={{ color: "var(--color-primary)" }}
                                >
                                  <User className="w-3 h-3 inline me-2" />
                                  {cell.teacher.name[lang]}
                                </div>
                                <div
                                  className=" gap-1 text-xs mb-1 text-center"
                                  style={{ color: "var(--color-text-secondary)" }}
                                >
                                  <Map className="me-2 inline w-3 h-3"/> {cell.location}
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
                  key={day.id}
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
                    <h3 className="font-bold text-lg">{day.name[lang]}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {data.periods.map((period) => {
                      const cell = getCell(data, day, period.id);
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
                            <div className="text-xs font-semibold">P{period.id}</div>
                            <div className="text-[10px]">{period.start}</div>
                          </div>
                          {cell ? (
                            <div className="flex-1">
                              <div
                                className="font-bold mb-1"
                                style={{
                                  color: "var(--color-text-primary)",
                                }}
                              >
                                {cell.subject.name[lang]}
                              </div>
                              <div
                                className="flex items-center gap-1 text-xs mb-1"
                                style={{ color: "var(--color-primary)" }}
                              >
                                <User className="w-3 h-3" />
                                {cell.teacher.name[lang]}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: "var(--color-text-secondary)" }}
                              >
                                {cell.location}
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
      </div>
    </div>
  );
}