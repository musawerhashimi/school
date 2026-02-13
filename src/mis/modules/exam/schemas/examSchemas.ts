import { z } from 'zod';

export const examTypeSchema = z.enum(['midterm', 'final'] as const);
export const examStatusSchema = z.enum(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'] as const);

const baseExamSchema = z.object({
  name: z.string()
    .min(3, 'Exam name must be at least 3 characters')
    .max(200, 'Exam name cannot exceed 200 characters'),
  
  exam_type: examTypeSchema,
  
  academic_year: z.number({
    required_error: 'Academic year is required',
    invalid_type_error: 'Academic year must be a number',
  }).min(1, 'Academic year must be at least 1'),
  
  class_levels: z.array(z.number()).optional(),
  class_instances: z.array(z.number()).optional(),
  
  start_date: z.string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid date format'),
  
  end_date: z.string()
    .min(1, 'End date is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid date format'),
  
  total_marks: z.number()
    .min(1, 'Total marks must be at least 1')
    .max(1000, 'Total marks cannot exceed 1000')
    .default(100),
  
  pass_percentage: z.number()
    .min(0, 'Pass percentage must be at least 0')
    .max(100, 'Pass percentage cannot exceed 100')
    .default(40),
  
  status: examStatusSchema
    .default('draft'),
  
  description: z.string().optional(),
  notes: z.string().optional(),
});

export const examSchema = baseExamSchema.refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return startDate <= endDate;
}, {
  message: 'End date must be on or after start date',
  path: ['end_date'],
});

export const createExamSchema = examSchema;
export const updateExamSchema = baseExamSchema.partial().refine((data) => {
  if (data.start_date && data.end_date) {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return startDate <= endDate;
  }
  return true;
}, {
  message: 'End date must be on or after start date',
  path: ['end_date'],
});

export type ExamFormData = z.infer<typeof examSchema>;
export type CreateExamFormData = z.infer<typeof createExamSchema>;
export type UpdateExamFormData = z.infer<typeof updateExamSchema>;

export const examFiltersSchema = z.object({
  academic_year: z.number().optional(),
  exam_type: examTypeSchema.optional(),
  status: examStatusSchema.optional(),
  class_level: z.number().optional(),
  class_instance: z.number().optional(),
  start_date_after: z.string().optional(),
  start_date_before: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
});

export type ExamFiltersFormData = z.infer<typeof examFiltersSchema>;

export const updateExamStatusSchema = z.object({
  status: examStatusSchema,
});

export type UpdateExamStatusFormData = z.infer<typeof updateExamStatusSchema>;
