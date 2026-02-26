/**
 * Parent Module Types
 * TypeScript interfaces for parent-related data structures
 */

import type { StudentApiResponse } from "../students/types";

// ============================================
// Parent Types
// ============================================

export type RelationType = "father" | "mother" | "guardian" | "other";

export interface ParentApiResponse {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  phone_secondary?: string;
  address?: string;
  occupation?: string;
  national_id?: string;
  photo_url?: string;
  relation_type: RelationType;
  relation_type_display: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateParentData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_secondary?: string;
  email?: string;
  address?: string;
  occupation?: string;
}

// ============================================
// Child/Student Summary Types
// ============================================

export type StudentStatus = "active" | "inactive" | "graduated" | "transferred" | "suspended";

export interface ChildSummary {
  id: number;
  student_id: string;
  full_name: string;
  photo_url?: string;
  class_name: string;
  section?: string;
  roll_number?: string;
  status: StudentStatus;
  status_display: string;
  attendance_percentage: number;
  average_score: number;
  pending_assignments: number;
  unpaid_fees: number;
}

// ============================================
// Dashboard Types
// ============================================

export interface ParentDashboardStats {
  total_children: number;
  children: ChildSummary[];
  overall_attendance: number;
  overall_average_score: number;
  total_pending_assignments: number;
  total_unpaid_fees: number;
}

// ============================================
// Attendance Types
// ============================================

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: number;
  date: string;
  status: AttendanceStatus;
  status_display: string;
  remarks?: string;
  subject?: string;
}

export interface AttendanceSummary {
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_percentage: number;
  records: AttendanceRecord[];
  monthly_summary?: MonthlyAttendance[];
}

export interface MonthlyAttendance {
  month: string;
  year: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  total_days: number;
  percentage: number;
}

// ============================================
// Fee Types
// ============================================

export type FeeStatus = "paid" | "unpaid" | "partial" | "overdue";

export interface FeeRecord {
  id: number;
  fee_type: string;
  description?: string;
  amount: number;
  paid_amount: number;
  due_date: string;
  paid_date?: string;
  status: FeeStatus;
  status_display: string;
  receipt_number?: string;
}

export interface FeeSummary {
  total_fees: number;
  paid_amount: number;
  pending_amount: number;
  overdue_amount: number;
  records: FeeRecord[];
}

// ============================================
// Academic Types (for child view)
// ============================================

export interface SubjectGrade {
  subject: string;
  teacher: string;
  midterm: {
    homework: number;
    classActivity: number;
    exam: number;
    total: number;
  };
  annual: {
    homework: number;
    classActivity: number;
    exam: number;
    total: number;
  };
  total: number;
  grade: string;
  percentage: number;
}

export interface AcademicSummary {
  academic_year: string;
  class_name: string;
  section?: string;
  gpa: number;
  pending_tasks: number;
  average_percentage: number;
  rank?: number;
  total_students?: number;
  grades: SubjectGrade[];
}

// ============================================
// Extended Student Type for Parent View
// ============================================

export interface ChildDetailResponse extends StudentApiResponse {
  attendance_summary?: AttendanceSummary;
  academic_summary?: AcademicSummary;
  fee_summary?: FeeSummary;
}
