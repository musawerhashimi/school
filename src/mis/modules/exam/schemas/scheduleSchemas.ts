import { z } from 'zod';

const baseExamScheduleSchema = z.object({
  exam: z.number({
    required_error: 'Exam is required',
    invalid_type_error: 'Exam must be a number',
  }).min(1, 'Exam must be at least 1'),
  
  class_instance: z.number({
    required_error: 'Class is required',
    invalid_type_error: 'Class must be a number',
  }).min(1, 'Class must be at least 1'),
  
  subject: z.number({
    required_error: 'Subject is required',
    invalid_type_error: 'Subject must be a number',
  }).min(1, 'Subject must be at least 1'),
  
  exam_date: z.string()
    .min(1, 'Exam date is required')
    .refine((date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, 'Invalid date format'),
  
  start_time: z.string()
    .min(1, 'Start time is required')
    .refine((time) => /^\d{2}:\d{2}$/.test(time), 'Invalid time format (must be HH:MM)'),
  
  end_time: z.string()
    .min(1, 'End time is required')
    .refine((time) => /^\d{2}:\d{2}$/.test(time), 'Invalid time format (must be HH:MM)'),
  
  room: z.number().optional(),
  invigilators: z.array(z.number()).optional(),
  notes: z.string().optional(),
});

export const examScheduleSchema = baseExamScheduleSchema.refine((data) => {
  // Validate time range
  const [startHours, startMinutes] = data.start_time.split(':').map(Number);
  const [endHours, endMinutes] = data.end_time.split(':').map(Number);
  return (startHours < endHours) || 
         (startHours === endHours && startMinutes < endMinutes);
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
}).refine((data) => {
  // Validate exam duration
  const [startHours, startMinutes] = data.start_time.split(':').map(Number);
  const [endHours, endMinutes] = data.end_time.split(':').map(Number);
  const duration = (endHours - startHours) * 60 + (endMinutes - startMinutes);
  return duration >= 15 && duration <= 240; // 15 minutes to 4 hours
}, {
  message: 'Exam duration must be between 15 minutes and 4 hours',
  path: ['end_time'],
});

export const createExamScheduleSchema = examScheduleSchema;
type PartialExamSchedule = Partial<z.infer<typeof baseExamScheduleSchema>>;

export const updateExamScheduleSchema = baseExamScheduleSchema.partial()
  .refine((data: PartialExamSchedule) => {
    if (data.start_time && data.end_time) {
      const [startHours, startMinutes] = data.start_time.split(':').map(Number);
      const [endHours, endMinutes] = data.end_time.split(':').map(Number);
      return (startHours < endHours) || 
             (startHours === endHours && startMinutes < endMinutes);
    }
    return true;
  }, {
    message: 'End time must be after start time',
    path: ['end_time'],
  })
  .refine((data: PartialExamSchedule) => {
    if (data.start_time && data.end_time) {
      const [startHours, startMinutes] = data.start_time.split(':').map(Number);
      const [endHours, endMinutes] = data.end_time.split(':').map(Number);
      const duration = (endHours - startHours) * 60 + (endMinutes - startMinutes);
      return duration >= 15 && duration <= 240; // 15 minutes to 4 hours
    }
    return true;
  }, {
    message: 'Exam duration must be between 15 minutes and 4 hours',
    path: ['end_time'],
  });

export type ExamScheduleFormData = z.infer<typeof examScheduleSchema>;
export type CreateExamScheduleFormData = z.infer<typeof createExamScheduleSchema>;
export type UpdateExamScheduleFormData = z.infer<typeof updateExamScheduleSchema>;

export const examScheduleFiltersSchema = z.object({
  exam: z.number().optional(),
  class_instance: z.number().optional(),
  subject: z.number().optional(),
  room: z.number().optional(),
  exam_date: z.string().optional(),
  exam_date_after: z.string().optional(),
  exam_date_before: z.string().optional(),
  is_completed: z.boolean().optional(),
  academic_year: z.number().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
});

export type ExamScheduleFiltersFormData = z.infer<typeof examScheduleFiltersSchema>;

export const conflictCheckSchema = z.object({
  exam: z.number().min(1),
  class_instance: z.number().min(1),
  subject: z.number().min(1),
  exam_date: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  room: z.number().optional(),
  schedule_id: z.number().optional(), // For checking existing schedule conflicts
});

export type ConflictCheckFormData = z.infer<typeof conflictCheckSchema>;
