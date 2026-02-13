import { apiClient } from '@/lib/api';
import type {
  SubjectApiResponse,
  PaginatedSubjectsResponse,
  CreateSubjectData,
  UpdateSubjectData,
  SubjectFilters,
} from '../types';

const BASE_URL = '/academic';

export const subjectService = {
  getAll: async (filters: SubjectFilters = {}): Promise<PaginatedSubjectsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedSubjectsResponse>(
      `${BASE_URL}/subjects/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<SubjectApiResponse> => {
    const response = await apiClient.get<SubjectApiResponse>(
      `${BASE_URL}/subjects/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateSubjectData): Promise<SubjectApiResponse> => {
    const response = await apiClient.post<SubjectApiResponse>(
      `${BASE_URL}/subjects/`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateSubjectData
  ): Promise<SubjectApiResponse> => {
    const response = await apiClient.patch<SubjectApiResponse>(
      `${BASE_URL}/subjects/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/subjects/${id}/`);
  },
};

export default subjectService;
