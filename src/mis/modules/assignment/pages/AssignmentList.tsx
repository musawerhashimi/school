/**
 * AssignmentList Page
 * Lists all assignments with filtering and search capabilities
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Send,
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
import { PageHeader } from '@mis-components/index';
import { useAssignments, useDeleteAssignment, usePublishAssignment } from '../hooks/useAssignments';
import { ASSIGNMENT_STATUS, ASSIGNMENT_TYPES } from '../constants';
import type { AssignmentListItem, AssignmentStatus, AssignmentType } from '../types';
import { format } from 'date-fns';

export default function AssignmentList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<AssignmentType | ''>('');
  const [page, setPage] = useState(1);

  // Data fetching
  const { data, isLoading, error } = useAssignments({
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    assignment_type: typeFilter || undefined,
    page,
    page_size: 20,
  });

  // Mutations
  const deleteAssignment = useDeleteAssignment();
  const publishAssignment = usePublishAssignment();

  // Stats calculations
  const stats = {
    total: data?.count || 0,
    published: data?.results?.filter((a) => a.status === 'published').length || 0,
    draft: data?.results?.filter((a) => a.status === 'draft').length || 0,
    graded: data?.results?.filter((a) => a.status === 'graded').length || 0,
  };

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
      key: 'class_instance_name',
      label: 'Class',
      header: 'Class',
      render: (row) => (
        <span className="text-sm font-medium">{row.class_instance_name}</span>
      ),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      header: 'Due Date',
      render: (row) => {
        const dueDate = new Date(row.due_date);
        const isOverdue = dueDate < new Date() && row.status !== 'graded';
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
        return (
          <Badge variant={config.variant}>
            {row.status_display}
          </Badge>
        );
      },
    },
    {
      key: 'submission_rate',
      label: 'Progress',
      header: 'Progress',
      render: (row) => (
        <div className="min-w-[120px]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-600">{row.submitted_count}/{row.total_students}</span>
            <span className="font-medium">{Math.round(row.submission_rate)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
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
          {row.status === 'draft' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                publishAssignment.mutate(row.id);
              }}
            >
              <Send className="h-4 w-4 text-indigo-600" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">Failed to load assignments</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Assignments"
          subtitle="Manage and track all assignments"
          icon={ClipboardList}
        />
        <Button onClick={() => navigate('/mis/assignments/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Send className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-blue-600">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Graded</p>
                <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | '')}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              {Object.entries(ASSIGNMENT_STATUS).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AssignmentType | '')}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Types</option>
              {Object.entries(ASSIGNMENT_TYPES).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" label="Loading assignments..." />
            </div>
          ) : data?.results && data.results.length > 0 ? (
            <DataTable
              columns={columns}
              data={data.results}
              onRowClick={(row) => navigate(`/mis/assignments/${row.id}`)}
              getRowKey={(row) => String(row.id)}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Assignments Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || statusFilter || typeFilter
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first assignment'}
              </p>
              <Button onClick={() => navigate('/mis/assignments/new')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.count > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, data.count)} of {data.count}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
