// ============================================================================
// API Response Types (from Django backend)
// ============================================================================

export interface GuardianApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  relation_type: GuardianRelationType;
  phone: string;
  phone_secondary?: string;
  email?: string;
  occupation?: string;
  address?: string;
  national_id?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentDocumentApiResponse {
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

// New interfaces for commitment form fields
export interface TazkiraDetails {
  page_number?: string;
  volume_number?: string;
  registration_number?: string;
  birth_date_on_tazkira?: string;
  age_on_tazkira?: number;
}

export interface LocationDetails {
  province: string;
  district?: string;
  area?: string;
}

export interface HealthExamination {
  hiv_test?: HealthTestResult;
  hcv_test?: HealthTestResult;
  hbs_test?: HealthTestResult;
  blood_group?: BloodGroup;
  test_date?: string;
}


export interface StudentApiResponse {
  id: number;
  student_id: string;

  // Personal Information
  first_name: string;
  last_name: string;
  full_name: string;
  father_name: string;
  grandfather_name?: string;
  date_of_birth: string;
  age: number;
  gender: "male" | "female";
  gender_display: string;
  nationality: string;
  religion?: string;
  blood_group?: BloodGroup;
  national_id?: string;
  photo?: string;
  photo_url?: string;

  // Personal Information - Extended (from commitment form)
  nickname?: string;
  current_age?: number;
  recent_photo?: string;
  recent_photo_url?: string;

  // Tazkira Details
  tazkira_details?: TazkiraDetails;

  // Location Information
  original_residence?: LocationDetails;
  current_residence?: LocationDetails;

  // Contact Information
  address: string;
  city: string;
  province: string;
  province_display: string;
  phone?: string;
  email?: string;

  // Academic Information
  current_class?: number;
  class_name?: string;
  section?: string;
  roll_number?: string;
  admission_date: string;
  admission_number?: string;
  education_level: EducationLevel;
  education_level_display: string;
  status: StudentStatus;
  status_display: string;

  // Academic Information - Enhanced (with academic module integration)
  academic_year?: number;
  academic_year_display?: string;
  class_instance?: number; // Link to ClassInstanceApiResponse
  class_instance_display?: string;
  shift?: ShiftType;
  shift_display?: string;
  enrollment_type?: EnrollmentType;
  enrollment_type_display?: string;

  // Guardian Information
  primary_guardian?: GuardianApiResponse;
  secondary_guardian?: GuardianApiResponse;

  // Parent/Guardian - Extended (from commitment form)
  parent_occupation?: string;
  family_contact_numbers?: string[]; // Multiple phone numbers
  telegram_contact?: string;
  relationship_to_student?: RelationshipType;
  relationship_to_student_display?: string;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;

  // Health Information
  medical_conditions?: string;
  allergies?: string;
  medications?: string;

  // Health Examination (from commitment form)
  health_examination?: HealthExamination;

  // Commitment
  commitment_accepted?: boolean;
  commitment_date?: string;
  commitment_form_generated?: boolean;

  // Previous Education
  previous_school?: string;
  previous_class?: string;
  transfer_certificate_number?: string;

  // Documents
  documents?: StudentDocumentApiResponse[];

  // System
  created_at: string;
  updated_at: string;
}

export interface StudentListApiResponse {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  father_name: string;
  gender: "male" | "female";
  gender_display: string;
  age: number;
  class_name?: string;
  roll_number?: string;
  status: StudentStatus;
  status_display: string;
  photo_url?: string;
  primary_guardian_name?: string;
  primary_guardian_phone?: string;
  admission_date: string;
  section: string;
  education_level: EducationLevel;
  education_level_display: string;
}

export interface PaginatedStudentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentListApiResponse[];
}

export interface StudentStatsResponse {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  transferred: number;
  male_count: number;
  female_count: number;
  by_class: Array<{ current_class__name: string; count: number }>;
  by_status: Array<{ status: string; count: number }>;
  by_education_level: Array<{ education_level: string; count: number }>;
}

// ============================================================================
// Form Data Types (for creating/updating students)
// ============================================================================

export interface CreateGuardianData {
  first_name: string;
  last_name: string;
  relation_type: string;
  phone: string;
  phone_secondary?: string;
  email?: string;
  occupation?: string;
  address?: string;
  national_id?: string;
}

export interface CreateStudentData {
  // Personal Information
  first_name: string;
  last_name: string;
  father_name: string;
  grandfather_name?: string;
  date_of_birth: string;
  gender: "male" | "female";
  nationality?: string;
  religion?: string;
  blood_group?: string;
  national_id?: string;

  // Contact Information
  address: string;
  city: string;
  province: string;
  phone?: string;
  email?: string;

  // Academic Information
  current_class?: number;
  roll_number?: string;
  admission_date: string;
  admission_number?: string;
  education_level: string;
  status?: StudentStatus;

  // Guardian Information
  primary_guardian?: CreateGuardianData;
  primary_guardian_id?: number;
  secondary_guardian?: CreateGuardianData;
  secondary_guardian_id?: number | null;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;

  // Health Information
  medical_conditions?: string;
  allergies?: string;
  medications?: string;

  // Health Examination
  hiv_test?: HealthTestResult;
  hcv_test?: HealthTestResult;
  hbs_test?: HealthTestResult;
  health_test_date?: string;

  // Previous Education
  previous_school?: string;
  previous_class?: string;
  transfer_certificate_number?: string;
}

export interface UpdateStudentData {
  // Personal Information
  first_name?: string;
  last_name?: string;
  father_name?: string;
  grandfather_name?: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  nationality?: string;
  religion?: string;
  blood_group?: string;
  national_id?: string;

  // Contact Information
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;

  // Academic Information
  current_class?: number;
  roll_number?: string;
  admission_date?: string;
  admission_number?: string;
  education_level?: string;
  status?: StudentStatus;

  // Guardian Information
  primary_guardian?: CreateGuardianData;
  primary_guardian_id?: number;
  secondary_guardian?: CreateGuardianData;
  secondary_guardian_id?: number | null;

  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;

  // Health Information
  medical_conditions?: string;
  allergies?: string;
  medications?: string;

  // Health Examination
  hiv_test?: HealthTestResult;
  hcv_test?: HealthTestResult;
  hbs_test?: HealthTestResult;
  health_test_date?: string;

  // Previous Education
  previous_school?: string;
  previous_class?: string;
  transfer_certificate_number?: string;

  // Commitment
  commitment_accepted?: boolean;
}

// ============================================================================
// Filter Types
// ============================================================================

export interface StudentFilters {
  status?: string;
  gender?: string;
  education_level?: string;
  province?: string;
  class_id?: number;
  section?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  admission_date_from?: string;
  admission_date_to?: string;
  age_min?: number;
  age_max?: number;
}

// ============================================================================
// Type Aliases and Enums
// ============================================================================

export type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "transferred"
  | "suspended"
  | "expelled"
  | "withdrawn";

export type EducationLevel = "primary" | "lower_secondary" | "upper_secondary";

export type GuardianRelationType =
  | "father"
  | "mother"
  | "guardian"
  | "uncle"
  | "aunt"
  | "grandfather"
  | "grandmother"
  | "brother"
  | "sister"
  | "other";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

// New types for commitment form fields
export type EnrollmentType = "fresh" | "transfer" | "readmission";

export type RelationshipType =
  | "brother"
  | "paternal_uncle" // کاکا (Pashto) / عمو (Dari)
  | "maternal_uncle" // ماما (Pashto) / خالو (Dari)
  | "cousin"
  | "other_relative";

export type ShiftType = "morning" | "afternoon" | "evening";

export type HealthTestResult = "positive" | "negative" | "not_tested";

// Afghan Provinces
export type AfghanProvince =
  | "kabul"
  | "balkh"
  | "herat"
  | "kandahar"
  | "nangarhar"
  | "kunduz"
  | "baghlan"
  | "takhar"
  | "badakhshan"
  | "ghazni"
  | "paktia"
  | "paktika"
  | "khost"
  | "logar"
  | "wardak"
  | "kapisa"
  | "parwan"
  | "panjshir"
  | "bamyan"
  | "daykundi"
  | "ghor"
  | "faryab"
  | "jawzjan"
  | "sar_e_pol"
  | "samangan"
  | "helmand"
  | "farah"
  | "nimroz"
  | "uruzgan"
  | "zabul"
  | "kunar"
  | "laghman"
  | "nuristan"
  | "badghis";

// ============================================================================
// Legacy Types (for backwards compatibility with existing components)
// ============================================================================


export interface StudentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  dateOfBirth: Date | null;
  gender: string;
  nationality: string;
  religion?: string;
  bloodGroup?: string;
  photo?: File | null;

  // Contact Information
  address: string;
  city: string;
  province: string;
  phone?: string;
  email?: string;

  // Academic Information
  classId: string;
  section: string;
  rollNumber: string;
  admissionDate: Date | null;

  // Parent/Guardian Information
  parentName: string;
  parentRelation: string;
  parentContact: string;
  parentEmail?: string;
  parentOccupation?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Health Information
  medicalConditions?: string;
  allergies?: string;

  // Previous Education
  previousSchool?: string;
  previousClass?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
  maleCount: number;
  femaleCount: number;
  byClass: { className: string; count: number }[];
}

// ============================================================================
// Integration Types (for other modules)
// ============================================================================

export interface StudentAttendanceSummary {
  studentId: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  percentage: number;
  eligibleForExam: boolean;
}

export interface StudentFeesSummary {
  studentId: string;
  totalFees: number;
  paidFees: number;
  pendingFees: number;
  lastPaymentDate?: string;
}

export interface StudentGradesSummary {
  studentId: string;
  term: string;
  subjects: {
    subjectName: string;
    marks: number;
    totalMarks: number;
    grade: string;
  }[];
  overallPercentage: number;
  overallGrade: string;
  rank?: number;
}

// ============================================================================
// Academic Performance Types
// ============================================================================

export interface SubjectGrade {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  teacher: string | null;
  activity_marks: number;
  assignment_marks: number;
  exam_marks: number;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade_letter: string;
  is_pass: boolean;
}

export interface ExamGrades {
  exam_id: number | null;
  exam_name: string | null;
  exam_type: string;
  subjects: SubjectGrade[];
  overall_percentage: number;
  overall_grade: string;
}

export interface AcademicHistory {
  academic_year: string;
  class_name: string;
  report_card_id: number | null;
  overall_percentage: number;
  overall_grade: string;
  rank_in_class: number | null;
  total_students: number | null;
  subjects_passed: number;
  subjects_failed: number;
  total_subjects: number;
  promotion_status: string | null;
}

export interface PerformanceMetrics {
  gpa: number;
  cumulative_average: number;
  years_completed: number;
  total_subjects_taken: number;
  all_time_pass_rate: number;
}

export interface CurrentGrades {
  academic_year_id: number;
  academic_year: string;
  midterm: ExamGrades | null;
  annual: ExamGrades | null;
  combined_average: number;
}

export interface StudentAcademicPerformanceResponse {
  student_id: string;
  student_name: string;
  student_photo: string | null;
  current_class: {
    id: number | null;
    name: string;
    academic_year: string | null;
  };
  current_grades: CurrentGrades;
  academic_history: AcademicHistory[];
  performance_metrics: PerformanceMetrics;
}
