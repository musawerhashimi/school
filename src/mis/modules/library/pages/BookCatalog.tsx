/**
 * BookCatalog Page
 * Displays the library catalog with search and filters
 */

import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Library,
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
import type { LibraryItemFilters, LibraryItemFormat, LibraryItemListResponse } from '../types';

export function BookCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [readingBook, setReadingBook] = useState<LibraryItemListResponse | null>(null);

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

  // Handle reading online books
  const handleReadBook = (book: LibraryItemListResponse) => {
    setReadingBook(book);
  };

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

  // Update filters
  const updateFilter = (key: string, value: string | number | boolean | undefined) => {
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
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = [
    filters.category,
    filters.format,
    filters.language,
    filters.is_available,
    filters.has_digital,
  ].some((v) => v !== undefined);

  // Pagination
  const totalPages = booksData ? Math.ceil(booksData.count / LIBRARY_DEFAULTS.pageSize) : 0;
  const currentPage = filters.page || 1;

  return (
    <div className="space-y-8">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-indigo-700 p-8 shadow-lg">
        <div className="absolute right-0 top-0 opacity-10">
          <Library className="h-64 w-64 -translate-y-12 translate-x-12" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-white">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Book Catalog</h1>
            </div>
            <p className="text-indigo-100 text-lg">
              Discover and explore our extensive library collection
            </p>
            {booksData && (
              <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span className="text-indigo-100">{booksData.count} Total Books</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-indigo-100">
                    {booksData.results.filter(b => b.has_digital).length} Digital Available
                  </span>
                </div>
              </div>
            )}
          </div>
          <Link to="/mis/library/catalog/new">
            <Button
              leftIcon={<Plus className="h-5 w-5" />}
              className="bg-white text-primary hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Add New Book
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters with enhanced styling */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search by title, author, ISBN..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-primary" />}
              className="h-12 text-base"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3">
            <div className="w-[200px]">
              <Select
                options={orderingOptions}
                value={filters.ordering || '-created_at'}
                onChange={(e) => updateFilter('ordering', e.target.value)}
                className="h-12"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(true)}
              className="relative h-12 px-4 border-2 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Filter className="h-5 w-5" />
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {[filters.category, filters.format, filters.language, filters.is_available, filters.has_digital].filter(Boolean).length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter Library Catalog"
        description="Refine your search to find exactly what you're looking for"
      >
        <div className="space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters.category?.toString() || ''}
              onChange={(e) =>
                updateFilter('category', e.target.value ? Number(e.target.value) : undefined)
              }
            />
            <p className="text-xs text-text-secondary">Filter books by their category</p>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Select
              label="Format"
              options={formatSelectOptions}
              value={filters.format || ''}
              onChange={(e) => updateFilter('format', e.target.value || undefined)}
            />
            <p className="text-xs text-text-secondary">Choose between physical, digital, or both formats</p>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Select
              label="Language"
              options={languageSelectOptions}
              value={filters.language || ''}
              onChange={(e) => updateFilter('language', e.target.value || undefined)}
            />
            <p className="text-xs text-text-secondary">Filter by book language</p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-text-primary mb-4">Additional Options</p>

            {/* Availability Toggle */}
            <div className="mb-4 p-4 rounded-lg bg-success-soft border border-success/20">
              <Switch
                label="Available only"
                checked={filters.is_available === true}
                onChange={(e) => updateFilter('is_available', e.target.checked || undefined)}
              />
              <p className="text-xs text-text-secondary mt-1 ml-8">Show only books currently available for borrowing</p>
            </div>

            {/* Digital Toggle */}
            <div className="p-4 rounded-lg bg-info-soft border border-info/20">
              <Switch
                label="Has digital version"
                checked={filters.has_digital === true}
                onChange={(e) => updateFilter('has_digital', e.target.checked || undefined)}
              />
              <p className="text-xs text-text-secondary mt-1 ml-8">Show only books with digital reading options</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {hasActiveFilters && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  clearFilters();
                  setFiltersOpen(false);
                }}
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All
              </Button>
            )}
            <Button
              fullWidth
              onClick={() => setFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-text-primary">Active Filters:</span>
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
              label="Available Only"
              onRemove={() => updateFilter('is_available', undefined)}
            />
          )}
          {filters.has_digital && (
            <FilterBadge
              label="Digital Version"
              onRemove={() => updateFilter('has_digital', undefined)}
            />
          )}
          <button
            onClick={clearFilters}
            className="ml-2 text-sm font-medium text-error hover:text-error/80 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Count */}
      {booksData && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-primary">
            Showing{' '}
            <span className="text-primary font-bold">
              {((currentPage - 1) * LIBRARY_DEFAULTS.pageSize) + 1}
            </span>
            {' '}-{' '}
            <span className="text-primary font-bold">
              {Math.min(currentPage * LIBRARY_DEFAULTS.pageSize, booksData.count)}
            </span>
            {' '}of{' '}
            <span className="text-primary font-bold">{booksData.count}</span>
            {' '}books
          </p>
          {filters.search && (
            <p className="text-sm text-text-secondary">
              Search results for: <span className="font-semibold text-text-primary">"{filters.search}"</span>
            </p>
          )}
        </div>
      )}

      {/* Book Grid */}
      <BookGrid
        books={booksData?.results || []}
        isLoading={isLoading}
        onRead={handleReadBook}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 bg-surface rounded-xl border border-border p-6">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => updateFilter('page', currentPage - 1)}
            className="h-10 px-4 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-2">
            {currentPage > 2 && (
              <>
                <PageButton page={1} currentPage={currentPage} onClick={() => updateFilter('page', 1)} />
                {currentPage > 3 && <span className="text-text-secondary">...</span>}
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
                {currentPage < totalPages - 2 && <span className="text-text-secondary">...</span>}
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
            className="h-10 px-4 disabled:opacity-50"
          >
            <span className="mr-2 hidden sm:inline">Next</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Reading Modal for Online Books */}
      {readingBook && (
        <Modal
          isOpen={true}
          onClose={() => setReadingBook(null)}
          title={readingBook.title}
          description={`by ${readingBook.author}`}
          size="full"
        >
          <div className="h-[80vh] flex flex-col">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">{readingBook.title}</h3>
                <p className="text-sm text-text-secondary">by {readingBook.author}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setReadingBook(null)}
                leftIcon={<X className="h-4 w-4" />}
              >
                Close Reader
              </Button>
            </div>
            <div className="flex-1 overflow-hidden rounded-lg border border-border bg-surface">
              {readingBook.has_digital ? (
                <iframe
                  src={`http://localhost:8000/api/library/items/${readingBook.id}/read/`}
                  className="h-full w-full"
                  title={`Read ${readingBook.title}`}
                  sandbox="allow-same-origin allow-scripts"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="mx-auto h-16 w-16 text-text-secondary mb-4" />
                    <p className="text-text-secondary">
                      Digital version not available for this book
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
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
        h-10 min-w-10 px-3 rounded-lg font-medium transition-all
        ${isActive
          ? 'bg-primary text-white shadow-md'
          : 'bg-surface text-text-primary hover:bg-surface-hover border border-border'
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
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-primary/30 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

export default BookCatalog;
