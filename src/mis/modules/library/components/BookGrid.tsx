/**
 * BookGrid Component
 * Displays books in a responsive grid layout with enhanced styling
 */

import { BookOpen } from 'lucide-react';
import { BookCard } from './BookCard';
import type { LibraryItemListResponse } from '../types';

interface BookGridProps {
  books: LibraryItemListResponse[];
  isLoading?: boolean;
}

export function BookGrid({ books, isLoading }: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <BookCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center py-20 text-center bg-gradient-to-br from-surface via-surface to-primary/5 rounded-2xl border-2 border-dashed border-border overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-lg shadow-primary/5">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <BookOpen className="relative h-16 w-16 text-primary" />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-bold text-text-primary">No Books Found</h3>
          <p className="text-base text-text-secondary max-w-md leading-relaxed">
            We couldn't find any books matching your criteria.
            <br />
            <span className="text-sm">Try adjusting your search or filter settings.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </div>
  );
}

function BookCardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Cover skeleton with shimmer effect */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-surface-hover to-surface overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
        {/* Fake badges */}
        <div className="absolute left-2 top-2 h-5 w-16 rounded-full bg-surface-hover/80" />
        <div className="absolute right-2 top-2 h-5 w-20 rounded-full bg-surface-hover/80" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 bg-surface-hover rounded-md w-full skeleton-shimmer" />
          <div className="h-4 bg-surface-hover rounded-md w-2/3 skeleton-shimmer" />
        </div>

        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-surface-hover skeleton-shimmer" />
          <div className="h-3 bg-surface-hover rounded w-1/2 skeleton-shimmer" />
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-surface-hover skeleton-shimmer" />
          <div className="h-5 bg-surface-hover rounded-full w-20 skeleton-shimmer" />
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-3 border-t border-border/30">
          <div className="h-3 bg-surface-hover rounded w-12 skeleton-shimmer" />
          <div className="h-5 bg-surface-hover rounded-full w-16 skeleton-shimmer" />
        </div>
      </div>

      {/* CSS for shimmer effect */}
      <style>{`
        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default BookGrid;
