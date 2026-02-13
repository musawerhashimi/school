/**
 * TeacherClassDetail Page
 * Class detail view from teacher perspective with tabs
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  ClipboardList,
  BarChart3,
  BookOpen,
  MapPin,
  User,
  ChevronRight,
  Plus,
  FileText,
  Eye,
  Edit,
  X,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  Alert,
  Avatar,
  DataTable,
  type Column,
} from '@mis-components/ui';
import {
  useClassInstance,
  useClassInstanceStudents,
} from '@/mis/modules/academic/hooks/useClassInstances';
import { useClassAssignments, useCreateAssignment } from '@/mis/modules/assignment/hooks/useAssignments';
import { ASSIGNMENT_STATUS, ASSIGNMENT_TYPES } from '@/mis/modules/assignment/constants';
import type { AssignmentListItem, AssignmentType } from '@/mis/modules/assignment/types';
import type { ClassInstanceStudent } from '@/mis/modules/academic/types';
import { format, isPast } from 'date-fns';
import { useUserStore } from '@auth/index';

type TabId = 'overview' | 'students' | 'assignments';

// Form validation schema
const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  assignment_type: z.string().min(1, 'Type is required'),
  assigned_date: z.string().min(1, 'Assigned date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  max_score: z.coerce.number().min(1, 'Max score must be at least 1').max(1000),
  pass_percentage: z.coerce.number().min(0).max(100).optional(),
  allow_late_submission: z.boolean().optional(),
  late_penalty_percentage: z.coerce.number().min(0).max(100).optional(),
});

type CreateAssignmentFormData = z.infer<typeof createAssignmentSchema>;

export default function TeacherClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const classId = id ? parseInt(id, 10) : 0;
  const { userProfile } = useUserStore();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Data fetching
  const { data: classInstance, isLoading: isLoadingClass } = useClassInstance(classId);
  const { data: studentsData, isLoading: isLoadingStudents } = useClassInstanceStudents(classId);
  const { data: assignments, isLoading: isLoadingAssignments } = useClassAssignments(classId);

  // Mutations
  const createAssignment = useCreateAssignment();

  // Form
  const form = useForm<CreateAssignmentFormData>({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      assignment_type: 'homework',
      assigned_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: '',
      max_score: 100,
      pass_percentage: 50,
      allow_late_submission: true,
      late_penalty_percentage: 10,
    },
  });

  const isLoading = isLoadingClass;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'students' as const, label: 'Students', icon: Users, count: classInstance?.enrolled_count || 0 },
    { id: 'assignments' as const, label: 'Assignments', icon: ClipboardList, count: assignments?.length || 0 },
  ];

  // Handle form submission
  const onSubmit = async (data: CreateAssignmentFormData) => {
    if (!classInstance) return;
    console.log("PASSES Class Instance Check");
    // Get teacher ID from user's teacher profile
    const teacherId = (userProfile?.teacherProfile?.id || 1); // TODO - remove default id
    if (!teacherId) {
      return;
    }
    console.log("PASSES Teacher ID Check");
    
    // Get subject from class (use first subject for now - could be improved with subject selector)
    const subjectId = classInstance.subjects?.[0]?.id;
    if (!subjectId) {
      return;
    }
    console.log("PASSES Subject ID Check");
    
    await createAssignment.mutateAsync({
      ...data,
      assignment_type: data.assignment_type as AssignmentType,
      class_instance: classId,
      subject: subjectId,
      teacher: teacherId,
      status: 'draft',
    });

    setShowCreateModal(false);
    form.reset();
  };

  // Student columns
  const studentColumns: Column<ClassInstanceStudent>[] = [
    {
      key: 'student_id',
      label: 'ID',
      header: 'ID',
      render: (row) => (
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {row.student_id}
        </span>
      ),
    },
    {
      key: 'full_name',
      label: 'Student',
      header: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} src={row.photo_url} size="sm" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.full_name}</p>
            <p className="text-xs text-gray-500">Roll #{row.roll_number || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'gender',
      label: 'Gender',
      header: 'Gender',
      render: (row) => (
        <Badge variant={row.gender === 'male' ? 'info' : 'secondary'} className="capitalize">
          {row.gender}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      header: '',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/mis/students/${row.id}`);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Assignment columns
  const assignmentColumns: Column<AssignmentListItem>[] = [
    {
      key: 'title',
      label: 'Assignment',
      header: 'Assignment',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.subject_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'due_date',
      label: 'Due Date',
      header: 'Due Date',
      render: (row) => {
        const isOverdue = isPast(new Date(row.due_date)) && row.status !== 'graded';
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {format(new Date(row.due_date), 'MMM d, yyyy')}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => (
        <Badge variant={ASSIGNMENT_STATUS[row.status].variant}>
          {row.status_display}
        </Badge>
      ),
    },
    {
      key: 'progress',
      label: 'Progress',
      header: 'Progress',
      render: (row) => (
        <div className="min-w-[100px]">
          <div className="text-xs mb-1">{row.submitted_count}/{row.total_students}</div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-indigo-500"
              style={{ width: `${row.submission_rate}%` }}
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
        <div className="flex gap-1">
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
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="error">Class not found</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-indigo-900/50 dark:to-purple-900/30 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(99,102,241,0.07)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/mis/teachers/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                    <span className="text-sm">
                      <span className="font-semibold">{classInstance.enrolled_count}</span>
                      <span className="text-gray-500">/{classInstance.capacity}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{classInstance.room_number || 'No Room'}</span>
                  </div>

                  {classInstance.class_teacher_name && (
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{classInstance.class_teacher_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Create Assignment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Class & Subject Info (read-only) */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Creating assignment for</p>
                <p className="font-medium">{classInstance?.display_name}</p>
                {classInstance?.subjects?.[0] && (
                  <p className="text-sm text-gray-500">Subject: {classInstance.subjects[0].name}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('title')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Chapter 5 Homework"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...form.register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instructions for students..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...form.register('assignment_type')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(ASSIGNMENT_TYPES).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assigned Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...form.register('assigned_date')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...form.register('due_date')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {form.formState.errors.due_date && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.due_date.message}</p>
                  )}
                </div>
              </div>

              {/* Scoring */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Score</label>
                  <input
                    type="number"
                    {...form.register('max_score')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pass %</label>
                  <input
                    type="number"
                    {...form.register('pass_percentage')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Late Submission */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...form.register('allow_late_submission')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Allow late submission</span>
                </label>
                {form.watch('allow_late_submission') && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Penalty:</span>
                    <input
                      type="number"
                      {...form.register('late_penalty_percentage')}
                      className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAssignment.isPending}
                >
                  {createAssignment.isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Assignment'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
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
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Assignments */}
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

                {isLoadingAssignments ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : assignments && assignments.length > 0 ? (
                  <div className="space-y-3">
                    {assignments.slice(0, 5).map((assignment) => (
                      <div
                        key={assignment.id}
                        onClick={() => navigate(`/mis/assignments/${assignment.id}`)}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-gray-500">
                              Due {format(new Date(assignment.due_date), 'MMM d')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={ASSIGNMENT_STATUS[assignment.status].variant}>
                          {assignment.status_display}
                        </Badge>
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
                      onClick={() => setShowCreateModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Students */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Students
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('students')}>
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {isLoadingStudents ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : studentsData && studentsData.students.length > 0 ? (
                  <div className="space-y-3">
                    {studentsData.students.slice(0, 5).map((student) => (
                      <div
                        key={student.id}
                        onClick={() => navigate(`/mis/students/${student.id}`)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
                      >
                        <Avatar name={student.full_name} src={student.photo_url} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{student.full_name}</p>
                          <p className="text-sm text-gray-500">Roll #{student.roll_number || 'N/A'}</p>
                        </div>
                        <Badge variant={student.status === 'active' ? 'success' : 'warning'}>
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No students enrolled</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Students</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {classInstance.enrolled_count}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <span>Subjects</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {classInstance.subjects?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span>Assignments</span>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {assignments?.length || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              Enrolled Students
            </h3>

            {isLoadingStudents ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" label="Loading students..." />
              </div>
            ) : studentsData && studentsData.students.length > 0 ? (
              <DataTable
                columns={studentColumns}
                data={studentsData.students}
                searchable
                onRowClick={(row) => navigate(`/mis/students/${row.id}`)}
                getRowKey={(row) => String(row.id)}
              />
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">No students enrolled in this class</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'assignments' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-gray-600" />
                All Assignments
              </h3>
              <Button size="sm" onClick={() => setShowCreateModal(true)}>
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
                columns={assignmentColumns}
                data={assignments}
                searchable
                onRowClick={(row) => navigate(`/mis/assignments/${row.id}`)}
                getRowKey={(row) => String(row.id)}
              />
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <h4 className="text-lg font-medium mb-2">No Assignments Yet</h4>
                <p className="text-gray-500 mb-4">Create your first assignment for this class</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
