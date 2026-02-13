import { apiClient } from '@/lib/api';
import type {
  ClassLevelApiResponse,
  PaginatedClassLevelsResponse,
  CreateClassLevelData,
  UpdateClassLevelData,
  ClassLevelFilters,
  SubjectApiResponse,
} from '../types';

const BASE_URL = '/academic';

export const classLevelService = {
  getAll: async (filters: ClassLevelFilters = {}): Promise<PaginatedClassLevelsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedClassLevelsResponse>(
      `${BASE_URL}/class-levels/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<ClassLevelApiResponse> => {
    const response = await apiClient.get<ClassLevelApiResponse>(
      `${BASE_URL}/class-levels/${id}/`
    );
    return response.data;
  },

  create: async (data: CreateClassLevelData): Promise<ClassLevelApiResponse> => {
    const response = await apiClient.post<ClassLevelApiResponse>(
      `${BASE_URL}/class-levels/`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateClassLevelData
  ): Promise<ClassLevelApiResponse> => {
    const response = await apiClient.patch<ClassLevelApiResponse>(
      `${BASE_URL}/class-levels/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/class-levels/${id}/`);
  },

  getSubjects: async (id: number): Promise<SubjectApiResponse[]> => {
    const response = await apiClient.get<SubjectApiResponse[]>(
      `${BASE_URL}/class-levels/${id}/subjects/`
    );
    return response.data;
  },
};

export default classLevelService;
