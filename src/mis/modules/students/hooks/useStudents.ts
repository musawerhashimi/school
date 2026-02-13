import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import type {
  StudentApiResponse,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
} from '../types';
import { toast } from 'react-hot-toast';

// Query Keys Factory
export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: number) => [...studentKeys.details(), id] as const,
  stats: () => [...studentKeys.all, 'stats'] as const,
  guardians: () => [...studentKeys.all, 'guardians'] as const,
  guardian: (id: number) => [...studentKeys.guardians(), id] as const,
  documents: (studentId: number) =>
    [...studentKeys.all, 'documents', studentId] as const,
  enrollments: (studentId: number) =>
    [...studentKeys.all, 'enrollments', studentId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch all students with optional filters and pagination
 */
export function useStudents(filters: StudentFilters = {}) {
  return useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single student by ID
 */
export function useStudent(id: number) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch student statistics
 */
export function useStudentStats() {
  return useQuery({
    queryKey: studentKeys.stats(),
    queryFn: () => studentService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch student documents
 */
export function useStudentDocuments(studentId: number) {
  return useQuery({
    queryKey: studentKeys.documents(studentId),
    queryFn: () => studentService.getDocuments(studentId),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch student enrollments
 */
export function useStudentEnrollments(studentId: number) {
  return useQuery({
    queryKey: studentKeys.enrollments(studentId),
    queryFn: () => studentService.getEnrollments(studentId),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new student
 */
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: studentKeys.lists() });
      toast.loading('Creating student...', { id: 'create-student' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create student', {
        id: 'create-student',
      });
    },
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
      toast.success(`Student ${newStudent.full_name} created successfully!`, {
        id: 'create-student',
      });
    },
  });
}

/**
 * Hook to update an existing student
 */
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentData }) =>
      studentService.update(id, data),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });
      toast.loading('Updating student...', { id: 'update-student' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update student', {
        id: 'update-student',
      });
    },
    onSuccess: (updatedStudent, { id }) => {
      queryClient.setQueryData(studentKeys.detail(id), updatedStudent);
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
      toast.success(`Student ${updatedStudent.full_name} updated successfully!`, {
        id: 'update-student',
      });
    },
  });
}

/**
 * Hook to delete a student
 */
export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: studentKeys.lists() });
      const student =
        queryClient.getQueryData<StudentApiResponse>(studentKeys.detail(id));
      toast.loading('Deleting student...', { id: 'delete-student' });
      return { studentName: student?.full_name };
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete student', {
        id: 'delete-student',
      });
    },
    onSuccess: (_, id, context) => {
      queryClient.removeQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
      toast.success(
        context?.studentName
          ? `Student ${context.studentName} deleted successfully!`
          : 'Student deleted successfully!',
        { id: 'delete-student' }
      );
    },
  });
}

/**
 * Hook to bulk update student status
 */
export function useBulkUpdateStudentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      studentService.bulkUpdateStatus(ids, status),
    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey: studentKeys.lists() });
      toast.loading(`Updating ${ids.length} student(s)...`, { id: 'bulk-update' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update students', {
        id: 'bulk-update',
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
      toast.success(result.message, { id: 'bulk-update' });
    },
  });
}

/**
 * Hook to upload student photo
 */
export function useUploadStudentPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      studentService.uploadPhoto(id, photo),
    onMutate: () => {
      toast.loading('Uploading photo...', { id: 'upload-photo' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload photo', {
        id: 'upload-photo',
      });
    },
    onSuccess: (updatedStudent, { id }) => {
      queryClient.setQueryData(studentKeys.detail(id), updatedStudent);
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success('Photo uploaded successfully!', { id: 'upload-photo' });
    },
  });
}

/**
 * Hook for bulk import
 */
export function useBulkImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => studentService.bulkImport(file),
    onMutate: () => {
      toast.loading('Importing students...', { id: 'bulk-import' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to import students', {
        id: 'bulk-import',
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });

      if (result.error_count > 0) {
        toast.success(
          `Imported ${result.created_count} students with ${result.error_count} errors`,
          { id: 'bulk-import' }
        );
      } else {
        toast.success(`Successfully imported ${result.created_count} students!`, {
          id: 'bulk-import',
        });
      }
    },
  });
}

/**
 * Hook for bulk promote
 */
export function useBulkPromoteStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentIds,
      classId,
      className,
      academicYear,
      section,
    }: {
      studentIds: number[];
      classId?: number;
      className?: string;
      academicYear: string;
      section?: string;
    }) => studentService.bulkPromote(studentIds, classId, className, academicYear, section),
    onMutate: () => {
      toast.loading('Promoting students...', { id: 'bulk-promote' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to promote students', {
        id: 'bulk-promote',
      });
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
      toast.success(result.message, { id: 'bulk-promote' });
    },
  });
}

// ============================================================================
// DOCUMENT MUTATIONS
// ============================================================================

export function useUploadStudentDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: number;
      data: {
        document_type: string;
        title: string;
        file: File;
        description?: string;
      };
    }) => studentService.uploadDocument(studentId, data),
    onMutate: () => {
      toast.loading('Uploading document...', { id: 'upload-document' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload document', {
        id: 'upload-document',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.documents(studentId) });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
      toast.success('Document uploaded successfully!', { id: 'upload-document' });
    },
  });
}

export function useDeleteStudentDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, documentId }: { studentId: number; documentId: number }) =>
      studentService.deleteDocument(studentId, documentId),
    onMutate: () => {
      toast.loading('Deleting document...', { id: 'delete-document' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete document', {
        id: 'delete-document',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.documents(studentId) });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
      toast.success('Document deleted successfully!', { id: 'delete-document' });
    },
  });
}

// ============================================================================
// PREFETCH UTILITIES
// ============================================================================

/**
 * Prefetch students list
 */
export function usePrefetchStudents() {
  const queryClient = useQueryClient();

  return (filters: StudentFilters = {}) => {
    queryClient.prefetchQuery({
      queryKey: studentKeys.list(filters),
      queryFn: () => studentService.getAll(filters),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Prefetch student detail
 */
export function usePrefetchStudent() {
  const queryClient = useQueryClient();

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: studentKeys.detail(id),
      queryFn: () => studentService.getById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
