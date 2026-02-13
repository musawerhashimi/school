/**
 * Assignment Hooks
 * React Query hooks for assignment management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assignmentService } from '../services/assignmentService';
import { ASSIGNMENT_QUERY_KEYS, STALE_TIMES } from '../constants';
import type {
  AssignmentApiResponse,
  AssignmentListItem,
  AssignmentSubmissionApiResponse,
  StudentAssignment,
  StudentAssignmentStats,
  ClassAssignmentStats,
  ClassWithAssignments,
  CreateAssignmentInput,
  AssignmentFilters,
  SubmissionFilters,
  GradeSubmissionInput,
  BulkGradeInput,
  PaginatedResponse,
} from '../types';

// ============================================================================
// Assignment List Hooks
// ============================================================================

/**
 * Get paginated list of assignments with filters
 */
export function useAssignments(
  filters?: AssignmentFilters,
  options?: Partial<UseQueryOptions<PaginatedResponse<AssignmentListItem>>>
) {
  return useQuery({
    queryKey: ASSIGNMENT_QUERY_KEYS.list(filters || {}),
    queryFn: () => assignmentService.getAll(filters),
    staleTime: STALE_TIMES.list,
    ...options,
  });
}

/**
 * Get single assignment by ID
 */
export function useAssignment(
  id: number,
  options?: Partial<UseQueryOptions<AssignmentApiResponse>>
) {
  return useQuery({
    queryKey: ASSIGNMENT_QUERY_KEYS.detail(id),
    queryFn: () => assignmentService.getById(id),
    enabled: id > 0,
    staleTime: STALE_TIMES.detail,
    ...options,
  });
}

// ============================================================================
// Class-specific Hooks
// ============================================================================

/**
 * Get assignments for a specific class
 */
export function useClassAssignments(
  classId: number,
  filters?: AssignmentFilters,
  options?: Partial<UseQueryOptions<AssignmentListItem[]>>
) {
  return useQuery({
    queryKey: [...ASSIGNMENT_QUERY_KEYS.byClass(classId), filters],
    queryFn: () => assignmentService.getByClass(classId, filters),
    enabled: classId > 0,
    staleTime: STALE_TIMES.list,
    ...options,
  });
}

/**
 * Get assignment statistics for a class
 */
export function useClassAssignmentStats(
  classId: number,
  options?: Partial<UseQueryOptions<ClassAssignmentStats>>
) {
  return useQuery({
    queryKey: ASSIGNMENT_QUERY_KEYS.classStats(classId),
    queryFn: () => assignmentService.getClassStats(classId),
    enabled: classId > 0,
    staleTime: STALE_TIMES.stats,
    ...options,
  });
}

/**
 * Get all classes with assignment info
 */
export function useClassesWithAssignments(
  filters?: { academic_year?: number; search?: string },
  options?: Partial<UseQueryOptions<ClassWithAssignments[]>>
) {
  return useQuery({
    queryKey: [...ASSIGNMENT_QUERY_KEYS.classesWithAssignments(), filters],
    queryFn: () => assignmentService.getClassesWithAssignments(filters),
    staleTime: STALE_TIMES.list,
    ...options,
  });
}

// ============================================================================
// Teacher-specific Hooks
// ============================================================================

/**
 * Get assignments by teacher
 */
export function useTeacherAssignments(
  teacherId: number,
  filters?: AssignmentFilters,
  options?: Partial<UseQueryOptions<AssignmentListItem[]>>
) {
  return useQuery({
    queryKey: [...ASSIGNMENT_QUERY_KEYS.byTeacher(teacherId), filters],
    queryFn: () => assignmentService.getByTeacher(teacherId, filters),
    enabled: teacherId > 0,
    staleTime: STALE_TIMES.list,
    ...options,
  });
}

// ============================================================================
// Student-specific Hooks
// ============================================================================

/**
 * Get assignments for a student
 */
export function useStudentAssignments(
  studentId: number,
  options?: Partial<UseQueryOptions<StudentAssignment[]>>
) {
  return useQuery({
    queryKey: ASSIGNMENT_QUERY_KEYS.byStudent(studentId),
    queryFn: () => assignmentService.getStudentAssignments(studentId),
    enabled: studentId > 0,
    staleTime: STALE_TIMES.list,
    ...options,
  });
}

/**
 * Get assignment statistics for a student
 */
export function useStudentAssignmentStats(
  studentId: number,
  options?: Partial<UseQueryOptions<StudentAssignmentStats>>
) {
  return useQuery({
    queryKey: ASSIGNMENT_QUERY_KEYS.studentStats(studentId),
    queryFn: () => assignmentService.getStudentStats(studentId),
    enabled: studentId > 0,
    staleTime: STALE_TIMES.stats,
    ...options,
  });
}

// ============================================================================
// Submission Hooks
// ============================================================================

/**
 * Get submissions for an assignment
 */
export function useAssignmentSubmissions(
  assignmentId: number,
  filters?: SubmissionFilters,
  options?: Partial<UseQueryOptions<AssignmentSubmissionApiResponse[]>>
) {
  return useQuery({
    queryKey: [...ASSIGNMENT_QUERY_KEYS.submissions(assignmentId), filters],
    queryFn: () => assignmentService.getSubmissions(assignmentId, filters),
    enabled: assignmentId > 0,
    staleTime: STALE_TIMES.submissions,
    ...options,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Create new assignment
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAssignmentInput) => assignmentService.create(data),
    onMutate: () => toast.loading('Creating assignment...'),
    onSuccess: (data) => {
      toast.dismiss();
      toast.success('Assignment created successfully');
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.byClass(data.class_instance),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Update assignment
 */
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateAssignmentInput> }) =>
      assignmentService.update(id, data),
    onMutate: () => toast.loading('Updating assignment...'),
    onSuccess: (data, variables) => {
      toast.dismiss();
      toast.success('Assignment updated successfully');
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Delete assignment
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.delete(id),
    onMutate: () => toast.loading('Deleting assignment...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Assignment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Publish assignment
 */
export function usePublishAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.publish(id),
    onMutate: () => toast.loading('Publishing assignment...'),
    onSuccess: (data, id) => {
      toast.dismiss();
      toast.success('Assignment published successfully');
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to publish assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Close assignment
 */
export function useCloseAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => assignmentService.close(id),
    onMutate: () => toast.loading('Closing assignment...'),
    onSuccess: (data, id) => {
      toast.dismiss();
      toast.success('Assignment closed successfully');
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_QUERY_KEYS.lists() });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to close assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Grade a submission
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      data,
    }: {
      submissionId: number;
      data: GradeSubmissionInput;
      assignmentId: number;
    }) => assignmentService.gradeSubmission(submissionId, data),
    onMutate: () => toast.loading('Saving grade...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Grade saved successfully');
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.submissions(variables.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.detail(variables.assignmentId),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to save grade', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Bulk grade submissions
 */
export function useBulkGradeSubmissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      grades,
    }: {
      assignmentId: number;
      grades: BulkGradeInput[];
    }) => assignmentService.bulkGradeSubmissions(assignmentId, grades),
    onMutate: () => toast.loading('Saving grades...'),
    onSuccess: (result, variables) => {
      toast.dismiss();
      if (result.error_count > 0) {
        toast.warning(`Saved ${result.success_count} grades, ${result.error_count} failed`);
      } else {
        toast.success(`All ${result.success_count} grades saved successfully`);
      }
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.submissions(variables.assignmentId),
      });
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.detail(variables.assignmentId),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to save grades', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Return submission for revision
 */
export function useReturnSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      feedback,
      assignmentId,
    }: {
      submissionId: number;
      feedback: string;
      assignmentId: number;
    }) => assignmentService.returnSubmission(submissionId, feedback),
    onMutate: () => toast.loading('Returning submission...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Submission returned for revision');
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.submissions(variables.assignmentId),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to return submission', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

/**
 * Submit assignment for a student
 */
export function useSubmitAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      assignmentId,
      content,
      attachment,
    }: {
      studentId: number;
      assignmentId: number;
      content?: string;
      attachment?: File;
    }) => assignmentService.submitAssignment(studentId, assignmentId, { content, attachment }),
    onMutate: () => toast.loading('Submitting assignment...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Assignment submitted successfully!');
      // Invalidate student assignments to refresh the list
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.byStudent(variables.studentId),
      });
      queryClient.invalidateQueries({
        queryKey: ASSIGNMENT_QUERY_KEYS.studentStats(variables.studentId),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to submit assignment', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
