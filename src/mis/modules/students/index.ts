/**
 * Student Module - Main Export File
 *
 * This file exports all components, hooks, services, and utilities
 * for the Student Management module
 */

// Main Components
export { default as StudentList } from './pages/StudentList';
export { default as StudentForm } from './pages/StudentForm';
export { default as StudentProfile } from './pages/StudentProfile';
export { default as StudentDashboard } from './pages/StudentDashboard';

// Sub-Components
export { default as BulkImportModal } from './components/BulkImportModal';
export { default as DocumentManager } from './components/DocumentManager';

// Hooks
export * from './hooks/useStudents';
export * from './hooks/useStudentIntegration';

// Services
export { studentService } from './services/studentService';
export { default as integrationService } from './services/integrationService';

// Utilities
export * from './utils/exportStudents';

// Types (re-export from entities)
export type {
  StudentListApiResponse,
  StudentApiResponse,
  StudentFilters,
  CreateStudentData,
  UpdateStudentData,
  GuardianApiResponse,
  CreateGuardianData,
  StudentDocumentApiResponse,
  PaginatedStudentsResponse,
  StudentStatsResponse,
  StudentStatus,
  EducationLevel,
  GuardianRelationType,
  BloodGroup,
  AfghanProvince,
} from './types';

// Integration Types
export type {
  StudentAttendanceRecord,
  StudentAttendanceSummary,
  StudentGrade,
  StudentGradeSummary,
  StudentFeeRecord,
  StudentFeeSummary,
  StudentLibraryBook,
  StudentLibrarySummary,
  StudentIntegratedProfile,
} from './services/integrationService';
