/**
 * ClassAssignmentDetail Page
 * Shows assignments for a specific class with tabs
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Plus,
  GraduationCap,
  ClipboardList,
  BarChart3,
  Users,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  FileText,
  Send,
  Eye,
  Edit,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  Alert,
  DataTable,
  type Column,
} from '@mis-components/ui';
import {
  useClassAssignments,
  useClassAssignmentStats,
} from '../hooks/useAssignments';
import { useClassInstance } from '@/mis/modules/academic/hooks/useClassInstances';
import { ASSIGNMENT_STATUS } from '../constants';
import type { AssignmentListItem } from '../types';
import { format, isPast } from 'date-fns';

type TabId = 'overview' | 'assignments' | 'statistics';

export default function ClassAssignmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const classId = id ? parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<TabId>('assignments');

  // Data fetching
  const { data: classInstance, isLoading: isLoadingClass } = useClassInstance(classId);
  const { data: assignments, isLoading: isLoadingAssignments } = useClassAssignments(classId);
  const { data: stats, isLoading: isLoadingStats } = useClassAssignmentStats(classId);

  const isLoading = isLoadingClass || isLoadingAssignments;

  // Table columns
  const columns: Column<AssignmentListItem>[] = [
    {
      key: 'title',
      label: 'Assignment',
      header: 'Assignment',
      render: (row) => (
        <div className="min-w-[200px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">{row.subject_name}</span>
                <span className="text-gray-300">•</span>
                <Badge variant="secondary" className="text-xs">
                  {row.assignment_type_display}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      header: 'Due Date',
      render: (row) => {
        const dueDate = new Date(row.due_date);
        const isOverdue = isPast(dueDate) && row.status !== 'graded';
        return (
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
              {format(dueDate, 'MMM d, yyyy')}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => {
        const config = ASSIGNMENT_STATUS[row.status];
        return <Badge variant={config.variant}>{row.status_display}</Badge>;
      },
    },
    {
      key: 'progress',
      label: 'Progress',
      header: 'Progress',
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>{row.submitted_count}/{row.total_students}</span>
            <span className="font-medium">{Math.round(row.submission_rate)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              style={{ width: `${Math.min(row.submission_rate, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/assignments/${row.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/assignments/${row.id}/edit`);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'assignments' as const, label: 'Assignments', icon: ClipboardList, count: assignments?.length || 0 },
    { id: 'statistics' as const, label: 'Statistics', icon: TrendingUp },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading class..." />
      </div>
    );
  }

  if (!classInstance) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate('/mis/assignments/classes')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
        <Alert variant="error">Class not found</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-indigo-900/50 dark:to-purple-900/30 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(99,102,241,0.07)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/mis/assignments/classes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Classes</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    {classInstance.display_name}
                  </h1>
                  <Badge variant={classInstance.is_active ? 'success' : 'secondary'}>
                    {classInstance.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {classInstance.academic_year_display} • {classInstance.shift_display} Shift
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{classInstance.enrolled_count} Students</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <ClipboardList className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{assignments?.length || 0} Assignments</span>
                  </div>
                  {classInstance.class_teacher_name && (
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{classInstance.class_teacher_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button onClick={() => navigate(`/mis/assignments/new?class=${classId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          {/* Assignment Summary */}
          {stats && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 text-center">
                <p className="text-3xl font-bold text-indigo-600">{stats.total_assignments}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.published_assignments}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 text-center">
                <p className="text-3xl font-bold text-green-600">{stats.completed_assignments}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {stats.overall_average_score?.toFixed(0) || 0}%
                </p>
                <p className="text-sm text-gray-500">Avg Score</p>
              </div>
            </div>
          )}
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
          {/* Recent Assignments */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-indigo-600" />
                    Recent Assignments
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('assignments')}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {assignments && assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.slice(0, 5).map((assignment) => (
                      <div
                        key={assignment.id}
                        onClick={() => navigate(`/mis/assignments/${assignment.id}`)}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-gray-500">
                              {assignment.subject_name} • Due {format(new Date(assignment.due_date), 'MMM d')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={ASSIGNMENT_STATUS[assignment.status].variant}>
                            {assignment.status_display}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No assignments yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate(`/mis/assignments/new?class=${classId}`)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Assignment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                        <Send className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Published</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {stats?.published_assignments || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <span>Drafts</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                      {stats?.draft_assignments || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Graded</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {stats?.graded_assignments || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-gray-600" />
                All Assignments
              </h3>
              <Button
                size="sm"
                onClick={() => navigate(`/mis/assignments/new?class=${classId}`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>

            {isLoadingAssignments ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" label="Loading assignments..." />
              </div>
            ) : assignments && assignments.length > 0 ? (
              <DataTable
                columns={columns}
                data={assignments}
                onRowClick={(row) => navigate(`/mis/assignments/${row.id}`)}
                searchable
                getRowKey={(row) => String(row.id)}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium mb-2">No Assignments Yet</h4>
                <p className="text-gray-500 mb-4">Create your first assignment for this class</p>
                <Button onClick={() => navigate(`/mis/assignments/new?class=${classId}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'statistics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              {stats ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Overall Submission Rate</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-bold text-indigo-600">
                        {stats.overall_submission_rate?.toFixed(0) || 0}%
                      </p>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${stats.overall_submission_rate || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.overall_average_score?.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No statistics available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Assignment Status</h3>
              {stats ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-gray-400" />
                    <span className="flex-1">Draft</span>
                    <span className="font-bold">{stats.draft_assignments}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="flex-1">Published</span>
                    <span className="font-bold">{stats.published_assignments}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                    <span className="flex-1">Closed</span>
                    <span className="font-bold">{stats.closed_count}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="flex-1">Graded</span>
                    <span className="font-bold">{stats.graded_assignments}</span>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No statistics available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
