/**
 * OverviewTab Component
 * Displays a summary overview of the student for parents
 */

import {
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Spinner } from "@mis-components/ui";
import { useChildAttendance } from "../../hooks/useParents";
import { useStudentAssignments } from "@/mis/modules/assignment/hooks/useAssignments";
import { ATTENDANCE_STATUS_CONFIG } from "../../constants";
import type { ChildDetailResponse } from "../../types";
import { format, isPast, formatDistanceToNow } from "date-fns";

interface OverviewTabProps {
  studentId: number;
  student: ChildDetailResponse;
}

export default function OverviewTab({ studentId, student }: OverviewTabProps) {
  const { data: attendance, isLoading: attendanceLoading } = useChildAttendance(studentId);
  const { data: assignments, isLoading: assignmentsLoading } = useStudentAssignments(studentId);
  const isLoading = attendanceLoading || assignmentsLoading;

  // Get recent attendance (last 5)
  const recentAttendance = attendance?.records?.slice(0, 5) || [];

  // Get upcoming/pending assignments
  const pendingAssignments = assignments?.filter(
    (a) => a.submission_status === "pending" || a.submission_status === "submitted"
  ).slice(0, 5) || [];

  // Get recently graded assignments
  const recentGraded = assignments?.filter(
    (a) => a.submission_status === "graded"
  ).slice(0, 3) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" label="Loading overview..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center">
                <CalendarCheck className="h-7 w-7 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Attendance Rate</p>
                <p className="text-3xl font-bold text-success">
                  {attendance?.attendance_percentage?.toFixed(0) || 0}%
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {attendance?.present_days || 0} of {attendance?.total_days || 0} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-info/10 flex items-center justify-center">
                <TrendingUp className="h-7 w-7 text-info" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Average Score</p>
                <p className="text-3xl font-bold text-info">
                  {student.academic_summary?.average_percentage?.toFixed(0) || "N/A"}%
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  GPA: {student.academic_summary?.gpa?.toFixed(2) || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignments */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center">
                <ClipboardList className="h-7 w-7 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary">Pending Assignments</p>
                <p className="text-3xl font-bold text-warning">
                  {pendingAssignments.length}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {recentGraded.length} recently graded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <Card>
          <CardHeader title="Recent Attendance" />
          <CardContent className="p-0">
            {recentAttendance.length > 0 ? (
              <div className="divide-y divide-border">
                {recentAttendance.map((record) => {
                  const config = ATTENDANCE_STATUS_CONFIG[record.status];
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${
                          record.status === "present"
                            ? "bg-success/10"
                            : record.status === "absent"
                            ? "bg-error/10"
                            : "bg-warning/10"
                        } flex items-center justify-center`}>
                          {record.status === "present" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : record.status === "absent" ? (
                            <AlertCircle className="h-5 w-5 text-error" />
                          ) : (
                            <Clock className="h-5 w-5 text-warning" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {format(new Date(record.date), "EEEE, MMM d")}
                          </p>
                          {record.remarks && (
                            <p className="text-xs text-text-secondary">{record.remarks}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <Calendar className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary">No attendance records yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader title="Upcoming Assignments" />
          <CardContent className="p-0">
            {pendingAssignments.length > 0 ? (
              <div className="divide-y divide-border">
                {pendingAssignments.map((assignment) => {
                  const dueDate = new Date(assignment.due_date);
                  const isOverdue = isPast(dueDate);
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-4 p-4 hover:bg-bg-secondary/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isOverdue ? "bg-error/10" : "bg-primary/10"
                      }`}>
                        <ClipboardList className={`h-5 w-5 ${
                          isOverdue ? "text-error" : "text-primary"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-text-primary truncate">
                            {assignment.title}
                          </h4>
                          {isOverdue && (
                            <Badge variant="error" size="sm">Overdue</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {assignment.subject_name}
                          </span>
                          <span className={`flex items-center gap-1 ${
                            isOverdue ? "text-error font-medium" : ""
                          }`}>
                            <Calendar className="h-3.5 w-3.5" />
                            {isOverdue
                              ? `${formatDistanceToNow(dueDate)} overdue`
                              : `Due ${format(dueDate, "MMM d")}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-text-secondary">All caught up! No pending assignments</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      {recentGraded.length > 0 && (
        <Card>
          <CardHeader title="Recent Grades" />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentGraded.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-success">
                        {assignment.grade_letter || "A"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{assignment.title}</h4>
                      <p className="text-sm text-text-secondary">{assignment.subject_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">
                      {assignment.score}/{assignment.max_score}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {assignment.percentage?.toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
