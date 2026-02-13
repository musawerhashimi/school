/**
 * AssignmentDetail Page
 * Shows assignment details with tabs for overview, submissions, and statistics
 */

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  Modal,
  Spinner,
  type Column,
} from '@mis-components/ui';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Edit,
  Eye,
  FileText,
  Lock,
  Paperclip,
  Send,
  Trash2,
  TrendingUp,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ASSIGNMENT_STATUS, getGradeFromPercentage, SUBMISSION_STATUS } from '../constants';
import {
  useAssignment,
  useAssignmentSubmissions,
  useCloseAssignment,
  useDeleteAssignment,
  useGradeSubmission,
  usePublishAssignment,
} from '../hooks/useAssignments';
import type { AssignmentSubmissionApiResponse } from '../types';

type TabId = 'overview' | 'submissions' | 'statistics';

export default function AssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const assignmentId = id ? parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<AssignmentSubmissionApiResponse | null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Data fetching
  const { data: assignment, isLoading, error } = useAssignment(assignmentId);
  const { data: submissions, isLoading: isLoadingSubmissions } = useAssignmentSubmissions(assignmentId);

  // Mutations
  const publishAssignment = usePublishAssignment();
  const closeAssignment = useCloseAssignment();
  const deleteAssignment = useDeleteAssignment();
  const gradeSubmission = useGradeSubmission();

  const handleGradeSubmit = () => {
    if (!selectedSubmission || !gradeScore) return;
    gradeSubmission.mutate(
      {
        submissionId: selectedSubmission.id,
        data: {
          score: parseFloat(gradeScore),
          feedback: gradeFeedback || undefined,
        },
        assignmentId,
      },
      {
        onSuccess: () => {
          setGradeModalOpen(false);
          setSelectedSubmission(null);
          setGradeScore('');
          setGradeFeedback('');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteAssignment.mutate(assignmentId, {
      onSuccess: () => {
        navigate('/mis/assignments');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading assignment..." />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate('/mis/assignments')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assignments
        </Button>
        <Alert variant="error">Failed to load assignment details</Alert>
      </div>
    );
  }

  const statusConfig = ASSIGNMENT_STATUS[assignment.status];
  const isOverdue = isPast(new Date(assignment.due_date)) && assignment.status !== 'graded';

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'submissions' as const, label: 'Submissions', icon: Users, count: assignment.submitted_count },
    { id: 'statistics' as const, label: 'Statistics', icon: TrendingUp },
  ];

  // Submission columns
  const submissionColumns: Column<AssignmentSubmissionApiResponse>[] = [
    {
      key: 'student_name',
      label: 'Student',
      header: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.student_name} src={row.student_photo || undefined} size="sm" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.student_name}</p>
            <p className="text-xs text-gray-500">ID: {row.student_id_number}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => {
        const config = SUBMISSION_STATUS[row.status];
        return (
          <Badge variant={config.variant}>
            {row.is_late && row.status === 'submitted' && 'Late - '}
            {row.status_display}
          </Badge>
        );
      },
    },
    {
      key: 'submitted_at',
      label: 'Submitted',
      header: 'Submitted',
      render: (row) =>
        row.submitted_at ? (
          <div className="text-sm">
            <p>{format(new Date(row.submitted_at), 'MMM d, yyyy')}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(row.submitted_at), 'h:mm a')}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: 'score',
      label: 'Score',
      header: 'Score',
      render: (row) =>
        row.score !== null ? (
          <div className="text-center">
            <p className="text-lg font-bold">
              {row.score}/{row.max_score}
            </p>
            <Badge
              variant={row.is_pass ? 'success' : 'error'}
              className="text-xs"
            >
              {row.grade_letter || getGradeFromPercentage(row.percentage || 0)}
            </Badge>
          </div>
        ) : (
          <span className="text-gray-400">Not graded</span>
        ),
    },
    {
      key: 'actions',
      label: '',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(row);
              setViewDetailsModalOpen(true);
            }}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(row);
              setGradeScore(row.score?.toString() || '');
              setGradeFeedback(row.feedback || '');
              setGradeModalOpen(true);
            }}
          >
            {row.score !== null ? 'Edit Grade' : 'Grade'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-indigo-900/50 dark:to-purple-900/30 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(99,102,241,0.07)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/mis/assignments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Assignments</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {assignment.title}
                  </h1>
                  <Badge variant={statusConfig.variant}>{assignment.status_display}</Badge>
                  {isOverdue && (
                    <Badge variant="error">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {assignment.class_instance_name} • {assignment.subject_name}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Due: {format(new Date(assignment.due_date), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignment.max_score} Points</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignment.teacher_name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {assignment.status === 'draft' && (
                <Button
                  onClick={() => publishAssignment.mutate(assignmentId)}
                  loading={publishAssignment.isPending}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
              {assignment.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={() => closeAssignment.mutate(assignmentId)}
                  loading={closeAssignment.isPending}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Close
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(`/mis/assignments/${assignmentId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="ghost"
                className="text-red-600 hover:bg-red-50"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Submission Progress */}
          <div className="mt-6 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Submission Progress</span>
              <span className="text-sm font-semibold">
                {assignment.submitted_count}/{assignment.total_students} ({Math.round(assignment.submission_rate)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${Math.min(assignment.submission_rate, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{assignment.submitted_count} submitted</span>
              <span>{assignment.graded_count} graded</span>
              <span>{assignment.pending_count} pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {assignment.description || 'No description provided.'}
                </p>

                {assignment.instructions && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {assignment.instructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Recent Submissions
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('submissions')}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {isLoadingSubmissions ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={submission.student_name}
                            src={submission.student_photo || undefined}
                            size="sm"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {submission.student_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {submission.submitted_at
                                ? formatDistanceToNow(new Date(submission.submitted_at), {
                                    addSuffix: true,
                                  })
                                : 'Not submitted'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={SUBMISSION_STATUS[submission.status].variant}>
                            {submission.status_display}
                          </Badge>
                          {submission.score !== null && (
                            <span className="font-bold">
                              {submission.score}/{submission.max_score}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Total Students</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {assignment.total_students}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Submitted</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {assignment.submitted_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                        <Award className="h-5 w-5 text-purple-600" />
                      </div>
                      <span>Average Score</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {assignment.average_score !== null
                        ? `${assignment.average_score.toFixed(1)}`
                        : '—'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt className="text-gray-500 text-sm">Type</dt>
                    <dd className="font-medium">{assignment.assignment_type_display}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt className="text-gray-500 text-sm">Assigned</dt>
                    <dd className="font-medium">
                      {format(new Date(assignment.assigned_date), 'MMM d, yyyy')}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt className="text-gray-500 text-sm">Due</dt>
                    <dd className="font-medium">
                      {format(new Date(assignment.due_date), 'MMM d, yyyy')}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt className="text-gray-500 text-sm">Max Score</dt>
                    <dd className="font-medium">{assignment.max_score}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <dt className="text-gray-500 text-sm">Pass %</dt>
                    <dd className="font-medium">{assignment.pass_percentage}%</dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-gray-500 text-sm">Late Submission</dt>
                    <dd>
                      <Badge variant={assignment.allow_late_submission ? 'success' : 'secondary'}>
                        {assignment.allow_late_submission ? 'Allowed' : 'Not Allowed'}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'submissions' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              All Submissions
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                {submissions?.length || 0}
              </span>
            </h3>

            {isLoadingSubmissions ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" label="Loading submissions..." />
              </div>
            ) : submissions && submissions.length > 0 ? (
              <DataTable
                columns={submissionColumns}
                data={submissions}
                searchable
                getRowKey={(row) => String(row.id)}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Submissions Yet
                </h4>
                <p className="text-gray-500">Students haven't submitted their work yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <div className="space-y-3">
                {assignment.average_score !== null ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span>Highest Score</span>
                      <span className="text-xl font-bold text-green-600">
                        {assignment.highest_score}/{assignment.max_score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span>Average Score</span>
                      <span className="text-xl font-bold text-blue-600">
                        {assignment.average_score?.toFixed(1)}/{assignment.max_score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span>Lowest Score</span>
                      <span className="text-xl font-bold text-red-600">
                        {assignment.lowest_score}/{assignment.max_score}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No graded submissions yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Submission Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="flex-1">Graded</span>
                  <span className="font-bold">{assignment.graded_count}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="flex-1">Submitted</span>
                  <span className="font-bold">
                    {assignment.submitted_count - assignment.graded_count}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="flex-1">Pending</span>
                  <span className="font-bold">{assignment.pending_count}</span>
                </div>
                {assignment.late_count > 0 && (
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="flex-1">Late</span>
                    <span className="font-bold">{assignment.late_count}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grade Modal */}
      <Modal
        isOpen={gradeModalOpen}
        onClose={() => setGradeModalOpen(false)}
        title={`Grade Submission - ${selectedSubmission?.student_name}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Score (out of {assignment.max_score})
            </label>
            <input
              type="number"
              min="0"
              max={assignment.max_score}
              value={gradeScore}
              onChange={(e) => setGradeScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={`0 - ${assignment.max_score}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feedback (optional)
            </label>
            <textarea
              value={gradeFeedback}
              onChange={(e) => setGradeFeedback(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter feedback for the student..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGradeSubmit}
              loading={gradeSubmission.isPending}
              disabled={!gradeScore}
            >
              Save Grade
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Assignment"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{assignment.title}</strong>? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteAssignment.isPending}
            >
              Delete Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Submission Details Modal */}
      <Modal
        isOpen={viewDetailsModalOpen}
        onClose={() => {
          setViewDetailsModalOpen(false);
          setSelectedSubmission(null);
        }}
        title="Submission Details"
        size="lg"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            {/* Student Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Avatar
                name={selectedSubmission.student_name}
                src={selectedSubmission.student_photo || undefined}
                size="lg"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedSubmission.student_name}
                </h4>
                <p className="text-sm text-gray-500">ID: {selectedSubmission.student_id_number}</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <Badge variant={SUBMISSION_STATUS[selectedSubmission.status].variant}>
                  {selectedSubmission.is_late && selectedSubmission.status === 'submitted' && 'Late - '}
                  {selectedSubmission.status_display}
                </Badge>
                {selectedSubmission.score !== null && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedSubmission.score}/{assignment.max_score}
                    </p>
                    <Badge
                      variant={selectedSubmission.is_pass ? 'success' : 'error'}
                      className="text-xs"
                    >
                      {selectedSubmission.grade_letter || getGradeFromPercentage(selectedSubmission.percentage || 0)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted At</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedSubmission.submitted_at
                    ? format(new Date(selectedSubmission.submitted_at), 'MMM d, yyyy h:mm a')
                    : 'Not submitted'}
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Days Late</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedSubmission.days_late > 0 ? (
                    <span className="text-red-600">{selectedSubmission.days_late} day(s)</span>
                  ) : (
                    <span className="text-green-600">On time</span>
                  )}
                </p>
              </div>
            </div>

            {/* Submission Content */}
            <div>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Submission Content
              </h5>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[100px]">
                {selectedSubmission.content ? (
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedSubmission.content}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">No text content submitted</p>
                )}
              </div>
            </div>

            {/* Attachment */}
            {selectedSubmission.attachment && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attachment
                </h5>
                <a
                  href={selectedSubmission.attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  <Paperclip className="h-4 w-4" />
                  View Attachment
                </a>
              </div>
            )}

            {/* Feedback */}
            {selectedSubmission.feedback && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Teacher Feedback
                </h5>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedSubmission.feedback}
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="ghost" onClick={() => setViewDetailsModalOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewDetailsModalOpen(false);
                  setGradeScore(selectedSubmission.score?.toString() || '');
                  setGradeFeedback(selectedSubmission.feedback || '');
                  setGradeModalOpen(true);
                }}
              >
                {selectedSubmission.score !== null ? 'Edit Grade' : 'Grade Submission'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
