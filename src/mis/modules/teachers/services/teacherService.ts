import api from '@mis-lib/api';
import type {
  TeacherProfileApiResponse,
  TeacherProfileListApiResponse,
  TeacherProfileFormData,
  TeacherProfileUpdateFormData,
  TeacherFilters,
  TeacherListResponse,
  TeacherScheduleApiResponse,
  TeacherStudentApiResponse,
  TeacherStatsApiResponse,
} from '../types';

/**
 * Teacher Service
 * Handles all API calls related to teacher profiles
 */
class TeacherService {
  private baseUrl = '/staff/teachers';

  // ============================================================================
  // READ OPERATIONS
  // ============================================================================

  /**
   * Get paginated list of teachers with filters
   */
  async getAll(filters: TeacherFilters = {}): Promise<TeacherListResponse> {
    const response = await api.get<TeacherListResponse>(this.baseUrl, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single teacher profile by ID
   */
  async getById(id: number): Promise<TeacherProfileApiResponse> {
    const response = await api.get<TeacherProfileApiResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  /**
   * Get teacher statistics
   */
  async getStats(): Promise<TeacherStatsApiResponse> {
    const response = await api.get<TeacherStatsApiResponse>(
      `${this.baseUrl}/stats/`
    );
    return response.data;
  }

  /**
   * Get teacher's weekly schedule
   */
  async getSchedule(id: number): Promise<TeacherScheduleApiResponse> {
    const response = await api.get<TeacherScheduleApiResponse>(
      `${this.baseUrl}/${id}/schedule/`
    );
    return response.data;
  }

  /**
   * Get teacher's assigned classes
   */
  async getClasses(id: number): Promise<any[]> {
    const response = await api.get(`${this.baseUrl}/${id}/classes/`);
    return response.data;
  }

  /**
   * Get all students taught by a teacher
   */
  async getStudents(id: number): Promise<TeacherStudentApiResponse[]> {
    const response = await api.get<TeacherStudentApiResponse[]>(
      `${this.baseUrl}/${id}/students/`
    );
    return response.data;
  }

  /**
   * Get available teachers at a specific time
   * @param excludeSchedule - Schedule ID to exclude from busy check (for editing)
   */
  async getAvailableTeachers(
    dayOfWeek: number,
    periodNumber: number,
    excludeSchedule?: number
  ): Promise<{
    day_of_week: number;
    period_number: number;
    available_count: number;
    teachers: TeacherProfileListApiResponse[];
  }> {
    const params: Record<string, number> = {
      day_of_week: dayOfWeek,
      period_number: periodNumber,
    };
    if (excludeSchedule) {
      params.exclude_schedule = excludeSchedule;
    }
    const response = await api.get(`${this.baseUrl}/available_teachers/`, {
      params,
    });
    return response.data;
  }

  // ============================================================================
  // CREATE/UPDATE/DELETE OPERATIONS
  // ============================================================================

  /**
   * Create a new teacher profile
   * Note: Staff member must exist with position='teacher'
   */
  async create(
    data: TeacherProfileFormData
  ): Promise<TeacherProfileApiResponse> {
    const response = await api.post<TeacherProfileApiResponse>(
      this.baseUrl,
      data
    );
    return response.data;
  }

  /**
   * Update an existing teacher profile
   */
  async update(
    id: number,
    data: TeacherProfileUpdateFormData
  ): Promise<TeacherProfileApiResponse> {
    const response = await api.patch<TeacherProfileApiResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Delete a teacher profile (soft delete)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Build query string from filters
   */
  private buildQueryParams(filters: TeacherFilters): URLSearchParams {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params;
  }

  /**
   * Export teachers to CSV
   */
  async exportToCSV(filters: TeacherFilters = {}): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/export/`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  }
}

export const teacherService = new TeacherService();
export default teacherService;
