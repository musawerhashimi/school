import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Download, Clock, User } from "lucide-react";
import PageHeader from "../../../components/layout/PageHeader";
import { classtimetable, days } from "../../../data/classtimetable";
import type {
  ClassTimetable,
  Day,
  TimetableCell,
} from "../../../entities/classtimetable";
import generateSubjectColor from "../../../utils/generateSubjectColor";

function getCell(
  data: ClassTimetable,
  day: Day,
  period: number
): TimetableCell | undefined {
  return data.timetable.find(
    (cell) => cell.day === day && cell.period === period
  );
}

// Get all timetables for a specific class ID
function getTimetablesByClassId(classId: string): ClassTimetable[] {
  return classtimetable.filter((cls) => cls.id.toString() === classId);
}

export default function TimetableTemplate() {
  // Get the id from URL parameters
  const { id } = useParams<{ id: string }>();

  // Get all timetables matching the URL id
  const matchingTimetables = id ? getTimetablesByClassId(id) : classtimetable;

  // Set initial activeClass
  const [activeClass, setActiveClass] = useState<string>(
    matchingTimetables.length > 0
      ? `${matchingTimetables[0].id}${matchingTimetables[0].sub_id}`
      : `${classtimetable[0].id}${classtimetable[0].sub_id}`
  );

  // Update activeClass when URL parameter changes
  useEffect(() => {
    if (matchingTimetables.length > 0) {
      setActiveClass(
        `${matchingTimetables[0].id}${matchingTimetables[0].sub_id}`
      );
    }
  }, [id]);

  // Error handling - if no timetables found for this ID
  if (matchingTimetables.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader
          title="Class Timetables"
          subtitle="View and download weekly schedules for all classes"
          image="/images/timetable.jpg"
          breadcrumb={["Home", "Academics Programs", "Class Timetables"]}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Class Not Found
            </h2>
            <p className="text-gray-600">No timetables found for class {id}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Class Timetables"
        subtitle="View and download weekly schedules for all classes"
        image="/images/timetable.jpg"
        breadcrumb={["Home", "Academics Programs", "Class Timetables"]}
      />

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(11, 122, 75, 0.1);
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
          box-shadow: 0 12px 24px rgba(11, 122, 75, 0.15);
        }
      `}</style>

      <div className="max-w-7xl mx-auto ">
        {/* Class Selector - Only show sections for the current class ID */}
        <div className="w-full flex justify-center md:justify-end my-4 ">
          <div className="relative">
            <select
              value={activeClass}
              onChange={(e) => setActiveClass(e.target.value)}
              className="appearance-none bg-secondary text-white px-12 py-3 pr-12 rounded-xl font-semibold shadow-lg cursor-pointer hover:bg-primary transition-all duration-200 text-lg border-2 border-emerald-700 text-center"
            >
              {matchingTimetables.map((cls) => {
                const classId = `${cls.id}${cls.sub_id}`;
                return (
                  <option
                    key={classId}
                    value={classId}
                    className="bg-white text-emerald-900"
                  >
                    Class {cls.id}/{cls.sub_id}
                  </option>
                );
              })}
            </select>

            {/* Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Timetables */}
        {matchingTimetables.map((currentClass) => {
          const classId = `${currentClass.id}${currentClass.sub_id}`;
          if (activeClass !== classId) return null;

          // Get periods and subjects from the data
          const periods = currentClass.periods;
          const subjects = currentClass.subjects;

          return (
            <div
              key={classId}
              className="glass-card rounded-2xl shadow-2xl p-6 sm:p-8 hover-lift animate-fade-in"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-emerald-100">
                <div>
                  <h2 className="text-3xl font-bold text-emerald-900 mb-2">
                    Class {currentClass.id}/{currentClass.sub_id}
                  </h2>
                  <p className="text-emerald-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Weekly Schedule • {periods.length} Periods Daily
                    </span>
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Download className="w-5 h-5" />
                  Download Timetable
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                      <th className="p-4 text-left font-semibold rounded-tl-xl border border-emerald-700">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time
                        </div>
                      </th>
                      {days.map((day, idx) => (
                        <th
                          key={day}
                          className={`p-4 text-center font-semibold border border-emerald-700 ${
                            idx === days.length - 1 ? "rounded-tr-xl" : ""
                          }`}
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
                        className="hover:bg-emerald-50 transition-colors"
                      >
                        <td className="p-4 font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200">
                          <div className="flex flex-col">
                            <span className="text-sm text-emerald-600">
                              Period {period.id}
                            </span>
                            <span className="text-xs text-emerald-500">
                              {period.start} – {period.end}
                            </span>
                          </div>
                        </td>
                        {days.map((day) => {
                          const cell = getCell(currentClass, day, period.id);
                          return (
                            <td
                              key={day}
                              className="p-3 border border-emerald-200"
                            >
                              {cell ? (
                                <div
                                  className={`rounded-lg p-3 border-2 ${generateSubjectColor(
                                    cell.subject
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
                                <div className="text-center text-gray-300 text-2xl">
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
                    className="bg-white rounded-xl border-2 border-emerald-200 overflow-hidden shadow-lg"
                  >
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
                      <h3 className="font-bold text-lg">{day}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {periods.map((period) => {
                        const cell = getCell(currentClass, day, period.id);
                        return (
                          <div
                            key={period.id}
                            className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                          >
                            <div className="flex-shrink-0 bg-emerald-600 text-white rounded-lg p-2 text-center min-w-[60px]">
                              <div className="text-xs font-semibold">
                                P{period.id}
                              </div>
                              <div className="text-[10px]">{period.start}</div>
                            </div>
                            {cell ? (
                              <div className="flex-1">
                                <div className="font-bold text-emerald-900 mb-1">
                                  {subjects[cell.subject] || cell.subject}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-emerald-600">
                                  <User className="w-3 h-3" />
                                  {cell.teacher}
                                </div>
                              </div>
                            ) : (
                              <div className="flex-1 text-gray-400 text-sm">
                                No class
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
          );
        })}
      </div>
    </div>
  );
}
