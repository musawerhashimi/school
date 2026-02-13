/**
 * Assignment Module Types
 * Type definitions for the assignment management system
 */

// ============================================================================
// Enums and Type Aliases
// ============================================================================

/**
 * Assignment status in its lifecycle
 */
export type AssignmentStatus = 'draft' | 'published' | 'closed' | 'graded';

/**
 * Type of assignment
 */
export type AssignmentType =
  | 'homework'
  | 'project'
  | 'essay'
  | 'lab_report'
  | 'quiz'
  | 'presentation'
  | 'other';

/**
 * Status of a student's submission
 */
export type SubmissionStatus =
  | 'pending'
  | 'submitted'
  | 'late'
  | 'graded'
  | 'returned';

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Assignment attachment
 */
export interface AssignmentAttachment {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

/**
 * Submission file
 */
export interface SubmissionFile {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
}

/**
 * Main assignment API response
 */
export interface AssignmentApiResponse {
  id: number;
  title: string;
  description: string;
  instructions: string | null;

  // Type info
  assignment_type: AssignmentType;
  assignment_type_display: string;

  // Relationships
  class_instance: number;
  class_instance_name: string;
  subject: number;
  subject_name: string;
  subject_code: string;
  teacher: number;
  teacher_name: string;

  // Dates
  assigned_date: string;
  due_date: string;
  close_date: string | null;

  // Scoring
  max_score: number;
  pass_percentage: number;
  weight_percentage: number;

  // Status
  status: AssignmentStatus;
  status_display: string;
  is_active: boolean;
  allow_late_submission: boolean;
  late_penalty_percentage: number;

  // Statistics
  total_students: number;
  submitted_count: number;
  graded_count: number;
  pending_count: number;
  late_count: number;
  average_score: number | null;
  highest_score: number | null;
  lowest_score: number | null;
  submission_rate: number;

  // Attachments
  attachments: AssignmentAttachment[];

  // Metadata
  created_at: string;
  updated_at: string;
  created_by: number | null;
  created_by_name: string | null;
}

/**
 * Simplified assignment for list views
 */
export interface AssignmentListItem {
  id: number;
  title: string;
  assignment_type: AssignmentType;
  assignment_type_display: string;
  class_instance: number;
  class_instance_name: string;
  subject_name: string;
  subject_code: string;
  teacher_name: string;
  assigned_date: string;
  due_date: string;
  max_score: number;
  status: AssignmentStatus;
  status_display: string;
  submitted_count: number;
  graded_count: number;
  total_students: number;
  submission_rate: number;
}

/**
 * Assignment submission response
 */
export interface AssignmentSubmissionApiResponse {
  id: number;
  assignment: number;
  assignment_title: string;

  // Student info
  student: number;
  student_name: string;
  student_id_number: string;
  student_photo: string | null;
  roll_number: string | null;

  // Submission details
  submitted_at: string | null;
  status: SubmissionStatus;
  status_display: string;
  is_late: boolean;
  days_late: number | null;
  content: string | null;
  attachment: string | null;

  // Scoring
  score: number | null;
  max_score: number;
  percentage: number | null;
  grade_letter: string | null;
  is_pass: boolean | null;

  // Late penalty applied
  late_penalty: number | null;
  final_score: number | null;

  // Feedback
  feedback: string | null;
  private_notes: string | null;
  graded_by: number | null;
  graded_by_name: string | null;
  graded_at: string | null;

  // Files
  submission_files: SubmissionFile[];

  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Student's assignment view (for student profile)
 */
export interface StudentAssignment {
  id: number;
  title: string;
  description: string | null;
  subject: number;
  subject_name: string;
  assignment_type: AssignmentType;
  assignment_type_display: string;
  assigned_date: string;
  due_date: string;
  max_score: number;
  pass_percentage: number;
  // Assignment status (draft, published, closed, graded)
  status: AssignmentStatus;
  status_display: string;
  is_past_due: boolean;
  days_until_due: number;
  // Student's submission info
  submission_status: SubmissionStatus;
  submission_status_display: string;
  submitted_at: string | null;
  score: number | null;
  percentage: number | null;
  grade_letter: string | null;
  feedback: string | null;
  submission_content: string | null;
  submission_attachment: string | null;
  is_late: boolean;
}

/**
 * Student assignment statistics
 */
export interface StudentAssignmentStats {
  student_id: number;
  student_name: string;
  total_assignments: number;
  submitted_count: number;
  pending_count: number;
  graded_count: number;
  late_count: number;
  on_time_count: number;
  average_score: number | null;
  average_percentage: number | null;
  on_time_rate: number;
  submission_rate: number;
  pass_rate: number;
  // By subject breakdown
  by_subject: SubjectAssignmentStats[];
}

/**
 * Assignment stats per subject
 */
export interface SubjectAssignmentStats {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  total: number;
  submitted: number;
  graded: number;
  average_score: number | null;
}

/**
 * Class assignment statistics (for teacher view)
 */
export interface ClassAssignmentStats {
  class_id: number;
  class_name: string;
  total_assignments: number;
  completed_assignments: number;
  overall_submission_rate: number;
  overall_average_score: number | null;
  // By status
  draft_assignments: number;
  published_assignments: number;
  closed_count: number;
  graded_assignments: number;
}


/**
 * Class with assignment info (for list view)
 */
export interface ClassWithAssignments {
  id: number;
  display_name: string;
  academic_year_display: string;
  class_level_number: number;
  section: string;
  shift_display: string;
  enrolled_count: number;
  class_teacher_name: string | null;
  is_active: boolean;
  // Assignment stats
  total_assignments: number;
  active_assignments: number;
  pending_submissions: number;
  average_score: number | null;
}

// ============================================================================
// Request/Input Types
// ============================================================================

/**
 * Create assignment input
 */
export interface CreateAssignmentInput {
  title: string;
  description?: string;
  instructions?: string;
  assignment_type: AssignmentType;
  class_instance: number;
  subject: number;
  teacher: number;
  assigned_date: string;
  due_date: string;
  close_date?: string;
  max_score: number;
  pass_percentage?: number;
  weight_percentage?: number;
  status?: AssignmentStatus;
  allow_late_submission?: boolean;
  late_penalty_percentage?: number;
}

/**
 * Update assignment input
 */
export interface UpdateAssignmentInput extends Partial<CreateAssignmentInput> {
  id: number;
}

/**
 * Grade submission input
 */
export interface GradeSubmissionInput {
  score: number;
  feedback?: string;
  private_notes?: string;
}

/**
 * Bulk grade input
 */
export interface BulkGradeInput {
  submission_id: number;
  score: number;
  feedback?: string;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Assignment list filters
 */
export interface AssignmentFilters {
  class_instance?: number;
  subject?: number;
  teacher?: number;
  status?: AssignmentStatus;
  assignment_type?: AssignmentType;
  due_date_after?: string;
  due_date_before?: string;
  assigned_date_after?: string;
  assigned_date_before?: string;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/**
 * Submission filters
 */
export interface SubmissionFilters {
  status?: SubmissionStatus;
  is_late?: boolean;
  is_graded?: boolean;
  search?: string;
  ordering?: string;
}

// ============================================================================
// Paginated Response
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
