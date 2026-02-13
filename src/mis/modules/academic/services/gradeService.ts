import api from '@/lib/api';
import type {
  GradeApiResponse,
  GradeDetailApiResponse,
  CreateGradeData,
  GradeFilters,
  PaginatedGradesResponse,
  BulkGradeCreateData,
  BulkGradeCreateResponse,
  GradesByClassResponse,
  StudentTranscriptResponse,
} from '../types';

const BASE_URL = '/academic/grades/';

export const gradeService = {
  async getAll(filters?: GradeFilters): Promise<PaginatedGradesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedGradesResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  async getById(id: number): Promise<GradeDetailApiResponse> {
    const response = await api.get<GradeDetailApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  async create(data: CreateGradeData): Promise<GradeDetailApiResponse> {
    const response = await api.post<GradeDetailApiResponse>(BASE_URL, data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateGradeData>): Promise<GradeDetailApiResponse> {
    const response = await api.patch<GradeDetailApiResponse>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  async bulkEntry(data: BulkGradeCreateData): Promise<BulkGradeCreateResponse> {
    const response = await api.post<BulkGradeCreateResponse>(`${BASE_URL}bulk_entry/`, data);
    return response.data;
  },

  async getByClass(examId: number, classInstanceId: number): Promise<GradesByClassResponse> {
    const response = await api.get<GradesByClassResponse>(
      `${BASE_URL}by_class/?exam=${examId}&class_instance=${classInstanceId}`
    );
    return response.data;
  },

  async getStudentTranscript(studentId: number, academicYearId?: number): Promise<StudentTranscriptResponse> {
    let url = `${BASE_URL}student_transcript/?student=${studentId}`;
    if (academicYearId) url += `&academic_year=${academicYearId}`;
    const response = await api.get<StudentTranscriptResponse>(url);
    return response.data;
  },
};

export default gradeService;
