import { apiClient } from '@/lib/api';
import type {
  ClassInstanceApiResponse,
  PaginatedClassInstancesResponse,
  CreateClassInstanceData,
  UpdateClassInstanceData,
  ClassInstanceFilters,
  ClassInstanceStudentsResponse,
  ClassInstanceStats,
  CurrentYearClassesResponse,
  ClassesByLevelResponse,
} from '../types';

const BASE_URL = '/academic';

export const classInstanceService = {
  getAll: async (filters: ClassInstanceFilters = {}): Promise<PaginatedClassInstancesResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedClassInstancesResponse>(
      `${BASE_URL}/classes/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<ClassInstanceApiResponse> => {
    const response = await apiClient.get<ClassInstanceApiResponse>(
      `${BASE_URL}/classes/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateClassInstanceData): Promise<ClassInstanceApiResponse> => {
    const response = await apiClient.post<ClassInstanceApiResponse>(
      `${BASE_URL}/classes/`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateClassInstanceData
  ): Promise<ClassInstanceApiResponse> => {
    const response = await apiClient.patch<ClassInstanceApiResponse>(
      `${BASE_URL}/classes/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/classes/${id}/`);
  },

  // Custom actions
  getCurrentYear: async (): Promise<CurrentYearClassesResponse> => {
    const response = await apiClient.get<CurrentYearClassesResponse>(
      `${BASE_URL}/classes/current_year/`
    );
    return response.data;
  },

  getStudents: async (id: number): Promise<ClassInstanceStudentsResponse> => {
    const response = await apiClient.get<ClassInstanceStudentsResponse>(
      `${BASE_URL}/classes/${id}/students/`
    );
    return response.data;
  },

  getSchedule: async (id: number): Promise<{ class_name: string; message: string; schedule: unknown[] }> => {
    const response = await apiClient.get(
      `${BASE_URL}/classes/${id}/schedule/`
    );
    return response.data;
  },

  getByLevel: async (academicYearId?: number): Promise<ClassesByLevelResponse> => {
    const params = academicYearId ? `?academic_year=${academicYearId}` : '';
    const response = await apiClient.get<ClassesByLevelResponse>(
      `${BASE_URL}/classes/by_level/${params}`
    );
    return response.data;
  },

  getStats: async (academicYearId?: number): Promise<ClassInstanceStats> => {
    const params = academicYearId ? `?academic_year=${academicYearId}` : '';
    const response = await apiClient.get<ClassInstanceStats>(
      `${BASE_URL}/classes/stats/${params}`
    );
    return response.data;
  },
};

export default classInstanceService;
