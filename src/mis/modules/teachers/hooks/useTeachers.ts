import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teacherService } from '../services/teacherService';
import type {
  TeacherFilters,
  TeacherProfileFormData,
  TeacherProfileUpdateFormData,
} from '../types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters: TeacherFilters) =>
    [...teacherKeys.lists(), filters] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: number) => [...teacherKeys.details(), id] as const,
  stats: () => [...teacherKeys.all, 'stats'] as const,
  schedule: (id: number) => [...teacherKeys.detail(id), 'schedule'] as const,
  classes: (id: number) => [...teacherKeys.detail(id), 'classes'] as const,
  students: (id: number) => [...teacherKeys.detail(id), 'students'] as const,
  available: (dayOfWeek: number, periodNumber: number, excludeSchedule?: number) =>
    [...teacherKeys.all, 'available', dayOfWeek, periodNumber, excludeSchedule] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Fetch paginated list of teachers
 */
export function useTeachers(filters: TeacherFilters = {}) {
  return useQuery({
    queryKey: teacherKeys.list(filters),
    queryFn: () => teacherService.getAll(filters),
  });
}

/**
 * Fetch a single teacher profile
 */
export function useTeacherDetail(id: number) {
  return useQuery({
    queryKey: teacherKeys.detail(id),
    queryFn: () => teacherService.getById(id),
    enabled: !!id,
  });
}

/**
 * Fetch teacher statistics
 */
export function useTeacherStats() {
  return useQuery({
    queryKey: teacherKeys.stats(),
    queryFn: () => teacherService.getStats(),
  });
}

/**
 * Fetch teacher's weekly schedule
 */
export function useTeacherSchedule(id: number) {
  return useQuery({
    queryKey: teacherKeys.schedule(id),
    queryFn: () => teacherService.getSchedule(id),
    enabled: !!id,
  });
}

/**
 * Fetch teacher's assigned classes
 */
export function useTeacherClasses(id: number) {
  return useQuery({
    queryKey: teacherKeys.classes(id),
    queryFn: () => teacherService.getClasses(id),
    enabled: !!id,
  });
}

/**
 * Fetch all students taught by a teacher
 */
export function useTeacherStudents(id: number) {
  return useQuery({
    queryKey: teacherKeys.students(id),
    queryFn: () => teacherService.getStudents(id),
    enabled: !!id,
  });
}

/**
 * Fetch available teachers at a specific time
 * @param excludeSchedule - Schedule ID to exclude from busy check (for editing)
 */
export function useAvailableTeachers(
  dayOfWeek: number,
  periodNumber: number,
  enabled = true,
  excludeSchedule?: number
) {
  return useQuery({
    queryKey: teacherKeys.available(dayOfWeek, periodNumber, excludeSchedule),
    queryFn: () => teacherService.getAvailableTeachers(dayOfWeek, periodNumber, excludeSchedule),
    enabled: enabled && dayOfWeek !== undefined && periodNumber !== undefined,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create a new teacher profile
 */
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeacherProfileFormData) =>
      teacherService.create(data),
    onSuccess: () => {
      // Invalidate teacher lists
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.stats() });
    },
  });
}

/**
 * Update an existing teacher profile
 */
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TeacherProfileUpdateFormData }) =>
      teacherService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific teacher and lists
      queryClient.invalidateQueries({
        queryKey: teacherKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.stats() });
    },
  });
}

/**
 * Delete a teacher profile
 */
export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherService.delete(id),
    onSuccess: () => {
      // Invalidate teacher lists
      queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teacherKeys.stats() });
    },
  });
}

/**
 * Export teachers to CSV
 */
export function useExportTeachers() {
  return useMutation({
    mutationFn: (filters: TeacherFilters) =>
      teacherService.exportToCSV(filters),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `teachers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
