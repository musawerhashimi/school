// ============================================================================
// ACADEMIC YEAR TYPES
// ============================================================================

export interface AcademicYearApiResponse {
  id: number;
  year: number;
  year_gregorian: number;
  display_name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  is_active: boolean;
  is_ongoing: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAcademicYearData {
  year: number;
  year_gregorian: number;
  start_date: string;
  end_date: string;
  is_current?: boolean;
  is_active?: boolean;
  description?: string;
}

export interface UpdateAcademicYearData {
  year?: number;
  year_gregorian?: number;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  is_active?: boolean;
  description?: string;
}

export interface AcademicYearFilters {
  year_min?: number;
  year_max?: number;
  is_current?: boolean;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// CLASS LEVEL TYPES
// ============================================================================

export type ClassLevelCategory = 'primary' | 'lower_secondary' | 'upper_secondary';

export interface ClassLevelApiResponse {
  id: number;
  level: number;
  name: string;
  name_dari?: string;
  name_pashto?: string;
  category: ClassLevelCategory;
  category_display: string;
  description?: string;
  moe_code?: string;
  minimum_age?: number;
  subjects_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClassLevelData {
  level: number;
  name: string;
  name_dari?: string;
  name_pashto?: string;
  category: ClassLevelCategory;
  description?: string;
  moe_code?: string;
  minimum_age?: number;
}

export interface UpdateClassLevelData {
  level?: number;
  name?: string;
  name_dari?: string;
  name_pashto?: string;
  category?: ClassLevelCategory;
  description?: string;
  moe_code?: string;
  minimum_age?: number;
}

export interface ClassLevelFilters {
  category?: ClassLevelCategory;
  level_min?: number;
  level_max?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// PHYSICAL CLASSROOM TYPES
// ============================================================================

export type RoomType = 'classroom' | 'lab' | 'computer_lab' | 'library' | 'hall' | 'outdoor' | 'workshop';

export interface PhysicalClassroomApiResponse {
  id: number;
  room_number: string;
  room_name: string;
  room_type: RoomType;
  room_type_display: string;
  building?: string;
  floor?: number;
  capacity: number;
  facilities?: string;
  is_available: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePhysicalClassroomData {
  room_number: string;
  room_name: string;
  room_type: RoomType;
  building?: string;
  floor?: number;
  capacity: number;
  facilities?: string;
  is_available?: boolean;
  notes?: string;
}

export interface UpdatePhysicalClassroomData {
  room_number?: string;
  room_name?: string;
  room_type?: RoomType;
  building?: string;
  floor?: number;
  capacity?: number;
  facilities?: string;
  is_available?: boolean;
  notes?: string;
}

export interface PhysicalClassroomFilters {
  room_type?: RoomType;
  is_available?: boolean;
  capacity_min?: number;
  capacity_max?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// SUBJECT TYPES
// ============================================================================

export type SubjectType = 'core' | 'elective' | 'religious' | 'language' | 'science' | 'arts' | 'practical';

export interface SubjectApiResponse {
  id: number;
  name: string;
  name_dari?: string;
  name_pashto?: string;
  code: string;
  subject_type: SubjectType;
  subject_type_display: string;
  class_levels: number[];
  class_levels_display: string[];
  class_levels_detail?: ClassLevelApiResponse[];
  total_marks: number;
  pass_marks: number;
  credit_hours: number;
  moe_code?: string;
  description?: string;
  syllabus?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSubjectData {
  name: string;
  name_dari?: string;
  name_pashto?: string;
  code: string;
  subject_type: SubjectType;
  class_levels: number[];
  total_marks: number;
  pass_marks: number;
  credit_hours: number;
  moe_code?: string;
  description?: string;
  syllabus?: string;
  is_active?: boolean;
}

export interface UpdateSubjectData {
  name?: string;
  name_dari?: string;
  name_pashto?: string;
  code?: string;
  subject_type?: SubjectType;
  class_levels?: number[];
  total_marks?: number;
  pass_marks?: number;
  credit_hours?: number;
  moe_code?: string;
  description?: string;
  syllabus?: string;
  is_active?: boolean;
}

export interface SubjectFilters {
  subject_type?: SubjectType;
  class_level?: number;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type PaginatedAcademicYearsResponse = PaginatedResponse<AcademicYearApiResponse>;
export type PaginatedClassLevelsResponse = PaginatedResponse<ClassLevelApiResponse>;
export type PaginatedPhysicalClassroomsResponse = PaginatedResponse<PhysicalClassroomApiResponse>;
export type PaginatedSubjectsResponse = PaginatedResponse<SubjectApiResponse>;

// ============================================================================
// CLASS INSTANCE TYPES
// ============================================================================

export type ShiftType = 'morning' | 'afternoon' | 'evening';
export type GenderSegregationType = 'mixed' | 'male_only' | 'female_only';

export interface ClassInstanceApiResponse {
  id: number;
  name: string;
  display_name: string;
  academic_year: number;
  academic_year_display: string;
  academic_year_detail?: AcademicYearApiResponse;
  class_level: number;
  class_level_name: string;
  class_level_number: number;
  class_level_detail?: ClassLevelApiResponse;
  physical_classroom?: number;
  room_number?: string;
  room_name?: string;
  physical_classroom_detail?: PhysicalClassroomApiResponse;
  section: string;
  shift: ShiftType;
  shift_display: string;
  gender_segregation: GenderSegregationType;
  gender_segregation_display: string;
  class_teacher?: number;
  class_teacher_name?: string;
  capacity: number;
  enrolled_count: number;
  available_seats: number;
  is_full: boolean;
  enrollment_percentage: number;
  is_active: boolean;
  description?: string;
  notes?: string;
  subjects?: SubjectApiResponse[];
  created_at: string;
  updated_at: string;
}

export interface CreateClassInstanceData {
  name?: string;
  academic_year: number;
  class_level: number;
  physical_classroom?: number;
  section: string;
  shift: ShiftType;
  gender_segregation: GenderSegregationType;
  class_teacher?: number;
  capacity: number;
  is_active?: boolean;
  description?: string;
  notes?: string;
}

export interface UpdateClassInstanceData {
  name?: string;
  academic_year?: number;
  class_level?: number;
  physical_classroom?: number;
  section?: string;
  shift?: ShiftType;
  gender_segregation?: GenderSegregationType;
  class_teacher?: number;
  capacity?: number;
  is_active?: boolean;
  description?: string;
  notes?: string;
}

export interface ClassInstanceFilters {
  academic_year?: number;
  academic_year_hijri?: number;
  class_level?: number;
  class_level_number?: number;
  physical_classroom?: number;
  section?: string;
  shift?: ShiftType;
  gender_segregation?: GenderSegregationType;
  class_teacher?: number;
  is_active?: boolean;
  has_capacity?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedClassInstancesResponse = PaginatedResponse<ClassInstanceApiResponse>;

// Class Instance Students Response
export interface ClassInstanceStudent {
  id: number;
  student_id: string;
  full_name: string;
  photo_url?: string;
  gender: string;
  roll_number?: string;
  status: string;
}

export interface ClassInstanceStudentsResponse {
  class_name: string;
  enrolled_count: number;
  capacity: number;
  available_seats: number;
  students: ClassInstanceStudent[];
}

// Class Instance Stats
export interface ClassInstanceStats {
  total_classes: number;
  total_capacity: number;
  total_enrolled: number;
  available_seats: number;
  enrollment_percentage: number;
  by_shift: Record<string, { display: string; count: number }>;
  by_level: Record<number, {
    name: string;
    count: number;
    total_capacity: number;
    total_enrolled: number;
  }>;
}

// Current Year Classes Response
export interface CurrentYearClassesResponse {
  academic_year: string;
  count: number;
  results: ClassInstanceApiResponse[];
}

// By Level Response
export interface ClassesByLevelItem {
  level: number;
  level_name: string;
  classes: ClassInstanceApiResponse[];
}

export type ClassesByLevelResponse = ClassesByLevelItem[];

// ============================================================================
// SCHEDULE TYPES
// ============================================================================

// Days of week (Afghan week starts Saturday)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5;

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Saturday',
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
};

export interface ScheduleApiResponse {
  id: number;
  class_instance: number;
  class_instance_name: string;
  subject: number;
  subject_name: string;
  subject_code: string;
  teacher_profile?: number;
  teacher_name?: string;
  room?: number;
  room_number?: string;
  room_name?: string;
  day_of_week: DayOfWeek;
  day_name: string;
  period_number: number;
  duration_minutes: number;
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleDetailApiResponse extends ScheduleApiResponse {
  class_instance_detail?: ClassInstanceApiResponse;
  subject_detail?: SubjectApiResponse;
  room_detail?: PhysicalClassroomApiResponse;
  effective_room?: {
    id: number;
    room_number: string;
    room_name: string;
  };
}

export interface CreateScheduleData {
  class_instance: number;
  subject: number;
  teacher_profile?: number | null;
  room?: number;
  day_of_week: DayOfWeek;
  period_number: number;
  is_active?: boolean;
  notes?: string;
}

export interface UpdateScheduleData {
  class_instance?: number;
  subject?: number;
  teacher_profile?: number | null;
  room?: number;
  day_of_week?: DayOfWeek;
  period_number?: number;
  is_active?: boolean;
  notes?: string;
}

export interface ScheduleFilters {
  class_instance?: number;
  subject?: number;
  teacher?: number;
  room?: number;
  day_of_week?: DayOfWeek;
  period_number?: number;
  period_min?: number;
  period_max?: number;
  academic_year?: number;
  class_level?: number;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedSchedulesResponse = PaginatedResponse<ScheduleApiResponse>;

// Weekly Schedule Response
export interface DaySchedule {
  day_of_week: DayOfWeek;
  day_name: string;
  periods: ScheduleApiResponse[];
}

export interface WeeklyScheduleResponse {
  class_instance: number;
  class_name: string;
  academic_year?: string;
  weekly_schedule: DaySchedule[];
  total_periods?: number;
}

// Class Instance Schedule Response (from class-instance endpoint)
export interface ClassScheduleResponse {
  class_name: string;
  class_id: number;
  weekly_schedule: DaySchedule[];
  total_periods: number;
}

// Teacher Schedule Response
export interface TeacherScheduleResponse {
  teacher_id: number;
  weekly_schedule: DaySchedule[];
  total_periods: number;
}

// Room Schedule Response
export interface RoomScheduleResponse {
  room_id: number;
  room_number: string;
  room_name: string;
  weekly_schedule: DaySchedule[];
  total_periods: number;
}

// Conflict Check Response
export interface ConflictCheckResponse {
  has_conflicts: boolean;
  conflicts: string[];
}

// Available Periods Response
export interface AvailablePeriodsResponse {
  class_instance: number;
  day_of_week: DayOfWeek;
  scheduled_periods: number[];
  available_periods: number[];
}

// Bulk Create Response
export interface BulkScheduleCreateResponse {
  created_count: number;
  schedules: ScheduleApiResponse[];
  warnings: string[];
}

// Schedule with warnings (create/update response)
export interface ScheduleWithWarnings extends ScheduleDetailApiResponse {
  warnings?: string[];
}

// ============================================================================
// EXAM TYPES
// ============================================================================

export type ExamType = 'midterm' | 'final' | 'quarterly' | 'monthly' | 'quiz' | 'assignment' | 'practical';
export type ExamStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

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
  total_marks: number;
  pass_percentage: number;
  pass_marks: number;
  weight_percentage: number;
  status: ExamStatus;
  status_display: string;
  grade_count: number;
  is_upcoming: boolean;
  is_ongoing: boolean;
  is_past: boolean;
}

export interface ExamDetailApiResponse extends ExamApiResponse {
  academic_year_detail?: AcademicYearApiResponse;
  class_levels?: number[];
  class_levels_detail?: ClassLevelApiResponse[];
  class_instances?: number[];
  class_instances_detail?: ClassInstanceApiResponse[];
  description?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
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
  weight_percentage?: number;
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

// Exam grades summary
export interface ExamSubjectSummary {
  subject_name: string;
  subject_code: string;
  total_students: number;
  passed: number;
  failed: number;
  absent: number;
  avg_marks: number;
  highest_marks: number;
  lowest_marks: number;
}

export interface ExamClassSummary {
  class_name: string;
  class_id: number;
  total_students: number;
  subjects: ExamSubjectSummary[];
}

export interface ExamGradesSummaryResponse {
  exam_name: string;
  exam_id: number;
  total_grades: number;
  class_summaries: ExamClassSummary[];
}


// ============================================================================
// GRADE TYPES
// ============================================================================

export type GradeLetter = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface GradeApiResponse {
  id: number;
  exam: number;
  exam_name: string;
  student: number;
  student_name: string;
  student_id_number: string;
  subject: number;
  subject_name: string;
  subject_code: string;
  class_instance: number;
  class_instance_name: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade_letter: GradeLetter;
  is_pass: boolean;
  is_absent: boolean;
  remarks?: string;
}

export interface GradeDetailApiResponse extends GradeApiResponse {
  subject_detail?: SubjectApiResponse;
  exam_detail?: ExamApiResponse;
  graded_by?: number;
  graded_by_name?: string;
  graded_at?: string;
  created_at: string;
  updated_at: string;
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
// REPORT CARD TYPES
// ============================================================================

export type ReportCardStatus = 'draft' | 'generated' | 'approved' | 'published';
export type PromotionStatus = 'pending' | 'promoted' | 'repeated' | 'conditionally_promoted';

export interface ReportCardApiResponse {
  id: number;
  student: number;
  student_name: string;
  student_id_number: string;
  academic_year: number;
  academic_year_display: string;
  class_instance: number;
  class_instance_name: string;
  overall_percentage: number;
  overall_grade: GradeLetter;
  subjects_passed: number;
  subjects_failed: number;
  total_subjects: number;
  is_overall_pass: boolean;
  rank_in_class?: number;
  total_students_in_class?: number;
  promotion_status: PromotionStatus;
  promotion_status_display: string;
  status: ReportCardStatus;
  status_display: string;
}

export interface SubjectExamScore {
  exam_id: number;
  exam_type: string;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade_letter: GradeLetter;
  is_pass: boolean;
  is_absent: boolean;
}

export interface SubjectResult {
  subject_name: string;
  subject_code: string;
  weighted_marks: number;
  weighted_total: number;
  final_percentage: number;
  final_grade: GradeLetter;
  is_pass: boolean;
  exam_scores: SubjectExamScore[];
}

export interface ReportCardDetailApiResponse extends ReportCardApiResponse {
  student_photo?: string;
  academic_year_detail?: AcademicYearApiResponse;
  class_instance_detail?: ClassInstanceApiResponse;
  total_marks_obtained: number;
  total_marks_possible: number;
  subject_results: Record<string, SubjectResult>;
  approved_by?: number;
  approved_by_name?: string;
  approved_at?: string;
  class_teacher_remarks?: string;
  principal_remarks?: string;
  display_name: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateReportCardData {
  promotion_status?: PromotionStatus;
  status?: ReportCardStatus;
  class_teacher_remarks?: string;
  principal_remarks?: string;
}

export interface ReportCardFilters {
  student?: number;
  academic_year?: number;
  class_instance?: number;
  class_level?: number;
  status?: ReportCardStatus;
  promotion_status?: PromotionStatus;
  is_overall_pass?: boolean;
  overall_grade?: GradeLetter;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedReportCardsResponse = PaginatedResponse<ReportCardApiResponse>;

// Generate report cards request
export interface GenerateReportCardsData {
  academic_year: number;
  class_instance: number;
}

export interface GenerateReportCardsResponse {
  message: string;
  generated_count: number;
  class_name: string;
  academic_year: string;
}

// Class results response
export interface ClassResultsResponse {
  class_instance_id: number;
  total_students: number;
  passed: number;
  failed: number;
  pass_rate: number;
  results: ReportCardApiResponse[];
}
