/**
 * StudentCard Component
 * Displays a student summary card for the parent dashboard
 */

import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, Badge, Avatar } from "@mis-components/ui";
import { STUDENT_STATUS_CONFIG } from "../constants";
import type { ChildSummary } from "../types";

interface StudentCardProps {
  student: ChildSummary;
  onHover?: () => void;
}

export default function StudentCard({ student, onHover }: StudentCardProps) {
  const navigate = useNavigate();
  const statusConfig = STUDENT_STATUS_CONFIG[student.status];

  const handleClick = () => {
    navigate(`/mis/parents/children/${student.id}`);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-warning";
    return "text-error";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <Card
      variant="elevated"
      padding="none"
      className="group cursor-pointer overflow-hidden border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={handleClick}
      onMouseEnter={onHover}
    >
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex items-start gap-4">
          <div className="relative">
            <Avatar
              name={student.full_name}
              src={student.photo_url}
              size="lg"
              className="ring-4 ring-white dark:ring-gray-800 shadow-lg"
            />
            {/* Status indicator */}
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                student.status === "active" ? "bg-success" : "bg-warning"
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                  {student.full_name}
                </h3>
                <p className="text-sm text-text-secondary flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {student.class_name}
                  {student.section && ` - ${student.section}`}
                </p>
              </div>
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.label}
              </Badge>
            </div>
            <p className="text-xs text-text-tertiary mt-1">
              ID: {student.student_id}
              {student.roll_number && ` | Roll: ${student.roll_number}`}
            </p>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Attendance */}
          <div className="text-center p-3 rounded-xl bg-bg-secondary/50 group-hover:bg-success/5 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center mx-auto mb-2">
              <CalendarCheck className="h-4 w-4 text-success" />
            </div>
            <p
              className={`text-lg font-bold ${getAttendanceColor(student.attendance_percentage)}`}
            >
              {student.attendance_percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-text-secondary">Attendance</p>
          </div>

          {/* Average Score */}
          <div className="text-center p-3 rounded-xl bg-bg-secondary/50 group-hover:bg-info/5 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-4 w-4 text-info" />
            </div>
            <p className={`text-lg font-bold ${getScoreColor(student.average_score)}`}>
              {student.average_score.toFixed(0)}%
            </p>
            <p className="text-xs text-text-secondary">Avg Score</p>
          </div>

          {/* Pending Assignments */}
          <div className="text-center p-3 rounded-xl bg-bg-secondary/50 group-hover:bg-warning/5 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center mx-auto mb-2">
              <ClipboardList className="h-4 w-4 text-warning" />
            </div>
            <p
              className={`text-lg font-bold ${
                student.pending_assignments > 0 ? "text-warning" : "text-success"
              }`}
            >
              {student.pending_assignments}
            </p>
            <p className="text-xs text-text-secondary">Pending</p>
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {student.unpaid_fees > 0 ? (
                <span className="text-error">
                  ${student.unpaid_fees.toFixed(0)} unpaid fees
                </span>
              ) : (
                <span className="text-success">No pending fees</span>
              )}
            </span>
            <span className="text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
