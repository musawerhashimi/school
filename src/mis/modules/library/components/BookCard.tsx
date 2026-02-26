/**
 * BookCard Component
 * Displays a library book in a modern card format
 */

import { Link } from 'react-router-dom';
import { Book, ExternalLink, BookOpen, Copy } from 'lucide-react';
import Badge from '@mis-components/ui/Badge';
import type { LibraryItemListResponse } from '../types';
import { FORMAT_CONFIG } from '../constants';

interface BookCardProps {
  book: LibraryItemListResponse;
  showActions?: boolean;
}

export function BookCard({ book, showActions = true }: BookCardProps) {
  const formatConfig = FORMAT_CONFIG[book.format];
  const isAvailable = book.available_copies > 0 || book.format === 'digital' || book.format === 'both';

  const handleReadOnline = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.digital_file) {
      window.open(book.digital_file, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`/api/library/items/${book.id}/read/`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
      {/* Cover Image */}
      <Link to={`/mis/library/catalog/${book.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-surface to-surface-hover">
          {book.cover_image ? (
            <img
              src={book.cover_image}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center p-4">
                <Book className="h-12 w-12 mx-auto text-primary/30 mb-2" />
                <p className="text-[10px] text-text-secondary/60 line-clamp-2 font-medium">
                  {book.title}
                </p>
              </div>
            </div>
          )}

          {/* Overlay on hover with Read button */}
          {showActions && book.has_digital && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button
                onClick={handleReadOnline}
                className="flex items-center gap-1.5 bg-white text-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg hover:bg-primary hover:text-white transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Read Online
              </button>
            </div>
          )}

          {/* Format badge - top left */}
          <div className="absolute top-2 left-2">
            <Badge variant={formatConfig.variant} size="sm" className="text-[10px] shadow-sm">
              {formatConfig.label}
            </Badge>
          </div>

          {/* Digital indicator - top right */}
          {book.has_digital && (
            <div className="absolute top-2 right-2">
              <div className="bg-info/90 text-white p-1.5 rounded-full shadow-sm">
                <BookOpen className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <Link to={`/mis/library/catalog/${book.id}`}>
          <h3 className="font-semibold text-sm text-text-primary line-clamp-1 hover:text-primary transition-colors mb-1">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-xs text-text-secondary line-clamp-1 mb-2">
          {book.author}
        </p>

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block text-[10px] font-medium text-text-secondary bg-surface-hover px-2 py-0.5 rounded">
            {book.category_name}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {/* Availability */}
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-success' : 'bg-error'}`} />
            {book.format !== 'digital' ? (
              <span className="text-[11px] text-text-secondary">
                {book.available_copies}/{book.total_copies}
              </span>
            ) : (
              <span className="text-[11px] text-success font-medium">Available</span>
            )}
          </div>

          {/* Borrow count */}
          {book.times_borrowed > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-text-secondary">
              <Copy className="h-3 w-3" />
              <span>{book.times_borrowed}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookCard;
