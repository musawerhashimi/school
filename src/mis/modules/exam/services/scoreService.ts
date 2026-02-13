import api from '@/lib/api';
import type { 
  ScoreApiResponse, 
  CreateScoreData, 
  UpdateScoreData, 
  ScoreFilters,
  PaginatedScoresResponse,
  BulkScoreCreateData,
  BulkScoreCreateResponse
} from '../types';

const BASE_URL = '/academic/scores/';

export const scoreService = {
  async getAll(filters?: ScoreFilters): Promise<PaginatedScoresResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedScoresResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<ScoreApiResponse> {
    const response = await api.get<ScoreApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  async create(data: CreateScoreData): Promise<ScoreApiResponse> {
    const response = await api.post<ScoreApiResponse>(BASE_URL, data);
    return response.data;
  },

  async update(id: number, data: UpdateScoreData): Promise<ScoreApiResponse> {
    const response = await api.patch<ScoreApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  async bulkEntry(data: BulkScoreCreateData): Promise<BulkScoreCreateResponse> {
    const response = await api.post<BulkScoreCreateResponse>(`${BASE_URL}bulk_entry/`, data);
    return response.data;
  },

  async getByGrade(gradeId: number): Promise<ScoreApiResponse> {
    const response = await api.get<ScoreApiResponse>(`${BASE_URL}by_grade/?grade=${gradeId}`);
    return response.data;
  },
};

export default scoreService;
