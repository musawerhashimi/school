import { z } from 'zod';

// ============================================================================
// ACADEMIC YEAR SCHEMAS
// ============================================================================

export const academicYearSchema = z.object({
  year: z.number()
    .min(1400, 'Year must be at least 1400 (Hijri)')
    .max(1500, 'Year must be at most 1500'),
  year_gregorian: z.number()
    .min(2020, 'Gregorian year must be at least 2020')
    .max(2100, 'Gregorian year must be at most 2100'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_current: z.boolean().default(false),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) < new Date(data.end_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

export const academicYearUpdateSchema = academicYearSchema;

export type AcademicYearFormData = z.infer<typeof academicYearSchema>;
export type AcademicYearUpdateFormData = z.infer<typeof academicYearUpdateSchema>;

// ============================================================================
// CLASS LEVEL SCHEMAS
// ============================================================================

export const classLevelSchema = z.object({
  level: z.number()
    .min(1, 'Level must be between 1 and 12')
    .max(12, 'Level must be between 1 and 12'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  name_dari: z.string().max(100).optional(),
  name_pashto: z.string().max(100).optional(),
  category: z.enum(['primary', 'lower_secondary', 'upper_secondary'], {
    required_error: 'Category is required',
  }),
  description: z.string().optional(),
  moe_code: z.string().max(50).optional(),
  minimum_age: z.number().min(3).max(25).optional(),
});

export const classLevelUpdateSchema = classLevelSchema.partial();

export type ClassLevelFormData = z.infer<typeof classLevelSchema>;
export type ClassLevelUpdateFormData = z.infer<typeof classLevelUpdateSchema>;

// ============================================================================
// PHYSICAL CLASSROOM SCHEMAS
// ============================================================================

export const classroomSchema = z.object({
  room_number: z.string()
    .min(1, 'Room number is required')
    .max(50, 'Room number is too long'),
  room_name: z.string()
    .min(1, 'Room name is required')
    .max(200, 'Room name is too long'),
  room_type: z.enum([
    'classroom',
    'lab',
    'computer_lab',
    'library',
    'hall',
    'outdoor',
    'workshop',
  ], {
    required_error: 'Room type is required',
  }),
  building: z.string().max(100).optional(),
  floor: z.number().int().optional(),
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(500, 'Capacity seems too large'),
  facilities: z.string().optional(),
  is_available: z.boolean().default(true),
  notes: z.string().optional(),
});

export const classroomUpdateSchema = classroomSchema.partial();

export type ClassroomFormData = z.infer<typeof classroomSchema>;
export type ClassroomUpdateFormData = z.infer<typeof classroomUpdateSchema>;

// ============================================================================
// SUBJECT SCHEMAS
// ============================================================================

export const subjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  name_dari: z.string().max(200).optional(),
  name_pashto: z.string().max(200).optional(),
  code: z.string()
    .min(1, 'Code is required')
    .max(50, 'Code is too long')
    .regex(/^[A-Z0-9-]+$/, 'Code must contain only uppercase letters, numbers, and hyphens'),
  subject_type: z.enum([
    'core',
    'elective',
    'religious',
    'language',
    'science',
    'arts',
    'practical',
  ], {
    required_error: 'Subject type is required',
  }),
  class_levels: z.array(z.number()).min(1, 'At least one class level is required'),
  total_marks: z.number()
    .min(1, 'Total marks must be at least 1')
    .max(1000, 'Total marks seems too large')
    .default(100),
  pass_marks: z.number()
    .min(1, 'Pass marks must be at least 1')
    .max(1000, 'Pass marks seems too large'),
  credit_hours: z.number()
    .min(0.5, 'Credit hours must be at least 0.5')
    .max(20, 'Credit hours seems too large')
    .default(1),
  moe_code: z.string().max(50).optional(),
  description: z.string().optional(),
  syllabus: z.string().optional(),
  is_active: z.boolean().default(true),
}).refine((data) => {
  return data.pass_marks <= data.total_marks;
}, {
  message: 'Pass marks cannot exceed total marks',
  path: ['pass_marks'],
});

export const subjectUpdateSchema = subjectSchema;

export type SubjectFormData = z.infer<typeof subjectSchema>;
export type SubjectUpdateFormData = z.infer<typeof subjectUpdateSchema>;

// ============================================================================
// FILTER SCHEMAS
// ============================================================================

export const academicYearFilterSchema = z.object({
  year_min: z.number().optional(),
  year_max: z.number().optional(),
  is_current: z.boolean().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const classLevelFilterSchema = z.object({
  category: z.enum(['primary', 'lower_secondary', 'upper_secondary']).optional(),
  level_min: z.number().optional(),
  level_max: z.number().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const classroomFilterSchema = z.object({
  room_type: z.enum([
    'classroom',
    'lab',
    'computer_lab',
    'library',
    'hall',
    'outdoor',
    'workshop',
  ]).optional(),
  is_available: z.boolean().optional(),
  capacity_min: z.number().optional(),
  capacity_max: z.number().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const subjectFilterSchema = z.object({
  subject_type: z.enum([
    'core',
    'elective',
    'religious',
    'language',
    'science',
    'arts',
    'practical',
  ]).optional(),
  class_level: z.number().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export type AcademicYearFilterFormData = z.infer<typeof academicYearFilterSchema>;
export type ClassLevelFilterFormData = z.infer<typeof classLevelFilterSchema>;
export type ClassroomFilterFormData = z.infer<typeof classroomFilterSchema>;
export type SubjectFilterFormData = z.infer<typeof subjectFilterSchema>;

// ============================================================================
// CLASS INSTANCE SCHEMAS
// ============================================================================

export const classInstanceSchema = z.object({
  name: z.string().max(100).optional(),
  academic_year: z.number({
    required_error: 'Academic year is required',
  }).min(1, 'Academic year is required'),
  class_level: z.number({
    required_error: 'Class level is required',
  }).min(1, 'Class level is required'),
  physical_classroom: z.number().optional().nullable(),
  section: z.string()
    .min(1, 'Section is required')
    .max(10, 'Section is too long')
    .default('A'),
  shift: z.enum(['morning', 'afternoon', 'evening'], {
    required_error: 'Shift is required',
  }).default('morning'),
  gender_segregation: z.enum(['mixed', 'male_only', 'female_only'], {
    required_error: 'Gender segregation policy is required',
  }).default('mixed'),
  class_teacher: z.number().optional().nullable(),
  capacity: z.number()
    .min(1, 'Capacity must be at least 1')
    .max(200, 'Capacity seems too large')
    .default(30),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const classInstanceUpdateSchema = classInstanceSchema.partial();

export type ClassInstanceFormData = z.infer<typeof classInstanceSchema>;
export type ClassInstanceUpdateFormData = z.infer<typeof classInstanceUpdateSchema>;

export const classInstanceFilterSchema = z.object({
  academic_year: z.number().optional(),
  academic_year_hijri: z.number().optional(),
  class_level: z.number().optional(),
  class_level_number: z.number().optional(),
  physical_classroom: z.number().optional(),
  section: z.string().optional(),
  shift: z.enum(['morning', 'afternoon', 'evening']).optional(),
  gender_segregation: z.enum(['mixed', 'male_only', 'female_only']).optional(),
  class_teacher: z.number().optional(),
  is_active: z.boolean().optional(),
  has_capacity: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
});

export type ClassInstanceFilterFormData = z.infer<typeof classInstanceFilterSchema>;

// ============================================================================
// SCHEDULE SCHEMAS
// ============================================================================

export const scheduleSchema = z.object({
  class_instance: z.number({
    required_error: 'Class is required',
  }).min(1, 'Class is required'),
  subject: z.number({
    required_error: 'Subject is required',
  }).min(1, 'Subject is required'),
  teacher: z.number().optional().nullable(),
  day_of_week: z.number({
    required_error: 'Day is required',
  }).min(0).max(5, 'Day must be between 0 (Saturday) and 5 (Thursday)'),
  period_number: z.number({
    required_error: 'Period number is required',
  }).min(1, 'Period must be at least 1').max(6, 'Period cannot exceed 6'),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

export const scheduleUpdateSchema = z.object({
  class_instance: z.number().optional(),
  subject: z.number().optional(),
  teacher: z.number().optional().nullable(),
  day_of_week: z.number().min(0).max(5).optional(),
  period_number: z.number().min(1).max(6).optional(),
  is_active: z.boolean().optional(),
  notes: z.string().optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type ScheduleUpdateFormData = z.infer<typeof scheduleUpdateSchema>;

export const scheduleFilterSchema = z.object({
  class_instance: z.number().optional(),
  subject: z.number().optional(),
  teacher: z.number().optional(),
  room: z.number().optional(),
  day_of_week: z.number().min(0).max(5).optional(),
  period_number: z.number().optional(),
  period_min: z.number().optional(),
  period_max: z.number().optional(),
  academic_year: z.number().optional(),
  class_level: z.number().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
});

export type ScheduleFilterFormData = z.infer<typeof scheduleFilterSchema>;

// ============================================================================
// EXAM SCHEMAS
// ============================================================================

export const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required').max(200),
  exam_type: z.enum(['midterm', 'final', 'quarterly', 'monthly', 'quiz', 'assignment', 'practical']),
  academic_year: z.number({ required_error: 'Academic year is required' }).min(1),
  class_levels: z.array(z.number()).optional(),
  class_instances: z.array(z.number()).optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  total_marks: z.number().min(1).max(1000).default(100),
  pass_percentage: z.number().min(0).max(100).default(40),
  weight_percentage: z.number().min(0).max(100).default(100),
  status: z.enum(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled']).default('draft'),
  description: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return data.start_date <= data.end_date;
  }
  return true;
}, {
  message: 'End date must be on or after start date',
  path: ['end_date'],
});

export type ExamFormData = z.infer<typeof examSchema>;

// ============================================================================
// GRADE SCHEMAS
// ============================================================================

export const gradeSchema = z.object({
  exam: z.number({ required_error: 'Exam is required' }).min(1),
  student: z.number({ required_error: 'Student is required' }).min(1),
  subject: z.number({ required_error: 'Subject is required' }).min(1),
  class_instance: z.number({ required_error: 'Class is required' }).min(1),
  marks_obtained: z.number().min(0, 'Marks cannot be negative'),
  total_marks: z.number().min(1, 'Total marks must be at least 1'),
  is_absent: z.boolean().default(false),
  remarks: z.string().optional(),
}).refine((data) => {
  if (!data.is_absent && data.marks_obtained > data.total_marks) {
    return false;
  }
  return true;
}, {
  message: 'Marks obtained cannot exceed total marks',
  path: ['marks_obtained'],
});

export type GradeFormData = z.infer<typeof gradeSchema>;

export const bulkGradeEntrySchema = z.object({
  exam: z.number().min(1, 'Exam is required'),
  subject: z.number().min(1, 'Subject is required'),
  class_instance: z.number().min(1, 'Class is required'),
  total_marks: z.number().min(1, 'Total marks is required'),
});

export type BulkGradeEntryFormData = z.infer<typeof bulkGradeEntrySchema>;

// ============================================================================
// REPORT CARD SCHEMAS
// ============================================================================

export const reportCardUpdateSchema = z.object({
  promotion_status: z.enum(['pending', 'promoted', 'repeated', 'conditionally_promoted']).optional(),
  status: z.enum(['draft', 'generated', 'approved', 'published']).optional(),
  class_teacher_remarks: z.string().optional(),
  principal_remarks: z.string().optional(),
});

export type ReportCardUpdateFormData = z.infer<typeof reportCardUpdateSchema>;

export const generateReportCardsSchema = z.object({
  academic_year: z.number({ required_error: 'Academic year is required' }).min(1),
  class_instance: z.number({ required_error: 'Class is required' }).min(1),
});

export type GenerateReportCardsFormData = z.infer<typeof generateReportCardsSchema>;
