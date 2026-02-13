/**
 * AssignmentFormPage
 * Create and edit assignments
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ClipboardList,
  Save,
  Calendar,
  Award,
  AlertCircle,
  Lock,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Spinner,
  Alert,
  Badge,
} from '@mis-components/ui';
import { PageHeader } from '@mis-components/index';
import {
  useAssignment,
  useCreateAssignment,
  useUpdateAssignment,
} from '../hooks/useAssignments';
import { useClassInstances } from '@/mis/modules/academic/hooks/useClassInstances';
import { useSubjects } from '@/mis/modules/academic/hooks/useSubjects';
import { useUserStore } from '@/mis/modules/auth/stores/useUserStore';
import {
  ASSIGNMENT_TYPE_OPTIONS,
  ASSIGNMENT_STATUS_OPTIONS,
  DEFAULT_PASS_PERCENTAGE,
  DEFAULT_MAX_SCORE,
  DEFAULT_LATE_PENALTY_PERCENTAGE,
} from '../constants';
import type { CreateAssignmentInput, AssignmentType, AssignmentStatus } from '../types';
import { format } from 'date-fns';

// Validation schema
const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  assignment_type: z.enum(['homework', 'project', 'essay', 'lab_report', 'quiz', 'presentation', 'other']),
  class_instance: z.number().min(1, 'Class is required'),
  subject: z.number().min(1, 'Subject is required'),
  assigned_date: z.string().min(1, 'Assigned date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  max_score: z.number().min(1, 'Max score must be at least 1').max(1000, 'Max score too high'),
  pass_percentage: z.number().min(0).max(100).optional(),
  weight_percentage: z.number().min(0).max(100).optional(),
  status: z.enum(['draft', 'published', 'closed', 'graded']).optional(),
  allow_late_submission: z.boolean().optional(),
  late_penalty_percentage: z.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof assignmentSchema>;

export default function AssignmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const assignmentId = id ? parseInt(id, 10) : 0;
  const { userProfile } = useUserStore();

  // State for selected class (to filter subjects)
  const [selectedClassId, setSelectedClassId] = useState<number>(0);

  // Fetch existing assignment for edit mode
  const { data: existingAssignment, isLoading: isLoadingAssignment } = useAssignment(
    assignmentId,
    { enabled: isEdit }
  );

  // Fetch classes and subjects
  const { data: classesData, isLoading: isLoadingClasses } = useClassInstances({
    is_active: true,
    page_size: 100,
  });

  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({
    is_active: true,
    page_size: 100,
  });

  const classes = classesData?.results || [];
  const subjects = subjectsData?.results || [];

  // Mutations
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      assignment_type: 'homework',
      class_instance: 0,
      subject: 0,
      assigned_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: '',
      max_score: DEFAULT_MAX_SCORE,
      pass_percentage: DEFAULT_PASS_PERCENTAGE,
      weight_percentage: 100,
      status: 'draft',
      allow_late_submission: true,
      late_penalty_percentage: DEFAULT_LATE_PENALTY_PERCENTAGE,
    },
  });

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (existingAssignment) {
      reset({
        title: existingAssignment.title,
        description: existingAssignment.description || '',
        instructions: existingAssignment.instructions || '',
        assignment_type: existingAssignment.assignment_type,
        class_instance: existingAssignment.class_instance,
        subject: existingAssignment.subject,
        assigned_date: existingAssignment.assigned_date,
        due_date: existingAssignment.due_date,
        max_score: existingAssignment.max_score,
        pass_percentage: existingAssignment.pass_percentage,
        weight_percentage: existingAssignment.weight_percentage,
        status: existingAssignment.status,
        allow_late_submission: existingAssignment.allow_late_submission,
        late_penalty_percentage: existingAssignment.late_penalty_percentage,
      });
      setSelectedClassId(existingAssignment.class_instance);
    }
  }, [existingAssignment, reset]);

  const allowLate = watch('allow_late_submission');
  const watchedClassId = watch('class_instance');

  // Update selected class when form value changes
  useEffect(() => {
    if (watchedClassId && watchedClassId !== selectedClassId) {
      setSelectedClassId(watchedClassId);
    }
  }, [watchedClassId, selectedClassId]);

  const onSubmit = async (data: FormData) => {
    // Get teacher ID from user profile
    const teacherId = userProfile?.teacherProfile?.id;
    if (!teacherId && !isEdit) {
      return;
    }

    const payload: Partial<CreateAssignmentInput> = {
      title: data.title,
      description: data.description,
      instructions: data.instructions,
      assignment_type: data.assignment_type as AssignmentType,
      assigned_date: data.assigned_date,
      due_date: data.due_date,
      max_score: data.max_score,
      pass_percentage: data.pass_percentage,
      weight_percentage: data.weight_percentage,
      status: data.status as AssignmentStatus,
      allow_late_submission: data.allow_late_submission,
      late_penalty_percentage: data.late_penalty_percentage,
    };

    if (isEdit) {
      // In edit mode, don't update class and subject (they're locked)
      updateAssignment.mutate(
        { id: assignmentId, data: payload },
        {
          onSuccess: () => navigate(`/mis/assignments/${assignmentId}`),
        }
      );
    } else {
      // In create mode, include class, subject, and teacher
      const createPayload: CreateAssignmentInput = {
        ...payload,
        class_instance: data.class_instance,
        subject: data.subject,
        teacher: teacherId!,
      } as CreateAssignmentInput;

      createAssignment.mutate(createPayload, {
        onSuccess: () => navigate('/mis/assignments'),
      });
    }
  };

  if (isEdit && isLoadingAssignment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading assignment..." />
      </div>
    );
  }

  if (isLoadingClasses || isLoadingSubjects) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <PageHeader
        title={isEdit ? 'Edit Assignment' : 'Create Assignment'}
        subtitle={isEdit ? 'Update assignment details' : 'Create a new assignment for your class'}
        icon={ClipboardList}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              Basic Information
            </h3>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Chapter 5 Homework"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('assignment_type')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ASSIGNMENT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Class <span className="text-red-500">*</span>
                    {isEdit && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </label>
                  {isEdit ? (
                    <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                      {existingAssignment?.class_instance_name || 'Loading...'}
                    </div>
                  ) : (
                    <select
                      {...register('class_instance', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>Select a class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.display_name || cls.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.class_instance && !isEdit && (
                    <p className="mt-1 text-sm text-red-500">{errors.class_instance.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                    {isEdit && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </label>
                  {isEdit ? (
                    <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                      {existingAssignment?.subject_name || 'Loading...'}
                    </div>
                  ) : (
                    <select
                      {...register('subject', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={0}>Select a subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.subject && !isEdit && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              {isEdit && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Class and Subject cannot be changed after creation
                </p>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brief description of the assignment..."
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instructions
                </label>
                <textarea
                  {...register('instructions')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Detailed instructions for students..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates and Scoring */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Dates & Scoring
            </h3>

            <div className="space-y-4">
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assigned Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('assigned_date')}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.assigned_date && (
                    <p className="mt-1 text-sm text-red-500">{errors.assigned_date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('due_date')}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.due_date && (
                    <p className="mt-1 text-sm text-red-500">{errors.due_date.message}</p>
                  )}
                </div>
              </div>

              {/* Scoring */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Score <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('max_score', { valueAsNumber: true })}
                    min={1}
                    max={1000}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.max_score && (
                    <p className="mt-1 text-sm text-red-500">{errors.max_score.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pass Percentage
                  </label>
                  <input
                    type="number"
                    {...register('pass_percentage', { valueAsNumber: true })}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Weight %
                  </label>
                  <input
                    type="number"
                    {...register('weight_percentage', { valueAsNumber: true })}
                    min={0}
                    max={100}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              Settings
            </h3>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {ASSIGNMENT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Draft assignments are not visible to students
                </p>
              </div>

              {/* Late Submission */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('allow_late_submission')}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Allow late submissions
                  </span>
                </label>

                {allowLate && (
                  <div className="ml-7">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Late Penalty (%)
                    </label>
                    <input
                      type="number"
                      {...register('late_penalty_percentage', { valueAsNumber: true })}
                      min={0}
                      max={100}
                      className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Percentage deducted from score for late submissions
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createAssignment.isPending || updateAssignment.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isEdit ? 'Save Changes' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
