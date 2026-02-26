/**
 * Parent Service
 * API service layer for parent-related endpoints
 */

import { apiClient } from "@/lib/api";
import type {
  ParentApiResponse,
  UpdateParentData,
  ChildSummary,
  ParentDashboardStats,
  AttendanceSummary,
  AcademicSummary,
  FeeSummary,
  ChildDetailResponse,
} from "../types";
import type { StudentApiResponse } from "../../students/types";
import type { StudentAssignment } from "../../assignment/types";

const BASE_URL = "/parents";

export const parentService = {
  // ============================================
  // Parent Profile
  // ============================================

  /**
   * Get current logged-in parent's profile
   */
  getProfile: async (): Promise<ParentApiResponse> => {
    const response = await apiClient.get<ParentApiResponse>(`${BASE_URL}/me/`);
    return response.data;
  },

  /**
   * Update current parent's profile
   */
  updateProfile: async (data: UpdateParentData): Promise<ParentApiResponse> => {
    const response = await apiClient.patch<ParentApiResponse>(`${BASE_URL}/me/`, data);
    return response.data;
  },

  // ============================================
  // Dashboard
  // ============================================

  /**
   * Get aggregated dashboard stats for parent
   */
  getDashboardStats: async (): Promise<ParentDashboardStats> => {
    const response = await apiClient.get<ParentDashboardStats>(`${BASE_URL}/me/dashboard-stats/`);
    return response.data;
  },

  // ============================================
  // Children
  // ============================================

  /**
   * Get all children of current parent
   */
  getChildren: async (): Promise<ChildSummary[]> => {
    const response = await apiClient.get<ChildSummary[]>(`${BASE_URL}/me/children/`);
    return response.data;
  },

  /**
   * Get specific child details
   */
  getChild: async (studentId: number): Promise<ChildDetailResponse> => {
    const response = await apiClient.get<ChildDetailResponse>(
      `${BASE_URL}/me/children/${studentId}/`
    );
    return response.data;
  },

  // ============================================
  // Child Attendance
  // ============================================

  /**
   * Get child's attendance records
   */
  getChildAttendance: async (
    studentId: number,
    params?: { month?: number; year?: number }
  ): Promise<AttendanceSummary> => {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append("month", String(params.month));
    if (params?.year) searchParams.append("year", String(params.year));

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/me/children/${studentId}/attendance/${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<AttendanceSummary>(url);
    return response.data;
  },

  // ============================================
  // Child Academics
  // ============================================

  /**
   * Get child's academic performance
   */
  getChildAcademics: async (
    studentId: number,
    params?: { academic_year?: string }
  ): Promise<AcademicSummary> => {
    const searchParams = new URLSearchParams();
    if (params?.academic_year) searchParams.append("academic_year", params.academic_year);

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/me/children/${studentId}/academics/${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<AcademicSummary>(url);
    return response.data;
  },

  // ============================================
  // Child Assignments
  // ============================================

  /**
   * Get child's assignments
   */
  getChildAssignments: async (
    studentId: number,
    params?: { status?: string; subject?: string }
  ): Promise<StudentAssignment[]> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.subject) searchParams.append("subject", params.subject);

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/me/children/${studentId}/assignments/${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<StudentAssignment[]>(url);
    return response.data;
  },

  // ============================================
  // Child Timetable
  // ============================================

  /**
   * Get child's class schedule/timetable
   */
  getChildTimetable: async (studentId: number): Promise<{
    class_name: string;
    section?: string;
    weekly_schedule: Array<{
      day: string;
      day_number: number;
      periods: Array<{
        period_number: number;
        subject_name: string;
        teacher_name?: string;
        room?: string;
        start_time: string;
        end_time: string;
      }>;
    }>;
  }> => {
    const response = await apiClient.get(`${BASE_URL}/me/children/${studentId}/timetable/`);
    return response.data;
  },

  // ============================================
  // Child Fees
  // ============================================

  /**
   * Get child's fee records
   */
  getChildFees: async (
    studentId: number,
    params?: { status?: string; academic_year?: string }
  ): Promise<FeeSummary> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.academic_year) searchParams.append("academic_year", params.academic_year);

    const queryString = searchParams.toString();
    const url = `${BASE_URL}/me/children/${studentId}/fees/${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get<FeeSummary>(url);
    return response.data;
  },
};

export default parentService;
