/**
 * Library Module Types
 * Type definitions for the library management system
 */

// ============================================================================
// Enums and Type Aliases
// ============================================================================

/**
 * Library item format type
 */
export type LibraryItemFormat = 'physical' | 'digital' | 'both';

/**
 * Book copy status
 */
export type BookCopyStatus = 'available' | 'issued' | 'reserved' | 'lost' | 'damaged';

/**
 * Book copy condition
 */
export type BookCondition = 'new' | 'good' | 'fair' | 'poor';

/**
 * Borrow record status
 */
export type BorrowStatus = 'active' | 'returned' | 'overdue' | 'lost';

/**
 * Digital access type
 */
export type DigitalAccessType = 'read' | 'download';

/**
 * Digital file type
 */
export type DigitalFileType = 'pdf' | 'epub';

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Book category
 */
export interface BookCategory {
  id: number;
  name: string;
  description: string;
  parent: number | null;
  parent_name: string | null;
  book_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Book category tree node
 */
export interface BookCategoryTree extends BookCategory {
  children: BookCategoryTree[];
}

/**
 * Library item (book) list response
 */
export interface LibraryItemListResponse {
  id: number;
  title: string;
  subtitle: string;
  author: string;
  isbn: string;
  isbn_13: string;
  publisher: string;
  publication_year: number | null;
  format: LibraryItemFormat;
  format_display: string;
  category: number;
  category_name: string;
  cover_image: string | null;
  digital_file: string | null;
  total_copies: number;
  available_copies: number;
  times_borrowed: number;
  is_active: boolean;
  has_digital: boolean;
  created_at: string;
}

/**
 * Library item (book) detail response
 */
export interface LibraryItemDetailResponse extends LibraryItemListResponse {
  co_authors: string[];
  edition: string;
  language: string;
  tags: string[];
  description: string;
  summary: string;
  table_of_contents: string;
  page_count: number | null;
  digital_file: string | null;
  file_type: string;
  is_downloadable: boolean;
  added_by: number | null;
  added_by_name: string | null;
  average_rating: number | null;
  current_borrows: number;
  updated_at: string;
}

/**
 * Book copy list response
 */
export interface BookCopyListResponse {
  id: number;
  library_item: number;
  book_title: string;
  book_author: string;
  barcode: string;
  accession_number: string;
  shelf_location: string;
  building: string;
  floor: string;
  section: string;
  status: BookCopyStatus;
  status_display: string;
  condition: BookCondition;
  condition_display: string;
  is_reference_only: boolean;
  is_available: boolean;
  current_borrower: string | null;
}

/**
 * Book copy detail response
 */
export interface BookCopyDetailResponse extends BookCopyListResponse {
  acquisition_date: string | null;
  acquisition_cost: number | null;
  notes: string;
  updated_at: string;
}

/**
 * Borrow record list response
 */
export interface BorrowRecordListResponse {
  id: number;
  book_copy: number;
  barcode: string;
  book_title: string;
  book_author: string;
  cover_thumbnail: string | null;
  student: number;
  student_name: string;
  student_id_number: string;
  student_class: string;
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: BorrowStatus;
  status_display: string;
  is_overdue: boolean;
  days_overdue: number;
  fine_amount: number;
  fine_paid: boolean;
  fine_waived: boolean;
  issued_by_name: string;
}

/**
 * Borrow record detail response
 */
export interface BorrowRecordDetailResponse extends BorrowRecordListResponse {
  returned_to: number | null;
  returned_to_name: string | null;
  fine_paid_at: string | null;
  fine_waived_reason: string;
  issue_notes: string;
  return_notes: string;
  created_at: string;
  updated_at: string;
}

/**
 * Digital access log response
 */
export interface DigitalAccessLogResponse {
  id: number;
  library_item: number;
  book_title: string;
  student: number;
  student_name: string;
  access_type: DigitalAccessType;
  access_type_display: string;
  accessed_at: string;
  duration_seconds: number;
  pages_viewed: number;
}

/**
 * Book recommendation response
 */
export interface BookRecommendationResponse {
  id: number;
  library_item: number;
  book_title: string;
  book_author: string;
  cover_image: string | null;
  teacher: number;
  teacher_name: string;
  class_instance: number;
  class_name: string;
  subject: number | null;
  subject_name: string | null;
  is_required: boolean;
  notes: string;
  is_active: boolean;
  created_at: string;
}

/**
 * Library dashboard stats
 */
export interface LibraryDashboardStats {
  total_books: number;
  total_copies: number;
  available_copies: number;
  issued_copies: number;
  digital_books: number;
  active_borrows: number;
  overdue_count: number;
  pending_fines: number;
  total_fines_collected: number;
  new_books_this_month: number;
  borrows_this_month: number;
  returns_this_month: number;
}

/**
 * Popular book response
 */
export interface PopularBookResponse {
  id: number;
  title: string;
  author: string;
  cover_image: string | null;
  times_borrowed: number;
  category_name: string;
}

/**
 * Overdue record response
 */
export interface OverdueRecordResponse {
  id: number;
  book_title: string;
  barcode: string;
  student_name: string;
  student_id_number: string;
  student_class: string;
  due_date: string;
  days_overdue: number;
  fine_amount: number;
}

/**
 * Student library summary
 */
export interface StudentLibrarySummary {
  student_id: number;
  student_name: string;
  current_borrows: number;
  max_borrows: number;
  can_borrow: boolean;
  has_overdue: boolean;
  overdue_count: number;
  total_fines: number;
  unpaid_fines: number;
  total_borrows: number;
  books_returned_on_time: number;
  on_time_rate: number;
}

/**
 * Library settings
 */
export interface LibrarySettings {
  id: number;
  default_loan_period_days: number;
  max_books_per_student: number;
  max_renewals: number;
  fine_per_day: number;
  allow_renewals: boolean;
  renewal_period_days: number;
  reservation_expiry_days: number;
  send_due_reminders: boolean;
  reminder_days_before: number;
  updated_at: string;
}

// ============================================================================
// Request/Input Types
// ============================================================================

/**
 * Create/Update library item input
 */
export interface LibraryItemInput {
  title: string;
  subtitle?: string;
  author: string;
  co_authors?: string[];
  isbn?: string;
  isbn_13?: string;
  publisher?: string;
  publication_year?: number;
  edition?: string;
  language?: string;
  category: number;
  tags?: string[];
  description?: string;
  summary?: string;
  table_of_contents?: string;
  page_count?: number;
  format: LibraryItemFormat;
  cover_image?: File | null;
  digital_file?: File | null;
  file_type?: string;
  is_downloadable?: boolean;
  is_active?: boolean;
}

/**
 * Create/Update book copy input
 */
export interface BookCopyInput {
  library_item: number;
  barcode: string;
  accession_number?: string;
  shelf_location: string;
  building?: string;
  floor?: string;
  section?: string;
  status?: BookCopyStatus;
  condition?: BookCondition;
  is_reference_only?: boolean;
  acquisition_date?: string;
  acquisition_cost?: number;
  notes?: string;
}

/**
 * Bulk create book copies input
 */
export interface BulkBookCopyInput {
  library_item: number;
  copies: {
    barcode: string;
    shelf_location: string;
    accession_number?: string;
  }[];
}

/**
 * Issue book input
 */
export interface IssueBookInput {
  book_copy_id?: number;
  barcode?: string;
  student_id: number;
  due_date: string;
  notes?: string;
}

/**
 * Return book input
 */
export interface ReturnBookInput {
  book_copy_id?: number;
  barcode?: string;
  borrow_record_id?: number;
  notes?: string;
  waive_fine?: boolean;
  waive_reason?: string;
}

/**
 * Renew borrow input
 */
export interface RenewBorrowInput {
  new_due_date: string;
}

/**
 * Log digital access input
 */
export interface LogDigitalAccessInput {
  library_item_id: number;
  access_type: DigitalAccessType;
  duration_seconds?: number;
  pages_viewed?: number;
}

/**
 * Create book recommendation input
 */
export interface BookRecommendationInput {
  library_item: number;
  class_instance: number;
  subject?: number;
  is_required?: boolean;
  notes?: string;
}

/**
 * Update library settings input
 */
export interface LibrarySettingsInput {
  default_loan_period_days?: number;
  max_books_per_student?: number;
  max_renewals?: number;
  fine_per_day?: number;
  allow_renewals?: boolean;
  renewal_period_days?: number;
  reservation_expiry_days?: number;
  send_due_reminders?: boolean;
  reminder_days_before?: number;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Library item filters
 */
export interface LibraryItemFilters {
  category?: number;
  format?: LibraryItemFormat;
  author?: string;
  publisher?: string;
  language?: string;
  publication_year_min?: number;
  publication_year_max?: number;
  is_available?: boolean;
  has_digital?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/**
 * Book copy filters
 */
export interface BookCopyFilters {
  library_item?: number;
  status?: BookCopyStatus;
  condition?: BookCondition;
  shelf_location?: string;
  building?: string;
  section?: string;
  is_reference_only?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/**
 * Borrow record filters
 */
export interface BorrowRecordFilters {
  student?: number;
  book_copy?: number;
  library_item?: number;
  status?: BorrowStatus;
  is_overdue?: boolean;
  issued_by?: number;
  issue_date_after?: string;
  issue_date_before?: string;
  due_date_after?: string;
  due_date_before?: string;
  class_instance?: number;
  has_fine?: boolean;
  fine_paid?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/**
 * Digital access log filters
 */
export interface DigitalAccessLogFilters {
  library_item?: number;
  student?: number;
  access_type?: DigitalAccessType;
  accessed_after?: string;
  accessed_before?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

/**
 * Book recommendation filters
 */
export interface BookRecommendationFilters {
  teacher?: number;
  class_instance?: number;
  subject?: number;
  library_item?: number;
  is_required?: boolean;
  is_active?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ============================================================================
// Paginated Response
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============================================================================
// Recent Activity Types
// ============================================================================

export interface RecentActivityItem {
  id: number;
  type: 'issue' | 'return';
  book_title: string;
  student_name: string;
  timestamp: string;
  staff_name: string;
}

// ============================================================================
// Book Statistics
// ============================================================================

export interface BookStatistics {
  total_borrows: number;
  unique_borrowers: number;
  average_borrow_duration: number;
  monthly_borrows: {
    month: string;
    count: number;
  }[];
  top_borrowers: {
    student_name: string;
    borrow_count: number;
  }[];
}
