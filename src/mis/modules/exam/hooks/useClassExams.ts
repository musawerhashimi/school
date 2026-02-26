import type { SubjectApiResponse } from '../../reference/types';
import type { UseQueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { classExamService, type ClassExamFilters, type PaginatedClassExamsResponse } from '../services/classExamService';
import type {
  BulkScoreSaveInput,
  ClassExamInfo,
  ClassExamsResponse,
  ClassStudent,
  ClassSubjectScoresResponse,
  ExamScheduleGridResponse,
  ExamType,
  StudentExamReport
} from '../types';

const CLASS_EXAMS_KEY = ['exam-classes'] as const;

const QUERY_KEYS = {
  classes: CLASS_EXAMS_KEY,
  classDetail: (id: number) => [...CLASS_EXAMS_KEY, id] as const,
  classExams: (id: number) => [...CLASS_EXAMS_KEY, id, 'exams'] as const,
  scheduleGrid: (classId: number, examType: ExamType) =>
    [...CLASS_EXAMS_KEY, classId, 'schedule', examType] as const,
  subjects: (classId: number) => [...CLASS_EXAMS_KEY, classId, 'subjects'] as const,
  availableSubjects: (classId: number, examId: number, scheduleId?: number) =>
    [...CLASS_EXAMS_KEY, classId, 'subjects', 'available', examId, scheduleId ?? 'new'] as const,
  subjectScores: (classId: number, subjectId: number, examType: ExamType) =>
    [...CLASS_EXAMS_KEY, classId, 'subjects', subjectId, 'scores', examType] as const,
  students: (classId: number) => [...CLASS_EXAMS_KEY, classId, 'students'] as const,
  studentReport: (classId: number, studentId: number) =>
    [...CLASS_EXAMS_KEY, classId, 'students', studentId, 'report'] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get all classes with exam information
 */
export function useExamClasses(
  filters?: ClassExamFilters,
  options?: Omit<UseQueryOptions<PaginatedClassExamsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.classes, filters],
    queryFn: () => classExamService.getClasses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Get a single class with exam information
 */
export function useExamClassDetail(
  classId: number,
  options?: Omit<UseQueryOptions<ClassExamInfo>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.classDetail(classId),
    queryFn: () => classExamService.getClassDetail(classId),
    enabled: classId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Get midterm and final exams for a class
 */
export function useClassExams(
  classId: number,
  options?: Omit<UseQueryOptions<ClassExamsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.classExams(classId),
    queryFn: () => classExamService.getClassExams(classId),
    enabled: classId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Get exam schedule grid for a class
 */
export function useExamScheduleGrid(
  classId: number,
  examType: ExamType,
  options?: Omit<UseQueryOptions<ExamScheduleGridResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.scheduleGrid(classId, examType),
    queryFn: () => classExamService.getScheduleGrid(classId, examType),
    enabled: classId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Get all subjects for a class
 */
export function useClassSubjects(
  classId: number,
  options?: Omit<UseQueryOptions<SubjectApiResponse[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.subjects(classId),
    queryFn: () => classExamService.getClassSubjects(classId),
    enabled: classId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

/**
 * Get available subjects for schedule creation/edit in a specific exam
 */
export function useAvailableScheduleSubjects(
  classId: number,
  examId: number,
  scheduleId?: number,
  options?: Omit<UseQueryOptions<SubjectApiResponse[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.availableSubjects(classId, examId, scheduleId),
    queryFn: () => classExamService.getAvailableScheduleSubjects(classId, examId, scheduleId),
    enabled: classId > 0 && examId > 0,
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * Get scores for a specific subject in a class
 */
export function useSubjectScores(
  classId: number,
  subjectId: number,
  examType: ExamType,
  options?: Omit<UseQueryOptions<ClassSubjectScoresResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.subjectScores(classId, subjectId, examType),
    queryFn: () => classExamService.getSubjectScores(classId, subjectId, examType),
    enabled: classId > 0 && subjectId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - scores change frequently
    ...options,
  });
}

/**
 * Get all students in a class
 */
export function useClassStudents(
  classId: number,
  options?: Omit<UseQueryOptions<ClassStudent[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.students(classId),
    queryFn: () => classExamService.getClassStudents(classId),
    enabled: classId > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
}

/**
 * Get student exam report (GPA and subject performance)
 */
export function useStudentExamReport(
  classId: number,
  studentId: number,
  options?: Omit<UseQueryOptions<StudentExamReport>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: QUERY_KEYS.studentReport(classId, studentId),
    queryFn: () => classExamService.getStudentReport(classId, studentId),
    enabled: classId > 0 && studentId > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================


/**
 * Save scores for a subject (bulk create/update)
 */
export function useSaveSubjectScores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      classId,
      subjectId,
      examType,
      scores,
    }: {
      classId: number;
      subjectId: number;
      examType: ExamType;
      scores: BulkScoreSaveInput[];
    }) => classExamService.saveSubjectScores(classId, subjectId, examType, scores),
    onMutate: () => toast.loading('Saving scores...'),
    onSuccess: (result, variables) => {
      toast.dismiss();
      toast.success(`Scores saved successfully`, {
        description: `${result.created_count} created, ${result.updated_count} updated`,
      });
      // Invalidate scores for this subject
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.subjectScores(variables.classId, variables.subjectId, variables.examType),
      });
      // Invalidate student reports (they will change with new scores)
      queryClient.invalidateQueries({
        queryKey: [...CLASS_EXAMS_KEY, variables.classId, 'students'],
        predicate: (query) => query.queryKey.includes('report'),
      });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to save scores', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export { QUERY_KEYS as CLASS_EXAM_QUERY_KEYS };
