import { z } from 'zod';
import { SCORE_MAX_MARKS } from '../constants';
import type { ExamType } from '../types';

export const scoreSchema = z.object({
  grade_id: z.number({
    required_error: 'Grade is required',
    invalid_type_error: 'Grade must be a number',
  }).min(1, 'Grade must be at least 1'),
  
  homework_marks: z.number({
    invalid_type_error: 'Homework marks must be a number',
  }).min(0, 'Homework marks cannot be negative'),
  
  activity_marks: z.number({
    invalid_type_error: 'Activity marks must be a number',
  }).min(0, 'Activity marks cannot be negative'),
  
  exam_marks: z.number({
    invalid_type_error: 'Exam marks must be a number',
  }).min(0, 'Exam marks cannot be negative'),
});

export const createScoreSchema = scoreSchema;
export const updateScoreSchema = scoreSchema.partial();

export type ScoreFormData = z.infer<typeof scoreSchema>;
export type CreateScoreFormData = z.infer<typeof createScoreSchema>;
export type UpdateScoreFormData = z.infer<typeof updateScoreSchema>;

export const bulkScoreEntrySchema = z.object({
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
  
  scores: z.array(z.object({
    student_id: z.number({
      required_error: 'Student ID is required',
      invalid_type_error: 'Student ID must be a number',
    }).min(1),
    
    homework_marks: z.number({
      invalid_type_error: 'Homework marks must be a number',
    }).min(0),
    
    activity_marks: z.number({
      invalid_type_error: 'Activity marks must be a number',
    }).min(0),
    
    exam_marks: z.number({
      invalid_type_error: 'Exam marks must be a number',
    }).min(0),
  })),
});

export type BulkScoreEntryFormData = z.infer<typeof bulkScoreEntrySchema>;

export const scoreFiltersSchema = z.object({
  exam: z.number().optional(),
  student: z.number().optional(),
  subject: z.number().optional(),
  class_instance: z.number().optional(),
  grade_id: z.number().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export type ScoreFiltersFormData = z.infer<typeof scoreFiltersSchema>;

export function createScoreValidationSchema(examType: ExamType) {
  const maxMarks = SCORE_MAX_MARKS[examType];
  
  return scoreSchema.refine((data) => {
    if (data.homework_marks > maxMarks.homework) {
      return false;
    }
    if (data.activity_marks > maxMarks.class_activity) {
      return false;
    }
    if (data.exam_marks > maxMarks.exam) {
      return false;
    }
    return true;
  }, {
    message: 'Scores exceed maximum marks for this exam type',
  });
}

export function createBulkScoreValidationSchema(examType: ExamType) {
  const maxMarks = SCORE_MAX_MARKS[examType];
  
  return bulkScoreEntrySchema.refine((data) => {
    return data.scores.every(score => {
      return (
        score.homework_marks <= maxMarks.homework &&
        score.activity_marks <= maxMarks.class_activity &&
        score.exam_marks <= maxMarks.exam
      );
    });
  }, {
    message: 'Some scores exceed the maximum marks for this exam type',
  });
}
