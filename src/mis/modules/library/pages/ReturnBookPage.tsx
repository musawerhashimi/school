/**
 * ReturnBookPage
 * Process book returns
 */

import { useState } from 'react';
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
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import Input from '@mis-components/ui/Input';
import Textarea from '@mis-components/ui/Textarea';
import Switch from '@mis-components/ui/Switch';
import { Card, CardContent, CardHeader } from '@mis-components/ui/Card';
import Alert from '@mis-components/ui/Alert';
import Badge from '@mis-components/ui/Badge';
import {
  useBookCopyByBarcode,
  useReturnBook,
} from '../hooks/useLibrary';
import { returnBookSchema, type ReturnBookFormData } from '../schemas/librarySchemas';

export function ReturnBookPage() {
  const [barcode, setBarcode] = useState('');
  const [returnComplete, setReturnComplete] = useState<{
    success: boolean;
    message: string;
    fine?: number;
  } | null>(null);

  // Look up book by barcode
  const {
    data: bookCopy,
    isLoading: bookLoading,
    error: bookError,
  } = useBookCopyByBarcode(barcode);

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

  // Handle barcode scan/input
  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
    setValue('barcode', value);
    setReturnComplete(null);
  };

  // Handle submit
  const onSubmit = async (data: ReturnBookFormData) => {
    try {
      const result = await returnMutation.mutateAsync({
        barcode: data.barcode,
        notes: data.notes,
        waive_fine: data.waive_fine,
        waive_reason: data.waive_reason,
      });

      setReturnComplete({
        success: true,
        message: 'Book returned successfully',
        fine: result.fine_amount > 0 && !result.fine_paid && !result.fine_waived
          ? result.fine_amount
          : undefined,
      });

      // Reset form for next return
      reset({
        barcode: '',
        notes: '',
        waive_fine: false,
        waive_reason: '',
      });
      setBarcode('');
    } catch {
      // Error handled by mutation
    }
  };

  // Check if book is issued (can be returned)
  const canReturn = bookCopy?.status === 'issued';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/mis/library">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Return Book</h1>
          <p className="text-text-secondary">
            Process a book return
          </p>
        </div>
      </div>

      {/* Success Message */}
      {returnComplete?.success && (
        <Alert variant="success" title="Return Successful">
          {returnComplete.message}
          {returnComplete.fine && (
            <span className="block mt-1 font-medium">
              Outstanding fine: ${returnComplete.fine.toFixed(2)}
            </span>
          )}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Barcode Input */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Barcode className="h-5 w-5" />
                    Scan or Enter Barcode
                  </span>
                }
                subtitle="Scan the book's barcode or enter it manually"
              />
              <CardContent>
                <Controller
                  name="barcode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter or scan book barcode"
                      {...field}
                      value={barcode}
                      onChange={(e) => handleBarcodeChange(e.target.value)}
                      autoFocus
                      error={errors.barcode?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Return Notes */}
            <Card>
              <CardHeader title="Return Details" />
              <CardContent className="space-y-4">
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Notes (Optional)"
                      placeholder="Add any notes about the return (e.g., condition issues)"
                      error={errors.notes?.message}
                      {...field}
                    />
                  )}
                />

                {/* Waive Fine Option */}
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
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!canReturn || returnMutation.isPending}
              loading={returnMutation.isPending}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {returnMutation.isPending ? 'Processing...' : 'Process Return'}
            </Button>
          </form>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          {/* Book Preview */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Book Details
                </span>
              }
            />
            <CardContent>
              {bookLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : bookError ? (
                <Alert variant="error" title="Book not found">
                  No book found with this barcode
                </Alert>
              ) : bookCopy ? (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-16 overflow-hidden rounded bg-gray-100">
                      <Book className="h-full w-full p-2 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{bookCopy.book_title}</h3>
                      <p className="text-sm text-text-secondary">
                        {bookCopy.book_author}
                      </p>
                      <p className="mt-1 font-mono text-xs">
                        Barcode: {bookCopy.barcode}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Location: {bookCopy.shelf_location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      variant={bookCopy.status === 'issued' ? 'warning' : 'success'}
                    >
                      {bookCopy.status_display}
                    </Badge>
                  </div>

                  {bookCopy.status === 'issued' && bookCopy.current_borrower && (
                    <div className="rounded-lg bg-surface p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          Currently borrowed by: {bookCopy.current_borrower}
                        </span>
                      </div>
                    </div>
                  )}

                  {bookCopy.status !== 'issued' && (
                    <Alert variant="info" title="Cannot Return">
                      This book is not currently issued. Status: {bookCopy.status_display}
                    </Alert>
                  )}

                  {bookCopy.status === 'issued' && (
                    <Alert variant="success">
                      Ready to process return
                    </Alert>
                  )}
                </div>
              ) : (
                <p className="py-8 text-center text-text-secondary">
                  Enter a barcode to see book details
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent className="space-y-2">
              <Link to="/mis/library/issue" className="block">
                <Button variant="outline" fullWidth className="justify-start" leftIcon={<Book className="h-4 w-4" />}>
                  Issue a Book
                </Button>
              </Link>
              <Link to="/mis/library/borrows" className="block">
                <Button variant="outline" fullWidth className="justify-start" leftIcon={<Calendar className="h-4 w-4" />}>
                  View All Borrows
                </Button>
              </Link>
              <Link to="/mis/library/borrows?status=overdue" className="block">
                <Button variant="outline" fullWidth className="justify-start" leftIcon={<AlertTriangle className="h-4 w-4" />}>
                  View Overdue Books
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ReturnBookPage;
