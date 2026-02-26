import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { examService } from '../services/examService';
import type { ExamApiResponse, ExamDetailApiResponse, CreateExamData, UpdateExamData, ExamFilters, PaginatedExamsResponse, ExamGradesSummaryResponse, ExamStatisticsResponse } from '../types';

const EXAMS_KEY = ['exams'] as const;

const QUERY_KEYS = {
  exams: EXAMS_KEY,
  exam: (id: number) => [...EXAMS_KEY, id] as const,
  gradesSummary: (id: number) => [...EXAMS_KEY, id, 'grades-summary'] as const,
  statistics: (id: number) => [...EXAMS_KEY, id, 'statistics'] as const,
  currentYear: [...EXAMS_KEY, 'current-year'] as const,
};

export function useExams(filters?: ExamFilters, options?: UseQueryOptions<PaginatedExamsResponse>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.exams, filters],
    queryFn: () => examService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useExam(id: number, options?: UseQueryOptions<ExamDetailApiResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.exam(id),
    queryFn: () => examService.getById(id),
    enabled: id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

export function useExamGradesSummary(examId: number, options?: UseQueryOptions<ExamGradesSummaryResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.gradesSummary(examId),
    queryFn: () => examService.getGradesSummary(examId),
    enabled: examId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useExamStatistics(examId: number, options?: UseQueryOptions<ExamStatisticsResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(examId),
    queryFn: () => examService.getStatistics(examId),
    enabled: examId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useCurrentYearExams(options?: UseQueryOptions<PaginatedExamsResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.currentYear,
    queryFn: () => examService.getCurrentYear(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamData) => examService.create(data),
    onMutate: () => toast.loading('Creating exam...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Exam created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exams });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create exam', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamData }) => examService.update(id, data),
    onMutate: () => toast.loading('Updating exam...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Exam updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exam(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exams });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update exam', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examService.delete(id),
    onMutate: () => toast.loading('Deleting exam...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Exam deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exams });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete exam', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateExamStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, status }: { examId: number; status: string }) =>
      examService.updateStatus(examId, status),
    onMutate: () => toast.loading('Updating exam status...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Exam status updated');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exam(variables.examId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exams });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update exam status', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
