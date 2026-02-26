/**
 * CMS About Hooks
 * React Query hooks for About page / Team content management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cmsAboutService } from "../services/cmsAboutService";
import type {
  Department,
  DepartmentInput,
  TeamMember,
  TeamMemberInput,
  TeamMemberDetails,
} from "../types";

// ============================================================================
// Query Keys
// ============================================================================

export const CMS_ABOUT_QUERY_KEYS = {
  departments: ["cms", "about", "departments"] as const,
  department: (id: number) => ["cms", "about", "departments", id] as const,
  teamMembers: ["cms", "about", "teamMembers"] as const,
  teamMember: (id: number) => ["cms", "about", "teamMembers", id] as const,
};

// ============================================================================
// Department Hooks
// ============================================================================

/**
 * Fetch all departments
 */
export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: CMS_ABOUT_QUERY_KEYS.departments,
    queryFn: () => cmsAboutService.departments.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single department by ID
 */
export function useDepartment(id: number) {
  return useQuery<Department>({
    queryKey: CMS_ABOUT_QUERY_KEYS.department(id),
    queryFn: () => cmsAboutService.departments.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new department
 */
export function useCreateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DepartmentInput) =>
      cmsAboutService.departments.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.departments,
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create department: ${error.message}`);
    },
  });
}

/**
 * Update an existing department
 */
export function useUpdateDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: DepartmentInput }) =>
      cmsAboutService.departments.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.departments,
      });
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.department(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update department: ${error.message}`);
    },
  });
}

/**
 * Delete a department
 */
export function useDeleteDepartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cmsAboutService.departments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.departments,
      });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete department: ${error.message}`);
    },
  });
}

// ============================================================================
// Team Member Hooks
// ============================================================================

/**
 * Fetch all team members
 */
export function useTeamMembers() {
  return useQuery<TeamMember[]>({
    queryKey: CMS_ABOUT_QUERY_KEYS.teamMembers,
    queryFn: () => cmsAboutService.teamMembers.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single team member by ID
 */
export function useTeamMemberDetail(id: number) {
  return useQuery<TeamMemberDetails>({
    queryKey: CMS_ABOUT_QUERY_KEYS.teamMember(id),
    queryFn: () => cmsAboutService.teamMembers.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new team member
 */
export function useCreateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TeamMemberInput) =>
      cmsAboutService.teamMembers.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.teamMembers,
      });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create team member: ${error.message}`);
    },
  });
}

/**
 * Update an existing team member
 */
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TeamMemberInput }) =>
      cmsAboutService.teamMembers.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.teamMembers,
      });
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.teamMember(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update team member: ${error.message}`);
    },
  });
}

/**
 * Delete a team member
 */
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cmsAboutService.teamMembers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CMS_ABOUT_QUERY_KEYS.teamMembers,
      });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      toast.success("Team member deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete team member: ${error.message}`);
    },
  });
}
