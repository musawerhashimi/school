import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftService } from '../services/shiftService';
import type { ShiftApiResponse, CreateShiftData, ShiftFilters } from '../types';
import { toast } from 'react-hot-toast';

// Query Keys Factory
export const shiftKeys = {
  all: ['shifts'] as const,
  lists: () => [...shiftKeys.all, 'list'] as const,
  list: (filters: ShiftFilters) => [...shiftKeys.lists(), filters] as const,
  details: () => [...shiftKeys.all, 'detail'] as const,
  detail: (id: number) => [...shiftKeys.details(), id] as const,
  assignedStaff: (shiftId: number) => [...shiftKeys.all, 'assigned', shiftId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch all shifts with optional filters and pagination
 */
export function useShifts(filters: ShiftFilters = {}) {
  return useQuery({
    queryKey: shiftKeys.list(filters),
    queryFn: () => shiftService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single shift by ID
 */
export function useShift(id: number) {
  return useQuery({
    queryKey: shiftKeys.detail(id),
    queryFn: () => shiftService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch staff assigned to a shift
 */
export function useShiftAssignedStaff(shiftId: number) {
  return useQuery({
    queryKey: shiftKeys.assignedStaff(shiftId),
    queryFn: () => shiftService.getAssignedStaff(shiftId),
    enabled: !!shiftId && shiftId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new shift
 */
export function useCreateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShiftData) => shiftService.create(data),
    onMutate: () => {
      toast.loading('Creating shift...', { id: 'create-shift' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create shift', { id: 'create-shift' });
    },
    onSuccess: (newShift) => {
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      toast.success(`Shift ${newShift.name} created successfully!`, {
        id: 'create-shift',
      });
    },
  });
}

/**
 * Hook to update a shift
 */
export function useUpdateShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateShiftData> }) =>
      shiftService.update(id, data),
    onMutate: () => {
      toast.loading('Updating shift...', { id: 'update-shift' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update shift', { id: 'update-shift' });
    },
    onSuccess: (updatedShift, { id }) => {
      queryClient.setQueryData(shiftKeys.detail(id), updatedShift);
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      toast.success(`Shift ${updatedShift.name} updated successfully!`, {
        id: 'update-shift',
      });
    },
  });
}

/**
 * Hook to delete a shift
 */
export function useDeleteShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shiftService.delete(id),
    onMutate: async (id) => {
      const shift = queryClient.getQueryData<ShiftApiResponse>(shiftKeys.detail(id));
      toast.loading('Deleting shift...', { id: 'delete-shift' });
      return { shiftName: shift?.name };
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete shift', { id: 'delete-shift' });
    },
    onSuccess: (_, id, context) => {
      queryClient.removeQueries({ queryKey: shiftKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: shiftKeys.lists() });
      toast.success(
        context?.shiftName
          ? `Shift ${context.shiftName} deleted successfully!`
          : 'Shift deleted successfully!',
        { id: 'delete-shift' }
      );
    },
  });
}
