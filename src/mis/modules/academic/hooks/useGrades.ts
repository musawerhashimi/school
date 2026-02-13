import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gradeService } from '../services/gradeService';
import type { GradeFilters, CreateGradeData, BulkGradeCreateData } from '../types';

export const gradeKeys = {
  all: ['grades'] as const,
  lists: () => [...gradeKeys.all, 'list'] as const,
  list: (filters: GradeFilters) => [...gradeKeys.lists(), filters] as const,
  details: () => [...gradeKeys.all, 'detail'] as const,
  detail: (id: number) => [...gradeKeys.details(), id] as const,
  byClass: (examId: number, classId: number) => [...gradeKeys.all, 'byClass', examId, classId] as const,
  transcript: (studentId: number, yearId?: number) => [...gradeKeys.all, 'transcript', studentId, yearId] as const,
};

export function useGrades(filters: GradeFilters = {}) {
  return useQuery({
    queryKey: gradeKeys.list(filters),
    queryFn: () => gradeService.getAll(filters),
    staleTime: 3 * 60 * 1000,
  });
}

export function useGrade(id: number) {
  return useQuery({
    queryKey: gradeKeys.detail(id),
    queryFn: () => gradeService.getById(id),
    enabled: id > 0,
  });
}

export function useGradesByClass(examId: number, classInstanceId: number) {
  return useQuery({
    queryKey: gradeKeys.byClass(examId, classInstanceId),
    queryFn: () => gradeService.getByClass(examId, classInstanceId),
    enabled: examId > 0 && classInstanceId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentTranscript(studentId: number, academicYearId?: number) {
  return useQuery({
    queryKey: gradeKeys.transcript(studentId, academicYearId),
    queryFn: () => gradeService.getStudentTranscript(studentId, academicYearId),
    enabled: studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGradeData) => gradeService.create(data),
    onSuccess: () => {
      toast.success('Grade saved');
      queryClient.invalidateQueries({ queryKey: gradeKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to save grade', { description: error.message });
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGradeData> }) =>
      gradeService.update(id, data),
    onSuccess: () => {
      toast.success('Grade updated');
      queryClient.invalidateQueries({ queryKey: gradeKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to update grade', { description: error.message });
    },
  });
}

export function useBulkGradeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkGradeCreateData) => gradeService.bulkEntry(data),
    onMutate: () => { toast.loading('Saving grades...', { id: 'bulk-grades' }); },
    onSuccess: (result) => {
      toast.dismiss('bulk-grades');
      toast.success(`Saved ${result.total} grades (${result.created_count} new, ${result.updated_count} updated)`);
      queryClient.invalidateQueries({ queryKey: gradeKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('bulk-grades');
      toast.error('Failed to save grades', { description: error.message });
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onSuccess: () => {
      toast.success('Grade deleted');
      queryClient.invalidateQueries({ queryKey: gradeKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete grade', { description: error.message });
    },
  });
}
