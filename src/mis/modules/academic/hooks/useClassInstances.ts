import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { classInstanceService } from '../services/classInstanceService';
import type {
  CreateClassInstanceData,
  UpdateClassInstanceData,
  ClassInstanceFilters,
} from '../types';

// Query Keys Factory
export const classInstanceKeys = {
  all: ['class-instances'] as const,
  lists: () => [...classInstanceKeys.all, 'list'] as const,
  list: (filters: ClassInstanceFilters) => [...classInstanceKeys.lists(), filters] as const,
  details: () => [...classInstanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...classInstanceKeys.details(), id] as const,
  currentYear: () => [...classInstanceKeys.all, 'current-year'] as const,
  students: (id: number) => [...classInstanceKeys.all, 'students', id] as const,
  schedule: (id: number) => [...classInstanceKeys.all, 'schedule', id] as const,
  byLevel: (academicYearId?: number) => [...classInstanceKeys.all, 'by-level', academicYearId] as const,
  stats: (academicYearId?: number) => [...classInstanceKeys.all, 'stats', academicYearId] as const,
};

export function useClassInstances(filters: ClassInstanceFilters = {}) {
  return useQuery({
    queryKey: classInstanceKeys.list(filters),
    queryFn: () => classInstanceService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClassInstance(id: number) {
  return useQuery({
    queryKey: classInstanceKeys.detail(id),
    queryFn: () => classInstanceService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCurrentYearClasses() {
  return useQuery({
    queryKey: classInstanceKeys.currentYear(),
    queryFn: () => classInstanceService.getCurrentYear(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassInstanceStudents(id: number) {
  return useQuery({
    queryKey: classInstanceKeys.students(id),
    queryFn: () => classInstanceService.getStudents(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassInstanceSchedule(id: number) {
  return useQuery({
    queryKey: classInstanceKeys.schedule(id),
    queryFn: () => classInstanceService.getSchedule(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassesByLevel(academicYearId?: number) {
  return useQuery({
    queryKey: classInstanceKeys.byLevel(academicYearId),
    queryFn: () => classInstanceService.getByLevel(academicYearId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassInstanceStats(academicYearId?: number) {
  return useQuery({
    queryKey: classInstanceKeys.stats(academicYearId),
    queryFn: () => classInstanceService.getStats(academicYearId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClassInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassInstanceData) => classInstanceService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: classInstanceKeys.lists() });
      toast.loading('Creating class...', { id: 'create-class-instance' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create class', {
        id: 'create-class-instance',
      });
    },
    onSuccess: (newClass) => {
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.currentYear() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.byLevel() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.stats() });
      toast.success(`${newClass.name} created successfully!`, {
        id: 'create-class-instance',
      });
    },
  });
}

export function useUpdateClassInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClassInstanceData }) =>
      classInstanceService.update(id, data),
    onMutate: async () => {
      toast.loading('Updating class...', { id: 'update-class-instance' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update class', {
        id: 'update-class-instance',
      });
    },
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.detail(updatedClass.id) });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.currentYear() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.byLevel() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.stats() });
      toast.success('Class updated successfully!', {
        id: 'update-class-instance',
      });
    },
  });
}

export function useDeleteClassInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => classInstanceService.delete(id),
    onMutate: async () => {
      toast.loading('Deleting class...', { id: 'delete-class-instance' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete class', {
        id: 'delete-class-instance',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.currentYear() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.byLevel() });
      queryClient.invalidateQueries({ queryKey: classInstanceKeys.stats() });
      toast.success('Class deleted successfully!', {
        id: 'delete-class-instance',
      });
    },
  });
}
