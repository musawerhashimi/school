/**
 * Library Service
 * API service layer for library management
 */

import api from '@/lib/api';
import type {
  BookCategory,
  BookCategoryTree,
  LibraryItemListResponse,
  LibraryItemDetailResponse,
  BookCopyListResponse,
  BookCopyDetailResponse,
  BorrowRecordListResponse,
  BorrowRecordDetailResponse,
  DigitalAccessLogResponse,
  BookRecommendationResponse,
  LibraryDashboardStats,
  PopularBookResponse,
  OverdueRecordResponse,
  StudentLibrarySummary,
  LibrarySettings,
  BookStatistics,
  RecentActivityItem,
  LibraryItemInput,
  BookCopyInput,
  BulkBookCopyInput,
  IssueBookInput,
  ReturnBookInput,
  RenewBorrowInput,
  LogDigitalAccessInput,
  BookRecommendationInput,
  LibrarySettingsInput,
  LibraryItemFilters,
  BookCopyFilters,
  BorrowRecordFilters,
  DigitalAccessLogFilters,
  BookRecommendationFilters,
  PaginatedResponse,
} from '../types';

// Base URLs
const CATEGORIES_URL = '/library/categories/';
const ITEMS_URL = '/library/items/';
const COPIES_URL = '/library/copies/';
const BORROWS_URL = '/library/borrows/';
const DIGITAL_ACCESS_URL = '/library/digital-access/';
const RECOMMENDATIONS_URL = '/library/recommendations/';
const DASHBOARD_URL = '/library/dashboard/';
const SETTINGS_URL = '/library/settings/';
const STUDENTS_URL = '/library/students/';

/**
 * Build URL search params from filters object
 */
function buildParams(filters?: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
  }
  return params;
}

export const libraryService = {
  // ============================================================================
  // Categories
  // ============================================================================

  categories: {
    /**
     * Get all categories
     */
    async getAll(): Promise<BookCategory[]> {
      const response = await api.get<PaginatedResponse<BookCategory> | BookCategory[]>(CATEGORIES_URL);
      // Handle both paginated and non-paginated responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results || [];
    },

    /**
     * Get category tree (hierarchical)
     */
    async getTree(): Promise<BookCategoryTree[]> {
      const response = await api.get<BookCategoryTree[]>(`${CATEGORIES_URL}tree/`);
      return response.data;
    },

    /**
     * Get category by ID
     */
    async getById(id: number): Promise<BookCategory> {
      const response = await api.get<BookCategory>(`${CATEGORIES_URL}${id}/`);
      return response.data;
    },

    /**
     * Create category
     */
    async create(data: { name: string; description?: string; parent?: number }): Promise<BookCategory> {
      const response = await api.post<BookCategory>(CATEGORIES_URL, data);
      return response.data;
    },

    /**
     * Update category
     */
    async update(id: number, data: Partial<{ name: string; description?: string; parent?: number }>): Promise<BookCategory> {
      const response = await api.patch<BookCategory>(`${CATEGORIES_URL}${id}/`, data);
      return response.data;
    },

    /**
     * Delete category
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${CATEGORIES_URL}${id}/`);
    },
  },

  // ============================================================================
  // Library Items (Books)
  // ============================================================================

  items: {
    /**
     * Get paginated list of library items
     */
    async getAll(filters?: LibraryItemFilters): Promise<PaginatedResponse<LibraryItemListResponse>> {
      const params = buildParams(filters);
      const response = await api.get<PaginatedResponse<LibraryItemListResponse>>(
        `${ITEMS_URL}?${params.toString()}`
      );
      return response.data;
    },

    /**
     * Get library item by ID
     */
    async getById(id: number): Promise<LibraryItemDetailResponse> {
      const response = await api.get<LibraryItemDetailResponse>(`${ITEMS_URL}${id}/`);
      return response.data;
    },

    /**
     * Create library item
     */
    async create(data: LibraryItemInput): Promise<LibraryItemDetailResponse> {
      // Check if we have files to upload
      const hasFiles = data.cover_image instanceof File || data.digital_file instanceof File;

      if (hasFiles) {
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value === null || value === undefined) return;

          if (value instanceof File) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        const response = await api.post<LibraryItemDetailResponse>(ITEMS_URL, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        const response = await api.post<LibraryItemDetailResponse>(ITEMS_URL, data);
        return response.data;
      }
    },

    /**
     * Update library item
     */
    async update(id: number, data: Partial<LibraryItemInput>): Promise<LibraryItemDetailResponse> {
      // Check if we have files to upload
      const hasFiles = data.cover_image instanceof File || data.digital_file instanceof File;

      if (hasFiles) {
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value === null || value === undefined) return;

          if (value instanceof File) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        const response = await api.patch<LibraryItemDetailResponse>(`${ITEMS_URL}${id}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      } else {
        const response = await api.patch<LibraryItemDetailResponse>(`${ITEMS_URL}${id}/`, data);
        return response.data;
      }
    },

    /**
     * Delete library item
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${ITEMS_URL}${id}/`);
    },

    /**
     * Upload cover image
     */
    async uploadCover(id: number, file: File): Promise<LibraryItemDetailResponse> {
      const formData = new FormData();
      formData.append('cover_image', file);
      const response = await api.post<LibraryItemDetailResponse>(
        `${ITEMS_URL}${id}/upload_cover/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },

    /**
     * Upload digital file
     */
    async uploadDigital(id: number, file: File): Promise<LibraryItemDetailResponse> {
      const formData = new FormData();
      formData.append('digital_file', file);
      const response = await api.post<LibraryItemDetailResponse>(
        `${ITEMS_URL}${id}/upload_digital/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    },

    /**
     * Get copies of a library item
     */
    async getCopies(id: number): Promise<BookCopyListResponse[]> {
      const response = await api.get<BookCopyListResponse[]>(`${ITEMS_URL}${id}/copies/`);
      return response.data;
    },

    /**
     * Get statistics for a library item
     */
    async getStatistics(id: number): Promise<BookStatistics> {
      const response = await api.get<BookStatistics>(`${ITEMS_URL}${id}/statistics/`);
      return response.data;
    },
  },

  // ============================================================================
  // Book Copies
  // ============================================================================

  copies: {
    /**
     * Get paginated list of book copies
     */
    async getAll(filters?: BookCopyFilters): Promise<PaginatedResponse<BookCopyListResponse>> {
      const params = buildParams(filters);
      const response = await api.get<PaginatedResponse<BookCopyListResponse>>(
        `${COPIES_URL}?${params.toString()}`
      );
      return response.data;
    },

    /**
     * Get book copy by ID
     */
    async getById(id: number): Promise<BookCopyDetailResponse> {
      const response = await api.get<BookCopyDetailResponse>(`${COPIES_URL}${id}/`);
      return response.data;
    },

    /**
     * Get book copy by barcode
     */
    async getByBarcode(barcode: string): Promise<BookCopyDetailResponse> {
      const response = await api.get<BookCopyDetailResponse>(
        `${COPIES_URL}by_barcode/?barcode=${encodeURIComponent(barcode)}`
      );
      return response.data;
    },

    /**
     * Create book copy
     */
    async create(data: BookCopyInput): Promise<BookCopyDetailResponse> {
      const response = await api.post<BookCopyDetailResponse>(COPIES_URL, data);
      return response.data;
    },

    /**
     * Update book copy
     */
    async update(id: number, data: Partial<BookCopyInput>): Promise<BookCopyDetailResponse> {
      const response = await api.patch<BookCopyDetailResponse>(`${COPIES_URL}${id}/`, data);
      return response.data;
    },

    /**
     * Delete book copy
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${COPIES_URL}${id}/`);
    },

    /**
     * Bulk create book copies
     */
    async bulkCreate(data: BulkBookCopyInput): Promise<{ created_count: number; copies: BookCopyListResponse[] }> {
      const response = await api.post<{ created_count: number; copies: BookCopyListResponse[] }>(
        `${COPIES_URL}bulk_create/`,
        data
      );
      return response.data;
    },
  },

  // ============================================================================
  // Borrow Records
  // ============================================================================

  borrows: {
    /**
     * Get paginated list of borrow records
     */
    async getAll(filters?: BorrowRecordFilters): Promise<PaginatedResponse<BorrowRecordListResponse>> {
      const params = buildParams(filters);
      const response = await api.get<PaginatedResponse<BorrowRecordListResponse>>(
        `${BORROWS_URL}?${params.toString()}`
      );
      return response.data;
    },

    /**
     * Get borrow record by ID
     */
    async getById(id: number): Promise<BorrowRecordDetailResponse> {
      const response = await api.get<BorrowRecordDetailResponse>(`${BORROWS_URL}${id}/`);
      return response.data;
    },

    /**
     * Issue a book to a student
     */
    async issue(data: IssueBookInput): Promise<BorrowRecordDetailResponse> {
      const response = await api.post<BorrowRecordDetailResponse>(`${BORROWS_URL}issue/`, data);
      return response.data;
    },

    /**
     * Return a book
     */
    async return(data: ReturnBookInput): Promise<BorrowRecordDetailResponse> {
      const response = await api.post<BorrowRecordDetailResponse>(`${BORROWS_URL}return_book/`, data);
      return response.data;
    },

    /**
     * Get active borrows
     */
    async getActive(): Promise<BorrowRecordListResponse[]> {
      const response = await api.get<PaginatedResponse<BorrowRecordListResponse> | BorrowRecordListResponse[]>(`${BORROWS_URL}active/`);
      // Handle both paginated and non-paginated responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results || [];
    },

    /**
     * Get overdue borrows
     */
    async getOverdue(): Promise<OverdueRecordResponse[]> {
      const response = await api.get<OverdueRecordResponse[]>(`${BORROWS_URL}overdue/`);
      return response.data;
    },

    /**
     * Renew a borrow
     */
    async renew(id: number, data: RenewBorrowInput): Promise<BorrowRecordDetailResponse> {
      const response = await api.post<BorrowRecordDetailResponse>(`${BORROWS_URL}${id}/renew/`, data);
      return response.data;
    },

    /**
     * Mark a book as lost
     */
    async markLost(id: number, replacementFine?: number): Promise<BorrowRecordDetailResponse> {
      const response = await api.post<BorrowRecordDetailResponse>(
        `${BORROWS_URL}${id}/mark_lost/`,
        replacementFine ? { replacement_fine: replacementFine } : {}
      );
      return response.data;
    },
  },

  // ============================================================================
  // Student Library
  // ============================================================================

  students: {
    /**
     * Get student's borrow records
     */
    async getBorrows(studentId: number): Promise<BorrowRecordListResponse[]> {
      const response = await api.get<BorrowRecordListResponse[]>(
        `${STUDENTS_URL}${studentId}/borrows/`
      );
      return response.data;
    },

    /**
     * Get student's library summary
     */
    async getSummary(studentId: number): Promise<StudentLibrarySummary> {
      const response = await api.get<StudentLibrarySummary>(
        `${STUDENTS_URL}${studentId}/summary/`
      );
      return response.data;
    },
  },

  // ============================================================================
  // Digital Access
  // ============================================================================

  digitalAccess: {
    /**
     * Get digital access logs
     */
    async getAll(filters?: DigitalAccessLogFilters): Promise<PaginatedResponse<DigitalAccessLogResponse>> {
      const params = buildParams(filters);
      const response = await api.get<PaginatedResponse<DigitalAccessLogResponse>>(
        `${DIGITAL_ACCESS_URL}?${params.toString()}`
      );
      return response.data;
    },

    /**
     * Log digital access
     */
    async log(data: LogDigitalAccessInput): Promise<DigitalAccessLogResponse> {
      const response = await api.post<DigitalAccessLogResponse>(`${DIGITAL_ACCESS_URL}log/`, data);
      return response.data;
    },
  },

  // ============================================================================
  // Recommendations
  // ============================================================================

  recommendations: {
    /**
     * Get book recommendations
     */
    async getAll(filters?: BookRecommendationFilters): Promise<PaginatedResponse<BookRecommendationResponse>> {
      const params = buildParams(filters);
      const response = await api.get<PaginatedResponse<BookRecommendationResponse>>(
        `${RECOMMENDATIONS_URL}?${params.toString()}`
      );
      return response.data;
    },

    /**
     * Get recommendations for a class
     */
    async getByClass(classId: number): Promise<BookRecommendationResponse[]> {
      const response = await api.get<BookRecommendationResponse[]>(
        `${RECOMMENDATIONS_URL}class/${classId}/`
      );
      return response.data;
    },

    /**
     * Create recommendation
     */
    async create(data: BookRecommendationInput): Promise<BookRecommendationResponse> {
      const response = await api.post<BookRecommendationResponse>(RECOMMENDATIONS_URL, data);
      return response.data;
    },

    /**
     * Delete recommendation
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${RECOMMENDATIONS_URL}${id}/`);
    },
  },

  // ============================================================================
  // Dashboard
  // ============================================================================

  dashboard: {
    /**
     * Get dashboard statistics
     */
    async getStats(): Promise<LibraryDashboardStats> {
      const response = await api.get<LibraryDashboardStats>(`${DASHBOARD_URL}stats/`);
      return response.data;
    },

    /**
     * Get popular books
     */
    async getPopular(limit = 10): Promise<PopularBookResponse[]> {
      const response = await api.get<PopularBookResponse[]>(
        `${DASHBOARD_URL}popular/?limit=${limit}`
      );
      return response.data;
    },

    /**
     * Get recent activity
     */
    async getRecentActivity(limit = 20): Promise<RecentActivityItem[]> {
      const response = await api.get<RecentActivityItem[]>(
        `${DASHBOARD_URL}recent_activity/?limit=${limit}`
      );
      return response.data;
    },
  },

  // ============================================================================
  // Settings
  // ============================================================================

  settings: {
    /**
     * Get library settings
     */
    async get(): Promise<LibrarySettings> {
      const response = await api.get<LibrarySettings | LibrarySettings[]>(SETTINGS_URL);
      // Settings is a singleton - handle both single object and array response
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          throw new Error('Library settings not configured');
        }
        return response.data[0];
      }
      return response.data;
    },

    /**
     * Update library settings
     */
    async update(id: number, data: LibrarySettingsInput): Promise<LibrarySettings> {
      const response = await api.patch<LibrarySettings>(`${SETTINGS_URL}${id}/`, data);
      return response.data;
    },
  },
};

export default libraryService;
