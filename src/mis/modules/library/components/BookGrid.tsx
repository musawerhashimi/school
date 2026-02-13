/**
 * BookGrid Component
 * Displays books in a responsive grid layout
 */

import { BookCard } from './BookCard';
import type { LibraryItemListResponse } from '../types';

interface BookGridProps {
  books: LibraryItemListResponse[];
  isLoading?: boolean;
  onRead?: (book: LibraryItemListResponse) => void;
}

export function BookGrid({ books, isLoading, onRead }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <BookCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-surface rounded-2xl border-2 border-dashed border-border">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <svg
            className="h-16 w-16 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-text-primary">No Books Found</h3>
        <p className="text-base text-text-secondary max-w-md">
          We couldn't find any books matching your criteria. Try adjusting your search or filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onRead={onRead} />
      ))}
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm animate-pulse">
      <div className="aspect-[2/3] bg-gradient-to-br from-surface to-surface-hover" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-surface-hover rounded w-3/4"></div>
        <div className="h-4 bg-surface-hover rounded w-1/2"></div>
        <div className="h-3 bg-surface-hover rounded w-2/3"></div>
        <div className="flex justify-between pt-2">
          <div className="h-3 bg-surface-hover rounded w-1/4"></div>
          <div className="h-3 bg-surface-hover rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export default BookGrid;
