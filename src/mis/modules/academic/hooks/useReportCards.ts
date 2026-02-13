import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reportCardService } from '../services/reportCardService';
import type {
  ReportCardFilters,
  UpdateReportCardData,
  GenerateReportCardsData,
} from '../types';
import { examKeys } from './useExams';
import { gradeKeys } from './useGrades';

export const reportCardKeys = {
  all: ['report-cards'] as const,
  lists: () => [...reportCardKeys.all, 'list'] as const,
  list: (filters: ReportCardFilters) => [...reportCardKeys.lists(), filters] as const,
  details: () => [...reportCardKeys.all, 'detail'] as const,
  detail: (id: number) => [...reportCardKeys.details(), id] as const,
  classResults: (classId: number, yearId?: number) =>
    [...reportCardKeys.all, 'classResults', classId, yearId] as const,
};

export function useReportCards(filters: ReportCardFilters = {}) {
  return useQuery({
    queryKey: reportCardKeys.list(filters),
    queryFn: () => reportCardService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReportCard(id: number) {
  return useQuery({
    queryKey: reportCardKeys.detail(id),
    queryFn: () => reportCardService.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassResults(classInstanceId: number, academicYearId?: number) {
  return useQuery({
    queryKey: reportCardKeys.classResults(classInstanceId, academicYearId),
    queryFn: () => reportCardService.getClassResults(classInstanceId, academicYearId),
    enabled: classInstanceId > 0,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGenerateReportCards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateReportCardsData) => reportCardService.generate(data),
    onMutate: () => { toast.loading('Generating report cards...', { id: 'generate-rc' }); },
    onSuccess: (result) => {
      toast.dismiss('generate-rc');
      toast.success(`Generated ${result.generated_count} report cards for ${result.class_name}`);
      queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('generate-rc');
      toast.error('Failed to generate report cards', { description: error.message });
    },
  });
}

export function useUpdateReportCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReportCardData }) =>
      reportCardService.update(id, data),
    onSuccess: () => {
      toast.success('Report card updated');
      queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to update report card', { description: error.message });
    },
  });
}

export function useApproveReportCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reportCardService.approve(id),
    onSuccess: () => {
      toast.success('Report card approved');
      queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
    },
    onError: (error: Error) => {
      toast.error('Failed to approve report card', { description: error.message });
    },
  });
}

export function useBulkApproveReportCards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => reportCardService.bulkApprove(ids),
    onMutate: () => { toast.loading('Approving...', { id: 'bulk-approve' }); },
    onSuccess: (result) => {
      toast.dismiss('bulk-approve');
      toast.success(`Approved ${result.approved_count} report cards`);
      queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('bulk-approve');
      toast.error('Failed to approve', { description: error.message });
    },
  });
}

export function usePublishReportCards() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { ids?: number[]; class_instance?: number; academic_year?: number }) =>
      reportCardService.publish(data),
    onMutate: () => { toast.loading('Publishing...', { id: 'publish-rc' }); },
    onSuccess: (result) => {
      toast.dismiss('publish-rc');
      toast.success(`Published ${result.published_count} report cards`);
      queryClient.invalidateQueries({ queryKey: reportCardKeys.all });
    },
    onError: (error: Error) => {
      toast.dismiss('publish-rc');
      toast.error('Failed to publish', { description: error.message });
    },
  });
}
