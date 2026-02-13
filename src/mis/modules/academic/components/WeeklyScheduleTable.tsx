import { useMemo } from "react";
import { BookOpen, Edit, Eye } from "lucide-react";
import { Badge, Card, CardContent } from "@mis-components/ui";
import type { DaySchedule, ScheduleApiResponse, DayOfWeek } from "../types";
import { useTheme } from "@/hooks/useTheme";

interface WeeklyScheduleTableProps {
  weeklySchedule: DaySchedule[];
  onSlotClick?: (slot: ScheduleApiResponse) => void;
  onEmptySlotClick?: (dayOfWeek: DayOfWeek, periodNumber: number) => void;
  maxPeriods?: number;
  showTeacher?: boolean;
  showRoom?: boolean;
  mode?: "view" | "edit";
  className?: string;
  showModeToggle?: boolean;
  onModeChange?: (mode: "view" | "edit") => void;
}

// Enhanced subject type colors with better contrast and visual appeal
// Dark mode uses more subtle, muted colors for better readability
const SUBJECT_COLORS: Record<string, { light: string; dark: string }> = {
  mathematics: {
    light: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 text-blue-900 hover:shadow-blue-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-blue-700/50 text-blue-200 hover:shadow-lg"
  },
  english: {
    light: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 text-amber-900 hover:shadow-amber-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-amber-700/50 text-amber-200 hover:shadow-lg"
  },
  science: {
    light: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-400 text-emerald-900 hover:shadow-emerald-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-emerald-700/50 text-emerald-200 hover:shadow-lg"
  },
  physics: {
    light: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-400 text-cyan-900 hover:shadow-cyan-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-cyan-700/50 text-cyan-200 hover:shadow-lg"
  },
  chemistry: {
    light: "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-400 text-violet-900 hover:shadow-violet-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-violet-700/50 text-violet-200 hover:shadow-lg"
  },
  biology: {
    light: "bg-gradient-to-br from-green-50 to-green-100 border-green-400 text-green-900 hover:shadow-green-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-green-700/50 text-green-200 hover:shadow-lg"
  },
  history: {
    light: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 text-orange-900 hover:shadow-orange-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-orange-700/50 text-orange-200 hover:shadow-lg"
  },
  geography: {
    light: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-400 text-teal-900 hover:shadow-teal-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-teal-700/50 text-teal-200 hover:shadow-lg"
  },
  arts: {
    light: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-400 text-pink-900 hover:shadow-pink-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-pink-700/50 text-pink-200 hover:shadow-lg"
  },
  music: {
    light: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 text-purple-900 hover:shadow-purple-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-purple-700/50 text-purple-200 hover:shadow-lg"
  },
  pe: {
    light: "bg-gradient-to-br from-red-50 to-red-100 border-red-400 text-red-900 hover:shadow-red-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-red-700/50 text-red-200 hover:shadow-lg"
  },
  computer: {
    light: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-400 text-indigo-900 hover:shadow-indigo-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-indigo-700/50 text-indigo-200 hover:shadow-lg"
  },
  language: {
    light: "bg-gradient-to-br from-fuchsia-50 to-fuchsia-100 border-fuchsia-400 text-fuchsia-900 hover:shadow-fuchsia-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-fuchsia-700/50 text-fuchsia-200 hover:shadow-lg"
  },
  religious: {
    light: "bg-gradient-to-br from-lime-50 to-lime-100 border-lime-400 text-lime-900 hover:shadow-lime-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-lime-700/50 text-lime-200 hover:shadow-lg"
  },
  default: {
    light: "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-400 text-slate-900 hover:shadow-slate-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-slate-600/50 text-slate-200 hover:shadow-lg"
  },
};

// Color palette for hash-based assignment
const COLOR_PALETTE: { light: string; dark: string }[] = [
  {
    light: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 text-blue-900 hover:shadow-blue-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-blue-700/50 text-blue-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 text-purple-900 hover:shadow-purple-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-purple-700/50 text-purple-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-400 text-emerald-900 hover:shadow-emerald-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-emerald-700/50 text-emerald-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-400 text-rose-900 hover:shadow-rose-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-rose-700/50 text-rose-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 text-amber-900 hover:shadow-amber-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-amber-700/50 text-amber-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-400 text-cyan-900 hover:shadow-cyan-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-cyan-700/50 text-cyan-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-400 text-pink-900 hover:shadow-pink-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-pink-700/50 text-pink-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-400 text-indigo-900 hover:shadow-indigo-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-indigo-700/50 text-indigo-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-400 text-orange-900 hover:shadow-orange-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-orange-700/50 text-orange-200 hover:shadow-lg"
  },
  {
    light: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-400 text-teal-900 hover:shadow-teal-200",
    dark: "bg-gradient-to-br from-slate-700/60 to-slate-800/60 border-teal-700/50 text-teal-200 hover:shadow-lg"
  },
];


export default function WeeklyScheduleTable({
  weeklySchedule,
  onSlotClick,
  onEmptySlotClick,
  maxPeriods = 6,
  showTeacher = true,
  showRoom = true,
  mode = "view",
  className = "",
  showModeToggle = false,
  onModeChange,
}: WeeklyScheduleTableProps) {
  const { theme } = useTheme();
  // Calculate the actual max periods from the data
  const actualMaxPeriods = useMemo(() => {
    let max = maxPeriods;
    weeklySchedule.forEach((day) => {
      day.periods.forEach((period) => {
        if (period.period_number > max) {
          max = period.period_number;
        }
      });
    });
    return Math.min(max, 8); // Cap at 8 periods
  }, [weeklySchedule, maxPeriods]);

  // Create period numbers array
  const periodNumbers = useMemo(
    () => Array.from({ length: actualMaxPeriods }, (_, i) => i + 1),
    [actualMaxPeriods]
  );

  // Build schedule grid
  const scheduleGrid = useMemo(() => {
    const grid: Record<number, Record<number, ScheduleApiResponse | null>> = {};

    // Initialize grid with null values
    weeklySchedule.forEach((day) => {
      grid[day.day_of_week] = {};
      periodNumbers.forEach((period) => {
        grid[day.day_of_week][period] = null;
      });
    });

    // Fill in actual slots
    weeklySchedule.forEach((day) => {
      day.periods.forEach((slot) => {
        grid[day.day_of_week][slot.period_number] = slot;
      });
    });

    return grid;
  }, [weeklySchedule, periodNumbers]);

  const getSlotColor = (slot: ScheduleApiResponse) => {
    // First, try to match by subject name keywords
    const subjectLower = slot.subject_name.toLowerCase();

    for (const [key, colors] of Object.entries(SUBJECT_COLORS)) {
      if (key !== "default" && subjectLower.includes(key)) {
        return theme === "dark" ? colors.dark : colors.light;
      }
    }

    // If no match, use hash-based color assignment for consistency
    const hash = slot.subject_name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorPair = COLOR_PALETTE[hash % COLOR_PALETTE.length];
    return theme === "dark" ? colorPair.dark : colorPair.light;
  };

  const renderSlot = (
    dayOfWeek: DayOfWeek,
    periodNumber: number,
    slot: ScheduleApiResponse | null
  ) => {
    const isDark = theme === "dark";

    if (!slot) {
      // Empty slot
      if (mode === "edit" && onEmptySlotClick) {
        return (
          <button
            type="button"
            onClick={() => onEmptySlotClick(dayOfWeek, periodNumber)}
            className={`w-full h-full min-h-[80px] border-2 border-dashed rounded-lg
                       hover:border-primary transition-all duration-200 
                       flex items-center justify-center group
                       ${
                         isDark
                           ? "border-gray-600 bg-gray-800/20 hover:bg-primary/10 text-gray-500 hover:text-primary"
                           : "border-gray-300 bg-white hover:bg-primary/10 text-gray-400 hover:text-primary"
                       }`}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                +
              </span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Add Class
              </span>
            </div>
          </button>
        );
      }
      return (
        <div
          className={`w-full h-full min-h-[80px] border rounded-lg
                        ${
                          isDark
                            ? "border-gray-700 bg-gray-800/30"
                            : "border-gray-200 bg-gray-50/50"
                        }`}
        />
      );
    }

    const colorClass = getSlotColor(slot);
    const isClickable = mode === "edit" || onSlotClick;

    return (
      <button
        type="button"
        onClick={() => isClickable && onSlotClick?.(slot)}
        disabled={!isClickable}
        className={`w-full h-full min-h-[80px] p-3 rounded-lg border-2
                   ${colorClass} 
                   ${
                     isClickable
                       ? "cursor-pointer hover:shadow-lg"
                       : "cursor-default"
                   }
                   transition-all duration-200
                   text-left flex flex-col justify-between relative group
                   ${mode === "view" ? "opacity-95" : ""}`}
      >
        {/* Subject Name Only */}
        <div>
          <div className="font-bold text-sm truncate leading-tight pr-6">
            {slot.subject_name}
          </div>
        </div>

        {/* Teacher and Room */}
        <div className="mt-2 space-y-0.5">
          {showTeacher && slot.teacher_name && (
            <div className="text-xs font-medium truncate flex items-center gap-1">
              <span className="opacity-60">👤</span>
              <span>{slot.teacher_name}</span>
            </div>
          )}
          {showRoom && slot.room_number && (
            <div className="text-xs font-medium truncate flex items-center gap-1">
              <span className="opacity-60">📍</span>
              <span>{slot.room_number}</span>
            </div>
          )}
        </div>

        {/* Edit mode indicator */}
        {mode === "edit" && (
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit className="h-3 w-3" />
          </div>
        )}
      </button>
    );
  };

  if (!weeklySchedule || weeklySchedule.length === 0) {
    const isDark = theme === "dark";
    return (
      <Card className={className}>
        <CardContent
          className={`p-8 text-center
                                ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <BookOpen
            className={`h-16 w-16 mx-auto mb-4 
                               ${isDark ? "text-gray-600" : "text-gray-300"}`}
          />
          <p className={`text-lg font-medium ${isDark ? "text-gray-300" : ""}`}>
            No schedule data available
          </p>
          <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : ""}`}>
            Schedule will appear here once configured
          </p>
        </CardContent>
      </Card>
    );
  }

  const isDark = theme === "dark";

  return (
    <div className={className}>
      {/* Mode Toggle Header */}
      {showModeToggle && onModeChange && (
        <div
          className={`mb-4 flex justify-between items-center p-4 rounded-lg
                        ${
                          isDark
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-50 border border-gray-200"
                        }`}
        >
          <h3
            className={`text-lg font-semibold ${
              isDark ? "text-gray-200" : "text-gray-900"
            }`}
          >
            Weekly Schedule
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onModeChange("view")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                         flex items-center gap-2
                         ${
                           mode === "view"
                             ? "bg-primary text-white shadow-md"
                             : isDark
                             ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                         }`}
            >
              <Eye className="h-4 w-4" />
              View
            </button>
            <button
              type="button"
              onClick={() => onModeChange("edit")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                         flex items-center gap-2
                         ${
                           mode === "edit"
                             ? "bg-primary text-white shadow-md"
                             : isDark
                             ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                             : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                         }`}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div
        className={`overflow-x-auto rounded-lg border shadow-sm
                      ${
                        isDark
                          ? "border-gray-700 bg-gray-900/50"
                          : "border-gray-200 bg-white"
                      }`}
      >
        <table className="w-full border-collapse min-w-[800px]">
          <thead
            className={
              isDark
                ? "bg-gradient-to-r from-gray-800 to-gray-800/80"
                : "bg-gradient-to-r from-gray-50 to-gray-100"
            }
          >
            <tr>
              {/* Day column header */}
              <th
                className={`p-3 text-left text-sm font-semibold w-28 border-b-2
                            ${
                              isDark
                                ? "text-gray-200 border-gray-600"
                                : "text-gray-700 border-gray-300"
                            }`}
              >
                Day
              </th>
              {/* Period column headers */}
              {periodNumbers.map((periodNum) => (
                <th
                  key={periodNum}
                  className={`p-3 text-center text-sm font-semibold border-b-2
                            ${
                              isDark
                                ? "text-gray-200 border-gray-600"
                                : "text-gray-700 border-gray-300"
                            }`}
                >
                  <Badge
                    variant="secondary"
                    className={`text-sm font-semibold px-3 py-1
                              ${isDark ? "bg-gray-700 text-gray-200" : ""}`}
                  >
                    Period {periodNum}
                  </Badge>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isDark ? "bg-gray-900" : "bg-white"}>
            {weeklySchedule.map((day, index) => (
              <tr
                key={day.day_of_week}
                className={
                  index % 2 === 0
                    ? isDark
                      ? "bg-gray-800/30"
                      : "bg-gray-50/30"
                    : isDark
                    ? "bg-gray-900"
                    : "bg-white"
                }
              >
                {/* Day name */}
                <td
                  className={`p-3 border-r-2
                              ${
                                isDark ? "border-gray-700" : "border-gray-200"
                              }`}
                >
                  <div
                    className={`font-bold text-sm ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {day.day_name}
                  </div>
                  <div
                    className={`text-xs mt-0.5 ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {day.periods.length}{" "}
                    {day.periods.length === 1 ? "class" : "classes"}
                  </div>
                </td>
                {/* Period cells */}
                {periodNumbers.map((periodNum) => (
                  <td
                    key={`${day.day_of_week}-${periodNum}`}
                    className={`p-2 ${
                      isDark
                        ? "border-r border-gray-800"
                        : "border-r border-gray-100"
                    }`}
                  >
                    {renderSlot(
                      day.day_of_week as DayOfWeek,
                      periodNum,
                      scheduleGrid[day.day_of_week]?.[periodNum] || null
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className={`mt-4 p-3 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-800/50 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
      >
        <div
          className={`text-xs flex items-center gap-4 flex-wrap
                        ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          <span className="font-semibold">Legend:</span>
          <span className="flex items-center gap-1">👤 Teacher</span>
          <span className="flex items-center gap-1">📍 Room</span>
          {mode === "edit" && (
            <span
              className={`flex items-center gap-1 font-medium
                            ${isDark ? "text-primary-400" : "text-primary"}`}
            >
              ✏️ Click to edit • + to add
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced Compact version for smaller displays
export function CompactScheduleTable({
  weeklySchedule,
  onSlotClick,
  mode = "view",
  theme = "light",
  className = "",
}: {
  weeklySchedule: DaySchedule[];
  onSlotClick?: (slot: ScheduleApiResponse) => void;
  mode?: "view" | "edit";
  theme?: "light" | "dark";
  className?: string;
}) {
  const isDark = theme === "dark";

  const getSlotColor = (slot: ScheduleApiResponse) => {
    const subjectLower = slot.subject_name.toLowerCase();

    for (const [key, colors] of Object.entries(SUBJECT_COLORS)) {
      if (key !== "default" && subjectLower.includes(key)) {
        return isDark ? colors.dark : colors.light;
      }
    }

    const hash = slot.subject_name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorPair = COLOR_PALETTE[hash % COLOR_PALETTE.length];
    return isDark ? colorPair.dark : colorPair.light;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {weeklySchedule.map((day) => (
        <Card
          key={day.day_of_week}
          className={`overflow-hidden
                                                ${
                                                  isDark
                                                    ? "bg-gray-800 border-gray-700"
                                                    : ""
                                                }`}
        >
          <div
            className={`p-4 border-b
                          ${
                            isDark
                              ? "bg-gradient-to-r from-gray-700 to-gray-700/80 border-gray-600"
                              : "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200"
                          }`}
          >
            <h4
              className={`font-bold text-lg ${
                isDark ? "text-gray-200" : "text-gray-900"
              }`}
            >
              {day.day_name}
            </h4>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {day.periods.length}{" "}
              {day.periods.length === 1 ? "class" : "classes"} scheduled
            </p>
          </div>
          <CardContent className={`p-4 ${isDark ? "bg-gray-800" : ""}`}>
            {day.periods.length === 0 ? (
              <div className="text-center py-8">
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  No classes scheduled
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {day.periods
                  .sort((a, b) => a.period_number - b.period_number)
                  .map((slot) => {
                    const colorClass = getSlotColor(slot);
                    const isClickable = mode === "edit" || onSlotClick;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => isClickable && onSlotClick?.(slot)}
                        disabled={!isClickable}
                        className={`w-full p-4 rounded-lg border-2 ${colorClass}
                                   ${
                                     isClickable
                                       ? "cursor-pointer hover:shadow-lg"
                                       : "cursor-default"
                                   }
                                   transition-all duration-200 text-left`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <Badge
                              variant="secondary"
                              className={`mt-0.5 font-semibold
                                        ${
                                          isDark
                                            ? "bg-gray-700/50 text-gray-200"
                                            : ""
                                        }`}
                            >
                              P{slot.period_number}
                            </Badge>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm leading-tight">
                                {slot.subject_name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-medium space-y-1">
                            {slot.teacher_name && (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="opacity-60">👤</span>
                                <span>{slot.teacher_name}</span>
                              </div>
                            )}
                            {slot.room_number && (
                              <div className="flex items-center gap-1 justify-end">
                                <span className="opacity-60">📍</span>
                                <span>{slot.room_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
