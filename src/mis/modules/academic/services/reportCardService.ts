import api from '@/lib/api';
import type {
  ReportCardApiResponse,
  ReportCardDetailApiResponse,
  UpdateReportCardData,
  ReportCardFilters,
  PaginatedReportCardsResponse,
  GenerateReportCardsData,
  GenerateReportCardsResponse,
  ClassResultsResponse,
} from '../types';

const BASE_URL = '/academic/report-cards/';

export const reportCardService = {
  async getAll(filters?: ReportCardFilters): Promise<PaginatedReportCardsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedReportCardsResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<ReportCardDetailApiResponse> {
    const response = await api.get<ReportCardDetailApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  async update(id: number, data: UpdateReportCardData): Promise<ReportCardDetailApiResponse> {
    const response = await api.patch<ReportCardDetailApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  async generate(data: GenerateReportCardsData): Promise<GenerateReportCardsResponse> {
    const response = await api.post<GenerateReportCardsResponse>(`${BASE_URL}generate/`, data);
    return response.data;
  },

  async getClassResults(classInstanceId: number, academicYearId?: number): Promise<ClassResultsResponse> {
    let url = `${BASE_URL}class_results/?class_instance=${classInstanceId}`;
    if (academicYearId) url += `&academic_year=${academicYearId}`;
    const response = await api.get<ClassResultsResponse>(url);
    return response.data;
  },

  async approve(id: number): Promise<{ message: string }> {
    const response = await api.post(`${BASE_URL}${id}/approve/`);
    return response.data;
  },

  async bulkApprove(ids: number[]): Promise<{ message: string; approved_count: number }> {
    const response = await api.post(`${BASE_URL}bulk_approve/`, { ids });
    return response.data;
  },

  async publish(data: { ids?: number[]; class_instance?: number; academic_year?: number }): Promise<{ message: string; published_count: number }> {
    const response = await api.post(`${BASE_URL}publish/`, data);
    return response.data;
  },
};

export default reportCardService;
