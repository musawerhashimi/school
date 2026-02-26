/**
 * BookCatalog Page
 * Displays the library catalog with search and filters
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Library,
  SlidersHorizontal,
} from 'lucide-react';
import Input from '@mis-components/ui/Input';
import Button from '@mis-components/ui/Button';
import Select from '@mis-components/ui/Select';
import Switch from '@mis-components/ui/Switch';
import Modal from '@mis-components/ui/Modal';
import { BookGrid } from '../components/BookGrid';
import { useLibraryItems, useCategories } from '../hooks/useLibrary';
import {
  FORMAT_OPTIONS,
  ITEM_ORDERING_OPTIONS,
  LANGUAGE_OPTIONS,
  LIBRARY_DEFAULTS,
} from '../constants';
import type { LibraryItemFilters, LibraryItemFormat } from '../types';

// Debounce hook for search input
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function BookCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Local filter state for the filter modal
  const [localFilters, setLocalFilters] = useState<{
    category: string;
    format: string;
    language: string;
    is_available: boolean;
    has_digital: boolean;
  }>({
    category: '',
    format: '',
    language: '',
    is_available: false,
    has_digital: false,
  });

  // Local search state for immediate UI feedback
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(localSearch, 400);
  const isFirstRender = useRef(true);

  // Sync debounced search to URL params
  useEffect(() => {
    // Skip first render to avoid unnecessary URL update
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newParams.set('search', debouncedSearch);
    } else {
      newParams.delete('search');
    }
    // Reset to page 1 when search changes
    newParams.delete('page');
    setSearchParams(newParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Get filters from URL
  const filters: LibraryItemFilters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
    format: (searchParams.get('format') as LibraryItemFormat) || undefined,
    language: searchParams.get('language') || undefined,
    is_available: searchParams.get('is_available') === 'true' ? true : undefined,
    has_digital: searchParams.get('has_digital') === 'true' ? true : undefined,
    ordering: searchParams.get('ordering') || '-created_at',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    page_size: LIBRARY_DEFAULTS.pageSize,
  };

  // Queries
  const { data: booksData, isLoading } = useLibraryItems(filters);
  const { data: categories = [] } = useCategories();

  // Convert categories to options format
  const categoryOptions = useMemo(() => [
    { value: '', label: 'All categories' },
    ...categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
  ], [categories]);

  // Convert other options
  const formatSelectOptions = useMemo(() => [
    { value: '', label: 'All formats' },
    ...FORMAT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  ], []);

  const languageSelectOptions = useMemo(() => [
    { value: '', label: 'All languages' },
    ...LANGUAGE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  ], []);

  const orderingOptions = useMemo(() =>
    ITEM_ORDERING_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  []);

  // Open filter modal and sync local filters with current URL params
  const openFilters = useCallback(() => {
    setLocalFilters({
      category: filters.category?.toString() || '',
      format: filters.format || '',
      language: filters.language || '',
      is_available: filters.is_available || false,
      has_digital: filters.has_digital || false,
    });
    setFiltersOpen(true);
  }, [filters]);

  // Apply filters from local state to URL
  const applyFilters = useCallback(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (localFilters.category) {
      newParams.set('category', localFilters.category);
    } else {
      newParams.delete('category');
    }
    
    if (localFilters.format) {
      newParams.set('format', localFilters.format);
    } else {
      newParams.delete('format');
    }
    
    if (localFilters.language) {
      newParams.set('language', localFilters.language);
    } else {
      newParams.delete('language');
    }
    
    if (localFilters.is_available) {
      newParams.set('is_available', 'true');
    } else {
      newParams.delete('is_available');
    }
    
    if (localFilters.has_digital) {
      newParams.set('has_digital', 'true');
    } else {
      newParams.delete('has_digital');
    }
    
    // Reset to page 1 when filters change
    newParams.delete('page');
    setSearchParams(newParams);
    setFiltersOpen(false);
  }, [localFilters, searchParams, setSearchParams]);

  // Update filters (for ordering, pagination, and removing badges)
  const updateFilter = useCallback((key: string, value: string | number | boolean | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    // Reset to page 1 when filters change (except for page changes)
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters = [
    filters.category,
    filters.format,
    filters.language,
    filters.is_available,
    filters.has_digital,
  ].some((v) => v !== undefined);

  const activeFilterCount = [
    filters.category,
    filters.format,
    filters.language,
    filters.is_available,
    filters.has_digital,
  ].filter(Boolean).length;

  // Pagination
  const totalPages = booksData ? Math.ceil(booksData.count / LIBRARY_DEFAULTS.pageSize) : 0;
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-indigo-700 p-6 md:p-8 shadow-xl shadow-primary/20">
        <div className="absolute right-0 top-0 opacity-10">
          <Library className="h-48 w-48 md:h-64 md:w-64 -translate-y-8 translate-x-8 md:-translate-y-12 md:translate-x-12" />
        </div>
        <div className="absolute left-1/2 bottom-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-white">
            <div className="mb-2 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
                <BookOpen className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Book Catalog</h1>
            </div>
            <p className="text-indigo-100 text-sm md:text-base">
              Discover and explore our extensive library collection
            </p>
            {booksData && (
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-white font-medium">{booksData.count} Books</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="text-white font-medium">
                    {booksData.results.filter(b => b.has_digital).length} Digital
                  </span>
                </div>
              </div>
            )}
          </div>
          <Link to="/mis/library/catalog/new">
            <Button
              leftIcon={<Plus className="h-5 w-5" />}
              className="bg-primary text-primary hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all font-semibold"
              size="lg"
            >
              Add New Book
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search - using local state */}
          <div className="flex-1 relative">
            <Input
              placeholder="Search by title, author, ISBN..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-primary" />}
              className="h-11 text-base pr-10"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-hover transition-colors"
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <div className="w-[180px]">
              <Select
                options={orderingOptions}
                value={filters.ordering || '-created_at'}
                onChange={(e) => updateFilter('ordering', e.target.value)}
                className="h-11"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={openFilters}
              className={`relative h-11 px-4 border-2 transition-all ${
                hasActiveFilters
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'hover:border-primary hover:bg-primary/5'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {hasActiveFilters && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-md">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Modal - with max-height fix */}
      <Modal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter Catalog"
        description="Refine your search"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 space-y-4">
          {/* Category */}
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters(prev => ({ ...prev, category: e.target.value }))
              }
            />
          </div>

          {/* Format */}
          <div>
            <Select
              label="Format"
              options={formatSelectOptions}
              value={localFilters.format}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, format: e.target.value }))}
            />
          </div>

          {/* Language */}
          <div>
            <Select
              label="Language"
              options={languageSelectOptions}
              value={localFilters.language}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, language: e.target.value }))}
            />
          </div>

          {/* Toggle Options */}
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-lg bg-success/5 border border-success/20 hover:bg-success/10 transition-colors">
              <Switch
                label="Available only"
                checked={localFilters.is_available}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, is_available: e.target.checked }))}
              />
            </div>

            <div className="p-3 rounded-lg bg-info/5 border border-info/20 hover:bg-info/10 transition-colors">
              <Switch
                label="Has digital version"
                checked={localFilters.has_digital}
                onChange={(e) => setLocalFilters(prev => ({ ...prev, has_digital: e.target.checked }))}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 mt-4 border-t border-border">
          {hasActiveFilters && (
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setLocalFilters({
                  category: '',
                  format: '',
                  language: '',
                  is_available: false,
                  has_digital: false,
                });
              }}
              leftIcon={<X className="h-4 w-4" />}
              className="text-error border-error/30 hover:bg-error/5"
            >
              Clear All
            </Button>
          )}
          <Button
            fullWidth
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </Modal>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Filters:</span>
          {filters.category && (
            <FilterBadge
              label={categories.find((c) => c.id === filters.category)?.name || 'Category'}
              onRemove={() => updateFilter('category', undefined)}
            />
          )}
          {filters.format && (
            <FilterBadge
              label={FORMAT_OPTIONS.find((f) => f.value === filters.format)?.label || 'Format'}
              onRemove={() => updateFilter('format', undefined)}
            />
          )}
          {filters.language && (
            <FilterBadge
              label={filters.language}
              onRemove={() => updateFilter('language', undefined)}
            />
          )}
          {filters.is_available && (
            <FilterBadge
              label="Available"
              onRemove={() => updateFilter('is_available', undefined)}
              variant="success"
            />
          )}
          {filters.has_digital && (
            <FilterBadge
              label="Digital"
              onRemove={() => updateFilter('has_digital', undefined)}
              variant="info"
            />
          )}
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-error hover:text-error/80 transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Count */}
      {booksData && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-text-secondary">
            Showing{' '}
            <span className="font-semibold text-text-primary">
              {((currentPage - 1) * LIBRARY_DEFAULTS.pageSize) + 1}-{Math.min(currentPage * LIBRARY_DEFAULTS.pageSize, booksData.count)}
            </span>
            {' '}of{' '}
            <span className="font-semibold text-text-primary">{booksData.count}</span>
          </p>
          {filters.search && (
            <p className="text-text-secondary">
              Results for "<span className="font-semibold text-primary">{filters.search}</span>"
            </p>
          )}
        </div>
      )}

      {/* Book Grid */}
      <BookGrid
        books={booksData?.results || []}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 bg-surface rounded-xl border border-border p-4">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => updateFilter('page', currentPage - 1)}
            className="h-9 px-3 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline text-sm">Prev</span>
          </Button>

          <div className="flex items-center gap-1">
            {currentPage > 2 && (
              <>
                <PageButton page={1} currentPage={currentPage} onClick={() => updateFilter('page', 1)} />
                {currentPage > 3 && <span className="text-text-secondary px-1">...</span>}
              </>
            )}

            {currentPage > 1 && (
              <PageButton
                page={currentPage - 1}
                currentPage={currentPage}
                onClick={() => updateFilter('page', currentPage - 1)}
              />
            )}

            <PageButton page={currentPage} currentPage={currentPage} onClick={() => {}} />

            {currentPage < totalPages && (
              <PageButton
                page={currentPage + 1}
                currentPage={currentPage}
                onClick={() => updateFilter('page', currentPage + 1)}
              />
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="text-text-secondary px-1">...</span>}
                <PageButton
                  page={totalPages}
                  currentPage={currentPage}
                  onClick={() => updateFilter('page', totalPages)}
                />
              </>
            )}
          </div>

          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => updateFilter('page', currentPage + 1)}
            className="h-9 px-3 disabled:opacity-40"
          >
            <span className="mr-1 hidden sm:inline text-sm">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function PageButton({
  page,
  currentPage,
  onClick,
}: {
  page: number;
  currentPage: number;
  onClick: () => void;
}) {
  const isActive = page === currentPage;
  return (
    <button
      onClick={onClick}
      disabled={isActive}
      className={`
        h-9 min-w-9 px-3 rounded-lg text-sm font-medium transition-all
        ${isActive
          ? 'bg-primary text-white shadow-md shadow-primary/30'
          : 'bg-surface text-text-primary hover:bg-primary/10 hover:text-primary border border-border'
        }
      `}
    >
      {page}
    </button>
  );
}

function FilterBadge({
  label,
  onRemove,
  variant = 'default',
}: {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'success' | 'info';
}) {
  const variantClasses = {
    default: 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/15',
    success: 'bg-success/10 border-success/20 text-success hover:bg-success/15',
    info: 'bg-info/10 border-info/20 text-info hover:bg-info/15',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${variantClasses[variant]}`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default BookCatalog;
