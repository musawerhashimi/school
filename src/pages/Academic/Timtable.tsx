import { useState } from "react";
import { Download, Clock, User } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

type Day =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday";
type Subject =
  | "math"
  | "physics"
  | "chemistry"
  | "dari"
  | "english"
  | "history"
  | "geography"
  | "computer"
  | "sports"
  | "islamic";

interface Period {
  id: number;
  start: string;
  end: string;
}

interface TimetableCell {
  day: Day;
  period: number;
  subject: Subject | null;
  teacher: string;
}

interface ClassTimetable {
  id: number;
  sub_id: string;
  timetable: TimetableCell[];
}

const days: Day[] = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

const periods: Period[] = [
  { id: 1, start: "08:00", end: "08:45" },
  { id: 2, start: "08:45", end: "09:30" },
  { id: 3, start: "09:30", end: "10:15" },
  { id: 4, start: "10:30", end: "11:15" },
  { id: 5, start: "11:15", end: "12:00" },
  { id: 6, start: "12:00", end: "12:45" },
];

const subjects: Record<Subject, string> = {
  math: "ریاضی",
  physics: "فزیک",
  chemistry: "کیمیا",
  dari: "دری",
  english: "انگلیسی",
  history: "تاریخ",
  geography: "جغرافیه",
  computer: "کمپیوتر",
  sports: "ورزش",
  islamic: "تعلیمات اسلامی",
};

const subjectColors: Record<Subject, string> = {
  math: "bg-blue-50 border-blue-200 text-blue-900",
  physics: "bg-purple-50 border-purple-200 text-purple-900",
  chemistry: "bg-green-50 border-green-200 text-green-900",
  dari: "bg-amber-50 border-amber-200 text-amber-900",
  english: "bg-red-50 border-red-200 text-red-900",
  history: "bg-orange-50 border-orange-200 text-orange-900",
  geography: "bg-teal-50 border-teal-200 text-teal-900",
  computer: "bg-indigo-50 border-indigo-200 text-indigo-900",
  sports: "bg-lime-50 border-lime-200 text-lime-900",
  islamic: "bg-emerald-50 border-emerald-200 text-emerald-900",
};

const classtimetable: ClassTimetable[] = [
  {
    id: 10,
    sub_id: "A",
    timetable: [
      // Saturday
      { day: "Saturday", period: 1, subject: "math", teacher: "Mr. Ahmad" },
      { day: "Saturday", period: 2, subject: "physics", teacher: "Mr. Ahmad" },
      { day: "Saturday", period: 3, subject: "dari", teacher: "Mr. Ahmad" },
      { day: "Saturday", period: 4, subject: "english", teacher: "Mr. Ahmad" },
      { day: "Saturday", period: 5, subject: "islamic", teacher: "Mr. Ahmad" },
      { day: "Saturday", period: 6, subject: "history", teacher: "Mr. Ahmad" },

      // Sunday
      { day: "Sunday", period: 1, subject: "computer", teacher: "Mr. Ahmad" },
      { day: "Sunday", period: 2, subject: "english", teacher: "Mr. Ahmad" },
      { day: "Sunday", period: 3, subject: "sports", teacher: "Mr. Ahmad" },
      { day: "Sunday", period: 4, subject: "geography", teacher: "Mr. Ahmad" },
      { day: "Sunday", period: 5, subject: "dari", teacher: "Mr. Ahmad" },
      { day: "Sunday", period: 6, subject: "physics", teacher: "Mr. Ahmad" },

      // Monday
      { day: "Monday", period: 1, subject: "english", teacher: "Mr. Ahmad" },
      { day: "Monday", period: 2, subject: "dari", teacher: "Mr. Ahmad" },
      { day: "Monday", period: 3, subject: "geography", teacher: "Mr. Ahmad" },
      { day: "Monday", period: 4, subject: "sports", teacher: "Mr. Ahmad" },
      { day: "Monday", period: 5, subject: "physics", teacher: "Mr. Ahmad" },
      { day: "Monday", period: 6, subject: "math", teacher: "Mr. Ahmad" },

      // Tuesday
      { day: "Tuesday", period: 1, subject: "chemistry", teacher: "Mr. Ahmad" },
      { day: "Tuesday", period: 2, subject: "english", teacher: "Mr. Ahmad" },
      { day: "Tuesday", period: 3, subject: "math", teacher: "Mr. Ahmad" },
      { day: "Tuesday", period: 4, subject: "dari", teacher: "Mr. Ahmad" },
      { day: "Tuesday", period: 5, subject: "computer", teacher: "Mr. Ahmad" },
      { day: "Tuesday", period: 6, subject: "sports", teacher: "Mr. Ahmad" },

      // Wednesday
      { day: "Wednesday", period: 1, subject: "physics", teacher: "Mr. Ahmad" },
      { day: "Wednesday", period: 2, subject: "english", teacher: "Mr. Ahmad" },
      {
        day: "Wednesday",
        period: 3,
        subject: "chemistry",
        teacher: "Mr. Ahmad",
      },
      {
        day: "Wednesday",
        period: 4,
        subject: "geography",
        teacher: "Mr. Ahmad",
      },
      { day: "Wednesday", period: 5, subject: "dari", teacher: "Mr. Ahmad" },
      { day: "Wednesday", period: 6, subject: "islamic", teacher: "Mr. Ahmad" },

      // Thursday
      { day: "Thursday", period: 1, subject: "math", teacher: "Mr. Ahmad" },
      { day: "Thursday", period: 2, subject: "english", teacher: "Mr. Ahmad" },
      { day: "Thursday", period: 3, subject: "physics", teacher: "Mr. Ahmad" },
      { day: "Thursday", period: 4, subject: "history", teacher: "Mr. Ahmad" },
      { day: "Thursday", period: 5, subject: "computer", teacher: "Mr. Ahmad" },
      { day: "Thursday", period: 6, subject: "sports", teacher: "Mr. Ahmad" },
    ],
  },

  {
    id: 10,
    sub_id: "B",
    timetable: [
      // Saturday
      { day: "Saturday", period: 1, subject: "english", teacher: "Ms. Fatima" },
      { day: "Saturday", period: 2, subject: "math", teacher: "Ms. Fatima" },
      { day: "Saturday", period: 3, subject: "physics", teacher: "Ms. Fatima" },
      {
        day: "Saturday",
        period: 4,
        subject: "computer",
        teacher: "Ms. Fatima",
      },
      { day: "Saturday", period: 5, subject: "islamic", teacher: "Ms. Fatima" },
      { day: "Saturday", period: 6, subject: "history", teacher: "Ms. Fatima" },

      // Sunday
      { day: "Sunday", period: 1, subject: "geography", teacher: "Ms. Fatima" },
      { day: "Sunday", period: 2, subject: "dari", teacher: "Ms. Fatima" },
      { day: "Sunday", period: 3, subject: "english", teacher: "Ms. Fatima" },
      { day: "Sunday", period: 4, subject: "sports", teacher: "Ms. Fatima" },
      { day: "Sunday", period: 5, subject: "physics", teacher: "Ms. Fatima" },
      { day: "Sunday", period: 6, subject: "math", teacher: "Ms. Fatima" },

      // Monday
      { day: "Monday", period: 1, subject: "computer", teacher: "Ms. Fatima" },
      { day: "Monday", period: 2, subject: "english", teacher: "Ms. Fatima" },
      { day: "Monday", period: 3, subject: "chemistry", teacher: "Ms. Fatima" },
      { day: "Monday", period: 4, subject: "dari", teacher: "Ms. Fatima" },
      { day: "Monday", period: 5, subject: "sports", teacher: "Ms. Fatima" },
      { day: "Monday", period: 6, subject: "physics", teacher: "Ms. Fatima" },

      // Tuesday
      { day: "Tuesday", period: 1, subject: "math", teacher: "Ms. Fatima" },
      { day: "Tuesday", period: 2, subject: "english", teacher: "Ms. Fatima" },
      {
        day: "Tuesday",
        period: 3,
        subject: "geography",
        teacher: "Ms. Fatima",
      },
      { day: "Tuesday", period: 4, subject: "computer", teacher: "Ms. Fatima" },
      { day: "Tuesday", period: 5, subject: "dari", teacher: "Ms. Fatima" },
      { day: "Tuesday", period: 6, subject: "sports", teacher: "Ms. Fatima" },

      // Wednesday
      {
        day: "Wednesday",
        period: 1,
        subject: "physics",
        teacher: "Ms. Fatima",
      },
      { day: "Wednesday", period: 2, subject: "math", teacher: "Ms. Fatima" },
      {
        day: "Wednesday",
        period: 3,
        subject: "english",
        teacher: "Ms. Fatima",
      },
      {
        day: "Wednesday",
        period: 4,
        subject: "chemistry",
        teacher: "Ms. Fatima",
      },
      {
        day: "Wednesday",
        period: 5,
        subject: "geography",
        teacher: "Ms. Fatima",
      },
      {
        day: "Wednesday",
        period: 6,
        subject: "islamic",
        teacher: "Ms. Fatima",
      },

      // Thursday
      { day: "Thursday", period: 1, subject: "english", teacher: "Ms. Fatima" },
      {
        day: "Thursday",
        period: 2,
        subject: "computer",
        teacher: "Ms. Fatima",
      },
      { day: "Thursday", period: 3, subject: "physics", teacher: "Ms. Fatima" },
      { day: "Thursday", period: 4, subject: "dari", teacher: "Ms. Fatima" },
      { day: "Thursday", period: 5, subject: "history", teacher: "Ms. Fatima" },
      { day: "Thursday", period: 6, subject: "sports", teacher: "Ms. Fatima" },
    ],
  },
];

function getCell(
  data: ClassTimetable,
  day: Day,
  period: number
): TimetableCell | undefined {
  return data.timetable.find(
    (cell) => cell.day === day && cell.period === period
  );
}

export default function TimetableTemplate() {
  const [activeClass, setActiveClass] = useState<string>("10A");

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
      <>
        <div className="max-w-7xl mx-auto ">
          {/* Class Selector */}
          <div className="w-full flex justify-center md:justify-end my-4 ">
            <div className="relative">
              <select
                value={activeClass}
                onChange={(e) => setActiveClass(e.target.value)}
                className="appearance-none bg-secondary text-white px-12 py-3 pr-12 rounded-xl font-semibold shadow-lg cursor-pointer hover:bg-primary transition-all duration-200 text-lg border-2 border-emerald-700 text-center"
              >
                {classtimetable.map((cls) => {
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
          {classtimetable.map((currentClass) => {
            const classId = `${currentClass.id}${currentClass.sub_id}`;
            if (activeClass !== classId) return null;

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
                      <span>Weekly Schedule • 6 Periods Daily</span>
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
                                    className={`rounded-lg p-3 border-2 ${
                                      subjectColors[cell.subject!]
                                    } transition-all hover:scale-105 hover:shadow-md`}
                                  >
                                    <div className="font-bold text-sm mb-1">
                                      {subjects[cell.subject!]}
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
                                <div className="text-[10px]">
                                  {period.start}
                                </div>
                              </div>
                              {cell ? (
                                <div className="flex-1">
                                  <div className="font-bold text-emerald-900 mb-1">
                                    {subjects[cell.subject!]}
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
      </>
    </div>
  );
}
