import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { examScheduleService } from '../services/examScheduleService';
import type { 
  ExamScheduleDetailApiResponse, 
  CreateExamScheduleData, 
  UpdateExamScheduleData, 
  ExamScheduleFilters,
  PaginatedExamSchedulesResponse,
  ExamScheduleCalendarResponse,
  ConflictCheckData
} from '../types';

const QUERY_KEYS = {
  examSchedules: ['exam-schedules'] as const,
  examSchedule: (id: number) => [...QUERY_KEYS.examSchedules, id] as const,
  examSchedulesByExam: (examId: number) => [...QUERY_KEYS.examSchedules, 'by-exam', examId] as const,
  examSchedulesByClass: (classInstanceId: number) => [...QUERY_KEYS.examSchedules, 'by-class', classInstanceId] as const,
  examScheduleCalendar: ['exam-schedule-calendar'] as const,
  // Also invalidate class-exam schedule queries when schedules change
  classExamSchedules: ['exam-classes'] as const,
};

export function useExamSchedules(filters?: ExamScheduleFilters, options?: UseQueryOptions<PaginatedExamSchedulesResponse>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.examSchedules, filters],
    queryFn: () => examScheduleService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useExamSchedule(id: number, options?: UseQueryOptions<ExamScheduleDetailApiResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.examSchedule(id),
    queryFn: () => examScheduleService.getById(id),
    enabled: id > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

export function useExamSchedulesByExam(examId: number, options?: UseQueryOptions<PaginatedExamSchedulesResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.examSchedulesByExam(examId),
    queryFn: () => examScheduleService.getByExam(examId),
    enabled: examId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useExamSchedulesByClass(classInstanceId: number, options?: UseQueryOptions<PaginatedExamSchedulesResponse>) {
  return useQuery({
    queryKey: QUERY_KEYS.examSchedulesByClass(classInstanceId),
    queryFn: () => examScheduleService.getByClass(classInstanceId),
    enabled: classInstanceId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

export function useExamScheduleCalendar(filters?: ExamScheduleFilters, options?: UseQueryOptions<ExamScheduleCalendarResponse>) {
  return useQuery({
    queryKey: [...QUERY_KEYS.examScheduleCalendar, filters],
    queryFn: () => examScheduleService.getCalendar(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    ...options,
  });
}

export function useCreateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamScheduleData) => examScheduleService.create(data),
    onMutate: () => toast.loading('Creating exam schedule...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Exam schedule created successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.examSchedules });
      // Also invalidate class-exam schedule grid queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.classExamSchedules });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create exam schedule', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamScheduleData }) =>
      examScheduleService.update(id, data),
    onMutate: () => toast.loading('Updating exam schedule...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Exam schedule updated successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.examSchedule(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.examSchedules });
      // Also invalidate class-exam schedule grid queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.classExamSchedules });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update exam schedule', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteExamSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examScheduleService.delete(id),
    onMutate: () => toast.loading('Deleting exam schedule...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Exam schedule deleted successfully');
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.examSchedules });
      // Also invalidate class-exam schedule grid queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.classExamSchedules });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete exam schedule', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useCheckExamScheduleConflicts() {
  return useMutation({
    mutationFn: (data: ConflictCheckData) => examScheduleService.checkConflicts(data),
    onMutate: () => toast.loading('Checking for conflicts...'),
    onSuccess: (data) => {
      toast.dismiss();
      if (data.has_conflicts) {
        toast.error(`Found ${data.conflicts.length} scheduling conflict(s)`);
      } else {
        toast.success('No conflicts found');
      }
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to check for conflicts', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
