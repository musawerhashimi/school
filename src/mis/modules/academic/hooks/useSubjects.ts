import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { subjectService } from '../services/subjectService';
import type {
  CreateSubjectData,
  UpdateSubjectData,
  SubjectFilters,
} from '../types';

// Query Keys Factory
export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (filters: SubjectFilters) => [...subjectKeys.lists(), filters] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: number) => [...subjectKeys.details(), id] as const,
};

export function useSubjects(filters: SubjectFilters = {}) {
  return useQuery({
    queryKey: subjectKeys.list(filters),
    queryFn: () => subjectService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubjectData) => subjectService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: subjectKeys.lists() });
      toast.loading('Creating subject...', { id: 'create-subject' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create subject', {
        id: 'create-subject',
      });
    },
    onSuccess: (newSubject) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      toast.success(`${newSubject.name} created successfully!`, {
        id: 'create-subject',
      });
    },
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectData }) =>
      subjectService.update(id, data),
    onMutate: async () => {
      toast.loading('Updating subject...', { id: 'update-subject' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update subject', {
        id: 'update-subject',
      });
    },
    onSuccess: (updatedSubject) => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(updatedSubject.id) });
      toast.success('Subject updated successfully!', {
        id: 'update-subject',
      });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subjectService.delete(id),
    onMutate: async () => {
      toast.loading('Deleting subject...', { id: 'delete-subject' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete subject', {
        id: 'delete-subject',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      toast.success('Subject deleted successfully!', {
        id: 'delete-subject',
      });
    },
  });
}
