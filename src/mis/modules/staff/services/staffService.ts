import apiClient from '@/mis/lib/api';
import type {
  StaffApiResponse,
  StaffListApiResponse,
  PaginatedStaffResponse,
  StaffStatsResponse,
  CreateStaffData,
  UpdateStaffData,
  StaffFilters,
  StaffDocumentApiResponse,
  StaffSalaryApiResponse,
  CreateSalaryData,
  AssignShiftData,
  StaffShiftApiResponse,
} from '../types';

const BASE_URL = '/staff';

/**
 * Staff Service - API client for staff-related operations
 */
export const staffService = {
  // ============================================================================
  // STAFF
  // ============================================================================

  /**
   * Get all staff with optional filters and pagination
   */
  getAll: async (filters: StaffFilters = {}): Promise<PaginatedStaffResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedStaffResponse>(
      `${BASE_URL}/staff/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single staff member by ID
   */
  getById: async (id: number): Promise<StaffApiResponse> => {
    const response = await apiClient.get<StaffApiResponse>(
      `${BASE_URL}/staff/${id}/`
    );
    return response.data;
  },

  /**
   * Create a new staff member
   */
  create: async (data: CreateStaffData): Promise<StaffApiResponse> => {
    const response = await apiClient.post<StaffApiResponse>(
      `${BASE_URL}/staff/`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing staff member
   */
  update: async (
    id: number,
    data: UpdateStaffData
  ): Promise<StaffApiResponse> => {
    const response = await apiClient.patch<StaffApiResponse>(
      `${BASE_URL}/staff/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete a staff member (soft delete)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/staff/${id}/`);
  },

  /**
   * Get staff statistics
   */
  getStats: async (): Promise<StaffStatsResponse> => {
    const response = await apiClient.get<StaffStatsResponse>(
      `${BASE_URL}/staff/stats/`
    );
    return response.data;
  },

  /**
   * Upload staff photo
   */
  uploadPhoto: async (id: number, photo: File): Promise<StaffApiResponse> => {
    const formData = new FormData();
    formData.append('photo', photo);

    const response = await apiClient.post<StaffApiResponse>(
      `${BASE_URL}/staff/${id}/upload_photo/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  // ============================================================================
  // SALARY
  // ============================================================================

  /**
   * Get salary history for a staff member
   */
  getSalaryHistory: async (staffId: number): Promise<StaffSalaryApiResponse[]> => {
    const response = await apiClient.get<StaffSalaryApiResponse[]>(
      `${BASE_URL}/staff/${staffId}/salary_history/`
    );
    return response.data;
  },

  /**
   * Set/update salary for a staff member
   */
  setSalary: async (
    staffId: number,
    data: CreateSalaryData
  ): Promise<StaffSalaryApiResponse> => {
    const response = await apiClient.post<StaffSalaryApiResponse>(
      `${BASE_URL}/staff/${staffId}/set_salary/`,
      data
    );
    return response.data;
  },

  /**
   * Get salary slip (PDF) for a staff member
   */
  getSalarySlip: async (staffId: number, month: string): Promise<Blob> => {
    const response = await apiClient.get(
      `${BASE_URL}/staff/${staffId}/salary_slip/?month=${month}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // ============================================================================
  // SHIFTS
  // ============================================================================

  /**
   * Get shifts assigned to a staff member
   */
  getShifts: async (staffId: number): Promise<StaffShiftApiResponse[]> => {
    const response = await apiClient.get<StaffShiftApiResponse[]>(
      `${BASE_URL}/staff/${staffId}/shifts/`
    );
    return response.data;
  },

  /**
   * Assign a shift to a staff member
   */
  assignShift: async (
    staffId: number,
    data: AssignShiftData
  ): Promise<StaffShiftApiResponse> => {
    const response = await apiClient.post<StaffShiftApiResponse>(
      `${BASE_URL}/staff/${staffId}/assign_shift/`,
      data
    );
    return response.data;
  },

  // ============================================================================
  // DOCUMENTS
  // ============================================================================

  /**
   * Get documents for a staff member
   */
  getDocuments: async (staffId: number): Promise<StaffDocumentApiResponse[]> => {
    const response = await apiClient.get<StaffDocumentApiResponse[]>(
      `${BASE_URL}/staff/${staffId}/documents/`
    );
    return response.data;
  },

  /**
   * Upload a document for a staff member
   */
  uploadDocument: async (
    staffId: number,
    data: {
      document_type: string;
      title: string;
      file: File;
      description?: string;
    }
  ): Promise<StaffDocumentApiResponse> => {
    const formData = new FormData();
    formData.append('document_type', data.document_type);
    formData.append('title', data.title);
    formData.append('file', data.file);
    if (data.description) formData.append('description', data.description);

    const response = await apiClient.post<StaffDocumentApiResponse>(
      `${BASE_URL}/staff/${staffId}/upload_document/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  /**
   * Delete a document
   */
  deleteDocument: async (staffId: number, documentId: number): Promise<void> => {
    await apiClient.delete(
      `${BASE_URL}/staff/${staffId}/documents/${documentId}/`
    );
  },

  // ============================================================================
  // ATTENDANCE (Display only - from Attendance module)
  // ============================================================================

  /**
   * Get attendance summary for a staff member
   */
  getAttendanceSummary: async (
    staffId: number,
    params?: { month?: string; year?: string }
  ): Promise<any> => {
    const queryParams = new URLSearchParams();
    if (params?.month) queryParams.append('month', params.month);
    if (params?.year) queryParams.append('year', params.year);

    const response = await apiClient.get(
      `${BASE_URL}/staff/${staffId}/attendance_summary/?${queryParams.toString()}`
    );
    return response.data;
  },

  // ============================================================================
  // EXPORTS / IMPORTS
  // ============================================================================

  /**
   * Export staff to CSV with current filters applied
   */
  export: async (filters: StaffFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get(
      `${BASE_URL}/staff/export/?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Bulk import staff from CSV file
   */
  bulkImport: async (file: File): Promise<{
    created_count: number;
    error_count: number;
    created: Array<{ row: number; staff_id: string; name: string }>;
    errors: Array<{ row: number; error: string; data: Record<string, string> }>;
  }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(
      `${BASE_URL}/staff/bulk_import/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },
};

export default staffService;
