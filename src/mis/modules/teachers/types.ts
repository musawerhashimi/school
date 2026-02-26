import type { StaffApiResponse } from '@staff/types';

// ============================================================================
// TEACHER PROFILE TYPES
// ============================================================================

export interface TeacherProfileApiResponse {
  id: number;
  staff: number;
  staff_detail: StaffApiResponse;
  employee_code: string;
  specializations: string | null;
  teaching_experience_years: number;
  is_class_teacher: boolean;
  certifications: string | null;
  training_courses: string | null;
  average_rating: string | null;
  is_available_for_substitution: boolean;
  teaching_subjects: string[];
  assigned_classes: TeacherClassAssignment[];
  total_teaching_hours_per_week: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfileListApiResponse {
  id: number;
  staff_id: string;
  full_name: string;
  employee_code: string;
  position: string;
  department: string;
  phone: string;
  email: string | null;
  status: string;
  photo_url: string | null;
  specializations: string | null;
  teaching_experience_years: number;
  is_class_teacher: boolean;
  is_available_for_substitution: boolean;
  average_rating: string | null;
}

export interface TeacherClassAssignment {
  id: number;
  name: string;
  display_name: string;
  section: string;
  class_level: number | null;
  is_homeroom: boolean;
}

export interface TeacherScheduleSlot {
  id: number;
  day_of_week?: number;
  day_name?: string;
  period_number: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  subject: string;
  subject_code: string;
  class: string;
  class_id: number;
  room: string | null;
}

export interface TeacherScheduleApiResponse {
  teacher_id: number;
  teacher_name: string;
  total_slots: number;
  total_hours_per_week: number;
  schedule: Record<string, TeacherScheduleSlot[]>;
  weekly_schedule?: Array<{
    day_of_week: number;
    day_name: string;
    periods: TeacherScheduleSlot[];
  }>;
}

export interface TeacherStudentApiResponse {
  id: number;
  student_id: string;
  full_name: string;
  class: string | null;
  class_id: number | null;
  roll_number: string | null;
}

export interface TeacherStatsApiResponse {
  total_teachers: number;
  active_teachers: number;
  class_teachers: number;
  available_for_substitution: number;
  average_experience_years: number;
  average_rating: number;
}

// ============================================================================
// TEACHER FORM DATA TYPES
// ============================================================================

export interface TeacherProfileFormData {
  staff: number;
  employee_code?: string;
  specializations?: string;
  teaching_experience_years: number;
  is_class_teacher: boolean;
  certifications?: string;
  training_courses?: string;
  average_rating?: number;
  is_available_for_substitution: boolean;
  notes?: string;
}

export interface TeacherProfileUpdateFormData {
  employee_code?: string;
  specializations?: string;
  teaching_experience_years: number;
  is_class_teacher: boolean;
  certifications?: string;
  training_courses?: string;
  average_rating?: number;
  is_available_for_substitution: boolean;
  notes?: string;
}

// ============================================================================
// TEACHER FILTER TYPES
// ============================================================================

export interface TeacherFilters {
  search?: string;
  is_class_teacher?: boolean;
  is_available_for_substitution?: boolean;
  status?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface TeacherListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeacherProfileListApiResponse[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TEACHER_STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
] as const;

export const TEACHER_BOOLEAN_FILTERS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;
