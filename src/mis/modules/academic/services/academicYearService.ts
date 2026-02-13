import { apiClient } from '@/lib/api';
import type {
  AcademicYearApiResponse,
  PaginatedAcademicYearsResponse,
  CreateAcademicYearData,
  UpdateAcademicYearData,
  AcademicYearFilters,
} from '../types';

const BASE_URL = '/academic';

export const academicYearService = {
  getAll: async (filters: AcademicYearFilters = {}): Promise<PaginatedAcademicYearsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedAcademicYearsResponse>(
      `${BASE_URL}/academic-years/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<AcademicYearApiResponse> => {
    const response = await apiClient.get<AcademicYearApiResponse>(
      `${BASE_URL}/academic-years/${id}/`
    );
    return response.data;
  },

  getCurrent: async (): Promise<AcademicYearApiResponse> => {
    const response = await apiClient.get<AcademicYearApiResponse>(
      `${BASE_URL}/academic-years/current/`
    );
    return response.data;
  },

  create: async (data: CreateAcademicYearData): Promise<AcademicYearApiResponse> => {
    const response = await apiClient.post<AcademicYearApiResponse>(
      `${BASE_URL}/academic-years/`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateAcademicYearData
  ): Promise<AcademicYearApiResponse> => {
    const response = await apiClient.patch<AcademicYearApiResponse>(
      `${BASE_URL}/academic-years/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/academic-years/${id}/`);
  },

  setCurrent: async (id: number): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `${BASE_URL}/academic-years/${id}/set_current/`
    );
    return response.data;
  },
};

export default academicYearService;
