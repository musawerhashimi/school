/**
 * Library Hooks
 * React Query hooks for library management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { libraryService } from '../services/libraryService';
import { LIBRARY_QUERY_KEYS, LIBRARY_STALE_TIMES } from '../constants';
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

// ============================================================================
// Categories Hooks
// ============================================================================

export function useCategories(options?: UseQueryOptions<BookCategory[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.categories,
    queryFn: () => libraryService.categories.getAll(),
    staleTime: LIBRARY_STALE_TIMES.categories,
    ...options,
  });
}

export function useCategoryTree(options?: UseQueryOptions<BookCategoryTree[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.categoryTree,
    queryFn: () => libraryService.categories.getTree(),
    staleTime: LIBRARY_STALE_TIMES.categories,
    ...options,
  });
}

export function useCategory(id: number, options?: UseQueryOptions<BookCategory>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.category(id),
    queryFn: () => libraryService.categories.getById(id),
    enabled: id > 0,
    staleTime: LIBRARY_STALE_TIMES.categories,
    ...options,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string; parent?: number }) =>
      libraryService.categories.create(data),
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.categories });
    },
    onError: (error) => {
      toast.error('Failed to create category', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<{ name: string; description?: string; parent?: number }> }) =>
      libraryService.categories.update(id, data),
    onSuccess: (_, variables) => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.category(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.categories });
    },
    onError: (error) => {
      toast.error('Failed to update category', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => libraryService.categories.delete(id),
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.categories });
    },
    onError: (error) => {
      toast.error('Failed to delete category', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// Library Items Hooks
// ============================================================================

export function useLibraryItems(
  filters?: LibraryItemFilters,
  options?: UseQueryOptions<PaginatedResponse<LibraryItemListResponse>>
) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.itemsList(filters),
    queryFn: () => libraryService.items.getAll(filters),
    staleTime: LIBRARY_STALE_TIMES.items,
    ...options,
  });
}

export function useLibraryItem(id: number, options?: UseQueryOptions<LibraryItemDetailResponse>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.item(id),
    queryFn: () => libraryService.items.getById(id),
    enabled: id > 0,
    staleTime: LIBRARY_STALE_TIMES.items,
    ...options,
  });
}

export function useItemCopies(itemId: number, options?: UseQueryOptions<BookCopyListResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.itemCopies(itemId),
    queryFn: () => libraryService.items.getCopies(itemId),
    enabled: itemId > 0,
    staleTime: LIBRARY_STALE_TIMES.copies,
    ...options,
  });
}

export function useItemStatistics(itemId: number, options?: UseQueryOptions<BookStatistics>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.itemStatistics(itemId),
    queryFn: () => libraryService.items.getStatistics(itemId),
    enabled: itemId > 0,
    staleTime: LIBRARY_STALE_TIMES.items,
    ...options,
  });
}

export function useCreateLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LibraryItemInput) => libraryService.items.create(data),
    onMutate: () => toast.loading('Creating book...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Book created successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create book', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<LibraryItemInput> }) =>
      libraryService.items.update(id, data),
    onMutate: () => toast.loading('Updating book...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Book updated successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.item(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update book', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => libraryService.items.delete(id),
    onMutate: () => toast.loading('Deleting book...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Book deleted successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to delete book', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUploadCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      libraryService.items.uploadCover(id, file),
    onMutate: () => toast.loading('Uploading cover...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Cover uploaded successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.item(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to upload cover', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUploadDigitalFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      libraryService.items.uploadDigital(id, file),
    onMutate: () => toast.loading('Uploading digital file...'),
    onSuccess: (_, variables) => {
      toast.dismiss();
      toast.success('Digital file uploaded successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.item(variables.id) });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to upload digital file', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// Book Copies Hooks
// ============================================================================

export function useBookCopies(
  filters?: BookCopyFilters,
  options?: UseQueryOptions<PaginatedResponse<BookCopyListResponse>>
) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.copiesList(filters),
    queryFn: () => libraryService.copies.getAll(filters),
    staleTime: LIBRARY_STALE_TIMES.copies,
    ...options,
  });
}

export function useBookCopy(id: number, options?: UseQueryOptions<BookCopyDetailResponse>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.copy(id),
    queryFn: () => libraryService.copies.getById(id),
    enabled: id > 0,
    staleTime: LIBRARY_STALE_TIMES.copies,
    ...options,
  });
}

export function useBookCopyByBarcode(barcode: string, options?: UseQueryOptions<BookCopyDetailResponse>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.copyByBarcode(barcode),
    queryFn: () => libraryService.copies.getByBarcode(barcode),
    enabled: !!barcode && barcode.length > 0,
    staleTime: LIBRARY_STALE_TIMES.copies,
    retry: false,
    ...options,
  });
}

export function useCreateBookCopy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookCopyInput) => libraryService.copies.create(data),
    onSuccess: (result) => {
      toast.success('Book copy created successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.itemCopies(result.library_item) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.item(result.library_item) });
    },
    onError: (error) => {
      toast.error('Failed to create book copy', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useUpdateBookCopy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BookCopyInput> }) =>
      libraryService.copies.update(id, data),
    onSuccess: (result, variables) => {
      toast.success('Book copy updated successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copy(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.itemCopies(result.library_item) });
    },
    onError: (error) => {
      toast.error('Failed to update book copy', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteBookCopy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => libraryService.copies.delete(id),
    onSuccess: () => {
      toast.success('Book copy deleted successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
    },
    onError: (error) => {
      toast.error('Failed to delete book copy', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useBulkCreateCopies() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkBookCopyInput) => libraryService.copies.bulkCreate(data),
    onMutate: () => toast.loading('Creating copies...'),
    onSuccess: (result, variables) => {
      toast.dismiss();
      toast.success(`${result.created_count} copies created successfully`);
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.itemCopies(variables.library_item) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.item(variables.library_item) });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to create copies', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// Borrow Records Hooks
// ============================================================================

export function useBorrowRecords(
  filters?: BorrowRecordFilters,
  options?: UseQueryOptions<PaginatedResponse<BorrowRecordListResponse>>
) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.borrowsList(filters),
    queryFn: () => libraryService.borrows.getAll(filters),
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

export function useBorrowRecord(id: number, options?: UseQueryOptions<BorrowRecordDetailResponse>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.borrow(id),
    queryFn: () => libraryService.borrows.getById(id),
    enabled: id > 0,
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

export function useActiveBorrows(options?: UseQueryOptions<BorrowRecordListResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.activeBorrows,
    queryFn: () => libraryService.borrows.getActive(),
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

export function useOverdueBorrows(options?: UseQueryOptions<OverdueRecordResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.overdueBorrows,
    queryFn: () => libraryService.borrows.getOverdue(),
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

export function useIssueBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IssueBookInput) => libraryService.borrows.issue(data),
    onMutate: () => toast.loading('Issuing book...'),
    onSuccess: (result) => {
      toast.dismiss();
      toast.success('Book issued successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrows });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.dashboardStats });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.studentBorrows(result.student) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.studentSummary(result.student) });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to issue book', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReturnBookInput) => libraryService.borrows.return(data),
    onMutate: () => toast.loading('Processing return...'),
    onSuccess: (result) => {
      toast.dismiss();
      if (result.fine_amount > 0 && !result.fine_paid && !result.fine_waived) {
        toast.success('Book returned', {
          description: `Fine of $${result.fine_amount.toFixed(2)} is pending`,
        });
      } else {
        toast.success('Book returned successfully');
      }
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrows });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.dashboardStats });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.studentBorrows(result.student) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.studentSummary(result.student) });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to return book', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useRenewBorrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RenewBorrowInput }) =>
      libraryService.borrows.renew(id, data),
    onMutate: () => toast.loading('Renewing borrow...'),
    onSuccess: (result, variables) => {
      toast.dismiss();
      toast.success('Borrow renewed successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrow(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrows });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.studentBorrows(result.student) });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to renew borrow', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useMarkLost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, replacementFine }: { id: number; replacementFine?: number }) =>
      libraryService.borrows.markLost(id, replacementFine),
    onMutate: () => toast.loading('Marking as lost...'),
    onSuccess: (result, variables) => {
      toast.dismiss();
      toast.success('Book marked as lost');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrow(variables.id) });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.borrows });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.copies });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.items });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.dashboardStats });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to mark book as lost', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// Student Library Hooks
// ============================================================================

export function useStudentBorrows(studentId: number, options?: UseQueryOptions<BorrowRecordListResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.studentBorrows(studentId),
    queryFn: () => libraryService.students.getBorrows(studentId),
    enabled: studentId > 0,
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

export function useStudentLibrarySummary(studentId: number, options?: UseQueryOptions<StudentLibrarySummary>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.studentSummary(studentId),
    queryFn: () => libraryService.students.getSummary(studentId),
    enabled: studentId > 0,
    staleTime: LIBRARY_STALE_TIMES.borrows,
    ...options,
  });
}

// ============================================================================
// Digital Access Hooks
// ============================================================================

export function useDigitalAccessLogs(
  filters?: DigitalAccessLogFilters,
  options?: UseQueryOptions<PaginatedResponse<DigitalAccessLogResponse>>
) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.digitalAccessLogsList(filters),
    queryFn: () => libraryService.digitalAccess.getAll(filters),
    staleTime: LIBRARY_STALE_TIMES.items,
    ...options,
  });
}

export function useLogDigitalAccess() {
  return useMutation({
    mutationFn: (data: LogDigitalAccessInput) => libraryService.digitalAccess.log(data),
    // Silent - no toast notifications for access logging
  });
}

// ============================================================================
// Recommendations Hooks
// ============================================================================

export function useRecommendations(
  filters?: BookRecommendationFilters,
  options?: UseQueryOptions<PaginatedResponse<BookRecommendationResponse>>
) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.recommendationsList(filters),
    queryFn: () => libraryService.recommendations.getAll(filters),
    staleTime: LIBRARY_STALE_TIMES.recommendations,
    ...options,
  });
}

export function useClassRecommendations(classId: number, options?: UseQueryOptions<BookRecommendationResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.classRecommendations(classId),
    queryFn: () => libraryService.recommendations.getByClass(classId),
    enabled: classId > 0,
    staleTime: LIBRARY_STALE_TIMES.recommendations,
    ...options,
  });
}

export function useCreateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookRecommendationInput) => libraryService.recommendations.create(data),
    onSuccess: (_, variables) => {
      toast.success('Book recommendation created');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.recommendations });
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.classRecommendations(variables.class_instance) });
    },
    onError: (error) => {
      toast.error('Failed to create recommendation', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => libraryService.recommendations.delete(id),
    onSuccess: () => {
      toast.success('Recommendation removed');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.recommendations });
    },
    onError: (error) => {
      toast.error('Failed to remove recommendation', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

export function useDashboardStats(options?: UseQueryOptions<LibraryDashboardStats>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.dashboardStats,
    queryFn: () => libraryService.dashboard.getStats(),
    staleTime: LIBRARY_STALE_TIMES.dashboard,
    ...options,
  });
}

export function usePopularBooks(limit = 10, options?: UseQueryOptions<PopularBookResponse[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.popularBooks(limit),
    queryFn: () => libraryService.dashboard.getPopular(limit),
    staleTime: LIBRARY_STALE_TIMES.dashboard,
    ...options,
  });
}

export function useRecentActivity(limit = 20, options?: UseQueryOptions<RecentActivityItem[]>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.recentActivity,
    queryFn: () => libraryService.dashboard.getRecentActivity(limit),
    staleTime: LIBRARY_STALE_TIMES.dashboard,
    ...options,
  });
}

// ============================================================================
// Settings Hooks
// ============================================================================

export function useLibrarySettings(options?: UseQueryOptions<LibrarySettings>) {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.settings,
    queryFn: () => libraryService.settings.get(),
    staleTime: LIBRARY_STALE_TIMES.settings,
    ...options,
  });
}

export function useUpdateLibrarySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LibrarySettingsInput }) =>
      libraryService.settings.update(id, data),
    onMutate: () => toast.loading('Updating settings...'),
    onSuccess: () => {
      toast.dismiss();
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: LIBRARY_QUERY_KEYS.settings });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error('Failed to update settings', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
