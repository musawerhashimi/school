import api from '@/lib/api';
import type { 
  ExamScheduleDetailApiResponse, 
  CreateExamScheduleData, 
  UpdateExamScheduleData, 
  ExamScheduleFilters,
  PaginatedExamSchedulesResponse,
  ExamScheduleCalendarResponse,
  ExamScheduleConflictCheckResponse,
  ConflictCheckData
} from '../types';

const BASE_URL = '/exam/exam-schedules/';

export const examScheduleService = {
  async getAll(filters?: ExamScheduleFilters): Promise<PaginatedExamSchedulesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedExamSchedulesResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<ExamScheduleDetailApiResponse> {
    const response = await api.get<ExamScheduleDetailApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  async create(data: CreateExamScheduleData): Promise<ExamScheduleDetailApiResponse> {
    const response = await api.post<ExamScheduleDetailApiResponse>(BASE_URL, data);
    return response.data;
  },

  async update(id: number, data: UpdateExamScheduleData): Promise<ExamScheduleDetailApiResponse> {
    const response = await api.patch<ExamScheduleDetailApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  async getByExam(examId: number): Promise<PaginatedExamSchedulesResponse> {
    const response = await api.get<PaginatedExamSchedulesResponse>(
      `${BASE_URL}by_exam/?exam=${examId}`
    );
    return response.data;
  },

  async getByClass(classInstanceId: number): Promise<PaginatedExamSchedulesResponse> {
    const response = await api.get<PaginatedExamSchedulesResponse>(
      `${BASE_URL}by_class/?class_instance=${classInstanceId}`
    );
    return response.data;
  },

  async getCalendar(filters?: ExamScheduleFilters): Promise<ExamScheduleCalendarResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<ExamScheduleCalendarResponse>(
      `${BASE_URL}calendar/?${params.toString()}`
    );
    return response.data;
  },

  async checkConflicts(data: ConflictCheckData): Promise<ExamScheduleConflictCheckResponse> {
    const response = await api.post<ExamScheduleConflictCheckResponse>(
      `${BASE_URL}check_conflicts/`,
      data
    );
    return response.data;
  },
};

export default examScheduleService;
