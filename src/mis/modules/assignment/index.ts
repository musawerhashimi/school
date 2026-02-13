/**
 * Assignment Module
 * Main entry point for assignment management functionality
 */

// Types
export * from './types';

// Constants
export * from './constants';

// Services
export { assignmentService } from './services/assignmentService';

// Hooks
export {
  // List hooks
  useAssignments,
  useAssignment,
  // Class hooks
  useClassAssignments,
  useClassAssignmentStats,
  useClassesWithAssignments,
  // Teacher hooks
  useTeacherAssignments,
  // Student hooks
  useStudentAssignments,
  useStudentAssignmentStats,
  // Submission hooks
  useAssignmentSubmissions,
  // Mutation hooks
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  usePublishAssignment,
  useCloseAssignment,
  useGradeSubmission,
  useBulkGradeSubmissions,
  useReturnSubmission,
} from './hooks/useAssignments';

// Pages (will be added)
export { default as AssignmentList } from './pages/AssignmentList';
export { default as AssignmentDetail } from './pages/AssignmentDetail';
export { default as AssignmentFormPage } from './pages/AssignmentFormPage';
export { default as ClassAssignmentList } from './pages/ClassAssignmentList';
export { default as ClassAssignmentDetail } from './pages/ClassAssignmentDetail';
