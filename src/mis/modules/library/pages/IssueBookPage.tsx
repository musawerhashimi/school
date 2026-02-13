/**
 * IssueBookPage
 * Issue a book to a student
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays } from 'date-fns';
import {
  ArrowLeft,
  Barcode,
  User,
  Calendar,
  Book,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import Input from '@mis-components/ui/Input';
import Textarea from '@mis-components/ui/Textarea';
import { Card, CardContent, CardHeader } from '@mis-components/ui/Card';
import Alert from '@mis-components/ui/Alert';
import Badge from '@mis-components/ui/Badge';
import {
  useBookCopyByBarcode,
  useIssueBook,
  useStudentLibrarySummary,
} from '../hooks/useLibrary';
import { issueBookSchema, type IssueBookFormData } from '../schemas/librarySchemas';
import { LIBRARY_DEFAULTS } from '../constants';

export function IssueBookPage() {
  const [barcode, setBarcode] = useState('');
  const [studentId, setStudentId] = useState<number | null>(null);

  // Look up book by barcode
  const {
    data: bookCopy,
    isLoading: bookLoading,
    error: bookError,
  } = useBookCopyByBarcode(barcode);

  // Look up student summary
  const { data: studentSummary, isLoading: studentLoading } =
    useStudentLibrarySummary(studentId || 0);

  // Issue mutation
  const issueMutation = useIssueBook();

  // Form
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<IssueBookFormData>({
    resolver: zodResolver(issueBookSchema),
    defaultValues: {
      barcode: '',
      student_id: undefined as unknown as number,
      due_date: format(addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  // Handle barcode scan/input
  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
    setValue('barcode', value);
  };

  // Handle student selection
  const handleStudentIdChange = (value: string) => {
    const id = parseInt(value, 10);
    if (!isNaN(id)) {
      setStudentId(id);
      setValue('student_id', id);
    }
  };

  // Handle submit
  const onSubmit = async (data: IssueBookFormData) => {
    try {
      await issueMutation.mutateAsync({
        barcode: data.barcode,
        student_id: data.student_id,
        due_date: data.due_date,
        notes: data.notes,
      });
      // Reset form for next issue
      reset({
        barcode: '',
        student_id: undefined as unknown as number,
        due_date: format(addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays), 'yyyy-MM-dd'),
        notes: '',
      });
      setBarcode('');
      setStudentId(null);
    } catch {
      // Error handled by mutation
    }
  };

  const canIssue =
    bookCopy?.is_available &&
    studentSummary?.can_borrow &&
    !studentSummary?.has_overdue;

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
          <h1 className="text-2xl font-bold">Issue Book</h1>
          <p className="text-text-secondary">
            Issue a book to a student
          </p>
        </div>
      </div>

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

            {/* Student Input */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Select Student
                  </span>
                }
              />
              <CardContent>
                <Controller
                  name="student_id"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Student ID"
                      type="number"
                      placeholder="Enter student ID"
                      value={field.value || ''}
                      onChange={(e) => handleStudentIdChange(e.target.value)}
                      error={errors.student_id?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Due Date & Notes */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Issue Details
                  </span>
                }
              />
              <CardContent className="space-y-4">
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Due Date"
                      type="date"
                      {...field}
                      error={errors.due_date?.message}
                    />
                  )}
                />

                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Notes (Optional)"
                      placeholder="Add any notes about this issue"
                      {...field}
                      error={errors.notes?.message}
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={!canIssue || issueMutation.isPending}
              loading={issueMutation.isPending}
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
            >
              {issueMutation.isPending ? 'Issuing...' : 'Issue Book'}
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
                    <Badge variant={bookCopy.is_available ? 'success' : 'error'}>
                      {bookCopy.is_available ? 'Available' : 'Not Available'}
                    </Badge>
                    <Badge variant="default" className="capitalize">
                      {bookCopy.condition}
                    </Badge>
                  </div>

                  {!bookCopy.is_available && (
                    <Alert variant="error">
                      This copy is currently {bookCopy.status}
                      {bookCopy.current_borrower &&
                        ` by ${bookCopy.current_borrower}`}
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

          {/* Student Preview */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Details
                </span>
              }
            />
            <CardContent>
              {studentLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : studentSummary ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{studentSummary.student_name}</h3>
                    <p className="text-sm text-text-secondary">
                      ID: {studentSummary.student_id}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-secondary">Current Borrows</p>
                      <p className="font-medium">
                        {studentSummary.current_borrows} / {studentSummary.max_borrows}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Unpaid Fines</p>
                      <p className="font-medium">
                        ${studentSummary.unpaid_fines.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {studentSummary.has_overdue && (
                    <Alert variant="error" title="Overdue Books">
                      This student has {studentSummary.overdue_count} overdue
                      book(s). Cannot issue new books until returned.
                    </Alert>
                  )}

                  {!studentSummary.can_borrow && !studentSummary.has_overdue && (
                    <Alert variant="error" title="Limit Reached">
                      Student has reached the maximum borrow limit.
                    </Alert>
                  )}

                  {studentSummary.can_borrow && !studentSummary.has_overdue && (
                    <Alert variant="success">
                      Student is eligible to borrow
                    </Alert>
                  )}
                </div>
              ) : studentId ? (
                <Alert variant="error" title="Student not found">
                  No student found with this ID
                </Alert>
              ) : (
                <p className="py-8 text-center text-text-secondary">
                  Enter a student ID to see details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default IssueBookPage;
