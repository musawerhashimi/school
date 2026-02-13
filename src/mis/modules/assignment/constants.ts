/**
 * Assignment Module Constants
 * Constants, enums, and configuration for assignment management
 */

import type { AssignmentStatus, AssignmentType, SubmissionStatus } from './types';

// ============================================================================
// Assignment Types Configuration
// ============================================================================

export const ASSIGNMENT_TYPES: Record<
  AssignmentType,
  { label: string; description: string; icon: string }
> = {
  homework: {
    label: 'Homework',
    description: 'Regular homework assignments',
    icon: 'BookOpen',
  },
  project: {
    label: 'Project',
    description: 'Long-term project work',
    icon: 'FolderKanban',
  },
  essay: {
    label: 'Essay',
    description: 'Written essay or composition',
    icon: 'FileText',
  },
  lab_report: {
    label: 'Lab Report',
    description: 'Laboratory experiment report',
    icon: 'FlaskConical',
  },
  quiz: {
    label: 'Quiz',
    description: 'Quick assessment or quiz',
    icon: 'HelpCircle',
  },
  presentation: {
    label: 'Presentation',
    description: 'Oral presentation or slides',
    icon: 'Presentation',
  },
  other: {
    label: 'Other',
    description: 'Other type of assignment',
    icon: 'FileQuestion',
  },
};

export const ASSIGNMENT_TYPE_OPTIONS = Object.entries(ASSIGNMENT_TYPES).map(
  ([value, config]) => ({
    value: value as AssignmentType,
    label: config.label,
    description: config.description,
  })
);

// ============================================================================
// Assignment Status Configuration
// ============================================================================

export const ASSIGNMENT_STATUS: Record<
  AssignmentStatus,
  { label: string; description: string; variant: 'secondary' | 'info' | 'warning' | 'success' }
> = {
  draft: {
    label: 'Draft',
    description: 'Not yet published to students',
    variant: 'secondary',
  },
  published: {
    label: 'Published',
    description: 'Visible to students for submission',
    variant: 'info',
  },
  closed: {
    label: 'Closed',
    description: 'No longer accepting submissions',
    variant: 'warning',
  },
  graded: {
    label: 'Graded',
    description: 'All submissions have been graded',
    variant: 'success',
  },
};

export const ASSIGNMENT_STATUS_OPTIONS = Object.entries(ASSIGNMENT_STATUS).map(
  ([value, config]) => ({
    value: value as AssignmentStatus,
    label: config.label,
  })
);

// ============================================================================
// Submission Status Configuration
// ============================================================================

export const SUBMISSION_STATUS: Record<
  SubmissionStatus,
  { label: string; description: string; variant: 'warning' | 'info' | 'error' | 'success' | 'secondary' }
> = {
  pending: {
    label: 'Pending',
    description: 'Not yet submitted',
    variant: 'warning',
  },
  submitted: {
    label: 'Submitted',
    description: 'Submitted on time',
    variant: 'info',
  },
  late: {
    label: 'Late',
    description: 'Submitted after due date',
    variant: 'error',
  },
  graded: {
    label: 'Graded',
    description: 'Has been graded',
    variant: 'success',
  },
  returned: {
    label: 'Returned',
    description: 'Returned for revision',
    variant: 'secondary',
  },
};

// ============================================================================
// Grade Letters Configuration
// ============================================================================

export type GradeLetter = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export const GRADE_LETTERS: Record<
  GradeLetter,
  { minPercentage: number; maxPercentage: number; gpa: number; description: string; color: string }
> = {
  'A+': { minPercentage: 97, maxPercentage: 100, gpa: 4.0, description: 'Exceptional', color: 'text-green-600' },
  'A': { minPercentage: 93, maxPercentage: 96.99, gpa: 4.0, description: 'Excellent', color: 'text-green-600' },
  'A-': { minPercentage: 90, maxPercentage: 92.99, gpa: 3.7, description: 'Very Good', color: 'text-green-500' },
  'B+': { minPercentage: 87, maxPercentage: 89.99, gpa: 3.3, description: 'Good', color: 'text-blue-600' },
  'B': { minPercentage: 83, maxPercentage: 86.99, gpa: 3.0, description: 'Good', color: 'text-blue-500' },
  'B-': { minPercentage: 80, maxPercentage: 82.99, gpa: 2.7, description: 'Above Average', color: 'text-blue-400' },
  'C+': { minPercentage: 77, maxPercentage: 79.99, gpa: 2.3, description: 'Average', color: 'text-yellow-600' },
  'C': { minPercentage: 73, maxPercentage: 76.99, gpa: 2.0, description: 'Average', color: 'text-yellow-500' },
  'C-': { minPercentage: 70, maxPercentage: 72.99, gpa: 1.7, description: 'Below Average', color: 'text-yellow-400' },
  'D+': { minPercentage: 67, maxPercentage: 69.99, gpa: 1.3, description: 'Poor', color: 'text-orange-500' },
  'D': { minPercentage: 60, maxPercentage: 66.99, gpa: 1.0, description: 'Passing', color: 'text-orange-600' },
  'F': { minPercentage: 0, maxPercentage: 59.99, gpa: 0.0, description: 'Failing', color: 'text-red-600' },
};

/**
 * Calculate grade letter from percentage
 */
export function getGradeFromPercentage(percentage: number): GradeLetter {
  for (const [letter, config] of Object.entries(GRADE_LETTERS)) {
    if (percentage >= config.minPercentage && percentage <= config.maxPercentage) {
      return letter as GradeLetter;
    }
  }
  return 'F';
}

/**
 * Get grade color class from percentage
 */
export function getGradeColor(percentage: number): string {
  const grade = getGradeFromPercentage(percentage);
  return GRADE_LETTERS[grade].color;
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_PASS_PERCENTAGE = 60;
export const DEFAULT_MAX_SCORE = 100;
export const DEFAULT_WEIGHT_PERCENTAGE = 100;
export const DEFAULT_LATE_PENALTY_PERCENTAGE = 10;

// ============================================================================
// Query Keys
// ============================================================================

export const ASSIGNMENT_QUERY_KEYS = {
  all: ['assignments'] as const,
  lists: () => [...ASSIGNMENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...ASSIGNMENT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...ASSIGNMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ASSIGNMENT_QUERY_KEYS.details(), id] as const,
  byClass: (classId: number) => [...ASSIGNMENT_QUERY_KEYS.all, 'class', classId] as const,
  classStats: (classId: number) => [...ASSIGNMENT_QUERY_KEYS.byClass(classId), 'stats'] as const,
  byTeacher: (teacherId: number) => [...ASSIGNMENT_QUERY_KEYS.all, 'teacher', teacherId] as const,
  byStudent: (studentId: number) => [...ASSIGNMENT_QUERY_KEYS.all, 'student', studentId] as const,
  studentStats: (studentId: number) => [...ASSIGNMENT_QUERY_KEYS.byStudent(studentId), 'stats'] as const,
  submissions: (assignmentId: number) => [...ASSIGNMENT_QUERY_KEYS.detail(assignmentId), 'submissions'] as const,
  classesWithAssignments: () => [...ASSIGNMENT_QUERY_KEYS.all, 'classes'] as const,
};

// ============================================================================
// Stale Times (in milliseconds)
// ============================================================================

export const STALE_TIMES = {
  list: 5 * 60 * 1000, // 5 minutes
  detail: 2 * 60 * 1000, // 2 minutes
  submissions: 1 * 60 * 1000, // 1 minute
  stats: 5 * 60 * 1000, // 5 minutes
};
