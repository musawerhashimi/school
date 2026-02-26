// ============================================================================
// EXAM MODULE CONSTANTS
// ============================================================================

import type { ExamType, ExamStatus, GradeLetter, QuestionType, DifficultyLevel, ScoreMaxMarks } from './types';

// ============================================================================
// EXAM TYPE CONSTANTS
// ============================================================================

export const EXAM_TYPES: Record<ExamType, { label: string; labelDari: string; labelPashto: string }> = {
  midterm: { label: 'Midterm Exam', labelDari: 'امتحان نیمه سال', labelPashto: 'نیم کال امتحان' },
  final: { label: 'Final Exam', labelDari: 'امتحان نهایی', labelPashto: 'وروستی امتحان' },
};

export const EXAM_TYPE_OPTIONS = Object.entries(EXAM_TYPES).map(([value, labels]) => ({
  value: value as ExamType,
  label: labels.label,
}));

// ============================================================================
// EXAM STATUS CONSTANTS
// ============================================================================

export const EXAM_STATUSES: Record<ExamStatus, { label: string; color: string; bgColor: string }> = {
  draft: { label: 'Draft', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  scheduled: { label: 'Scheduled', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  in_progress: { label: 'In Progress', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  completed: { label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export const EXAM_STATUS_OPTIONS = Object.entries(EXAM_STATUSES).map(([value, config]) => ({
  value: value as ExamStatus,
  label: config.label,
}));

export const STATUS_BADGE_VARIANTS: Record<ExamStatus, 'secondary' | 'info' | 'warning' | 'success' | 'error'> = {
  draft: 'secondary',
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
};

// ============================================================================
// SCORE BREAKDOWN CONSTANTS
// ============================================================================

/**
 * Maximum marks for each component based on exam type
 * Midterm: 40 marks total (Homework: 2, Activity: 2, Exam: 36)
 * Final: 60 marks total (Homework: 3, Activity: 3, Exam: 54)
 */
export const SCORE_MAX_MARKS: Record<ExamType, ScoreMaxMarks> = {
  midterm: {
    homework: 2,
    class_activity: 2,
    exam: 36,
    total: 40,
  },
  final: {
    homework: 3,
    class_activity: 3,
    exam: 54,
    total: 60,
  },
};

// Combined total marks (Midterm + Final = 100)
export const TOTAL_YEAR_MARKS = 100;

// ============================================================================
// GRADE LETTER CONSTANTS
// ============================================================================

export const GRADE_LETTERS: Record<GradeLetter, { minPercentage: number; maxPercentage: number; gpa: number; description: string }> = {
  'A+': { minPercentage: 95, maxPercentage: 100, gpa: 4.0, description: 'Excellent' },
  'A': { minPercentage: 90, maxPercentage: 94.99, gpa: 4.0, description: 'Excellent' },
  'A-': { minPercentage: 85, maxPercentage: 89.99, gpa: 3.7, description: 'Very Good' },
  'B+': { minPercentage: 80, maxPercentage: 84.99, gpa: 3.3, description: 'Good' },
  'B': { minPercentage: 75, maxPercentage: 79.99, gpa: 3.0, description: 'Good' },
  'B-': { minPercentage: 70, maxPercentage: 74.99, gpa: 2.7, description: 'Above Average' },
  'C+': { minPercentage: 65, maxPercentage: 69.99, gpa: 2.3, description: 'Average' },
  'C': { minPercentage: 60, maxPercentage: 64.99, gpa: 2.0, description: 'Average' },
  'C-': { minPercentage: 55, maxPercentage: 59.99, gpa: 1.7, description: 'Below Average' },
  'D': { minPercentage: 50, maxPercentage: 54.99, gpa: 1.0, description: 'Pass' },
  'F': { minPercentage: 0, maxPercentage: 49.99, gpa: 0.0, description: 'Fail' },
};

export const GRADE_LETTER_OPTIONS: GradeLetter[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

export const GRADE_COLORS: Record<GradeLetter, string> = {
  'A+': 'text-green-700 bg-green-100',
  'A': 'text-green-600 bg-green-100',
  'A-': 'text-green-500 bg-green-50',
  'B+': 'text-blue-600 bg-blue-100',
  'B': 'text-blue-500 bg-blue-100',
  'B-': 'text-blue-400 bg-blue-50',
  'C+': 'text-yellow-600 bg-yellow-100',
  'C': 'text-yellow-500 bg-yellow-100',
  'C-': 'text-yellow-400 bg-yellow-50',
  'D': 'text-orange-500 bg-orange-100',
  'F': 'text-red-600 bg-red-100',
};

// ============================================================================
// QUESTION TYPE CONSTANTS (Optional Feature)
// ============================================================================

export const QUESTION_TYPES: Record<QuestionType, { label: string; icon: string }> = {
  multiple_choice: { label: 'Multiple Choice', icon: 'list' },
  true_false: { label: 'True/False', icon: 'check-circle' },
  short_answer: { label: 'Short Answer', icon: 'edit-3' },
  essay: { label: 'Essay', icon: 'file-text' },
  fill_blank: { label: 'Fill in the Blank', icon: 'minus-square' },
};

export const QUESTION_TYPE_OPTIONS = Object.entries(QUESTION_TYPES).map(([value, config]) => ({
  value: value as QuestionType,
  label: config.label,
}));

// ============================================================================
// DIFFICULTY LEVEL CONSTANTS
// ============================================================================

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'text-green-600 bg-green-100' },
  medium: { label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
  hard: { label: 'Hard', color: 'text-red-600 bg-red-100' },
};

export const DIFFICULTY_LEVEL_OPTIONS = Object.entries(DIFFICULTY_LEVELS).map(([value, config]) => ({
  value: value as DifficultyLevel,
  label: config.label,
}));

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_PASS_PERCENTAGE = 40;
export const DEFAULT_TOTAL_MARKS = 100;

// ============================================================================
// EXAM SCHEDULE CONSTANTS
// ============================================================================

export const DEFAULT_EXAM_DURATION_MINUTES = 90;
export const MIN_EXAM_DURATION_MINUTES = 15;
export const MAX_EXAM_DURATION_MINUTES = 240;

export const EXAM_TIME_SLOTS = [
  { start: '08:00', end: '09:30', label: 'Morning 1 (8:00 - 9:30)' },
  { start: '09:45', end: '11:15', label: 'Morning 2 (9:45 - 11:15)' },
  { start: '11:30', end: '13:00', label: 'Morning 3 (11:30 - 1:00)' },
  { start: '14:00', end: '15:30', label: 'Afternoon 1 (2:00 - 3:30)' },
  { start: '15:45', end: '17:15', label: 'Afternoon 2 (3:45 - 5:15)' },
];

// ============================================================================
// PAGINATION DEFAULTS
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const EXAM_API_ENDPOINTS = {
  EXAMS: '/exams/',
  GRADES: '/exam/grades/',
  SCORES: '/exam/scores/',
  EXAM_SCHEDULES: '/exam/exam-schedules/',
  QUESTIONS: '/exam/questions/',
  EXAM_QUESTIONS: '/exam/exam-questions/',
} as const;

// ============================================================================
// QUERY KEYS
// ============================================================================

export const EXAM_QUERY_KEYS = {
  exams: ['exams'] as const,
  grades: ['grades'] as const,
  scores: ['scores'] as const,
  examSchedules: ['exam-schedules'] as const,
  questions: ['questions'] as const,
} as const;
