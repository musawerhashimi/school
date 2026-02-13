// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ShiftApiResponse {
  id: number;
  name: string;
  name_dari?: string;
  name_pashto?: string;
  shift_type: ShiftType;
  shift_type_display: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  working_days: string;
  is_active: boolean;
  description?: string;
  assigned_staff_count: number;
  created_at: string;
  updated_at: string;
}

export interface StaffSalaryApiResponse {
  id: number;
  staff: number;
  basic_salary: string;
  housing_allowance: string;
  transport_allowance: string;
  total_salary: string;
  effective_from: string;
  effective_to?: string;
  is_current: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffShiftApiResponse {
  id: number;
  staff: number;
  shift: number;
  shift_name: string;
  shift_detail: ShiftApiResponse;
  effective_from: string;
  effective_to?: string;
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StaffDocumentApiResponse {
  id: number;
  document_type: string;
  document_type_display: string;
  title: string;
  file: string;
  file_url: string;
  description?: string;
  uploaded_by: number;
  uploaded_by_name: string;
  created_at: string;
}

export interface StaffListApiResponse {
  id: number;
  staff_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  father_name: string;
  gender: 'male' | 'female';
  age: number;
  photo_url?: string;
  phone: string;
  email?: string;
  position: StaffPosition;
  position_display: string;
  department: Department;
  department_display: string;
  employment_type: EmploymentType;
  employment_type_display: string;
  status: StaffStatus;
  status_display: string;
  join_date: string;
  current_salary?: string;
  shifts: string[];
}

export interface StaffApiResponse {
  id: number;
  staff_id: string;

  // Personal Information
  first_name: string;
  last_name: string;
  full_name: string;
  father_name: string;
  grandfather_name?: string;
  date_of_birth: string;
  age: number;
  gender: 'male' | 'female';
  gender_display: string;
  nationality: string;
  marital_status?: MaritalStatus;
  marital_status_display?: string;

  // Contact
  phone: string;
  phone_secondary?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;

  // Address
  address: string;
  city: string;
  province: string;
  province_display: string;

  // National ID
  tazkira_number: string;
  tazkira_page_number?: string;
  tazkira_volume_number?: string;

  // Photo
  photo?: string;
  photo_url?: string;

  // Employment
  position: StaffPosition;
  position_display: string;
  department: Department;
  department_display: string;
  employment_type: EmploymentType;
  employment_type_display: string;
  join_date: string;
  end_date?: string;
  status: StaffStatus;
  status_display: string;

  // Qualifications
  highest_qualification?: string;
  specialization?: string;
  years_of_experience: number;

  // Work Details
  work_hours_per_week: string;

  // User Account
  user?: number;

  // Notes
  notes?: string;

  // Related Data
  current_salary_detail?: StaffSalaryApiResponse;
  salary_history: StaffSalaryApiResponse[];
  shifts: StaffShiftApiResponse[];
  documents: StaffDocumentApiResponse[];

  // System
  created_at: string;
  updated_at: string;
}

export interface PaginatedStaffResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StaffListApiResponse[];
}

export interface PaginatedShiftResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShiftApiResponse[];
}

export interface StaffStatsResponse {
  total: number;
  active: number;
  inactive: number;
  on_leave: number;
  male_count: number;
  female_count: number;
  by_position: Array<{ position: string; count: number }>;
  by_department: Array<{ department: string; count: number }>;
  by_employment_type: Array<{ employment_type: string; count: number }>;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface CreateStaffData {
  // Personal
  first_name: string;
  last_name: string;
  father_name: string;
  grandfather_name?: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  nationality?: string;
  marital_status?: MaritalStatus;

  // Contact
  phone: string;
  phone_secondary?: string;
  email?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;

  // Address
  address: string;
  city: string;
  province: string;

  // National ID
  tazkira_number: string;
  tazkira_page_number?: string;
  tazkira_volume_number?: string;

  // Employment
  position: StaffPosition;
  department: Department;
  employment_type: EmploymentType;
  join_date: string;
  end_date?: string;

  // Qualifications
  highest_qualification?: string;
  specialization?: string;
  years_of_experience?: number;

  // Work
  work_hours_per_week?: number;

  notes?: string;
}

export interface UpdateStaffData extends Partial<CreateStaffData> {
  status?: StaffStatus;
}

export interface CreateShiftData {
  name: string;
  name_dari?: string;
  name_pashto?: string;
  shift_type: ShiftType;
  start_time: string;
  end_time: string;
  working_days?: string;
  is_active?: boolean;
  description?: string;
}

export interface CreateSalaryData {
  staff?: number;
  basic_salary: number;
  housing_allowance?: number;
  transport_allowance?: number;
  effective_from: string;
  effective_to?: string;
  is_current?: boolean;
  notes?: string;
}

export interface AssignShiftData {
  staff?: number;
  shift: number;
  effective_from: string;
  effective_to?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UploadDocumentData {
  staff?: number;
  document_type: DocumentType;
  title: string;
  file: File;
  description?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface StaffFilters {
  search?: string;
  position?: StaffPosition;
  department?: Department;
  status?: StaffStatus;
  employment_type?: EmploymentType;
  gender?: 'male' | 'female';
  province?: string;
  join_date_from?: string;
  join_date_to?: string;
  has_salary?: boolean;
  shift?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface ShiftFilters {
  search?: string;
  shift_type?: ShiftType;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}

// ============================================================================
// TYPE ALIASES AND ENUMS
// ============================================================================

export type StaffPosition =
  | 'teacher'
  | 'principal'
  | 'vice_principal'
  | 'admin_staff'
  | 'librarian'
  | 'accountant'
  | 'counselor'
  | 'security'
  | 'support_staff';

export type Department =
  | 'administration'
  | 'academic'
  | 'accounts'
  | 'library'
  | 'it'
  | 'sports'
  | 'support'
  | 'other';

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'temporary';

export type StaffStatus =
  | 'active'
  | 'inactive'
  | 'on_leave'
  | 'suspended'
  | 'terminated'
  | 'resigned';

export type MaritalStatus =
  | 'single'
  | 'married'
  | 'divorced'
  | 'widowed';

export type ShiftType =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'custom';

export type DocumentType =
  | 'tazkira'
  | 'resume'
  | 'degree_certificate'
  | 'teaching_license'
  | 'experience_letter'
  | 'appointment_letter'
  | 'contract'
  | 'medical_certificate'
  | 'police_clearance'
  | 'photo'
  | 'other';

// ============================================================================
// CONSTANTS
// ============================================================================

export const STAFF_POSITIONS: Array<{ value: StaffPosition; label: string }> = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'principal', label: 'Principal' },
  { value: 'vice_principal', label: 'Vice Principal' },
  { value: 'admin_staff', label: 'Administrative Staff' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'counselor', label: 'Counselor' },
  { value: 'security', label: 'Security' },
  { value: 'support_staff', label: 'Support Staff' },
];

export const DEPARTMENTS: Array<{ value: Department; label: string }> = [
  { value: 'administration', label: 'Administration' },
  { value: 'academic', label: 'Academic / Teaching' },
  { value: 'accounts', label: 'Accounts / Finance' },
  { value: 'library', label: 'Library' },
  { value: 'it', label: 'IT / Computer' },
  { value: 'sports', label: 'Sports / Physical Education' },
  { value: 'support', label: 'Support Staff' },
  { value: 'other', label: 'Other' },
];

export const EMPLOYMENT_TYPES: Array<{ value: EmploymentType; label: string }> = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
];

export const STAFF_STATUSES: Array<{ value: StaffStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'terminated', label: 'Terminated' },
  { value: 'resigned', label: 'Resigned' },
];

export const MARITAL_STATUSES: Array<{ value: MaritalStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

export const SHIFT_TYPES: Array<{ value: ShiftType; label: string }> = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'custom', label: 'Custom' },
];

export const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: 'tazkira', label: 'Tazkira (National ID)' },
  { value: 'resume', label: 'Resume / CV' },
  { value: 'degree_certificate', label: 'Degree Certificate' },
  { value: 'teaching_license', label: 'Teaching License' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'appointment_letter', label: 'Appointment Letter' },
  { value: 'contract', label: 'Employment Contract' },
  { value: 'medical_certificate', label: 'Medical Certificate' },
  { value: 'police_clearance', label: 'Police Clearance' },
  { value: 'photo', label: 'Passport Photo' },
  { value: 'other', label: 'Other' },
];
