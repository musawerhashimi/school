import api from '@/lib/api';
import type { 
  ExamApiResponse, 
  ExamDetailApiResponse, 
  CreateExamData, 
  UpdateExamData, 
  ExamFilters,
  PaginatedExamsResponse,
  ExamGradesSummaryResponse,
  ExamStatisticsResponse
} from '../types';

const BASE_URL = '/exam/exams/';

export const examService = {
  async getAll(filters?: ExamFilters): Promise<PaginatedExamsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedExamsResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<ExamDetailApiResponse> {
    const response = await api.get<ExamDetailApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  async create(data: CreateExamData): Promise<ExamDetailApiResponse> {
    const response = await api.post<ExamDetailApiResponse>(BASE_URL, data);
    return response.data;
  },

  async update(id: number, data: UpdateExamData): Promise<ExamDetailApiResponse> {
    const response = await api.patch<ExamDetailApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  async getCurrentYear(): Promise<{ academic_year: string; count: number; results: ExamApiResponse[] }> {
    const response = await api.get(`${BASE_URL}current_year/`);
    return response.data;
  },

  async getGradesSummary(examId: number): Promise<ExamGradesSummaryResponse> {
    const response = await api.get<ExamGradesSummaryResponse>(`${BASE_URL}${examId}/grades_summary/`);
    return response.data;
  },

  async updateStatus(examId: number, status: string): Promise<{ message: string; status: string }> {
    const response = await api.post(`${BASE_URL}${examId}/update_status/`, { status });
    return response.data;
  },

  async getStatistics(examId: number): Promise<ExamStatisticsResponse> {
    const response = await api.get<ExamStatisticsResponse>(`${BASE_URL}${examId}/statistics/`);
    return response.data;
  },
};

export default examService;
