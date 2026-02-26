/**
 * Parent Hooks
 * React Query hooks for parent-related data fetching and mutations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { parentService } from "../services/parentService";
import { PARENT_QUERY_KEYS, PARENT_STALE_TIMES } from "../constants";
import type { UpdateParentData } from "../types";

// ============================================
// Parent Profile Hooks
// ============================================

/**
 * Get current parent's profile
 */
export function useParentProfile() {
  return useQuery({
    queryKey: PARENT_QUERY_KEYS.profile(),
    queryFn: () => parentService.getProfile(),
    staleTime: PARENT_STALE_TIMES.profile,
  });
}

/**
 * Update parent profile
 */
export function useUpdateParentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateParentData) => parentService.updateProfile(data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: PARENT_QUERY_KEYS.profile() });
      toast.loading("Updating profile...", { id: "update-profile" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile", { id: "update-profile" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARENT_QUERY_KEYS.profile() });
      toast.success("Profile updated successfully!", { id: "update-profile" });
    },
  });
}

// ============================================
// Dashboard Hook
// ============================================

/**
 * Get parent dashboard stats with children summaries
 */
export function useParentDashboard() {
  return useQuery({
    queryKey: PARENT_QUERY_KEYS.dashboard(),
    queryFn: () => parentService.getDashboardStats(),
    staleTime: PARENT_STALE_TIMES.dashboard,
  });
}

// ============================================
// Children Hooks
// ============================================

/**
 * Get all children of current parent
 */
export function useChildren() {
  return useQuery({
    queryKey: PARENT_QUERY_KEYS.children(),
    queryFn: () => parentService.getChildren(),
    staleTime: PARENT_STALE_TIMES.children,
  });
}

/**
 * Get specific child details
 */
export function useChild(studentId: number) {
  return useQuery({
    queryKey: PARENT_QUERY_KEYS.child(studentId),
    queryFn: () => parentService.getChild(studentId),
    staleTime: PARENT_STALE_TIMES.children,
    enabled: !!studentId && studentId > 0,
  });
}

// ============================================
// Child Data Hooks
// ============================================

/**
 * Get child's attendance records
 */
export function useChildAttendance(
  studentId: number,
  params?: { month?: number; year?: number }
) {
  return useQuery({
    queryKey: [...PARENT_QUERY_KEYS.childAttendance(studentId), params],
    queryFn: () => parentService.getChildAttendance(studentId, params),
    staleTime: PARENT_STALE_TIMES.attendance,
    enabled: !!studentId && studentId > 0,
  });
}

/**
 * Get child's academic performance
 */
export function useChildAcademics(
  studentId: number,
  params?: { academic_year?: string }
) {
  return useQuery({
    queryKey: [...PARENT_QUERY_KEYS.childAcademics(studentId), params],
    queryFn: () => parentService.getChildAcademics(studentId, params),
    staleTime: PARENT_STALE_TIMES.academics,
    enabled: !!studentId && studentId > 0,
  });
}

/**
 * Get child's assignments
 */
export function useChildAssignments(
  studentId: number,
  params?: { status?: string; subject?: string }
) {
  return useQuery({
    queryKey: [...PARENT_QUERY_KEYS.childAssignments(studentId), params],
    queryFn: () => parentService.getChildAssignments(studentId, params),
    staleTime: PARENT_STALE_TIMES.assignments,
    enabled: !!studentId && studentId > 0,
  });
}

/**
 * Get child's timetable
 */
export function useChildTimetable(studentId: number) {
  return useQuery({
    queryKey: PARENT_QUERY_KEYS.childTimetable(studentId),
    queryFn: () => parentService.getChildTimetable(studentId),
    staleTime: PARENT_STALE_TIMES.timetable,
    enabled: !!studentId && studentId > 0,
  });
}

/**
 * Get child's fee records
 */
export function useChildFees(
  studentId: number,
  params?: { status?: string; academic_year?: string }
) {
  return useQuery({
    queryKey: [...PARENT_QUERY_KEYS.childFees(studentId), params],
    queryFn: () => parentService.getChildFees(studentId, params),
    staleTime: PARENT_STALE_TIMES.fees,
    enabled: !!studentId && studentId > 0,
  });
}

// ============================================
// Prefetch Hooks
// ============================================

/**
 * Prefetch child data for faster navigation
 */
export function usePrefetchChild() {
  const queryClient = useQueryClient();

  return (studentId: number) => {
    // Prefetch child details
    queryClient.prefetchQuery({
      queryKey: PARENT_QUERY_KEYS.child(studentId),
      queryFn: () => parentService.getChild(studentId),
      staleTime: PARENT_STALE_TIMES.children,
    });

    // Prefetch attendance
    queryClient.prefetchQuery({
      queryKey: PARENT_QUERY_KEYS.childAttendance(studentId),
      queryFn: () => parentService.getChildAttendance(studentId),
      staleTime: PARENT_STALE_TIMES.attendance,
    });

    // Prefetch assignments
    queryClient.prefetchQuery({
      queryKey: PARENT_QUERY_KEYS.childAssignments(studentId),
      queryFn: () => parentService.getChildAssignments(studentId),
      staleTime: PARENT_STALE_TIMES.assignments,
    });
  };
}
