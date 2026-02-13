import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gradeService } from '../services/gradeService';
import type { GradeDetailApiResponse, CreateGradeData, GradeFilters, PaginatedGradesResponse, BulkGradeCreateData, GradesByClassResponse, StudentTranscriptResponse } from '../types';

const QUERY_KEYS = {
  grades: ['grades'] as const,
  grade: (id: number) => [...QUERY_KEYS.grades, id] as const,
  gradesByClass: (examId: number, classInstanceId: number) => 
    [...QUERY_KEYS.grades, 'by-class', examId, classInstanceId] as const,
  transcript: (studentId: number, academicYearId?: number) => 
    [...QUERY_KEYS.grades, 'transcript', studentId, academicYearId] as const,
};

export function useGrades(filters?: GradeFilters, options?: UseQueryOptions<PaginatedGradesResponse>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.grades, filters],
    queryFn: () => gradeService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useGrade(id: number, options?: UseQueryOptions<GradeDetailApiResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.grade(id),
    queryFn: () => gradeService.getById(id),
    enabled: id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

export function useGradesByClass(examId: number, classInstanceId: number, options?: UseQueryOptions<GradesByClassResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.gradesByClass(examId, classInstanceId),
    queryFn: () => gradeService.getByClass(examId, classInstanceId),
    enabled: examId > 0 && classInstanceId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useStudentTranscript(studentId: number, academicYearId?: number, options?: UseQueryOptions<StudentTranscriptResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.transcript(studentId, academicYearId),
    queryFn: () => gradeService.getStudentTranscript(studentId, academicYearId),
    enabled: studentId > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGradeData) => gradeService.create(data),
    onMutate: () => toast.loading('Creating grade...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Grade created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grades });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create grade', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGradeData> }) => 
      gradeService.update(id, data),
    onMutate: () => toast.loading('Updating grade...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Grade updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grade(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grades });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update grade', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => gradeService.delete(id),
    onMutate: () => toast.loading('Deleting grade...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Grade deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grades });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete grade', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useBulkGradeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkGradeCreateData) => gradeService.bulkEntry(data),
    onMutate: () => toast.loading('Saving grades...'),
    onSuccess: (result) => {
      toast.dismiss();
      toast.success(`Saved ${result.total} grades (${result.created_count} new, ${result.updated_count} updated)`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.grades });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to save grades', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
