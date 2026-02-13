import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { examService } from '../services/examService';
import type { ExamFilters, CreateExamData, UpdateExamData } from '../types';

export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (filters: ExamFilters) => [...examKeys.lists(), filters] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: number) => [...examKeys.details(), id] as const,
  currentYear: () => [...examKeys.all, 'currentYear'] as const,
  gradesSummary: (id: number) => [...examKeys.all, 'gradesSummary', id] as const,
};

export function useExams(filters: ExamFilters = {}) {
  return useQuery({
    queryKey: examKeys.list(filters),
    queryFn: () => examService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExam(id: number) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: () => examService.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentYearExams() {
  return useQuery({
    queryKey: examKeys.currentYear(),
    queryFn: () => examService.getCurrentYear(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExamGradesSummary(examId: number) {
  return useQuery({
    queryKey: examKeys.gradesSummary(examId),
    queryFn: () => examService.getGradesSummary(examId),
    enabled: examId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamData) => examService.create(data),
    onMutate: () => { toast.loading('Creating exam...', { id: 'create-exam' }); },
    onSuccess: () => {
      toast.dismiss('create-exam');
      toast.success('Exam created successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('create-exam');
      toast.error('Failed to create exam', { description: error.message });
    },
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamData }) => examService.update(id, data),
    onMutate: () => { toast.loading('Updating exam...', { id: 'update-exam' }); },
    onSuccess: () => {
      toast.dismiss('update-exam');
      toast.success('Exam updated successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('update-exam');
      toast.error('Failed to update exam', { description: error.message });
    },
  });
}

export function useDeleteExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examService.delete(id),
    onMutate: () => { toast.loading('Deleting exam...', { id: 'delete-exam' }); },
    onSuccess: () => {
      toast.dismiss('delete-exam');
      toast.success('Exam deleted successfully');
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('delete-exam');
      toast.error('Failed to delete exam', { description: error.message });
    },
  });
}

export function useUpdateExamStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, status }: { examId: number; status: string }) =>
      examService.updateStatus(examId, status),
    onSuccess: () => {
      toast.success('Exam status updated');
      queryClient.invalidateQueries({ queryKey: examKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to update status', { description: error.message });
    },
  });
}
