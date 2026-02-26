/**
 * TimetableTab Component
 * Displays the student's class schedule for parents
 */

import {
  Calendar,
  Clock,
  BookOpen,
  User,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Spinner, Alert } from "@mis-components/ui";
import WeeklyScheduleTable from "@/mis/modules/academic/components/WeeklyScheduleTable";
import { useWeeklySchedule } from "@academic/index";
import type { ChildDetailResponse } from "../../types";

interface TimetableTabProps {
  studentId: number;
  student: ChildDetailResponse;
}

export default function TimetableTab({ studentId, student }: TimetableTabProps) {
  // Fetch the weekly schedule for the student's class
  const {
    data: scheduleData,
    isLoading,
    error
  } = useWeeklySchedule(student.current_class || 0);

  // If student has no class assigned
  if (!student.current_class) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="info" title="No Class Assigned">
            Your child is not currently assigned to a class. Schedule information will be available once they are enrolled in a class.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
            <span className="ml-3 text-text-secondary">Loading timetable...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="error" title="Error Loading Timetable">
            Failed to load the class schedule. Please try again later.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Calculate schedule statistics
  const weeklySchedule = scheduleData?.weekly_schedule || [];
  const totalPeriods = weeklySchedule.reduce((sum, day) => sum + day.periods.length, 0);
  const uniqueSubjects = new Set(
    weeklySchedule.flatMap((day) => day.periods.map((p) => p.subject_name))
  ).size;
  const uniqueTeachers = new Set(
    weeklySchedule.flatMap((day) => day.periods.map((p) => p.teacher_name).filter(Boolean))
  ).size;

  return (
    <div className="space-y-6">
      {/* Schedule Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Schedule
              </h3>
              <p className="text-sm text-text-secondary">
                Class: {scheduleData?.class_name || student.class_name}
                {(scheduleData?.section || student.section) && ` - Section ${scheduleData?.section || student.section}`}
              </p>
            </div>
            <Badge variant="info" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {totalPeriods} classes per week
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Table */}
      <Card>
        <CardHeader title="Class Timetable" />
        <CardContent className="p-6">
          <WeeklyScheduleTable
            weeklySchedule={weeklySchedule}
            mode="view"
            showTeacher={true}
            showRoom={true}
            maxPeriods={6}
          />
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Subjects</p>
                <p className="text-2xl font-bold text-text-primary">{uniqueSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-3">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Classes per Week</p>
                <p className="text-2xl font-bold text-text-primary">{totalPeriods}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-3">
                <User className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total Teachers</p>
                <p className="text-2xl font-bold text-text-primary">{uniqueTeachers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader title="Today's Classes" />
        <CardContent className="p-0">
          {(() => {
            const jsDay = new Date().getDay();
            // Convert JavaScript day (0=Sunday) to Afghan week day (0=Saturday)
            // JS: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
            // Afghan: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5
            const afghanDay = jsDay === 0 ? 1 : jsDay === 6 ? 0 : jsDay + 1;
            const todaySchedule = weeklySchedule.find((d) => d.day_of_week === afghanDay);

            if (!todaySchedule || todaySchedule.periods.length === 0) {
              return (
                <div className="text-center py-8 px-4">
                  <Calendar className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-text-secondary">No classes scheduled for today</p>
                </div>
              );
            }

            return (
              <div className="divide-y divide-border">
                {todaySchedule.periods.map((period, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">{period.period_number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-primary">{period.subject_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-text-secondary mt-1">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {period.teacher_name}
                        </span>
                        {period.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {period.room}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {period.start_time} - {period.end_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert variant="info" title="Schedule Information">
        This schedule is subject to change. Please check regularly for updates. Contact the administration office for any schedule-related queries.
      </Alert>
    </div>
  );
}
