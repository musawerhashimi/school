import { Alert, Badge, Card, CardContent, CardHeader, Spinner } from "@mis-components/ui";
import { BookOpen, Calendar, Clock, User } from "lucide-react";
import type { StudentApiResponse } from "../../types";
import WeeklyScheduleTable from "@mis/modules/academic/components/WeeklyScheduleTable";
import { useWeeklySchedule } from "@academic/index";

interface ScheduleTabProps {
  student: StudentApiResponse;
}

export default function ScheduleTab({ student }: ScheduleTabProps) {
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
            This student is not currently assigned to a class. Schedule information will be available once the student is enrolled in a class.
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
            <span className="ml-3 text-text-secondary">Loading schedule...</span>
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
          <Alert variant="error" title="Error Loading Schedule">
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
    weeklySchedule.flatMap(day => day.periods.map(p => p.subject_name))
  ).size;
  const uniqueTeachers = new Set(
    weeklySchedule.flatMap(day => day.periods.map(p => p.teacher_name).filter(Boolean))
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
                {student.section && ` - Section ${student.section}`}
              </p>
            </div>
            <Badge variant="info" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {totalPeriods} classes per week
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Table - View Only */}
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
                <p className="text-2xl font-bold text-text-primary">
                  {uniqueSubjects}
                </p>
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
                <p className="text-2xl font-bold text-text-primary">
                  {totalPeriods}
                </p>
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
                <p className="text-2xl font-bold text-text-primary">
                  {uniqueTeachers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert variant="info" title="Schedule Information">
        This schedule is subject to change. Please check regularly for updates. Contact the administration office for any schedule-related queries.
      </Alert>
    </div>
  );
}
