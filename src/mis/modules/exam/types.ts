// ============================================================================
// EXAM MODULE TYPES
// ============================================================================

import type {
  AcademicYearApiResponse,
  ClassLevelApiResponse,
  ClassInstanceApiResponse,
  SubjectApiResponse,
  PaginatedResponse,
  ClassInstanceStudent,
} from "../academic/types";

// Re-export for convenience
export type { ClassInstanceStudent };

// ============================================================================
// EXAM TYPES
// ============================================================================

export type ExamType = "midterm" | "final";
export type ExamStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ExamApiResponse {
  id: number;
  name: string;
  display_name: string;
  exam_type: ExamType;
  exam_type_display: string;
  academic_year: number;
  academic_year_display: string;
  start_date: string;
  end_date: string;
  status: ExamStatus;
  status_display: string;

  // Marks configuration
  total_marks: number;
  pass_percentage: number;
  pass_marks: number;

  // Statistics
  scheduled_count: number;
  completed_count: number;
  grade_count: number;

  // Metadata
  is_upcoming: boolean;
  is_ongoing: boolean;
  is_past: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExamDetailApiResponse extends ExamApiResponse {
  academic_year_detail?: AcademicYearApiResponse;
  class_levels?: number[];
  class_levels_detail?: ClassLevelApiResponse[];
  class_instances?: number[];
  class_instances_detail?: ClassInstanceApiResponse[];
  description?: string;
  notes?: string;
}

export interface CreateExamData {
  name: string;
  exam_type: ExamType;
  academic_year: number;
  class_levels?: number[];
  class_instances?: number[];
  start_date: string;
  end_date: string;
  total_marks?: number;
  pass_percentage?: number;
  status?: ExamStatus;
  description?: string;
  notes?: string;
}

export type UpdateExamData = Partial<CreateExamData>;

export interface ExamFilters {
  academic_year?: number;
  exam_type?: ExamType;
  status?: ExamStatus;
  class_level?: number;
  class_instance?: number;
  start_date_after?: string;
  start_date_before?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedExamsResponse = PaginatedResponse<ExamApiResponse>;

// ============================================================================
// SCORE TYPES
// ============================================================================

export interface ScoreBreakdown {
  homework: number;
  class_activity: number;
  exam: number;
  total: number;
}

export interface ScoreMaxMarks {
  homework: number;
  class_activity: number;
  exam: number;
  total: number;
}

export interface ScoreApiResponse {
  id: number;
  grade_id: number;
  exam: number;
  exam_type: ExamType;
  student: number;
  student_name: string;
  subject: number;
  subject_name: string;

  // Score breakdown
  homework_marks: number;
  homework_total: number;
  activity_marks: number;
  activity_total: number;
  exam_marks: number;
  exam_total: number;

  // Calculated
  total_marks: number;
  total_possible: number;
  percentage: number;

  created_at: string;
  updated_at: string;
}

export interface CreateScoreData {
  grade_id: number;
  homework_marks: number;
  activity_marks: number;
  exam_marks: number;
}

export type UpdateScoreData = Partial<CreateScoreData>;

export interface BulkScoreEntry {
  student_id: number;
  homework_marks: number;
  activity_marks: number;
  exam_marks: number;
}

export interface BulkScoreCreateData {
  exam: number;
  subject: number;
  class_instance: number;
  scores: BulkScoreEntry[];
}

export interface BulkScoreCreateResponse {
  created_count: number;
  updated_count: number;
  total: number;
}

export interface ScoreFilters {
  exam?: number;
  student?: number;
  subject?: number;
  class_instance?: number;
  grade_id?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

export type PaginatedScoresResponse = PaginatedResponse<ScoreApiResponse>;

// ============================================================================
// GRADE TYPES
// ============================================================================

export type GradeLetter =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D"
  | "F";

export interface GradeApiResponse {
  id: number;
  exam: number;
  exam_name: string;
  exam_type: ExamType;
  student: number;
  student_name: string;
  student_id_number: string;
  subject: number;
  subject_name: string;
  subject_code: string;
  class_instance: number;
  class_instance_name: string;

  // Score breakdown marks (from backend GradeListSerializer)
  activity_marks: number;
  assignment_marks: number;
  exam_marks: number;

  // Calculated marks
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade_letter: GradeLetter;

  // Status
  is_pass: boolean;
  is_absent: boolean;

  // Score breakdown object (if available)
  score_breakdown?: ScoreBreakdown;

  remarks?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GradeDetailApiResponse extends GradeApiResponse {
  subject_detail?: SubjectApiResponse;
  exam_detail?: ExamApiResponse;
  score_detail?: ScoreApiResponse;
  graded_by?: number;
  graded_by_name?: string;
  graded_at?: string;
}

export interface CreateGradeData {
  exam: number;
  student: number;
  subject: number;
  class_instance: number;
  marks_obtained: number;
  total_marks: number;
  is_absent?: boolean;
  remarks?: string;
}

export interface BulkGradeEntry {
  student_id: number;
  marks_obtained: number;
  is_absent?: boolean;
  remarks?: string;
  // Score breakdown (optional)
  homework_marks?: number;
  activity_marks?: number;
  exam_marks?: number;
}

export interface BulkGradeCreateData {
  exam: number;
  subject: number;
  class_instance: number;
  total_marks: number;
  grades: BulkGradeEntry[];
}

export interface BulkGradeCreateResponse {
  created_count: number;
  updated_count: number;
  total: number;
}

export interface GradeFilters {
  exam?: number;
  student?: number;
  subject?: number;
  class_instance?: number;
  is_pass?: boolean;
  is_absent?: boolean;
  grade_letter?: GradeLetter;
  academic_year?: number;
  exam_type?: ExamType;
  percentage_min?: number;
  percentage_max?: number;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedGradesResponse = PaginatedResponse<GradeApiResponse>;

// Grades by class response (grouped by subject)
export interface GradesByClassSubject {
  subject_name: string;
  subject_code: string;
  subject_id: number;
  total_marks: number;
  grades: GradeApiResponse[];
}

export interface GradesByClassResponse {
  exam_id: number;
  class_instance_id: number;
  subjects: GradesByClassSubject[];
}

// Student transcript
export interface StudentTranscriptExam {
  exam_name: string;
  exam_type: string;
  exam_id: number;
  start_date: string;
  grades: GradeApiResponse[];
}

export interface StudentTranscriptResponse {
  student_id: number;
  exams: StudentTranscriptExam[];
}

// ============================================================================
// EXAM SCHEDULE TYPES
// ============================================================================

export interface ExamScheduleApiResponse {
  id: number;
  exam: number;
  exam_name: string;
  exam_type: ExamType;
  class_instance: number;
  class_instance_name: string;
  subject: number;
  subject_name: string;
  subject_code: string;

  // Schedule details
  exam_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;

  // Location
  room?: number;
  room_number?: string;
  room_name?: string;

  // Invigilators
  invigilators?: number[];
  invigilator_names?: string[];

  // Status
  is_completed: boolean;
  notes?: string;

  created_at: string;
  updated_at: string;
}

// Note: ExamScheduleDetailApiResponse is defined below with full teacher/room details

export interface CreateExamScheduleData {
  exam: number;
  class_instance: number;
  subject: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  room?: number;
  invigilators?: number[];
  notes?: string;
}

export type UpdateExamScheduleData = Partial<CreateExamScheduleData>;

export interface ExamScheduleFilters {
  exam?: number;
  class_instance?: number;
  subject?: number;
  room?: number;
  exam_date?: string;
  exam_date_after?: string;
  exam_date_before?: string;
  is_completed?: boolean;
  academic_year?: number;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedExamSchedulesResponse =
  PaginatedResponse<ExamScheduleApiResponse>;

// Calendar view types
export interface ExamScheduleCalendarDay {
  date: string;
  schedules: ExamScheduleApiResponse[];
}

export interface ExamScheduleCalendarResponse {
  start_date: string;
  end_date: string;
  days: ExamScheduleCalendarDay[];
}

// Conflict check
export interface ExamScheduleConflict {
  type: "room" | "class" | "teacher" | "student";
  message: string;
  conflicting_schedule_id?: number;
}

export interface ExamScheduleConflictCheckResponse {
  has_conflicts: boolean;
  conflicts: ExamScheduleConflict[];
}

// ============================================================================
// EXAM STATISTICS TYPES
// ============================================================================

export interface ExamSubjectSummary {
  subject_name: string;
  subject_code: string;
  subject_id: number;
  total_students: number;
  passed: number;
  failed: number;
  absent: number;
  avg_marks: number;
  highest_marks: number;
  lowest_marks: number;
  pass_rate: number;
}

export interface ExamClassSummary {
  class_name: string;
  class_id: number;
  total_students: number;
  subjects: ExamSubjectSummary[];
  overall_pass_rate: number;
  overall_avg_marks: number;
}

export interface ExamGradesSummaryResponse {
  exam_name: string;
  exam_id: number;
  exam_type: ExamType;
  total_grades: number;
  total_students: number;
  overall_pass_rate: number;
  overall_avg_marks: number;
  class_summaries: ExamClassSummary[];
}

export interface ExamStatisticsResponse {
  exam_id: number;
  exam_name: string;
  exam_type: ExamType;
  total_schedules: number;
  completed_schedules: number;
  total_grades: number;
  total_students: number;
  pass_count: number;
  fail_count: number;
  absent_count: number;
  pass_rate: number;
  average_percentage: number;
  grade_distribution: Record<GradeLetter, number>;
}

// ============================================================================
// QUESTION BANK TYPES (Optional)
// ============================================================================

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "essay"
  | "fill_blank";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuestionApiResponse {
  id: number;
  question_text: string;
  question_type: QuestionType;
  question_type_display: string;
  difficulty: DifficultyLevel;
  difficulty_display: string;
  subject: number;
  subject_name: string;
  class_level: number;
  class_level_name: string;

  // For multiple choice
  options?: QuestionOption[];
  correct_answer?: string | number;

  // Marks
  marks: number;

  // Metadata
  tags?: string[];
  is_active: boolean;
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateQuestionData {
  question_text: string;
  question_type: QuestionType;
  difficulty: DifficultyLevel;
  subject: number;
  class_level: number;
  options?: Omit<QuestionOption, "id">[];
  correct_answer?: string | number;
  marks: number;
  tags?: string[];
  is_active?: boolean;
}

export type UpdateQuestionData = Partial<CreateQuestionData>;

export interface QuestionFilters {
  subject?: number;
  class_level?: number;
  question_type?: QuestionType;
  difficulty?: DifficultyLevel;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  page?: number;
  page_size?: number;
}

export type PaginatedQuestionsResponse = PaginatedResponse<QuestionApiResponse>;

export interface ExamQuestionLink {
  id: number;
  exam: number;
  question: number;
  question_detail?: QuestionApiResponse;
  order: number;
  marks_override?: number;
}

export interface CreateExamQuestionLinkData {
  exam: number;
  question: number;
  order?: number;
  marks_override?: number;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface ExamCardProps {
  exam: ExamApiResponse;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export interface ScoreBreakdownProps {
  examType: ExamType;
  homework: number;
  activity: number;
  exam: number;
  readonly?: boolean;
  onChange?: (breakdown: ScoreBreakdown) => void;
  errors?: {
    homework?: string;
    activity?: string;
    exam?: string;
  };
}

export interface GradeEntryTableProps {
  students: ClassInstanceStudent[];
  existingGrades?: GradeApiResponse[];
  examType: ExamType;
  totalMarks: number;
  passPercentage: number;
  onSave: (grades: BulkGradeEntry[]) => void;
  isLoading?: boolean;
}

export interface ExamScheduleCalendarProps {
  schedules: ExamScheduleApiResponse[];
  view: "day" | "week" | "month";
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  onScheduleClick?: (schedule: ExamScheduleApiResponse) => void;
  onAddSchedule?: (date: Date) => void;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface GradeEntryRow {
  studentId: number;
  studentIdNumber: string;
  studentName: string;
  marksObtained: string;
  isAbsent: boolean;
  remarks: string;
  existingGradeId?: number;
  // Score breakdown
  homeworkMarks: string;
  activityMarks: string;
  examMarks: string;
}

export interface ScoreEntryRow {
  studentId: number;
  studentIdNumber: string;
  studentName: string;
  homeworkMarks: string;
  activityMarks: string;
  examMarks: string;
  totalMarks: number;
  existingScoreId?: number;
}

export interface ConflictCheckData {
  exam: number;
  class_instance: number;
  subject: number;
  exam_date: string;
  start_time: string;
  end_time: string;
  room?: number;
  schedule_id?: number; // For checking existing schedule conflicts
}

// ============================================================================
// CLASS EXAM TYPES (Class-centric exam views)
// ============================================================================

/**
 * Class with exam information - used for the class exam list
 */
export interface ClassExamInfo {
  id: number;
  name: string;
  display_name: string;
  academic_year: number;
  academic_year_display: string;
  class_level: number;
  class_level_name: string;
  class_level_number: number;
  section: string;
  shift: string;
  shift_display: string;
  physical_classroom?: number;
  room_number?: string;
  class_teacher?: number;
  class_teacher_name?: string;
  capacity: number;
  enrolled_count: number;

  // Exam info
  midterm_exam?: ExamApiResponse;
  final_exam?: ExamApiResponse;
  schedule_count: number;
  grades_entered_count: number;

  is_active: boolean;
}

/**
 * Exam schedule grid day - a single day in the schedule grid
 */
export interface ExamScheduleGridDay {
  exam_date: string;
  day_of_week: number;
  day_name: string;
  slots: ExamScheduleDetailApiResponse[];
}

/**
 * Exam schedule grid response - the full schedule grid for a class
 */
export interface ExamScheduleGridResponse {
  exam_id: number | null;
  exam_type: ExamType;
  exam_name: string | null;
  class_instance_id: number;
  class_name: string;
  start_date: string | null;
  end_date: string | null;
  days: ExamScheduleGridDay[];
  max_slots_per_day: number;
}

/**
 * Student score entry - a single student's score for a subject
 */
export interface ClassSubjectScore {
  student_id: number;
  student_name: string;
  student_id_number: string;
  activity_marks: number;
  assignment_marks: number;
  exam_marks: number;
  total: number;
  percentage: number | null;
  grade_letter: GradeLetter | null;
  is_pass: boolean | null;
  is_absent: boolean;
  grade_id: number | null;
  remarks: string;
}

/**
 * Score max marks based on exam type
 */
export interface ExamMaxMarks {
  activity: number;
  assignment: number;
  exam: number;
  total: number;
}

/**
 * Class subject scores response - scores for all students in a class for one subject
 */
export interface ClassSubjectScoresResponse {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  exam_id: number;
  exam_type: ExamType;
  max_marks: ExamMaxMarks;
  scores: ClassSubjectScore[];
}

/**
 * Subject performance for student report
 */
export interface SubjectPerformance {
  subject: string;
  teacher: string;
  midterm: {
    activity: number;
    assignment: number;
    exam: number;
    total: number;
  };
  final: {
    activity: number;
    assignment: number;
    exam: number;
    total: number;
  };
  total: number;
  grade: GradeLetter;
  percentage: number;
}

/**
 * Student exam report - GPA and subject performance for a student
 */
export interface StudentExamReport {
  student_id: number;
  student_name: string;
  student_id_number: string;
  student_photo: string | null;
  class_name: string;
  gpa: number;
  average_score: number;
  total_subjects: number;
  subjects: SubjectPerformance[];
}

/**
 * Simple student info for class students list
 */
export interface ClassStudent {
  id: number;
  student_id: string;
  full_name: string;
  photo_url: string | null;
  gender: string;
}

/**
 * Class exams response - midterm and final exams for a class
 */
export interface ClassExamsResponse {
  midterm: ExamApiResponse | null;
  final: ExamApiResponse | null;
}

/**
 * Bulk score save input
 */
export interface BulkScoreSaveInput {
  student_id: number;
  activity_marks: number;
  assignment_marks: number;
  exam_marks: number;
  is_absent?: boolean;
  remarks?: string;
}

/**
 * Bulk score save response
 */
export interface BulkScoreSaveResponse {
  message: string;
  created_count: number;
  updated_count: number;
}

/**
 * Extended exam schedule detail with teacher and invigilator info
 * Matches backend ExamScheduleListSerializer/ExamScheduleDetailSerializer output
 */
export interface ExamScheduleDetailApiResponse extends ExamScheduleApiResponse {
  exam_detail?: ExamApiResponse;
  class_instance_detail?: ClassInstanceApiResponse;
  subject_detail?: SubjectApiResponse;

  // Room - backend returns room_detail from PhysicalClassroomListSerializer
  room_detail?: {
    id: number;
    room_number: string;
    room_name?: string;
    capacity?: number;
    building?: string;
    floor?: string;
    room_type?: string;
    is_available?: boolean;
  };

  // Teacher - backend returns teacher_detail from TeacherProfileListSerializer
  // TeacherProfileListSerializer flattens staff.full_name to full_name
  teacher?: number;
  teacher_detail?: {
    id: number;
    full_name: string;
    staff_id?: string;
    employee_code?: string;
    position?: string;
    department?: string;
  };

  // Invigilators - same serializer structure
  invigilators_detail?: Array<{
    id: number;
    full_name: string;
    staff_id?: string;
    employee_code?: string;
  }>;

  // Time/status fields
  day_of_week: number;
  day_name: string;
  is_upcoming: boolean;
  is_ongoing: boolean;
  is_past: boolean;
}

export { type PaginatedResponse };
