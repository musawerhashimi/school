import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/staffService';
import type {
  StaffApiResponse,
  CreateStaffData,
  UpdateStaffData,
  StaffFilters,
  CreateSalaryData,
  AssignShiftData,
} from '../types';
import { toast } from 'react-hot-toast';

// Query Keys Factory
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffFilters) => [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: number) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
  salaryHistory: (staffId: number) => [...staffKeys.all, 'salary', staffId] as const,
  shifts: (staffId: number) => [...staffKeys.all, 'shifts', staffId] as const,
  documents: (staffId: number) => [...staffKeys.all, 'documents', staffId] as const,
  attendance: (staffId: number) => [...staffKeys.all, 'attendance', staffId] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Hook to fetch all staff with optional filters and pagination
 */
export function useStaff(filters: StaffFilters = {}) {
  return useQuery({
    queryKey: staffKeys.list(filters),
    queryFn: () => staffService.getAll(filters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single staff member by ID
 */
export function useStaffDetail(id: number) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffService.getById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch staff statistics
 */
export function useStaffStats() {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: () => staffService.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch salary history for a staff member
 */
export function useSalaryHistory(staffId: number) {
  return useQuery({
    queryKey: staffKeys.salaryHistory(staffId),
    queryFn: () => staffService.getSalaryHistory(staffId),
    enabled: !!staffId && staffId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch shifts assigned to a staff member
 */
export function useStaffShifts(staffId: number) {
  return useQuery({
    queryKey: staffKeys.shifts(staffId),
    queryFn: () => staffService.getShifts(staffId),
    enabled: !!staffId && staffId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch documents for a staff member
 */
export function useStaffDocuments(staffId: number) {
  return useQuery({
    queryKey: staffKeys.documents(staffId),
    queryFn: () => staffService.getDocuments(staffId),
    enabled: !!staffId && staffId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch attendance summary for a staff member
 */
export function useStaffAttendance(
  staffId: number,
  params?: { month?: string; year?: string }
) {
  return useQuery({
    queryKey: [...staffKeys.attendance(staffId), params],
    queryFn: () => staffService.getAttendanceSummary(staffId, params),
    enabled: !!staffId && staffId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Hook to create a new staff member
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffData) => staffService.create(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: staffKeys.lists() });
      toast.loading('Creating staff member...', { id: 'create-staff' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create staff member', {
        id: 'create-staff',
      });
    },
    onSuccess: (newStaff) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
      toast.success(`Staff member ${newStaff.full_name} created successfully!`, {
        id: 'create-staff',
      });
    },
  });
}

/**
 * Hook to update a staff member
 */
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStaffData }) =>
      staffService.update(id, data),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: staffKeys.detail(id) });
      toast.loading('Updating staff member...', { id: 'update-staff' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff member', {
        id: 'update-staff',
      });
    },
    onSuccess: (updatedStaff, { id }) => {
      queryClient.setQueryData(staffKeys.detail(id), updatedStaff);
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
      toast.success(`Staff member ${updatedStaff.full_name} updated successfully!`, {
        id: 'update-staff',
      });
    },
  });
}

/**
 * Hook to delete a staff member
 */
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => staffService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: staffKeys.lists() });
      const staff = queryClient.getQueryData<StaffApiResponse>(staffKeys.detail(id));
      toast.loading('Deleting staff member...', { id: 'delete-staff' });
      return { staffName: staff?.full_name };
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete staff member', {
        id: 'delete-staff',
      });
    },
    onSuccess: (_, id, context) => {
      queryClient.removeQueries({ queryKey: staffKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
      toast.success(
        context?.staffName
          ? `Staff member ${context.staffName} deleted successfully!`
          : 'Staff member deleted successfully!',
        { id: 'delete-staff' }
      );
    },
  });
}

/**
 * Hook to upload staff photo
 */
export function useUploadStaffPhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, photo }: { id: number; photo: File }) =>
      staffService.uploadPhoto(id, photo),
    onMutate: () => {
      toast.loading('Uploading photo...', { id: 'upload-photo' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload photo', { id: 'upload-photo' });
    },
    onSuccess: (updatedStaff, { id }) => {
      queryClient.setQueryData(staffKeys.detail(id), updatedStaff);
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast.success('Photo uploaded successfully!', { id: 'upload-photo' });
    },
  });
}

/**
 * Hook to set/update salary
 */
export function useSetSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: number; data: CreateSalaryData }) =>
      staffService.setSalary(staffId, data),
    onMutate: () => {
      toast.loading('Setting salary...', { id: 'set-salary' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to set salary', { id: 'set-salary' });
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.salaryHistory(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      toast.success('Salary set successfully!', { id: 'set-salary' });
    },
  });
}

/**
 * Hook to assign shift
 */
export function useAssignShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, data }: { staffId: number; data: AssignShiftData }) =>
      staffService.assignShift(staffId, data),
    onMutate: () => {
      toast.loading('Assigning shift...', { id: 'assign-shift' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to assign shift', { id: 'assign-shift' });
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.shifts(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      toast.success('Shift assigned successfully!', { id: 'assign-shift' });
    },
  });
}

/**
 * Hook to upload document
 */
export function useUploadStaffDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: number;
      data: {
        document_type: string;
        title: string;
        file: File;
        description?: string;
      };
    }) => staffService.uploadDocument(staffId, data),
    onMutate: () => {
      toast.loading('Uploading document...', { id: 'upload-document' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload document', {
        id: 'upload-document',
      });
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.documents(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      toast.success('Document uploaded successfully!', { id: 'upload-document' });
    },
  });
}

/**
 * Hook to delete document
 */
export function useDeleteStaffDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ staffId, documentId }: { staffId: number; documentId: number }) =>
      staffService.deleteDocument(staffId, documentId),
    onMutate: () => {
      toast.loading('Deleting document...', { id: 'delete-document' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete document', {
        id: 'delete-document',
      });
    },
    onSuccess: (_, { staffId }) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.documents(staffId) });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
      toast.success('Document deleted successfully!', { id: 'delete-document' });
    },
  });
}
