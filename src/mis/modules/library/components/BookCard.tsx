/**
 * BookCard Component
 * Displays a library book in a card format
 */

import { Link } from 'react-router-dom';
import { Book, User, Tag, Eye } from 'lucide-react';
import { Card, CardContent } from '@mis-components/ui/Card';
import Badge from '@mis-components/ui/Badge';
import Button from '@mis-components/ui/Button';
import type { LibraryItemListResponse } from '../types';
import { FORMAT_CONFIG } from '../constants';

interface BookCardProps {
  book: LibraryItemListResponse;
  showActions?: boolean;
  onRead?: (book: LibraryItemListResponse) => void;
}

export function BookCard({ book, showActions = true, onRead }: BookCardProps) {
  const formatConfig = FORMAT_CONFIG[book.format];
  const isAvailable = book.available_copies > 0 || book.format === 'digital' || book.format === 'both';

  return (
    <Card padding="none" hover className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[2/3] bg-gradient-to-br from-surface-hover to-surface overflow-hidden">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <Book className="h-20 w-20 text-primary/40" />
          </div>
        )}

        {/* Format Badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={formatConfig.variant} size="sm" className="shadow-lg backdrop-blur-sm">
            {formatConfig.label}
          </Badge>
        </div>

        {/* Availability Badge */}
        <div className="absolute right-3 top-3">
          <Badge
            variant={isAvailable ? 'success' : 'error'}
            size="sm"
            className="shadow-lg backdrop-blur-sm"
          >
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        {/* Quick Actions Overlay */}
        {showActions && book.has_digital && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRead?.(book);
              }}
              leftIcon={<Eye className="h-4 w-4" />}
              className="bg-white text-primary hover:bg-indigo-50 shadow-lg"
            >
              Read Online
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-5 mt-0">
        <Link to={`/mis/library/catalog/${book.id}`} className="block mb-3">
          <h3 className="mb-1 line-clamp-2 font-bold text-base leading-tight text-text-primary hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>

        {book.subtitle && (
          <p className="mb-3 line-clamp-1 text-xs text-text-secondary italic">
            {book.subtitle}
          </p>
        )}

        <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
          <User className="h-4 w-4 text-primary/60" />
          <span className="line-clamp-1 font-medium">{book.author}</span>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs">
          <Tag className="h-3.5 w-3.5 text-secondary/70" />
          <span className="text-text-secondary font-medium">{book.category_name}</span>
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
          {book.format !== 'digital' && (
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-success' : 'bg-error'}`}></div>
              <span className="text-text-secondary font-medium">
                {book.available_copies}/{book.total_copies} available
              </span>
            </div>
          )}
          {book.times_borrowed > 0 && (
            <span className="text-text-secondary bg-primary/5 px-2 py-1 rounded-full font-medium">
              {book.times_borrowed} borrows
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BookCard;
