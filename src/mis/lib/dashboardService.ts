import apiClient from "./api";

// Dashboard Stats
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  pendingFees: number;
  studentsTrend?: number;
  teachersTrend?: number;
  attendanceTrend?: number;
  feesTrend?: number;
}

// Recent Notice
export interface RecentNotice {
  id: number;
  title: string;
  date: string;
  type: "exam" | "holiday" | "fee" | "general";
  description?: string;
}

// Upcoming Event
export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
}

// Recent Student
export interface RecentStudent {
  id: number;
  name: string;
  class: string;
  photo: string | null;
  status: "active" | "inactive";
  enrollmentDate: string;
}

// Dashboard Service
export const dashboardService = {
  // Get dashboard statistics
  getStats: () => apiClient.get<DashboardStats>("/mis/dashboard/stats/"),

  // Get recent notices
  getRecentNotices: (limit = 5) =>
    apiClient.get<RecentNotice[]>("/mis/notices/", { params: { limit } }),

  // Get upcoming events
  getUpcomingEvents: (limit = 5) =>
    apiClient.get<UpcomingEvent[]>("/mis/events/", { params: { limit } }),

  // Get recent students
  getRecentStudents: (limit = 5) =>
    apiClient.get<RecentStudent[]>("/mis/students/recent/", {
      params: { limit },
    }),
};

export default dashboardService;
