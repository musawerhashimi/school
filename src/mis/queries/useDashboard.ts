import { useQuery } from "@tanstack/react-query";
import {
  dashboardService,
  type DashboardStats,
  type RecentNotice,
  type UpcomingEvent,
  type RecentStudent,
} from "@/mis/lib/dashboardService";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  notices: () => [...dashboardKeys.all, "notices"] as const,
  events: () => [...dashboardKeys.all, "events"] as const,
  recentStudents: () => [...dashboardKeys.all, "recent-students"] as const,
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardService.getStats().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Recent Notices Hook
export const useRecentNotices = (limit = 5) => {
  return useQuery<RecentNotice[]>({
    queryKey: [...dashboardKeys.notices(), limit],
    queryFn: () => dashboardService.getRecentNotices(limit).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Upcoming Events Hook
export const useUpcomingEvents = (limit = 5) => {
  return useQuery<UpcomingEvent[]>({
    queryKey: [...dashboardKeys.events(), limit],
    queryFn: () => dashboardService.getUpcomingEvents(limit).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Recent Students Hook
export const useRecentStudents = (limit = 5) => {
  return useQuery<RecentStudent[]>({
    queryKey: [...dashboardKeys.recentStudents(), limit],
    queryFn: () => dashboardService.getRecentStudents(limit).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
