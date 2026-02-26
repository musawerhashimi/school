/**
 * TeacherWeeklySchedule Page
 * Full weekly schedule view for the logged-in teacher
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Users,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  Alert,
} from "@mis-components/ui";
import { PageHeader } from "@mis-components/index";
import { useTeacherSchedule } from "../hooks/useTeachers";
import type { TeacherScheduleSlot } from "../types";
import { useUserStore } from "@/mis/modules/auth";
import {
  PERIOD_TIME_FALLBACK,
  TEACHING_DAYS,
  getSlotTimeRange,
  getTodayTeachingDay,
} from "../utils/schedule";

function formatDateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Color palette for subjects
const SUBJECT_COLORS = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-green-500 to-green-600",
  "from-orange-500 to-orange-600",
  "from-pink-500 to-pink-600",
  "from-teal-500 to-teal-600",
  "from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600",
];

function getSubjectColor(subject: string): string {
  const index =
    Math.abs(
      subject.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[index];
}

export default function TeacherWeeklySchedule() {
  const navigate = useNavigate();
  const { userProfile } = useUserStore();

  // Get teacher ID from logged-in user profile
  const teacherId = userProfile?.teacherProfile?.id || 1;

  // Fetch schedule
  const {
    data: schedule,
    isLoading,
    error,
  } = useTeacherSchedule(teacherId ?? 0);

  const now = new Date();
  const todayName = getTodayTeachingDay(now);
  const todayDateLabel = formatDateLabel(now);
  const todayDisplayName = todayName ?? "Friday";

  const periodNumbers = useMemo(() => {
    const fromSchedule = (
      Object.values(schedule?.schedule || {}).flat() as TeacherScheduleSlot[]
    )
      .map((slot) => slot.period_number)
      .filter((period): period is number => typeof period === "number");

    const uniquePeriods = Array.from(new Set(fromSchedule)).sort(
      (a, b) => a - b
    );

    if (uniquePeriods.length > 0) {
      return uniquePeriods;
    }

    return Object.keys(PERIOD_TIME_FALLBACK)
      .map((period) => Number(period))
      .sort((a, b) => a - b);
  }, [schedule]);

  const periodTimeByNumber = useMemo(() => {
    const periodTimeMap: Record<number, string> = {};

    for (const period of periodNumbers) {
      let foundTime = "";

      for (const day of TEACHING_DAYS) {
        const slot = (schedule?.schedule?.[day] || []).find(
          (s) => s.period_number === period
        );
        if (slot) {
          const range = getSlotTimeRange(slot);
          if (range.start && range.end) {
            foundTime = `${range.start} - ${range.end}`;
            break;
          }
        }
      }

      if (!foundTime) {
        const fallback = PERIOD_TIME_FALLBACK[period];
        foundTime = fallback ? `${fallback.start} - ${fallback.end}` : "";
      }

      periodTimeMap[period] = foundTime;
    }

    return periodTimeMap;
  }, [periodNumbers, schedule]);

  const todaySchedule = useMemo<TeacherScheduleSlot[]>(() => {
    if (!todayName) {
      return [];
    }

    return [...(schedule?.schedule?.[todayName] || [])].sort(
      (a, b) => a.period_number - b.period_number
    );
  }, [schedule, todayName]);

  if (!teacherId) {
    return (
      <div className="p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/mis/teachers/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Alert variant="warning">
          No teacher profile is linked to your account yet.
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading schedule..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/mis/teachers/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Alert variant="error">Failed to load schedule</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => navigate("/mis/teachers/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <PageHeader
            title="Weekly Schedule"
            subtitle={`${schedule?.total_slots || 0} classes • ${
              schedule?.total_hours_per_week || 0
            } hours/week`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-sm px-3 py-1.5">
            <Clock className="h-4 w-4 mr-1" />
            Today: {todayDisplayName} ({todayDateLabel})
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Classes</p>
                <p className="text-2xl font-bold">
                  {schedule?.total_slots || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hours/Week</p>
                <p className="text-2xl font-bold">
                  {schedule?.total_hours_per_week || 0}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Today's Classes</p>
                <p className="text-2xl font-bold text-purple-600">
                  {todaySchedule.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Days Active</p>
                <p className="text-2xl font-bold">
                  {
                    TEACHING_DAYS.filter(
                      (day) => (schedule?.schedule?.[day] || []).length > 0
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Grid - Transposed: days are rows, periods are columns */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr>
                  <th className="w-44 p-3 text-left text-sm font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-tl-lg">
                    Day
                  </th>
                  {periodNumbers.map((period, index) => (
                    <th
                      key={period}
                      className={`p-3 text-center text-sm font-medium bg-gray-50 dark:bg-gray-800 text-gray-500 ${
                        index === periodNumbers.length - 1
                          ? "rounded-tr-lg"
                          : ""
                      }`}
                    >
                      <div>P{period}</div>
                      {periodTimeByNumber[period] && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          {periodTimeByNumber[period]}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEACHING_DAYS.map((day) => (
                  <tr
                    key={day}
                    className={`border-t border-gray-100 dark:border-gray-700 ${
                      day === todayName
                        ? "bg-indigo-50/40 dark:bg-indigo-900/10"
                        : ""
                    }`}
                  >
                    <td className="p-3 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{day}</span>
                        {day === todayName && (
                          <span className="text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {(schedule?.schedule?.[day] || []).length} class
                        {(schedule?.schedule?.[day] || []).length === 1
                          ? ""
                          : "es"}
                      </div>
                    </td>

                    {periodNumbers.map((period) => {
                      const slot = (schedule?.schedule?.[day] || []).find(
                        (s) => s.period_number === period
                      );

                      return (
                        <td key={`${day}-${period}`} className="p-2">
                          {slot ? (
                            <div
                              onClick={() =>
                                navigate(
                                  `/mis/teachers/classes/${slot.class_id}`
                                )
                              }
                              className={`p-3 rounded-lg bg-gradient-to-br ${getSubjectColor(
                                slot.subject
                              )} text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm min-h-[78px]`}
                            >
                              <p className="font-medium text-sm truncate">
                                {slot.subject}
                              </p>
                              <p className="text-xs text-white/80 truncate">
                                {slot.class}
                              </p>
                              {slot.room && (
                                <p className="text-xs text-white/70 mt-1 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {slot.room}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="h-[78px] rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule Detail */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Today's Classes ({todayDisplayName})
          </h3>

          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map((slot) => {
                const timeRange = getSlotTimeRange(slot);

                return (
                  <div
                    key={slot.id}
                    onClick={() =>
                      navigate(`/mis/teachers/classes/${slot.class_id}`)
                    }
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSubjectColor(
                          slot.subject
                        )} flex items-center justify-center text-white font-bold`}
                      >
                        P{slot.period_number}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {slot.subject}
                        </p>
                        <p className="text-sm text-gray-500">{slot.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {timeRange.start || "--:--"} -{" "}
                          {timeRange.end || "--:--"}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                          <MapPin className="h-3 w-3" />
                          {slot.room || "No room"}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600" />
          Click on any class to view details
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-dashed border-gray-300" />
          Free period
        </span>
      </div>
    </div>
  );
}
