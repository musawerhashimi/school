/**
 * Library Module Schemas
 * Zod validation schemas for library forms
 */

import { z } from 'zod';

// ============================================================================
// Category Schemas
// ============================================================================

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  parent: z.number().optional().nullable(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// ============================================================================
// Library Item Schemas
// ============================================================================

export const libraryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title cannot exceed 300 characters'),
  subtitle: z.string().max(200, 'Subtitle cannot exceed 200 characters').optional(),
  author: z.string().min(1, 'Author is required').max(200, 'Author name cannot exceed 200 characters'),
  co_authors: z.array(z.string()).optional(),
  isbn: z
    .string()
    .max(13, 'ISBN cannot exceed 13 characters')
    .regex(/^(\d{10}|\d{13})?$/, 'Invalid ISBN format')
    .optional()
    .or(z.literal('')),
  isbn_13: z
    .string()
    .max(13, 'ISBN-13 cannot exceed 13 characters')
    .regex(/^(\d{13})?$/, 'Invalid ISBN-13 format')
    .optional()
    .or(z.literal('')),
  publisher: z.string().max(200, 'Publisher name cannot exceed 200 characters').optional(),
  publication_year: z
    .number()
    .min(1000, 'Invalid publication year')
    .max(new Date().getFullYear() + 1, 'Publication year cannot be in the future')
    .optional()
    .nullable(),
  edition: z.string().max(50, 'Edition cannot exceed 50 characters').optional(),
  language: z.string().max(50, 'Language cannot exceed 50 characters').default('English'),
  category: z.number({ required_error: 'Category is required' }),
  tags: z.array(z.string()).optional(),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  summary: z.string().max(1000, 'Summary cannot exceed 1000 characters').optional(),
  table_of_contents: z.string().optional(),
  page_count: z.number().min(1, 'Page count must be at least 1').optional().nullable(),
  format: z.enum(['physical', 'digital', 'both'], {
    required_error: 'Format is required',
  }),
  cover_image: z.instanceof(File).optional().nullable(),
  digital_file: z.instanceof(File).optional().nullable(),
  file_type: z.string().max(50, 'File type cannot exceed 50 characters').optional(),
  is_downloadable: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export type LibraryItemFormData = z.infer<typeof libraryItemSchema>;

// ============================================================================
// Book Copy Schemas
// ============================================================================

export const bookCopySchema = z.object({
  library_item: z.number({ required_error: 'Book is required' }),
  barcode: z
    .string()
    .min(1, 'Barcode is required')
    .max(50, 'Barcode cannot exceed 50 characters'),
  accession_number: z.string().max(50, 'Accession number cannot exceed 50 characters').optional(),
  shelf_location: z.string().min(1, 'Shelf location is required').max(100, 'Location cannot exceed 100 characters'),
  building: z.string().max(100, 'Building cannot exceed 100 characters').optional(),
  floor: z.string().max(20, 'Floor cannot exceed 20 characters').optional(),
  section: z.string().max(50, 'Section cannot exceed 50 characters').optional(),
  status: z.enum(['available', 'issued', 'reserved', 'lost', 'damaged']).default('available'),
  condition: z.enum(['new', 'good', 'fair', 'poor']).default('good'),
  is_reference_only: z.boolean().default(false),
  acquisition_date: z.string().optional().nullable(),
  acquisition_cost: z.number().min(0, 'Cost cannot be negative').optional().nullable(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
});

export type BookCopyFormData = z.infer<typeof bookCopySchema>;

// Simplified copy for bulk creation
export const bulkCopyItemSchema = z.object({
  barcode: z.string().min(1, 'Barcode is required'),
  shelf_location: z.string().min(1, 'Location is required'),
  accession_number: z.string().optional(),
});

export const bulkCopySchema = z.object({
  library_item: z.number({ required_error: 'Book is required' }),
  copies: z.array(bulkCopyItemSchema).min(1, 'At least one copy is required'),
});

export type BulkCopyFormData = z.infer<typeof bulkCopySchema>;

// ============================================================================
// Issue/Return Schemas
// ============================================================================

export const issueBookSchema = z
  .object({
    book_copy_id: z.number().optional(),
    barcode: z.string().optional(),
    student_id: z.number({ required_error: 'Student is required' }),
    due_date: z.string().min(1, 'Due date is required'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
  })
  .refine((data) => data.book_copy_id || data.barcode, {
    message: 'Either book copy ID or barcode is required',
    path: ['barcode'],
  });

export type IssueBookFormData = z.infer<typeof issueBookSchema>;

export const returnBookSchema = z
  .object({
    book_copy_id: z.number().optional(),
    barcode: z.string().optional(),
    borrow_record_id: z.number().optional(),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
    waive_fine: z.boolean().default(false),
    waive_reason: z.string().max(200, 'Waive reason cannot exceed 200 characters').optional(),
  })
  .refine((data) => data.book_copy_id || data.barcode || data.borrow_record_id, {
    message: 'Either book copy ID, barcode, or borrow record ID is required',
    path: ['barcode'],
  });

export type ReturnBookFormData = z.infer<typeof returnBookSchema>;

export const renewBorrowSchema = z.object({
  new_due_date: z.string().min(1, 'New due date is required'),
});

export type RenewBorrowFormData = z.infer<typeof renewBorrowSchema>;

// ============================================================================
// Digital Access Schema
// ============================================================================

export const logDigitalAccessSchema = z.object({
  library_item_id: z.number({ required_error: 'Book is required' }),
  access_type: z.enum(['read', 'download']),
  duration_seconds: z.number().min(0).optional(),
  pages_viewed: z.number().min(0).optional(),
});

export type LogDigitalAccessFormData = z.infer<typeof logDigitalAccessSchema>;

// ============================================================================
// Recommendation Schema
// ============================================================================

export const recommendationSchema = z.object({
  library_item: z.number({ required_error: 'Book is required' }),
  class_instance: z.number({ required_error: 'Class is required' }),
  subject: z.number().optional().nullable(),
  is_required: z.boolean().default(false),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

export type RecommendationFormData = z.infer<typeof recommendationSchema>;

// ============================================================================
// Settings Schema
// ============================================================================

export const librarySettingsSchema = z.object({
  default_loan_period_days: z.number().min(1, 'Must be at least 1 day').max(365, 'Cannot exceed 365 days'),
  max_books_per_student: z.number().min(1, 'Must be at least 1').max(50, 'Cannot exceed 50'),
  max_renewals: z.number().min(0, 'Cannot be negative').max(10, 'Cannot exceed 10'),
  fine_per_day: z.number().min(0, 'Cannot be negative').max(100, 'Cannot exceed 100'),
  allow_renewals: z.boolean(),
  renewal_period_days: z.number().min(1, 'Must be at least 1 day').max(90, 'Cannot exceed 90 days'),
  reservation_expiry_days: z.number().min(1, 'Must be at least 1 day').max(30, 'Cannot exceed 30 days'),
  send_due_reminders: z.boolean(),
  reminder_days_before: z.number().min(1, 'Must be at least 1 day').max(14, 'Cannot exceed 14 days'),
});

export type LibrarySettingsFormData = z.infer<typeof librarySettingsSchema>;

// ============================================================================
// Filter Schemas
// ============================================================================

export const itemFiltersSchema = z.object({
  category: z.number().optional(),
  format: z.enum(['physical', 'digital', 'both']).optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  language: z.string().optional(),
  publication_year_min: z.number().optional(),
  publication_year_max: z.number().optional(),
  is_available: z.boolean().optional(),
  has_digital: z.boolean().optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type ItemFiltersFormData = z.infer<typeof itemFiltersSchema>;

export const borrowFiltersSchema = z.object({
  student: z.number().optional(),
  status: z.enum(['active', 'returned', 'overdue', 'lost']).optional(),
  is_overdue: z.boolean().optional(),
  has_fine: z.boolean().optional(),
  fine_paid: z.boolean().optional(),
  issue_date_after: z.string().optional(),
  issue_date_before: z.string().optional(),
  due_date_after: z.string().optional(),
  due_date_before: z.string().optional(),
  class_instance: z.number().optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export type BorrowFiltersFormData = z.infer<typeof borrowFiltersSchema>;
