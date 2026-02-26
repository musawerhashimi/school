/**
 * Parent Module Constants
 * Query keys, status configurations, and default values
 */

import type { AttendanceStatus, FeeStatus, RelationType, StudentStatus } from "./types";

// ============================================
// Query Keys
// ============================================

export const PARENT_QUERY_KEYS = {
  all: ["parents"] as const,
  profile: () => [...PARENT_QUERY_KEYS.all, "profile"] as const,
  dashboard: () => [...PARENT_QUERY_KEYS.all, "dashboard"] as const,
  children: () => [...PARENT_QUERY_KEYS.all, "children"] as const,
  child: (id: number) => [...PARENT_QUERY_KEYS.children(), id] as const,
  childAttendance: (id: number) => [...PARENT_QUERY_KEYS.child(id), "attendance"] as const,
  childAcademics: (id: number) => [...PARENT_QUERY_KEYS.child(id), "academics"] as const,
  childAssignments: (id: number) => [...PARENT_QUERY_KEYS.child(id), "assignments"] as const,
  childTimetable: (id: number) => [...PARENT_QUERY_KEYS.child(id), "timetable"] as const,
  childFees: (id: number) => [...PARENT_QUERY_KEYS.child(id), "fees"] as const,
} as const;

// ============================================
// Stale Times (in milliseconds)
// ============================================

export const PARENT_STALE_TIMES = {
  profile: 10 * 60 * 1000, // 10 minutes
  dashboard: 2 * 60 * 1000, // 2 minutes
  children: 5 * 60 * 1000, // 5 minutes
  attendance: 5 * 60 * 1000, // 5 minutes
  academics: 5 * 60 * 1000, // 5 minutes
  assignments: 2 * 60 * 1000, // 2 minutes
  timetable: 10 * 60 * 1000, // 10 minutes
  fees: 5 * 60 * 1000, // 5 minutes
} as const;

// ============================================
// Status Configurations
// ============================================

export const STUDENT_STATUS_CONFIG: Record<
  StudentStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" | "secondary" }
> = {
  active: { label: "Active", variant: "success" },
  inactive: { label: "Inactive", variant: "warning" },
  graduated: { label: "Graduated", variant: "info" },
  transferred: { label: "Transferred", variant: "secondary" },
  suspended: { label: "Suspended", variant: "error" },
};

export const ATTENDANCE_STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; variant: "success" | "warning" | "error" | "info"; color: string }
> = {
  present: { label: "Present", variant: "success", color: "text-success" },
  absent: { label: "Absent", variant: "error", color: "text-error" },
  late: { label: "Late", variant: "warning", color: "text-warning" },
  excused: { label: "Excused", variant: "info", color: "text-info" },
};

export const FEE_STATUS_CONFIG: Record<
  FeeStatus,
  { label: string; variant: "success" | "warning" | "error" | "info" }
> = {
  paid: { label: "Paid", variant: "success" },
  unpaid: { label: "Unpaid", variant: "warning" },
  partial: { label: "Partial", variant: "info" },
  overdue: { label: "Overdue", variant: "error" },
};

export const RELATION_TYPE_CONFIG: Record<RelationType, { label: string; icon: string }> = {
  father: { label: "Father", icon: "user" },
  mother: { label: "Mother", icon: "user" },
  guardian: { label: "Guardian", icon: "users" },
  other: { label: "Other", icon: "user" },
};

// ============================================
// Color Schemes for Stats
// ============================================

export const STAT_COLORS = {
  children: {
    bg: "bg-primary/10",
    text: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  attendance: {
    bg: "bg-success/10",
    text: "text-success",
    gradient: "from-success/20 to-success/5",
  },
  score: {
    bg: "bg-info/10",
    text: "text-info",
    gradient: "from-info/20 to-info/5",
  },
  assignments: {
    bg: "bg-warning/10",
    text: "text-warning",
    gradient: "from-warning/20 to-warning/5",
  },
  fees: {
    bg: "bg-error/10",
    text: "text-error",
    gradient: "from-error/20 to-error/5",
  },
} as const;

// ============================================
// Default Values
// ============================================

export const PARENT_DEFAULTS = {
  pageSize: 10,
  attendanceMonths: 6,
  recentActivityCount: 5,
} as const;

// ============================================
// Tab Configuration
// ============================================

export const STUDENT_DETAIL_TABS = [
  { value: "overview", label: "Overview", icon: "LayoutDashboard" },
  { value: "attendance", label: "Attendance", icon: "CalendarCheck" },
  { value: "academic", label: "Academic", icon: "GraduationCap" },
  { value: "assignments", label: "Assignments", icon: "ClipboardList" },
  { value: "timetable", label: "Timetable", icon: "Calendar" },
  { value: "fees", label: "Fees", icon: "Receipt" },
] as const;

export type StudentDetailTab = (typeof STUDENT_DETAIL_TABS)[number]["value"];
