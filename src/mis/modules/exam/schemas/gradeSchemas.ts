import { z } from 'zod';

export const gradeLetterSchema = z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] as const);

const baseGradeSchema = z.object({
  exam: z.number({
    required_error: 'Exam is required',
    invalid_type_error: 'Exam must be a number',
  }).min(1, 'Exam must be at least 1'),
  
  student: z.number({
    required_error: 'Student is required',
    invalid_type_error: 'Student must be a number',
  }).min(1, 'Student must be at least 1'),
  
  subject: z.number({
    required_error: 'Subject is required',
    invalid_type_error: 'Subject must be a number',
  }).min(1, 'Subject must be at least 1'),
  
  class_instance: z.number({
    required_error: 'Class is required',
    invalid_type_error: 'Class must be a number',
  }).min(1, 'Class must be at least 1'),
  
  marks_obtained: z.number({
    invalid_type_error: 'Marks obtained must be a number',
  }).min(0, 'Marks obtained cannot be negative'),
  
  total_marks: z.number({
    required_error: 'Total marks is required',
    invalid_type_error: 'Total marks must be a number',
  }).min(1, 'Total marks must be at least 1'),
  
  is_absent: z.boolean().default(false),
  remarks: z.string().optional(),
});

export const gradeSchema = baseGradeSchema.refine((data) => {
  if (!data.is_absent && data.marks_obtained > data.total_marks) {
    return false;
  }
  return true;
}, {
  message: 'Marks obtained cannot exceed total marks',
  path: ['marks_obtained'],
});

export const createGradeSchema = gradeSchema;
export const updateGradeSchema = baseGradeSchema.partial().refine((data) => {
  if (data.marks_obtained !== undefined && data.total_marks !== undefined && !data.is_absent) {
    return data.marks_obtained <= data.total_marks;
  }
  return true;
}, {
  message: 'Marks obtained cannot exceed total marks',
  path: ['marks_obtained'],
});

export type GradeFormData = z.infer<typeof gradeSchema>;
export type CreateGradeFormData = z.infer<typeof createGradeSchema>;
export type UpdateGradeFormData = z.infer<typeof updateGradeSchema>;

export const bulkGradeEntrySchema = z.object({
  exam: z.number({
    required_error: 'Exam is required',
    invalid_type_error: 'Exam must be a number',
  }).min(1),
  
  subject: z.number({
    required_error: 'Subject is required',
    invalid_type_error: 'Subject must be a number',
  }).min(1),
  
  class_instance: z.number({
    required_error: 'Class is required',
    invalid_type_error: 'Class must be a number',
  }).min(1),
  
  total_marks: z.number({
    required_error: 'Total marks is required',
    invalid_type_error: 'Total marks must be a number',
  }).min(1),
  
  grades: z.array(z.object({
    student_id: z.number({
      required_error: 'Student ID is required',
      invalid_type_error: 'Student ID must be a number',
    }).min(1),
    
    marks_obtained: z.number({
      invalid_type_error: 'Marks obtained must be a number',
    }).min(0),
    
    is_absent: z.boolean().optional().default(false),
    remarks: z.string().optional(),
    homework_marks: z.number().min(0).optional(),
    activity_marks: z.number().min(0).optional(),
    exam_marks: z.number().min(0).optional(),
  })),
});

export type BulkGradeEntryFormData = z.infer<typeof bulkGradeEntrySchema>;

export const gradeFiltersSchema = z.object({
  exam: z.number().optional(),
  student: z.number().optional(),
  subject: z.number().optional(),
  class_instance: z.number().optional(),
  is_pass: z.boolean().optional(),
  is_absent: z.boolean().optional(),
  grade_letter: gradeLetterSchema.optional(),
  academic_year: z.number().optional(),
  exam_type: z.enum(['midterm', 'final'] as const).optional(),
  percentage_min: z.number().optional(),
  percentage_max: z.number().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
});

export type GradeFiltersFormData = z.infer<typeof gradeFiltersSchema>;
