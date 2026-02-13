import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { academicYearService } from '../services/academicYearService';
import type {
  AcademicYearApiResponse,
  CreateAcademicYearData,
  UpdateAcademicYearData,
  AcademicYearFilters,
} from '../types';

// Query Keys Factory
export const academicYearKeys = {
  all: ['academic-years'] as const,
  lists: () => [...academicYearKeys.all, 'list'] as const,
  list: (filters: AcademicYearFilters) => [...academicYearKeys.lists(), filters] as const,
  details: () => [...academicYearKeys.all, 'detail'] as const,
  detail: (id: number) => [...academicYearKeys.details(), id] as const,
  current: () => [...academicYearKeys.all, 'current'] as const,
};

export function useAcademicYears(filters: AcademicYearFilters = {}) {
  return useQuery({
    queryKey: academicYearKeys.list(filters),
    queryFn: () => academicYearService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAcademicYear(id: number) {
  return useQuery({
    queryKey: academicYearKeys.detail(id),
    queryFn: () => academicYearService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentAcademicYear() {
  return useQuery({
    queryKey: academicYearKeys.current(),
    queryFn: () => academicYearService.getCurrent(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAcademicYearData) => academicYearService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: academicYearKeys.lists() });
      toast.loading('Creating academic year...', { id: 'create-academic-year' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create academic year', {
        id: 'create-academic-year',
      });
    },
    onSuccess: (newYear) => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      toast.success(`Academic year ${newYear.display_name} created successfully!`, {
        id: 'create-academic-year',
      });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAcademicYearData }) =>
      academicYearService.update(id, data),
    onMutate: async () => {
      toast.loading('Updating academic year...', { id: 'update-academic-year' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update academic year', {
        id: 'update-academic-year',
      });
    },
    onSuccess: (updatedYear) => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: academicYearKeys.detail(updatedYear.id) });
      toast.success('Academic year updated successfully!', {
        id: 'update-academic-year',
      });
    },
  });
}

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => academicYearService.delete(id),
    onMutate: async () => {
      toast.loading('Deleting academic year...', { id: 'delete-academic-year' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete academic year', {
        id: 'delete-academic-year',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      toast.success('Academic year deleted successfully!', {
        id: 'delete-academic-year',
      });
    },
  });
}

export function useSetCurrentAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => academicYearService.setCurrent(id),
    onMutate: async () => {
      toast.loading('Setting current academic year...', { id: 'set-current-year' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to set current academic year', {
        id: 'set-current-year',
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: academicYearKeys.current() });
      toast.success(response.message || 'Current academic year updated!', {
        id: 'set-current-year',
      });
    },
  });
}
