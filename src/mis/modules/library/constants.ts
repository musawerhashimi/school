/**
 * Library Module Constants
 * Query keys, stale times, and status configurations
 */

import type {
  LibraryItemFormat,
  BookCopyStatus,
  BookCondition,
  BorrowStatus,
  DigitalAccessType,
} from './types';

// ============================================================================
// Query Keys
// ============================================================================

export const LIBRARY_QUERY_KEYS = {
  // Categories
  categories: ['library', 'categories'] as const,
  categoryTree: ['library', 'categories', 'tree'] as const,
  category: (id: number) => ['library', 'categories', id] as const,

  // Library Items (Books)
  items: ['library', 'items'] as const,
  itemsList: (filters?: Record<string, unknown>) =>
    ['library', 'items', 'list', filters] as const,
  item: (id: number) => ['library', 'items', id] as const,
  itemCopies: (id: number) => ['library', 'items', id, 'copies'] as const,
  itemStatistics: (id: number) => ['library', 'items', id, 'statistics'] as const,

  // Book Copies
  copies: ['library', 'copies'] as const,
  copiesList: (filters?: Record<string, unknown>) =>
    ['library', 'copies', 'list', filters] as const,
  copy: (id: number) => ['library', 'copies', id] as const,
  copyByBarcode: (barcode: string) => ['library', 'copies', 'barcode', barcode] as const,

  // Borrow Records
  borrows: ['library', 'borrows'] as const,
  borrowsList: (filters?: Record<string, unknown>) =>
    ['library', 'borrows', 'list', filters] as const,
  borrow: (id: number) => ['library', 'borrows', id] as const,
  activeBorrows: ['library', 'borrows', 'active'] as const,
  overdueBorrows: ['library', 'borrows', 'overdue'] as const,

  // Student Library
  studentBorrows: (studentId: number) =>
    ['library', 'students', studentId, 'borrows'] as const,
  studentSummary: (studentId: number) =>
    ['library', 'students', studentId, 'summary'] as const,

  // Digital Access
  digitalAccessLogs: ['library', 'digital-access'] as const,
  digitalAccessLogsList: (filters?: Record<string, unknown>) =>
    ['library', 'digital-access', 'list', filters] as const,

  // Recommendations
  recommendations: ['library', 'recommendations'] as const,
  recommendationsList: (filters?: Record<string, unknown>) =>
    ['library', 'recommendations', 'list', filters] as const,
  classRecommendations: (classId: number) =>
    ['library', 'recommendations', 'class', classId] as const,

  // Dashboard
  dashboardStats: ['library', 'dashboard', 'stats'] as const,
  popularBooks: (limit?: number) => ['library', 'dashboard', 'popular', limit] as const,
  recentActivity: ['library', 'dashboard', 'recent-activity'] as const,

  // Settings
  settings: ['library', 'settings'] as const,
} as const;

// ============================================================================
// Stale Times
// ============================================================================

export const LIBRARY_STALE_TIMES = {
  categories: 5 * 60 * 1000, // 5 minutes
  items: 2 * 60 * 1000, // 2 minutes
  copies: 1 * 60 * 1000, // 1 minute (changes frequently with issues/returns)
  borrows: 1 * 60 * 1000, // 1 minute
  dashboard: 30 * 1000, // 30 seconds
  settings: 10 * 60 * 1000, // 10 minutes
  recommendations: 5 * 60 * 1000, // 5 minutes
} as const;

// ============================================================================
// Status Configurations
// ============================================================================

/**
 * Library item format configuration
 */
export const FORMAT_CONFIG: Record<
  LibraryItemFormat,
  { label: string; variant: 'primary' | 'success' | 'secondary' | 'info' }
> = {
  physical: {
    label: 'Physical',
    variant: 'primary',
  },
  digital: {
    label: 'Digital',
    variant: 'success',
  },
  both: {
    label: 'Physical & Digital',
    variant: 'secondary',
  },
};

/**
 * Book copy status configuration
 */
export const COPY_STATUS_CONFIG: Record<
  BookCopyStatus,
  { label: string; variant: 'success' | 'warning' | 'primary' | 'error' | 'default' }
> = {
  available: {
    label: 'Available',
    variant: 'success',
  },
  issued: {
    label: 'Issued',
    variant: 'warning',
  },
  reserved: {
    label: 'Reserved',
    variant: 'primary',
  },
  lost: {
    label: 'Lost',
    variant: 'error',
  },
  damaged: {
    label: 'Damaged',
    variant: 'default',
  },
};

/**
 * Book condition configuration
 */
export const CONDITION_CONFIG: Record<
  BookCondition,
  { label: string; variant: 'success' | 'primary' | 'warning' | 'error' }
> = {
  new: {
    label: 'New',
    variant: 'success',
  },
  good: {
    label: 'Good',
    variant: 'primary',
  },
  fair: {
    label: 'Fair',
    variant: 'warning',
  },
  poor: {
    label: 'Poor',
    variant: 'error',
  },
};

/**
 * Borrow status configuration
 */
export const BORROW_STATUS_CONFIG: Record<
  BorrowStatus,
  { label: string; variant: 'primary' | 'success' | 'error' | 'default' }
> = {
  active: {
    label: 'Active',
    variant: 'primary',
  },
  returned: {
    label: 'Returned',
    variant: 'success',
  },
  overdue: {
    label: 'Overdue',
    variant: 'error',
  },
  lost: {
    label: 'Lost',
    variant: 'default',
  },
};

/**
 * Digital access type configuration
 */
export const ACCESS_TYPE_CONFIG: Record<
  DigitalAccessType,
  { label: string; color: string; icon: string }
> = {
  read: {
    label: 'Read Online',
    color: 'text-blue-600',
    icon: 'eye',
  },
  download: {
    label: 'Download',
    color: 'text-green-600',
    icon: 'download',
  },
};

// ============================================================================
// Default Values
// ============================================================================

export const LIBRARY_DEFAULTS = {
  loanPeriodDays: 14,
  maxBooksPerStudent: 3,
  finePerDay: 5,
  maxRenewals: 2,
  pageSize: 12,
  reminderDaysBefore: 2,
} as const;

// ============================================================================
// Filter Options
// ============================================================================

export const FORMAT_OPTIONS = [
  { value: 'physical', label: 'Physical' },
  { value: 'digital', label: 'Digital' },
  { value: 'both', label: 'Physical & Digital' },
] as const;

export const COPY_STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'issued', label: 'Issued' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'lost', label: 'Lost' },
  { value: 'damaged', label: 'Damaged' },
] as const;

export const CONDITION_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
] as const;

export const BORROW_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'returned', label: 'Returned' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'lost', label: 'Lost' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Japanese', label: 'Japanese' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Other', label: 'Other' },
] as const;

export const FILE_TYPE_OPTIONS = [
  { value: 'PDF', label: 'PDF' },
  { value: 'EPUB', label: 'EPUB' },
  { value: 'MOBI', label: 'MOBI' },
  { value: 'AZW', label: 'AZW' },
  { value: 'DOC', label: 'DOC/DOCX' },
  { value: 'TXT', label: 'TXT' },
  { value: 'HTML', label: 'HTML' },
  { value: 'Other', label: 'Other' },
] as const;

// ============================================================================
// Ordering Options
// ============================================================================

export const ITEM_ORDERING_OPTIONS = [
  { value: 'title', label: 'Title (A-Z)' },
  { value: '-title', label: 'Title (Z-A)' },
  { value: 'author', label: 'Author (A-Z)' },
  { value: '-author', label: 'Author (Z-A)' },
  { value: '-publication_year', label: 'Newest First' },
  { value: 'publication_year', label: 'Oldest First' },
  { value: '-times_borrowed', label: 'Most Borrowed' },
  { value: '-created_at', label: 'Recently Added' },
] as const;

export const BORROW_ORDERING_OPTIONS = [
  { value: '-issue_date', label: 'Issue Date (Newest)' },
  { value: 'issue_date', label: 'Issue Date (Oldest)' },
  { value: 'due_date', label: 'Due Date (Soonest)' },
  { value: '-due_date', label: 'Due Date (Latest)' },
  { value: '-fine_amount', label: 'Highest Fine' },
] as const;
