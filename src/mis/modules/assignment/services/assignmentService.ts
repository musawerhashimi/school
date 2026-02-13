/**
 * Assignment Service
 * API service layer for assignment management
 */

import api from '@/lib/api';
import type {
  AssignmentApiResponse,
  AssignmentListItem,
  AssignmentSubmissionApiResponse,
  StudentAssignment,
  StudentAssignmentStats,
  ClassAssignmentStats,
  ClassWithAssignments,
  CreateAssignmentInput,
  UpdateAssignmentInput,
  GradeSubmissionInput,
  BulkGradeInput,
  AssignmentFilters,
  SubmissionFilters,
  PaginatedResponse,
} from '../types';

const BASE_URL = '/assignment/assignments/';
const CLASSES_URL = '/assignment/classes/';
const SUBMISSIONS_URL = '/assignment/submissions/';

/**
 * Build URL search params from filters object
 */
function buildParams(filters?: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }
  return params;
}

export const assignmentService = {
  // ============================================================================
  // CRUD Operations
  // ============================================================================

  /**
   * Get paginated list of assignments with optional filters
   */
  async getAll(filters?: AssignmentFilters): Promise<PaginatedResponse<AssignmentListItem>> {
    const params = buildParams(filters);
    const response = await api.get<PaginatedResponse<AssignmentListItem>>(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get assignment by ID
   */
  async getById(id: number): Promise<AssignmentApiResponse> {
    const response = await api.get<AssignmentApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  /**
   * Create new assignment
   */
  async create(data: CreateAssignmentInput): Promise<AssignmentApiResponse> {
    const response = await api.post<AssignmentApiResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Update assignment
   */
  async update(id: number, data: Partial<CreateAssignmentInput>): Promise<AssignmentApiResponse> {
    const response = await api.patch<AssignmentApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  /**
   * Delete assignment
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  // ============================================================================
  // Status Actions
  // ============================================================================

  /**
   * Publish assignment (draft -> published)
   */
  async publish(id: number): Promise<AssignmentApiResponse> {
    const response = await api.post<AssignmentApiResponse>(`${BASE_URL}${id}/publish/`);
    return response.data;
  },

  /**
   * Close assignment (published -> closed)
   */
  async close(id: number): Promise<AssignmentApiResponse> {
    const response = await api.post<AssignmentApiResponse>(`${BASE_URL}${id}/close/`);
    return response.data;
  },

  /**
   * Reopen assignment (closed -> published)
   */
  async reopen(id: number): Promise<AssignmentApiResponse> {
    const response = await api.post<AssignmentApiResponse>(`${BASE_URL}${id}/reopen/`);
    return response.data;
  },

  /**
   * Mark as fully graded
   */
  async markAsGraded(id: number): Promise<AssignmentApiResponse> {
    const response = await api.post<AssignmentApiResponse>(`${BASE_URL}${id}/mark_graded/`);
    return response.data;
  },

  // ============================================================================
  // Class-specific Operations
  // ============================================================================

  /**
   * Get assignments for a specific class
   */
  async getByClass(
    classId: number,
    filters?: AssignmentFilters
  ): Promise<AssignmentListItem[]> {
    const params = buildParams(filters);
    const response = await api.get<AssignmentListItem[]>(
      `${CLASSES_URL}${classId}/assignments/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get assignment statistics for a class
   */
  async getClassStats(classId: number): Promise<ClassAssignmentStats> {
    const response = await api.get<ClassAssignmentStats>(
      `${CLASSES_URL}${classId}/stats/`
    );
    return response.data;
  },

  /**
   * Get all classes with their assignment info
   */
  async getClassesWithAssignments(
    filters?: { academic_year?: number; search?: string }
  ): Promise<ClassWithAssignments[]> {
    const params = buildParams(filters);
    const response = await api.get<PaginatedResponse<ClassWithAssignments> | ClassWithAssignments[]>(
      `${CLASSES_URL}with_assignments/?${params.toString()}`
    );
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.results || [];
  },

  // ============================================================================
  // Teacher-specific Operations
  // ============================================================================

  /**
   * Get assignments created by a specific teacher
   */
  async getByTeacher(
    teacherId: number,
    filters?: AssignmentFilters
  ): Promise<AssignmentListItem[]> {
    const params = buildParams({ ...filters, teacher: teacherId });
    const response = await api.get<AssignmentListItem[]>(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  },

  // ============================================================================
  // Student-specific Operations
  // ============================================================================

  /**
   * Get assignments for a specific student (their submissions view)
   */
  async getStudentAssignments(studentId: number): Promise<StudentAssignment[]> {
    const response = await api.get<PaginatedResponse<StudentAssignment> | StudentAssignment[]>(
      `/assignment/students/${studentId}/assignments/`
    );
    // Handle both paginated and non-paginated responses
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data.results || [];
  },

  /**
   * Get assignment statistics for a student
   */
  async getStudentStats(studentId: number): Promise<StudentAssignmentStats> {
    const response = await api.get<StudentAssignmentStats>(
      `/assignment/students/${studentId}/assignments/stats/`
    );
    return response.data;
  },

  /**
   * Submit an assignment for a student
   */
  async submitAssignment(
    studentId: number,
    assignmentId: number,
    data: { content?: string; attachment?: File }
  ): Promise<{
    message: string;
    submission: {
      id: number;
      status: string;
      status_display: string;
      submitted_at: string;
      is_late: boolean;
      content: string | null;
      attachment: string | null;
    };
  }> {
    const formData = new FormData();
    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.attachment) {
      formData.append('attachment', data.attachment);
    }

    const response = await api.post(
      `/assignment/students/${studentId}/assignments/${assignmentId}/submit/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // ============================================================================
  // Submission Operations
  // ============================================================================

  /**
   * Get all submissions for an assignment
   */
  async getSubmissions(
    assignmentId: number,
    filters?: SubmissionFilters
  ): Promise<AssignmentSubmissionApiResponse[]> {
    const params = buildParams(filters);
    const response = await api.get<AssignmentSubmissionApiResponse[]>(
      `${BASE_URL}${assignmentId}/submissions/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get single submission details
   */
  async getSubmission(submissionId: number): Promise<AssignmentSubmissionApiResponse> {
    const response = await api.get<AssignmentSubmissionApiResponse>(
      `${SUBMISSIONS_URL}${submissionId}/`
    );
    return response.data;
  },

  /**
   * Grade a single submission
   */
  async gradeSubmission(
    submissionId: number,
    data: GradeSubmissionInput
  ): Promise<AssignmentSubmissionApiResponse> {
    const response = await api.post<AssignmentSubmissionApiResponse>(
      `${SUBMISSIONS_URL}${submissionId}/grade/`,
      data
    );
    return response.data;
  },

  /**
   * Bulk grade multiple submissions
   */
  async bulkGradeSubmissions(
    assignmentId: number,
    grades: BulkGradeInput[]
  ): Promise<{ success_count: number; error_count: number; errors: string[] }> {
    const response = await api.post<{
      success_count: number;
      error_count: number;
      errors: string[];
    }>(`${BASE_URL}${assignmentId}/bulk_grade/`, { grades });
    return response.data;
  },

  /**
   * Return a submission for revision
   */
  async returnSubmission(
    submissionId: number,
    feedback: string
  ): Promise<AssignmentSubmissionApiResponse> {
    const response = await api.post<AssignmentSubmissionApiResponse>(
      `${SUBMISSIONS_URL}${submissionId}/return/`,
      { feedback }
    );
    return response.data;
  },

  // ============================================================================
  // Statistics
  // ============================================================================

  /**
   * Get assignment statistics
   */
  async getStatistics(assignmentId: number): Promise<{
    submission_rate: number;
    average_score: number;
    highest_score: number;
    lowest_score: number;
    grade_distribution: Record<string, number>;
    submission_timeline: { date: string; count: number }[];
  }> {
    const response = await api.get(`${BASE_URL}${assignmentId}/statistics/`);
    return response.data;
  },
};

export default assignmentService;
