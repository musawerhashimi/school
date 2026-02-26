/**
 * AttendanceTab Component
 * Displays attendance records for parents (static/mock data for now)
 */

import { useState } from "react";
import {
  CalendarCheck,
  CalendarX,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
} from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Spinner, Alert, Button } from "@mis-components/ui";
import { useChildAttendance } from "../../hooks/useParents";
import { ATTENDANCE_STATUS_CONFIG } from "../../constants";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, getDay } from "date-fns";

interface AttendanceTabProps {
  studentId: number;
}

// Mock attendance data for demonstration
const generateMockAttendance = () => {
  const records = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    // Weighted random: 85% present, 5% absent, 7% late, 3% excused
    const rand = Math.random();
    let status: "present" | "absent" | "late" | "excused";
    if (rand < 0.85) status = "present";
    else if (rand < 0.90) status = "absent";
    else if (rand < 0.97) status = "late";
    else status = "excused";

    // Generate enter and exit times based on status
    let enter_time: string | null = null;
    let exit_time: string | null = null;

    if (status !== "absent") {
      // Generate enter time (7:30 - 8:30 for present, 8:30 - 9:30 for late)
      const enterHour = status === "late" ? 8 + Math.floor(Math.random() * 2) : 7 + Math.floor(Math.random() * 2);
      const enterMinute = Math.floor(Math.random() * 60);
      enter_time = `${enterHour.toString().padStart(2, "0")}:${enterMinute.toString().padStart(2, "0")}`;

      // Generate exit time (14:00 - 16:00)
      const exitHour = 14 + Math.floor(Math.random() * 3);
      const exitMinute = Math.floor(Math.random() * 60);
      exit_time = `${exitHour.toString().padStart(2, "0")}:${exitMinute.toString().padStart(2, "0")}`;
    }

    records.push({
      id: i + 1,
      date: format(date, "yyyy-MM-dd"),
      status,
      status_display: status.charAt(0).toUpperCase() + status.slice(1),
      enter_time,
      exit_time,
      remarks: status === "excused" ? "Medical appointment" : status === "late" ? "Traffic delay" : undefined,
    });
  }

  return records;
};

const mockAttendanceData = {
  total_days: 22,
  present_days: 19,
  absent_days: 1,
  late_days: 1,
  excused_days: 1,
  attendance_percentage: 86.4,
  records: generateMockAttendance(),
  monthly_summary: [
    { month: "January", year: 2024, present_days: 20, absent_days: 1, late_days: 1, total_days: 22, percentage: 90.9 },
    { month: "December", year: 2023, present_days: 18, absent_days: 2, late_days: 1, total_days: 21, percentage: 85.7 },
    { month: "November", year: 2023, present_days: 19, absent_days: 1, late_days: 2, total_days: 22, percentage: 86.4 },
  ],
};

export default function AttendanceTab({ studentId }: AttendanceTabProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Use mock data for now - uncomment below to use real API
  // const { data: attendance, isLoading } = useChildAttendance(studentId);
  const attendance = mockAttendanceData;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" label="Loading attendance..." />
      </div>
    );
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedMonth);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  // Generate calendar days
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the starting day of the week (0 = Sunday)
  const startDayOfWeek = getDay(monthStart);

  // Create a map of attendance by date
  const attendanceMap = new Map(
    attendance?.records?.map((r) => [r.date, r]) || []
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  {attendance?.total_days || 0}
                </p>
                <p className="text-xs text-text-secondary">Total Days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {attendance?.present_days || 0}
                </p>
                <p className="text-xs text-text-secondary">Present</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                <CalendarX className="h-5 w-5 text-error" />
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  {attendance?.absent_days || 0}
                </p>
                <p className="text-xs text-text-secondary">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {attendance?.late_days || 0}
                </p>
                <p className="text-xs text-text-secondary">Late</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-info">
                  {attendance?.attendance_percentage?.toFixed(0) || 0}%
                </p>
                <p className="text-xs text-text-secondary">Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Attendance Calendar"
            action={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {format(selectedMonth, "MMMM yyyy")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            }
          />
          <CardContent className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-text-secondary py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the month starts */}
              {Array.from({ length: startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Actual days */}
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const record = attendanceMap.get(dateStr);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const isTodayDate = isToday(day);

                return (
                  <div
                    key={dateStr}
                    className={`aspect-square p-1 rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                      isTodayDate
                        ? "ring-2 ring-primary"
                        : isWeekend
                        ? "bg-bg-secondary/50"
                        : record
                        ? record.status === "present"
                          ? "bg-success/10"
                          : record.status === "absent"
                          ? "bg-error/10"
                          : record.status === "late"
                          ? "bg-warning/10"
                          : "bg-info/10"
                        : "hover:bg-bg-secondary"
                    }`}
                    title={record ? `${record.status_display}${record.enter_time ? ` | In: ${record.enter_time}` : ""}${record.exit_time ? ` | Out: ${record.exit_time}` : ""}${record.remarks ? ` | ${record.remarks}` : ""}` : undefined}
                  >
                    <span
                      className={`font-medium ${
                        isTodayDate
                          ? "text-primary"
                          : isWeekend
                          ? "text-text-tertiary"
                          : "text-text-primary"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                    {record && !isWeekend && (
                      <div className="mt-0.5">
                        {record.status === "present" && (
                          <CalendarCheck className="h-3 w-3 text-success" />
                        )}
                        {record.status === "absent" && (
                          <CalendarX className="h-3 w-3 text-error" />
                        )}
                        {record.status === "late" && (
                          <Clock className="h-3 w-3 text-warning" />
                        )}
                        {record.status === "excused" && (
                          <AlertCircle className="h-3 w-3 text-info" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-text-secondary">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-error" />
                <span className="text-xs text-text-secondary">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-xs text-text-secondary">Late</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-info" />
                <span className="text-xs text-text-secondary">Excused</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card>
          <CardHeader title="Monthly Summary" />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {attendance?.monthly_summary?.map((month, index) => (
                <div
                  key={index}
                  className="p-4 hover:bg-bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-text-primary">
                      {month.month} {month.year}
                    </h4>
                    <Badge
                      variant={
                        month.percentage >= 90
                          ? "success"
                          : month.percentage >= 75
                          ? "warning"
                          : "error"
                      }
                    >
                      {month.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-text-secondary">
                    <span className="text-success">
                      {month.present_days} present
                    </span>
                    <span className="text-error">
                      {month.absent_days} absent
                    </span>
                    <span className="text-warning">
                      {month.late_days} late
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        month.percentage >= 90
                          ? "bg-success"
                          : month.percentage >= 75
                          ? "bg-warning"
                          : "bg-error"
                      }`}
                      style={{ width: `${month.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendance Records */}
      <Card>
        <CardHeader title="Recent Attendance Records" />
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-secondary/50">
                  <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                    <div className="flex items-center gap-1">
                      <LogIn className="h-3 w-3" />
                      Enter Time
                    </div>
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">
                    <div className="flex items-center gap-1">
                      <LogOut className="h-3 w-3" />
                      Exit Time
                    </div>
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendance?.records?.slice(0, 10).map((record) => (
                  <tr key={record.id} className="hover:bg-bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {format(new Date(record.date), "EEE, MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          record.status === "present"
                            ? "success"
                            : record.status === "absent"
                            ? "error"
                            : record.status === "late"
                            ? "warning"
                            : "info"
                        }
                      >
                        {record.status_display}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {record.enter_time ? (
                        <span className="flex items-center gap-1">
                          <LogIn className="h-3 w-3 text-success" />
                          {record.enter_time}
                        </span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-primary">
                      {record.exit_time ? (
                        <span className="flex items-center gap-1">
                          <LogOut className="h-3 w-3 text-error" />
                          {record.exit_time}
                        </span>
                      ) : (
                        <span className="text-text-tertiary">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {record.remarks || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert variant="info" title="Attendance Information">
        Attendance records are updated daily by the school. If you notice any discrepancies,
        please contact the school administration.
      </Alert>
    </div>
  );
}
