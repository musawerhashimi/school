import { apiClient } from '@/lib/api';
import type {
  PhysicalClassroomApiResponse,
  PaginatedPhysicalClassroomsResponse,
  CreatePhysicalClassroomData,
  UpdatePhysicalClassroomData,
  PhysicalClassroomFilters,
} from '../types';

const BASE_URL = '/academic';

export const classroomService = {
  getAll: async (filters: PhysicalClassroomFilters = {}): Promise<PaginatedPhysicalClassroomsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.append(key, String(value));
      }
    });

    const response = await apiClient.get<PaginatedPhysicalClassroomsResponse>(
      `${BASE_URL}/classrooms/?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: number): Promise<PhysicalClassroomApiResponse> => {
    const response = await apiClient.get<PhysicalClassroomApiResponse>(
      `${BASE_URL}/classrooms/${id}/`
    );
    return response.data;
  },

  getAvailable: async (): Promise<PhysicalClassroomApiResponse[]> => {
    const response = await apiClient.get<PhysicalClassroomApiResponse[]>(
      `${BASE_URL}/classrooms/available/`
    );
    return response.data;
  },

  create: async (data: CreatePhysicalClassroomData): Promise<PhysicalClassroomApiResponse> => {
    const response = await apiClient.post<PhysicalClassroomApiResponse>(
      `${BASE_URL}/classrooms/`,
      data
    );
    return response.data;
  },

  update: async (
    id: number,
    data: UpdatePhysicalClassroomData
  ): Promise<PhysicalClassroomApiResponse> => {
    const response = await apiClient.patch<PhysicalClassroomApiResponse>(
      `${BASE_URL}/classrooms/${id}/`,
      data
    );
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/classrooms/${id}/`);
  },
};

export default classroomService;
