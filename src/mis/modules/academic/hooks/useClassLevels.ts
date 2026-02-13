import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { classLevelService } from '../services/classLevelService';
import type {
  CreateClassLevelData,
  UpdateClassLevelData,
  ClassLevelFilters,
} from '../types';

// Query Keys Factory
export const classLevelKeys = {
  all: ['class-levels'] as const,
  lists: () => [...classLevelKeys.all, 'list'] as const,
  list: (filters: ClassLevelFilters) => [...classLevelKeys.lists(), filters] as const,
  details: () => [...classLevelKeys.all, 'detail'] as const,
  detail: (id: number) => [...classLevelKeys.details(), id] as const,
  subjects: (id: number) => [...classLevelKeys.all, 'subjects', id] as const,
};

export function useClassLevels(filters: ClassLevelFilters = {}) {
  return useQuery({
    queryKey: classLevelKeys.list(filters),
    queryFn: () => classLevelService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClassLevel(id: number) {
  return useQuery({
    queryKey: classLevelKeys.detail(id),
    queryFn: () => classLevelService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useClassLevelSubjects(id: number) {
  return useQuery({
    queryKey: classLevelKeys.subjects(id),
    queryFn: () => classLevelService.getSubjects(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClassLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassLevelData) => classLevelService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: classLevelKeys.lists() });
      toast.loading('Creating class level...', { id: 'create-class-level' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create class level', {
        id: 'create-class-level',
      });
    },
    onSuccess: (newLevel) => {
      queryClient.invalidateQueries({ queryKey: classLevelKeys.lists() });
      toast.success(`${newLevel.name} created successfully!`, {
        id: 'create-class-level',
      });
    },
  });
}

export function useUpdateClassLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateClassLevelData }) =>
      classLevelService.update(id, data),
    onMutate: async () => {
      toast.loading('Updating class level...', { id: 'update-class-level' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update class level', {
        id: 'update-class-level',
      });
    },
    onSuccess: (updatedLevel) => {
      queryClient.invalidateQueries({ queryKey: classLevelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classLevelKeys.detail(updatedLevel.id) });
      toast.success('Class level updated successfully!', {
        id: 'update-class-level',
      });
    },
  });
}

export function useDeleteClassLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => classLevelService.delete(id),
    onMutate: async () => {
      toast.loading('Deleting class level...', { id: 'delete-class-level' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete class level', {
        id: 'delete-class-level',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classLevelKeys.lists() });
      toast.success('Class level deleted successfully!', {
        id: 'delete-class-level',
      });
    },
  });
}
