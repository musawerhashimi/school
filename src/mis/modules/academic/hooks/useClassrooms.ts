import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { classroomService } from '../services/classroomService';
import type {
  CreatePhysicalClassroomData,
  UpdatePhysicalClassroomData,
  PhysicalClassroomFilters,
} from '../types';

// Query Keys Factory
export const classroomKeys = {
  all: ['classrooms'] as const,
  lists: () => [...classroomKeys.all, 'list'] as const,
  list: (filters: PhysicalClassroomFilters) => [...classroomKeys.lists(), filters] as const,
  details: () => [...classroomKeys.all, 'detail'] as const,
  detail: (id: number) => [...classroomKeys.details(), id] as const,
  available: () => [...classroomKeys.all, 'available'] as const,
};

export function useClassrooms(filters: PhysicalClassroomFilters = {}) {
  return useQuery({
    queryKey: classroomKeys.list(filters),
    queryFn: () => classroomService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useClassroom(id: number) {
  return useQuery({
    queryKey: classroomKeys.detail(id),
    queryFn: () => classroomService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAvailableClassrooms() {
  return useQuery({
    queryKey: classroomKeys.available(),
    queryFn: () => classroomService.getAvailable(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePhysicalClassroomData) => classroomService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: classroomKeys.lists() });
      toast.loading('Creating classroom...', { id: 'create-classroom' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create classroom', {
        id: 'create-classroom',
      });
    },
    onSuccess: (newClassroom) => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classroomKeys.available() });
      toast.success(`${newClassroom.room_name} created successfully!`, {
        id: 'create-classroom',
      });
    },
  });
}

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePhysicalClassroomData }) =>
      classroomService.update(id, data),
    onMutate: async () => {
      toast.loading('Updating classroom...', { id: 'update-classroom' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update classroom', {
        id: 'update-classroom',
      });
    },
    onSuccess: (updatedClassroom) => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classroomKeys.detail(updatedClassroom.id) });
      queryClient.invalidateQueries({ queryKey: classroomKeys.available() });
      toast.success('Classroom updated successfully!', {
        id: 'update-classroom',
      });
    },
  });
}

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => classroomService.delete(id),
    onMutate: async () => {
      toast.loading('Deleting classroom...', { id: 'delete-classroom' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete classroom', {
        id: 'delete-classroom',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classroomKeys.lists() });
      queryClient.invalidateQueries({ queryKey: classroomKeys.available() });
      toast.success('Classroom deleted successfully!', {
        id: 'delete-classroom',
      });
    },
  });
}
