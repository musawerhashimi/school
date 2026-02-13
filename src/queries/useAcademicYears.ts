import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  academicYearService,
  type AcademicYear,
  type CreateAcademicYearData,
  type UpdateAcademicYearData,
} from "@/lib/academicYearService";
import { extractAxiosError } from "@/utils/extractError";

// Query Keys
export const academicYearKeys = {
  all: ["academic-years"] as const,
  lists: () => [...academicYearKeys.all, "list"] as const,
  list: () => [...academicYearKeys.lists()] as const,
  details: () => [...academicYearKeys.all, "detail"] as const,
  detail: (id: number) => [...academicYearKeys.details(), id] as const,
};

// Get all academic years
export const useAcademicYears = () => {
  return useQuery<AcademicYear[]>({
    queryKey: academicYearKeys.list(),
    queryFn: () => academicYearService.getAcademicYears().then((res) => res.data),
  });
};

// Get single academic year
export const useAcademicYear = (id: number, options?: { enabled?: boolean }) => {
  return useQuery<AcademicYear>({
    queryKey: academicYearKeys.detail(id),
    queryFn: () => academicYearService.getAcademicYear(id).then((res) => res.data),
    ...options,
  });
};

// Create academic year
export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAcademicYearData) =>
      academicYearService.createAcademicYear(data).then((res) => res.data),
    onSuccess: () => {
      toast.success("Academic year created successfully");
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error, "Failed to create academic year"));
    },
  });
};

// Update academic year
export const useUpdateAcademicYear = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAcademicYearData) =>
      academicYearService.updateAcademicYear(id, data).then((res) => res.data),
    onSuccess: () => {
      toast.success("Academic year updated successfully");
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
      queryClient.invalidateQueries({ queryKey: academicYearKeys.detail(id) });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error, "Failed to update academic year"));
    },
  });
};

// Delete academic year
export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => academicYearService.deleteAcademicYear(id),
    onSuccess: () => {
      toast.success("Academic year deleted successfully");
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error, "Failed to delete academic year"));
    },
  });
};

// Set active academic year
export const useSetActiveAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => academicYearService.setActiveYear(id),
    onSuccess: () => {
      toast.success("Active academic year updated successfully");
      queryClient.invalidateQueries({ queryKey: academicYearKeys.lists() });
    },
    onError: (error) => {
      toast.error(extractAxiosError(error, "Failed to set active academic year"));
    },
  });
};
