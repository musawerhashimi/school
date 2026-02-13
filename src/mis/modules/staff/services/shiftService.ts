import apiClient from '@/mis/lib/api';
import type {
  ShiftApiResponse,
  CreateShiftData,
  ShiftFilters,
  PaginatedShiftResponse,
  StaffListApiResponse,
} from '../types';

const BASE_URL = '/staff';

/**
 * Shift Service - API client for shift-related operations
 */
export const shiftService = {
  /**
   * Get all shifts with optional filters and pagination
   */
  getAll: async (filters: ShiftFilters = {}): Promise<PaginatedShiftResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedShiftResponse>(
      `${BASE_URL}/shifts/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single shift by ID
   */
  getById: async (id: number): Promise<ShiftApiResponse> => {
    const response = await apiClient.get<ShiftApiResponse>(
      `${BASE_URL}/shifts/${id}/`
    );
    return response.data;
  },

  /**
   * Create a new shift
   */
  create: async (data: CreateShiftData): Promise<ShiftApiResponse> => {
    const response = await apiClient.post<ShiftApiResponse>(
      `${BASE_URL}/shifts/`,
      data
    );
    return response.data;
  },

  /**
   * Update an existing shift
   */
  update: async (
    id: number,
    data: Partial<CreateShiftData>
  ): Promise<ShiftApiResponse> => {
    const response = await apiClient.patch<ShiftApiResponse>(
      `${BASE_URL}/shifts/${id}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete a shift
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/shifts/${id}/`);
  },

  /**
   * Get staff assigned to a shift
   */
  getAssignedStaff: async (shiftId: number): Promise<StaffListApiResponse[]> => {
    const response = await apiClient.get<StaffListApiResponse[]>(
      `${BASE_URL}/shifts/${shiftId}/assigned_staff/`
    );
    return response.data;
  },
};

export default shiftService;
