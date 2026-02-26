import apiClient from '@/mis/lib/api';
import type {
  StudentApiResponse,
  StudentListApiResponse,
  PaginatedStudentsResponse,
  StudentStatsResponse,
  CreateStudentData,
  UpdateStudentData,
  StudentFilters,
  GuardianApiResponse,
  StudentDocumentApiResponse,
  StudentAcademicPerformanceResponse,
} from '../types';

const BASE_URL = '/students';

/**
 * Student Service - API client for student-related operations
 */
export const studentService = {
  // ============================================================================
  // STUDENTS
  // ============================================================================

  /**
   * Get all students with optional filters and pagination
   */
  getAll: async (filters: StudentFilters = {}): Promise<PaginatedStudentsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedStudentsResponse>(
      `${BASE_URL}/students/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single student by ID
   */
  getById: async (id: number): Promise<StudentApiResponse> => {
    const response = await apiClient.get<StudentApiResponse>(
      `${BASE_URL}/students/${id}/`
    );
    return response.data;
  },

  /**
   * Create a new student
   */
  create: async (data: CreateStudentData): Promise<StudentApiResponse> => {
    const response = await apiClient.post<StudentApiResponse>(
      `${BASE_URL}/students/`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing student
   */
  update: async (
    id: number,
    data: UpdateStudentData
  ): Promise<StudentApiResponse> => {
    const response = await apiClient.patch<StudentApiResponse>(
      `${BASE_URL}/students/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete a student (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/students/${id}/`);
  },

  /**
   * Get student statistics
   */
  getStats: async (): Promise<StudentStatsResponse> => {
    const response = await apiClient.get<StudentStatsResponse>(
      `${BASE_URL}/students/stats/`
    );
    return response.data;
  },

  /**
   * Upload student photo
   */
  uploadPhoto: async (id: number, photo: File): Promise<StudentApiResponse> => {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await apiClient.post<StudentApiResponse>(
      `${BASE_URL}/students/${id}/upload_photo/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Delete student photo
   */
  deletePhoto: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `${BASE_URL}/students/${id}/delete_photo/`
    );
    return response.data;
  },

  /**
   * Change student status
   */
  changeStatus: async (
    id: number,
    status: string
  ): Promise<{ message: string; status: string }> => {
    const response = await apiClient.post<{ message: string; status: string }>(
      `${BASE_URL}/students/${id}/change_status/`,
      { status }
    );
    return response.data;
  },

  /**
   * Bulk update student status
   */
  bulkUpdateStatus: async (
    studentIds: number[],
    status: string
  ): Promise<{ message: string; updated_count: number }> => {
    const response = await apiClient.post<{ message: string; updated_count: number }>(
      `${BASE_URL}/students/bulk_status_update/`,
      { student_ids: studentIds, status }
    );
    return response.data;
  },

  /**
   * Export students to CSV
   */
  export: async (filters: StudentFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(
      `${BASE_URL}/students/export/?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Bulk import students from CSV
   */
  bulkImport: async (file: File): Promise<{
    created_count: number;
    error_count: number;
    created: Array<{ row: number; student_id: string; name: string }>;
    errors: Array<{ row: number; error: string; data: Record<string, string> }>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `${BASE_URL}/students/bulk_import/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Bulk promote students
   */
  bulkPromote: async (
    studentIds: number[],
    classId: number | undefined,
    className: string | undefined,
    academicYear: string,
    section?: string
  ): Promise<{ message: string; promoted_count: number }> => {
    const response = await apiClient.post(
      `${BASE_URL}/students/bulk_promote/`,
      {
        student_ids: studentIds,
        class_id: classId,
        class_name: className,
        academic_year: academicYear,
        section,
      }
    );
    return response.data;
  },

  // ============================================================================
  // GUARDIANS
  // ============================================================================

  /**
   * Get all guardians
   */
  getGuardians: async (params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Promise<{
    count: number;
    next: string | null;
    previous: string | null;
    results: GuardianApiResponse[];
  }> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.page_size) searchParams.append('page_size', String(params.page_size));

    const response = await apiClient.get(
      `${BASE_URL}/guardians/?${searchParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get guardian by ID
   */
  getGuardianById: async (id: number): Promise<GuardianApiResponse> => {
    const response = await apiClient.get<GuardianApiResponse>(
      `${BASE_URL}/guardians/${id}/`
    );
    return response.data;
  },

  /**
   * Update guardian
   */
  updateGuardian: async (
    id: number,
    data: Partial<GuardianApiResponse>
  ): Promise<GuardianApiResponse> => {
    const response = await apiClient.patch<GuardianApiResponse>(
      `${BASE_URL}/guardians/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Get students for a guardian
   */
  getGuardianStudents: async (guardianId: number): Promise<StudentListApiResponse[]> => {
    const response = await apiClient.get<StudentListApiResponse[]>(
      `${BASE_URL}/guardians/${guardianId}/students/`
    );
    return response.data;
  },

  // ============================================================================
  // DOCUMENTS
  // ============================================================================

  /**
   * Get student documents
   */
  getDocuments: async (studentId: number): Promise<StudentDocumentApiResponse[]> => {
    const response = await apiClient.get<StudentDocumentApiResponse[]>(
      `${BASE_URL}/students/${studentId}/documents/`
    );
    return response.data;
  },

  /**
   * Upload student document
   */
  uploadDocument: async (
    studentId: number,
    data: {
      document_type: string;
      title: string;
      file: File;
      description?: string;
    }
  ): Promise<StudentDocumentApiResponse> => {
    const formData = new FormData();
    formData.append('document_type', data.document_type);
    formData.append('title', data.title);
    formData.append('file', data.file);
    if (data.description) formData.append('description', data.description);

    const response = await apiClient.post<StudentDocumentApiResponse>(
      `${BASE_URL}/students/${studentId}/documents/`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  /**
   * Delete student document
   */
  deleteDocument: async (studentId: number, documentId: number): Promise<void> => {
    await apiClient.delete(
      `${BASE_URL}/students/${studentId}/documents/${documentId}/`
    );
  },

  // ============================================================================
  // ENROLLMENTS
  // ============================================================================

  /**
   * Get student enrollment history
   */
  getEnrollments: async (studentId: number): Promise<unknown[]> => {
    const response = await apiClient.get(
      `${BASE_URL}/students/${studentId}/enrollments/`
    );
    return response.data.results || response.data;
  },

  // ============================================================================
  // ACADEMIC PERFORMANCE
  // ============================================================================

  /**
   * Get student academic performance (grades, GPA, history)
   */
  getAcademicPerformance: async (studentId: number): Promise<StudentAcademicPerformanceResponse> => {
    const response = await apiClient.get<StudentAcademicPerformanceResponse>(
      `${BASE_URL}/students/${studentId}/academic-performance/`
    );
    return response.data;
  },
};

export default studentService;
