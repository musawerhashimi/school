/**
 * AssignmentsTab Component
 * Displays assignments for parents (view-only mode)
 */

import { useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Calendar,
  Award,
  Eye,
  ArrowLeft,
  Timer,
  FileText,
  Paperclip,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Button, Spinner } from "@mis-components/ui";
import {
  useStudentAssignments,
  useStudentAssignmentStats,
} from "@/mis/modules/assignment/hooks/useAssignments";
import { SUBMISSION_STATUS } from "@/mis/modules/assignment/constants";
import { format, isPast, formatDistanceToNow } from "date-fns";
import type { StudentAssignment } from "@/mis/modules/assignment/types";

interface AssignmentsTabProps {
  studentId: number;
}

export default function AssignmentsTab({ studentId }: AssignmentsTabProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);

  // Fetch assignments using the same hooks as student module
  const { data: assignments, isLoading: isLoadingAssignments } = useStudentAssignments(studentId);
  const { data: stats, isLoading: isLoadingStats } = useStudentAssignmentStats(studentId);

  const isLoading = isLoadingAssignments || isLoadingStats;

  // Stats calculations - use stats from API if available, otherwise calculate from assignments
  const totalAssignments = stats?.total_assignments || assignments?.length || 0;
  const gradedCount = stats?.graded_count || assignments?.filter((a) => a.submission_status === "graded").length || 0;
  const pendingCount = stats?.pending_count || assignments?.filter((a) => a.submission_status === "pending" || a.submission_status === "submitted").length || 0;
  const averageScore = stats?.average_percentage || (assignments?.filter((a) => a.percentage !== null).length
    ? assignments.filter((a) => a.percentage !== null).reduce((sum, a) => sum + (a.percentage || 0), 0) /
      assignments.filter((a) => a.percentage !== null).length
    : 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" label="Loading assignments..." />
      </div>
    );
  }

  // Detail View
  if (selectedAssignment) {
    const dueDate = new Date(selectedAssignment.due_date);
    const isOverdue = isPast(dueDate);
    const statusConfig = SUBMISSION_STATUS[selectedAssignment.submission_status];
    const hasSubmission = selectedAssignment.submission_status !== "pending";

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedAssignment(null)}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-2 space-y-6">
            {/* Assignment Info Card */}
            <Card>
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h1 className="text-xl font-bold text-text-primary">
                          {selectedAssignment.title}
                        </h1>
                        <Badge variant={statusConfig.variant}>
                          {selectedAssignment.submission_status_display}
                        </Badge>
                        {selectedAssignment.is_late && <Badge variant="error">Late</Badge>}
                      </div>
                      <p className="text-text-secondary">
                        {selectedAssignment.subject_name} • {selectedAssignment.assignment_type_display}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Due Date Banner */}
                <div
                  className={`px-6 py-4 flex items-center gap-4 ${
                    isOverdue ? "bg-red-50 dark:bg-red-950/30" : "bg-blue-50 dark:bg-blue-950/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isOverdue ? "bg-red-100 dark:bg-red-900/50" : "bg-blue-100 dark:bg-blue-900/50"
                    }`}
                  >
                    <Timer className={`h-5 w-5 ${isOverdue ? "text-red-600" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                        isOverdue
                          ? "text-red-700 dark:text-red-400"
                          : "text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Due"}: {format(dueDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p
                      className={`text-sm ${
                        isOverdue
                          ? "text-red-600 dark:text-red-300"
                          : "text-blue-600 dark:text-blue-300"
                      }`}
                    >
                      {isOverdue
                        ? `${formatDistanceToNow(dueDate)} overdue`
                        : `${formatDistanceToNow(dueDate)} remaining`}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-border">
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Subject</p>
                    <p className="font-medium text-text-primary">{selectedAssignment.subject_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Type</p>
                    <p className="font-medium text-text-primary">
                      {selectedAssignment.assignment_type_display}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Assigned</p>
                    <p className="font-medium text-text-primary">
                      {format(new Date(selectedAssignment.assigned_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Max Score</p>
                    <p className="font-medium text-text-primary">{selectedAssignment.max_score} pts</p>
                  </div>
                </div>

                {/* Description */}
                {selectedAssignment.description && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">
                      Instructions
                    </h3>
                    <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submission Card (View Only) */}
            <Card>
              <CardHeader title="Submission" />
              <CardContent className="p-6 pt-0">
                {hasSubmission ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-text-secondary" />
                        <span className="text-text-secondary">Submitted:</span>
                        <span className="text-text-primary font-medium">
                          {selectedAssignment.submitted_at
                            ? format(new Date(selectedAssignment.submitted_at), "MMM d, yyyy 'at' h:mm a")
                            : "Unknown"}
                        </span>
                      </div>
                      {selectedAssignment.is_late && <Badge variant="error">Late</Badge>}
                    </div>

                    {selectedAssignment.submission_content && (
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Response</h4>
                        <div className="p-4 bg-bg-secondary rounded-xl border border-border">
                          <p className="text-text-primary whitespace-pre-wrap leading-relaxed">
                            {selectedAssignment.submission_content}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAssignment.submission_attachment && (
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Attachment</h4>
                        <a
                          href={selectedAssignment.submission_attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-4 py-3 bg-bg-secondary hover:bg-bg-tertiary rounded-xl border border-border transition-colors group"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Paperclip className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-text-primary font-medium">View Attachment</span>
                          <ExternalLink className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors" />
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-warning" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      No Submission Yet
                    </h4>
                    <p className="text-text-secondary">
                      Your child hasn't submitted this assignment yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Score Card */}
            {selectedAssignment.submission_status === "graded" && selectedAssignment.score !== null && (
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-success/20 to-success/5 p-6">
                  <div className="flex items-center gap-2 text-success mb-4">
                    <Award className="h-5 w-5" />
                    <h3 className="font-semibold">Score</h3>
                  </div>
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-lg mb-3">
                      <span className="text-3xl font-bold text-success">
                        {selectedAssignment.grade_letter}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">
                      {selectedAssignment.score}
                      <span className="text-lg text-text-secondary">/{selectedAssignment.max_score}</span>
                    </p>
                    <p className="text-text-secondary">{selectedAssignment.percentage?.toFixed(1)}%</p>
                  </div>
                </div>
                {selectedAssignment.feedback && (
                  <CardContent className="p-4 border-t border-border">
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Teacher Feedback</h4>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {selectedAssignment.feedback}
                    </p>
                  </CardContent>
                )}
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-text-primary mb-4">Quick Info</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Subject</p>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedAssignment.subject_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Type</p>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedAssignment.assignment_type_display}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Max Score</p>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedAssignment.max_score} points
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Pass Rate</p>
                      <p className="text-sm font-medium text-text-primary">
                        {selectedAssignment.pass_percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Total</p>
                <p className="text-2xl font-bold text-text-primary">{totalAssignments}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-primary/50 to-primary/10" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success/20 to-success/5 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Graded</p>
                <p className="text-2xl font-bold text-success">{gradedCount}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-success/50 to-success/10" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-warning/50 to-warning/10" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-info/20 to-info/5 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Avg Score</p>
                <p className="text-2xl font-bold text-info">{averageScore.toFixed(0)}%</p>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-info/50 to-info/10" />
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader title="All Assignments" />
        <CardContent className="p-0">
          {assignments && assignments.length > 0 ? (
            <div className="divide-y divide-border">
              {assignments.map((assignment) => {
                const dueDate = new Date(assignment.due_date);
                const isOverdue = isPast(dueDate) && assignment.submission_status === "pending";
                const statusConfig = SUBMISSION_STATUS[assignment.submission_status];

                return (
                  <div
                    key={assignment.id}
                    className="p-5 hover:bg-bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Icon */}
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            assignment.submission_status === "graded"
                              ? "bg-success/10"
                              : isOverdue
                              ? "bg-red-100 dark:bg-red-900/30"
                              : "bg-primary/10"
                          }`}
                        >
                          {assignment.submission_status === "graded" ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : isOverdue ? (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <ClipboardList className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h4 className="font-semibold text-text-primary">{assignment.title}</h4>
                            <Badge variant={statusConfig.variant}>
                              {assignment.submission_status_display}
                            </Badge>
                            {isOverdue && <Badge variant="error">Overdue</Badge>}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5" />
                              {assignment.subject_name}
                            </span>
                            <span className="hidden sm:inline text-text-tertiary">•</span>
                            <span
                              className={`flex items-center gap-1.5 ${
                                isOverdue ? "text-red-500 font-medium" : ""
                              }`}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              Due {format(dueDate, "MMM d, yyyy")}
                            </span>
                            {assignment.submission_status === "graded" && assignment.score !== null && (
                              <>
                                <span className="hidden sm:inline text-text-tertiary">•</span>
                                <span className="flex items-center gap-1.5 text-success font-semibold">
                                  <Award className="h-3.5 w-3.5" />
                                  {assignment.score}/{assignment.max_score}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAssignment(assignment)}
                        className="shrink-0"
                      >
                        <Eye className="h-4 w-4 sm:mr-1.5" />
                        <span className="hidden sm:inline">View Details</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-text-secondary" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">No Assignments Yet</h4>
              <p className="text-text-secondary">Your child doesn't have any assignments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
