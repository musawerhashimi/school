/**
 * ReturnBookPage
 * Process book returns with modern UI/UX using MIS theme colors
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Barcode,
  Book,
  User,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Search,
  DollarSign,
  ChevronDown,
  RotateCcw,
  Sparkles,
  BookOpen,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import Input from '@mis-components/ui/Input';
import Textarea from '@mis-components/ui/Textarea';
import Switch from '@mis-components/ui/Switch';
import Alert from '@mis-components/ui/Alert';
import Badge from '@mis-components/ui/Badge';
import {
  useBookCopyByBarcode,
  useReturnBook,
  useActiveBorrows,
  useBorrowRecord,
} from '../hooks/useLibrary';
import { returnBookSchema, type ReturnBookFormData } from '../schemas/librarySchemas';
import type { BorrowRecordListResponse, BookCondition } from '../types';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Book condition options - simplified colors
const CONDITION_OPTIONS: { value: BookCondition; label: string; selectedClass: string; icon: string }[] = [
  { value: 'new', label: 'Excellent', selectedClass: 'border-success bg-success/10 text-success', icon: '✨' },
  { value: 'good', label: 'Good', selectedClass: 'border-primary bg-primary/10 text-primary', icon: '👍' },
  { value: 'fair', label: 'Fair', selectedClass: 'border-warning bg-warning/10 text-warning', icon: '📖' },
  { value: 'poor', label: 'Damaged', selectedClass: 'border-error bg-error/10 text-error', icon: '⚠️' },
];

export function ReturnBookPage() {
  // State
  const [barcode, setBarcode] = useState('');
  const [selectedBorrowId, setSelectedBorrowId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBorrowDropdown, setShowBorrowDropdown] = useState(false);
  const [returnCondition, setReturnCondition] = useState<BookCondition>('good');
  const [returnComplete, setReturnComplete] = useState<{
    success: boolean;
    message: string;
    fine?: number;
    fineWaived?: boolean;
  } | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const borrowDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch active borrows
  const { data: activeBorrows = [], isLoading: borrowsLoading, refetch: refetchBorrows } = useActiveBorrows();

  // Look up book by barcode
  const {
    data: bookCopy,
    isLoading: bookLoading,
    error: bookError,
  } = useBookCopyByBarcode(barcode);

  // Get selected borrow details
  const { data: selectedBorrow } = useBorrowRecord(selectedBorrowId || 0);

  // Return mutation
  const returnMutation = useReturnBook();

  // Form
  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ReturnBookFormData>({
    resolver: zodResolver(returnBookSchema),
    defaultValues: {
      barcode: '',
      notes: '',
      waive_fine: false,
      waive_reason: '',
    },
  });

  // Watch waive_fine to show/hide reason field
  const waiveFine = watch('waive_fine');

  // Filter active borrows based on search
  const filteredBorrows = useMemo(() => {
    if (!debouncedSearch) return activeBorrows;
    const query = debouncedSearch.toLowerCase();
    return activeBorrows.filter((borrow) =>
      borrow.book_title?.toLowerCase().includes(query) ||
      borrow.student_name?.toLowerCase().includes(query) ||
      borrow.barcode?.toLowerCase().includes(query) ||
      borrow.student_id_number?.toLowerCase().includes(query)
    );
  }, [activeBorrows, debouncedSearch]);

  // Handle click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (borrowDropdownRef.current && !borrowDropdownRef.current.contains(event.target as Node)) {
        setShowBorrowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync barcode when borrow is selected
  useEffect(() => {
    if (selectedBorrow) {
      setBarcode(selectedBorrow.barcode || '');
      setValue('barcode', selectedBorrow.barcode || '');
    }
  }, [selectedBorrow, setValue]);

  // Handle barcode scan/input
  const handleBarcodeChange = useCallback((value: string) => {
    setBarcode(value);
    setValue('barcode', value);
    setReturnComplete(null);
    setSelectedBorrowId(null);
  }, [setValue]);

  // Handle borrow selection
  const handleSelectBorrow = useCallback((borrow: BorrowRecordListResponse) => {
    setSelectedBorrowId(borrow.id);
    setBarcode(borrow.barcode);
    setValue('barcode', borrow.barcode);
    setShowBorrowDropdown(false);
    setSearchQuery('');
    setReturnComplete(null);
  }, [setValue]);

  // Handle submit
  const onSubmit = async (data: ReturnBookFormData) => {
    try {
      const result = await returnMutation.mutateAsync({
        barcode: data.barcode,
        notes: data.notes ? `${data.notes}\nCondition on return: ${returnCondition}` : `Condition on return: ${returnCondition}`,
        waive_fine: data.waive_fine,
        waive_reason: data.waive_reason,
      });

      setReturnComplete({
        success: true,
        message: 'Book returned successfully!',
        fine: result.fine_amount > 0 && !result.fine_paid && !result.fine_waived
          ? result.fine_amount
          : undefined,
        fineWaived: result.fine_waived,
      });

      // Reset form for next return
      reset({
        barcode: '',
        notes: '',
        waive_fine: false,
        waive_reason: '',
      });
      setBarcode('');
      setSelectedBorrowId(null);
      setReturnCondition('good');
      refetchBorrows();
    } catch {
      // Error handled by mutation
    }
  };

  // Check if book is issued (can be returned)
  const canReturn = bookCopy?.status === 'issued' || selectedBorrow?.status === 'active';

  // Calculate days info
  const borrowRecord = selectedBorrow || (activeBorrows.find(b => b.barcode === barcode));
  const daysOverdue = borrowRecord?.days_overdue || 0;
  const isOverdue = borrowRecord?.is_overdue || false;
  const fineAmount = borrowRecord?.fine_amount || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative mb-6 rounded-xl bg-gradient-to-r from-primary to-secondary p-5 text-white shadow-lg overflow-hidden">
        <div className="relative flex items-center gap-4">
          <Link to="/mis/library">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Return Book</h1>
                <p className="text-sm text-white/80">Process book returns</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">{activeBorrows.length} Active</span>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {returnComplete?.success && (
        <div className="mb-6 animate-slide-up">
          <div className="rounded-lg border border-success/30 bg-success/10 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-success">Return Successful!</p>
                {returnComplete.fine !== undefined && (
                  <p className="text-sm text-warning mt-1">Outstanding fine: ${returnComplete.fine.toFixed(2)}</p>
                )}
                {returnComplete.fineWaived && (
                  <p className="text-sm text-info mt-1">Fine has been waived</p>
                )}
              </div>
              <button onClick={() => setReturnComplete(null)} className="text-text-secondary hover:text-text-primary">
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Form (3 columns) */}
        <div className="lg:col-span-3 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Search Active Borrows - with proper overflow for dropdown */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-text-primary">Select from Active Borrows</h3>
                </div>
              </div>

              <div className="p-4" style={{ overflow: 'visible' }}>
                <div ref={borrowDropdownRef} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Search by book, student, or barcode..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowBorrowDropdown(true);
                      }}
                      onFocus={() => setShowBorrowDropdown(true)}
                      className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>

                  {showBorrowDropdown && (
                    <div className="absolute left-0 right-0 z-[100] mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-card shadow-xl">
                      {borrowsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      ) : filteredBorrows.length === 0 ? (
                        <div className="py-6 text-center text-text-secondary text-sm">
                          <BookOpen className="mx-auto h-6 w-6 text-muted mb-1" />
                          <p>No active borrows found</p>
                        </div>
                      ) : (
                        filteredBorrows.map((borrow) => (
                          <button
                            key={borrow.id}
                            type="button"
                            onClick={() => handleSelectBorrow(borrow)}
                            className={`w-full px-3 py-2.5 text-left hover:bg-surface-hover transition-colors border-b border-border last:border-0 ${
                              selectedBorrowId === borrow.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-7 rounded bg-surface flex items-center justify-center overflow-hidden flex-shrink-0">
                                {borrow.cover_thumbnail ? (
                                  <img src={borrow.cover_thumbnail} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <Book className="h-4 w-4 text-muted" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-text-primary text-sm truncate">{borrow.book_title}</p>
                                <p className="text-xs text-text-secondary truncate">{borrow.student_name} - {borrow.barcode}</p>
                              </div>
                              {borrow.is_overdue && (
                                <span className="text-xs text-error font-medium">{borrow.days_overdue}d late</span>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected borrow preview */}
                {selectedBorrowId && borrowRecord && (
                  <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-text-primary truncate">{borrowRecord.book_title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBorrowId(null);
                          setBarcode('');
                          setValue('barcode', '');
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted">or scan barcode</span>
              </div>
            </div>

            {/* Barcode Input */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Barcode className="h-4 w-4 text-secondary" />
                  <h3 className="font-medium text-text-primary">Scan or Enter Barcode</h3>
                </div>
              </div>
              <div className="p-4">
                <Controller
                  name="barcode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter or scan book barcode"
                      {...field}
                      value={barcode}
                      onChange={(e) => handleBarcodeChange(e.target.value)}
                      error={errors.barcode?.message}
                      className="font-mono"
                    />
                  )}
                />
              </div>
            </div>

            {/* Book Condition on Return */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-text-secondary" />
                  <h3 className="font-medium text-text-primary">Book Condition</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {CONDITION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setReturnCondition(option.value)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        returnCondition === option.value
                          ? option.selectedClass
                          : 'border-border bg-surface hover:border-muted text-text-secondary'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <p className="mt-1 text-xs font-medium">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Return Notes & Waive Fine */}
            <div className="rounded-lg border border-border bg-card shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-text-secondary" />
                  <h3 className="font-medium text-text-primary">Return Details</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Notes (Optional)"
                      placeholder="Add any notes about the return..."
                      error={errors.notes?.message}
                      rows={2}
                      {...field}
                    />
                  )}
                />

                {/* Fine info if applicable */}
                {isOverdue && fineAmount > 0 && (
                  <div className="rounded-lg border border-error/30 bg-error/10 p-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-error" />
                      <span className="font-medium text-error">
                        Fine: ${Number(fineAmount).toFixed(2)} ({daysOverdue} days overdue)
                      </span>
                    </div>
                  </div>
                )}

                {/* Waive Fine Option */}
                <div className="rounded-lg border border-border bg-surface p-3">
                  <Controller
                    name="waive_fine"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        label="Waive Fine"
                        description="Waive any overdue fines for this return"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />

                  {waiveFine && (
                    <div className="mt-3">
                      <Controller
                        name="waive_reason"
                        control={control}
                        render={({ field }) => (
                          <Input
                            label="Waive Reason"
                            placeholder="Enter reason for waiving fine"
                            error={errors.waive_reason?.message}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!canReturn || returnMutation.isPending || (!barcode && !selectedBorrowId)}
              loading={returnMutation.isPending}
              leftIcon={<CheckCircle2 className="h-5 w-5" />}
            >
              {returnMutation.isPending ? 'Processing...' : 'Process Return'}
            </Button>
          </form>
        </div>

        {/* Right: Preview (2 columns) */}
        <div className="lg:col-span-2">
          {/* Quick Actions - compact, not sticky */}
          <div className="rounded-lg border border-border bg-card shadow-sm mb-4">
            <div className="p-3 flex flex-wrap gap-2">
              <Link to="/mis/library/issue">
                <Button variant="outline" size="sm" leftIcon={<Book className="h-3.5 w-3.5" />}>
                  Issue
                </Button>
              </Link>
              <Link to="/mis/library/borrows">
                <Button variant="outline" size="sm" leftIcon={<Calendar className="h-3.5 w-3.5" />}>
                  Borrows
                </Button>
              </Link>
              <Link to="/mis/library/borrows?status=overdue">
                <Button variant="outline" size="sm" leftIcon={<AlertTriangle className="h-3.5 w-3.5" />}>
                  Overdue
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => refetchBorrows()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Book Preview - sticky */}
          <div className="rounded-lg border border-border bg-card shadow-sm sticky top-6">
            <div className="border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4 text-secondary" />
                <h3 className="font-medium text-text-primary">Book Details</h3>
              </div>
            </div>
            <div className="p-4">
              {bookLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-text-secondary">Loading...</p>
                </div>
              ) : bookError && barcode ? (
                <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-center">
                  <XCircle className="mx-auto h-8 w-8 text-error" />
                  <p className="mt-2 font-medium text-error">Book not found</p>
                </div>
              ) : bookCopy || borrowRecord ? (
                <div className="space-y-3">
                  {/* Book info */}
                  <div className="flex gap-3">
                    <div className="h-20 w-14 overflow-hidden rounded bg-surface flex items-center justify-center flex-shrink-0 border border-border">
                      {borrowRecord?.cover_thumbnail ? (
                        <img src={borrowRecord.cover_thumbnail} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Book className="h-6 w-6 text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary line-clamp-2 text-sm">
                        {bookCopy?.book_title || borrowRecord?.book_title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {bookCopy?.book_author || borrowRecord?.book_author}
                      </p>
                      <p className="font-mono text-xs text-muted mt-1">
                        {bookCopy?.barcode || borrowRecord?.barcode}
                      </p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-1.5">
                    <Badge
                      variant={bookCopy?.status === 'issued' || borrowRecord?.status === 'active' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {bookCopy?.status_display || borrowRecord?.status_display}
                    </Badge>
                    {isOverdue && (
                      <Badge variant="error" size="sm">
                        {daysOverdue}d overdue
                      </Badge>
                    )}
                  </div>

                  {/* Borrower info */}
                  {(bookCopy?.current_borrower || borrowRecord) && (
                    <div className="rounded-lg bg-surface p-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted" />
                        <div>
                          <p className="font-medium text-text-primary">
                            {bookCopy?.current_borrower || borrowRecord?.student_name}
                          </p>
                          {borrowRecord?.student_id_number && (
                            <p className="text-xs text-muted">{borrowRecord.student_id_number}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Due date info */}
                  {borrowRecord && (
                    <div className={`rounded-lg p-3 text-sm ${
                      isOverdue ? 'bg-error/10' : 'bg-surface'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar className={`h-4 w-4 ${isOverdue ? 'text-error' : 'text-muted'}`} />
                        <div>
                          <p className={`font-medium ${isOverdue ? 'text-error' : 'text-text-primary'}`}>
                            Due: {new Date(borrowRecord.due_date).toLocaleDateString()}
                          </p>
                          {isOverdue && fineAmount > 0 && (
                            <p className="text-xs text-error">Fine: ${Number(fineAmount).toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Return status */}
                  {(bookCopy?.status !== 'issued' && borrowRecord?.status !== 'active') && (
                    <Alert variant="info">
                      This book is not currently issued
                    </Alert>
                  )}

                  {canReturn && (
                    <div className="rounded-lg bg-success/10 p-3">
                      <div className="flex items-center gap-2 text-success text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Ready to return</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="mx-auto h-6 w-6 text-muted mb-2" />
                  <p className="text-sm text-text-secondary">Select a borrow or enter barcode</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnBookPage;
