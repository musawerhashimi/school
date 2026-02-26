import { useState, useRef } from "react";
import { Button, Card, CardContent, CardHeader } from "@/mis/components/ui";
import { Badge, Spinner } from "@mis-components/ui";
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  TrendingUp,
  AlertCircle,
  Upload,
  X,
  Send,
  Paperclip,
  ArrowLeft,
  Calendar,
  BookOpen,
  Edit3,
  ExternalLink,
  Eye,
  Award,
  Timer,
} from "lucide-react";
import {
  useStudentAssignments,
  useStudentAssignmentStats,
  useSubmitAssignment,
} from "@/mis/modules/assignment/hooks/useAssignments";
import { SUBMISSION_STATUS } from "@/mis/modules/assignment/constants";
import type { StudentApiResponse } from "../../types";
import type { StudentAssignment } from "@/mis/modules/assignment/types";
import { format, isPast, formatDistanceToNow } from "date-fns";

interface AssignmentTabProps {
  student: StudentApiResponse;
}

function AssignmentTab({ student }: AssignmentTabProps) {
  // State
  const [selectedAssignment, setSelectedAssignment] = useState<StudentAssignment | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitContent, setSubmitContent] = useState("");
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data fetching
  const { data: assignments, isLoading: isLoadingAssignments } = useStudentAssignments(student.id);
  const { data: stats, isLoading: isLoadingStats } = useStudentAssignmentStats(student.id);
  const submitAssignment = useSubmitAssignment();

  const isLoading = isLoadingAssignments || isLoadingStats;

  // Stats calculations
  const totalAssignments = stats?.total_assignments || assignments?.length || 0;
  const gradedCount = stats?.graded_count || assignments?.filter((a) => a.submission_status === "graded").length || 0;
  const pendingCount = stats?.pending_count || assignments?.filter((a) => a.submission_status === "pending" || a.submission_status === "submitted").length || 0;
  const averageScore = stats?.average_percentage || (assignments?.filter((a) => a.percentage !== null).length
    ? assignments.filter((a) => a.percentage !== null).reduce((sum, a) => sum + (a.percentage || 0), 0) / assignments.filter((a) => a.percentage !== null).length
    : 0);

  // Handlers
  const handleViewDetails = (assignment: StudentAssignment) => {
    setSelectedAssignment(assignment);
    setIsEditing(false);
    setSubmitContent(assignment.submission_content || "");
    setSubmitFile(null);
  };

  const handleBackToList = () => {
    setSelectedAssignment(null);
    setIsEditing(false);
    setSubmitContent("");
    setSubmitFile(null);
  };

  const handleStartEdit = () => {
    if (selectedAssignment) {
      setIsEditing(true);
      setSubmitContent(selectedAssignment.submission_content || "");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setSubmitFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAssignment) return;
    if (!submitContent.trim() && !submitFile) {
      alert("Please provide content or attach a file");
      return;
    }

    try {
      await submitAssignment.mutateAsync({
        studentId: student.id,
        assignmentId: selectedAssignment.id,
        content: submitContent.trim() || undefined,
        attachment: submitFile || undefined,
      });
      setIsEditing(false);
      handleBackToList();
    } catch {
      // Error handled by mutation
    }
  };

  // Can edit if not graded and assignment is published
  const canEdit = (assignment: StudentAssignment) => {
    return assignment.submission_status !== "graded" && assignment.status === "published";
  };

  // Check if assignment is accepting submissions
  const isAcceptingSubmissions = (assignment: StudentAssignment) => {
    return assignment.status === "published";
  };

  const isLateSubmission = (assignment: StudentAssignment) => {
    return isPast(new Date(assignment.due_date)) &&
           (assignment.submission_status === "pending" || assignment.submission_status === "returned");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" label="Loading assignments..." />
      </div>
    );
  }

  // ==================== DETAIL VIEW ====================
  if (selectedAssignment) {
    const dueDate = new Date(selectedAssignment.due_date);
    const isOverdue = isPast(dueDate);
    const statusConfig = SUBMISSION_STATUS[selectedAssignment.submission_status];
    const hasSubmission = selectedAssignment.submission_status !== "pending";
    const allowEdit = canEdit(selectedAssignment);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </button>
          {allowEdit && !isEditing && isAcceptingSubmissions(selectedAssignment) && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="h-4 w-4" />}
              onClick={handleStartEdit}
            >
              {hasSubmission ? "Edit Submission" : "Submit Assignment"}
            </Button>
          )}
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
                        {selectedAssignment.is_late && (
                          <Badge variant="error">Late</Badge>
                        )}
                      </div>
                      <p className="text-text-secondary">
                        {selectedAssignment.subject_name} • {selectedAssignment.assignment_type_display}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Due Date Banner */}
                <div className={`px-6 py-4 flex items-center gap-4 ${
                  isOverdue
                    ? "bg-red-50 dark:bg-red-950/30"
                    : "bg-blue-50 dark:bg-blue-950/30"
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isOverdue ? "bg-red-100 dark:bg-red-900/50" : "bg-blue-100 dark:bg-blue-900/50"
                  }`}>
                    <Timer className={`h-5 w-5 ${isOverdue ? "text-red-600" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${isOverdue ? "text-red-700 dark:text-red-400" : "text-blue-700 dark:text-blue-400"}`}>
                      {isOverdue ? "Overdue" : "Due"}: {format(dueDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className={`text-sm ${isOverdue ? "text-red-600 dark:text-red-300" : "text-blue-600 dark:text-blue-300"}`}>
                      {isOverdue ? `${formatDistanceToNow(dueDate)} overdue` : `${formatDistanceToNow(dueDate)} remaining`}
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
                    <p className="font-medium text-text-primary">{selectedAssignment.assignment_type_display}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Assigned</p>
                    <p className="font-medium text-text-primary">{format(new Date(selectedAssignment.assigned_date), "MMM d, yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Max Score</p>
                    <p className="font-medium text-text-primary">{selectedAssignment.max_score} pts</p>
                  </div>
                </div>

                {/* Description */}
                {selectedAssignment.description && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-3">Instructions</h3>
                    <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                      {selectedAssignment.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submission Card */}
            <Card>
              <CardHeader title="Your Submission" />
              <CardContent className="p-6 pt-0">
                {isEditing ? (
                  // Edit Form
                  <div className="space-y-5">
                    {isLateSubmission(selectedAssignment) && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl">
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-700 dark:text-red-400">Late Submission</p>
                          <p className="text-sm text-red-600 dark:text-red-300">Your submission will be marked as late.</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Your Response <span className="text-text-secondary font-normal">(required)</span>
                      </label>
                      <textarea
                        value={submitContent}
                        onChange={(e) => setSubmitContent(e.target.value)}
                        placeholder="Type your answer or response here..."
                        rows={8}
                        className="w-full px-4 py-3 border border-border rounded-xl bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Attachment <span className="text-text-secondary font-normal">(optional)</span>
                      </label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                      {submitFile ? (
                        <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Paperclip className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{submitFile.name}</p>
                              <p className="text-xs text-text-secondary">{(submitFile.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSubmitFile(null)}
                            className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full p-6 border-2 border-dashed border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-bg-secondary group-hover:bg-primary/10 rounded-full flex items-center justify-center transition-colors">
                              <Upload className="h-6 w-6 text-text-secondary group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm font-medium text-text-primary">Click to upload</p>
                            <p className="text-xs text-text-secondary">PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)</p>
                          </div>
                        </button>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        leftIcon={<Send className="h-4 w-4" />}
                        onClick={handleSubmit}
                        disabled={submitAssignment.isPending || !submitContent.trim()}
                        loading={submitAssignment.isPending}
                      >
                        {hasSubmission ? "Update Submission" : "Submit Assignment"}
                      </Button>
                    </div>
                  </div>
                ) : !isAcceptingSubmissions(selectedAssignment) ? (
                  // Not accepting submissions
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">Submissions Closed</h4>
                    <p className="text-text-secondary">This assignment is not accepting submissions.</p>
                  </div>
                ) : hasSubmission ? (
                  // View Submission
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
                      {selectedAssignment.is_late && (
                        <Badge variant="error">Late</Badge>
                      )}
                    </div>

                    {selectedAssignment.submission_content && (
                      <div>
                        <h4 className="text-sm font-medium text-text-secondary mb-2">Your Response</h4>
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

                    {!selectedAssignment.submission_content && !selectedAssignment.submission_attachment && (
                      <p className="text-text-secondary italic py-4">Submission content not available.</p>
                    )}

                    {allowEdit && isAcceptingSubmissions(selectedAssignment) && (
                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          leftIcon={<Edit3 className="h-4 w-4" />}
                          onClick={handleStartEdit}
                        >
                          Edit Submission
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  // No submission
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-warning" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">No Submission Yet</h4>
                    <p className="text-text-secondary mb-6">You haven't submitted anything for this assignment.</p>
                    {isAcceptingSubmissions(selectedAssignment) && (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          leftIcon={<Send className="h-4 w-4" />}
                          onClick={handleStartEdit}
                        >
                          Submit Assignment
                        </Button>
                      </>
                    )}
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
                    <h3 className="font-semibold">Your Score</h3>
                  </div>
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-lg mb-3">
                      <span className="text-3xl font-bold text-success">{selectedAssignment.grade_letter}</span>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">
                      {selectedAssignment.score}<span className="text-lg text-text-secondary">/{selectedAssignment.max_score}</span>
                    </p>
                    <p className="text-text-secondary">{selectedAssignment.percentage?.toFixed(1)}%</p>
                  </div>
                </div>
                {selectedAssignment.feedback && (
                  <CardContent className="p-4 border-t border-border">
                    <h4 className="text-sm font-medium text-text-secondary mb-2">Teacher Feedback</h4>
                    <p className="text-sm text-text-primary leading-relaxed">{selectedAssignment.feedback}</p>
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
                      <p className="text-sm font-medium text-text-primary">{selectedAssignment.subject_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Type</p>
                      <p className="text-sm font-medium text-text-primary">{selectedAssignment.assignment_type_display}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Max Score</p>
                      <p className="text-sm font-medium text-text-primary">{selectedAssignment.max_score} points</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-secondary rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary">Pass Rate</p>
                      <p className="text-sm font-medium text-text-primary">{selectedAssignment.pass_percentage}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returned Card */}
            {selectedAssignment.submission_status === "returned" && (
              <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-3">
                    <Edit3 className="h-5 w-5" />
                    <h3 className="font-semibold">Returned for Revision</h3>
                  </div>
                  {selectedAssignment.feedback && (
                    <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                      {selectedAssignment.feedback}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==================== LIST VIEW ====================
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
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          assignment.submission_status === "graded"
                            ? "bg-success/10"
                            : isOverdue
                              ? "bg-red-100 dark:bg-red-900/30"
                              : "bg-primary/10"
                        }`}>
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
                            <h4 className="font-semibold text-text-primary">
                              {assignment.title}
                            </h4>
                            <Badge variant={statusConfig.variant}>
                              {assignment.submission_status_display}
                            </Badge>
                            {isOverdue && (
                              <Badge variant="error">Overdue</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-text-secondary flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <BookOpen className="h-3.5 w-3.5" />
                              {assignment.subject_name}
                            </span>
                            <span className="hidden sm:inline text-text-tertiary">•</span>
                            <span className={`flex items-center gap-1.5 ${isOverdue ? "text-red-500 font-medium" : ""}`}>
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
                        onClick={() => handleViewDetails(assignment)}
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
              <p className="text-text-secondary">This student doesn't have any assignments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AssignmentTab;
