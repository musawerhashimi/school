import api from '@/lib/api';
import type {
  ScheduleApiResponse,
  ScheduleDetailApiResponse,
  CreateScheduleData,
  UpdateScheduleData,
  ScheduleFilters,
  PaginatedSchedulesResponse,
  WeeklyScheduleResponse,
  TeacherScheduleResponse,
  RoomScheduleResponse,
  ConflictCheckResponse,
  AvailablePeriodsResponse,
  BulkScheduleCreateResponse,
  ScheduleWithWarnings,
  DayOfWeek,
} from '../types';

const BASE_URL = '/academic/schedules/';

/**
 * Schedule Service
 * Handles all API interactions for schedule/timetable management
 */
export const scheduleService = {
  /**
   * Get all schedules with optional filters
   */
  async getAll(filters?: ScheduleFilters): Promise<PaginatedSchedulesResponse> {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedSchedulesResponse>(
      `${BASE_URL}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get schedule by ID
   */
  async getById(id: number): Promise<ScheduleDetailApiResponse> {
    const response = await api.get<ScheduleDetailApiResponse>(`${BASE_URL}${id}/`);
    return response.data;
  },

  /**
   * Create a new schedule slot
   */
  async create(data: CreateScheduleData): Promise<ScheduleWithWarnings> {
    const response = await api.post<ScheduleWithWarnings>(BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing schedule slot
   */
  async update(id: number, data: UpdateScheduleData): Promise<ScheduleWithWarnings> {
    const response = await api.patch<ScheduleWithWarnings>(`${BASE_URL}${id}/`, data);
    return response.data;
  },

  /**
   * Delete a schedule slot
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${BASE_URL}${id}/`);
  },

  /**
   * Get weekly schedule for a class
   */
  async getWeeklySchedule(classInstanceId: number): Promise<WeeklyScheduleResponse> {
    const response = await api.get<WeeklyScheduleResponse>(
      `${BASE_URL}weekly/?class_instance=${classInstanceId}`
    );
    return response.data;
  },

  /**
   * Get weekly schedule for a teacher
   */
  async getTeacherSchedule(
    teacherId: number,
    academicYearId?: number
  ): Promise<TeacherScheduleResponse> {
    let url = `${BASE_URL}teacher_schedule/?teacher=${teacherId}`;
    if (academicYearId) {
      url += `&academic_year=${academicYearId}`;
    }
    const response = await api.get<TeacherScheduleResponse>(url);
    return response.data;
  },

  /**
   * Get weekly schedule for a room
   */
  async getRoomSchedule(
    roomId: number,
    academicYearId?: number
  ): Promise<RoomScheduleResponse> {
    let url = `${BASE_URL}room_schedule/?room=${roomId}`;
    if (academicYearId) {
      url += `&academic_year=${academicYearId}`;
    }
    const response = await api.get<RoomScheduleResponse>(url);
    return response.data;
  },

  /**
   * Check for conflicts before creating/updating
   */
  async checkConflicts(data: CreateScheduleData): Promise<ConflictCheckResponse> {
    const response = await api.post<ConflictCheckResponse>(
      `${BASE_URL}check_conflicts/`,
      data
    );
    return response.data;
  },

  /**
   * Bulk create multiple schedule slots
   */
  async bulkCreate(schedules: CreateScheduleData[]): Promise<BulkScheduleCreateResponse> {
    const response = await api.post<BulkScheduleCreateResponse>(
      `${BASE_URL}bulk_create/`,
      { schedules }
    );
    return response.data;
  },

  /**
   * Clear all schedule slots for a class
   */
  async clearClassSchedule(classInstanceId: number): Promise<{ deleted_count: number }> {
    const response = await api.delete<{ message: string; deleted_count: number }>(
      `${BASE_URL}clear_class_schedule/?class_instance=${classInstanceId}`
    );
    return { deleted_count: response.data.deleted_count };
  },

  /**
   * Get available periods for a specific day and class
   */
  async getAvailablePeriods(
    classInstanceId: number,
    dayOfWeek: DayOfWeek
  ): Promise<AvailablePeriodsResponse> {
    const response = await api.get<AvailablePeriodsResponse>(
      `${BASE_URL}available_periods/?class_instance=${classInstanceId}&day_of_week=${dayOfWeek}`
    );
    return response.data;
  },

  /**
   * Get schedules for a specific class (all slots)
   */
  async getByClass(classInstanceId: number): Promise<ScheduleApiResponse[]> {
    const response = await api.get<PaginatedSchedulesResponse>(
      `${BASE_URL}?class_instance=${classInstanceId}&page_size=100`
    );
    return response.data.results;
  },

  /**
   * Get schedules for a specific day
   */
  async getByDay(
    classInstanceId: number,
    dayOfWeek: DayOfWeek
  ): Promise<ScheduleApiResponse[]> {
    const response = await api.get<PaginatedSchedulesResponse>(
      `${BASE_URL}?class_instance=${classInstanceId}&day_of_week=${dayOfWeek}&ordering=period_number`
    );
    return response.data.results;
  },
};

export default scheduleService;
