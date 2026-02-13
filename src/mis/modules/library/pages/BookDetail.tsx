/**
 * BookDetail Page
 * Displays detailed information about a library book with tabs
 */

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Book,
  Users,
  Clock,
  BarChart3,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import Badge from '@mis-components/ui/Badge';
import { Card, CardContent, CardHeader } from '@mis-components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mis-components/ui/Tabs';
import Modal, { ModalFooter } from '@mis-components/ui/Modal';
import Skeleton from '@mis-components/ui/Skeleton';
import {
  useLibraryItem,
  useItemCopies,
  useDeleteLibraryItem,
  useBorrowRecords,
} from '../hooks/useLibrary';
import { FORMAT_CONFIG, COPY_STATUS_CONFIG, BORROW_STATUS_CONFIG } from '../constants';

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = Number(id) || 0;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Queries
  const { data: book, isLoading } = useLibraryItem(bookId);
  const { data: copies = [] } = useItemCopies(bookId);
  const { data: borrowsData } = useBorrowRecords({ library_item: bookId });

  // Mutations
  const deleteMutation = useDeleteLibraryItem();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(bookId);
      navigate('/mis/library/catalog');
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-lg font-medium">Book not found</p>
        <Link to="/mis/library/catalog" className="mt-4">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const formatConfig = FORMAT_CONFIG[book.format];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/mis/library/catalog">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            {book.subtitle && (
              <p className="text-text-secondary">{book.subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/mis/library/catalog/${book.id}/edit`}>
            <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
              Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Book"
        description={`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
      >
        <ModalFooter>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-100">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <Book className="h-20 w-20 text-slate-400" />
              </div>
            )}
          </div>

          {/* Digital Actions */}
          {book.has_digital && (
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" variant="secondary" leftIcon={<Eye className="h-4 w-4" />}>
                Read
              </Button>
              {book.is_downloadable && (
                <Button variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={formatConfig.variant}>
              {formatConfig.label}
            </Badge>
            <Badge variant={book.is_active ? 'primary' : 'default'}>
              {book.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<Users className="h-5 w-5" />}
              label="Author"
              value={book.author}
            />
            <InfoCard
              icon={<Book className="h-5 w-5" />}
              label="Category"
              value={book.category_name}
            />
            <InfoCard
              icon={<Clock className="h-5 w-5" />}
              label="Published"
              value={book.publication_year?.toString() || 'N/A'}
            />
            <InfoCard
              icon={<BarChart3 className="h-5 w-5" />}
              label="Times Borrowed"
              value={book.times_borrowed.toString()}
            />
          </div>

          {/* Quick Stats */}
          {book.format !== 'digital' && (
            <div className="flex gap-6 pt-2">
              <div>
                <span className="text-2xl font-bold text-green-600">
                  {book.available_copies}
                </span>
                <span className="ml-1 text-sm text-text-secondary">
                  available
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold">{book.total_copies}</span>
                <span className="ml-1 text-sm text-text-secondary">
                  total copies
                </span>
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-600">
                  {book.current_borrows}
                </span>
                <span className="ml-1 text-sm text-text-secondary">
                  currently issued
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="pt-2">
              <h3 className="mb-2 font-medium">Description</h3>
              <p className="text-sm text-text-secondary">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {book.format !== 'digital' && (
            <TabsTrigger value="copies">
              Copies ({copies.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="history">Borrow History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader title="Book Details" />
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="ISBN" value={book.isbn || 'N/A'} />
                <DetailItem label="ISBN-13" value={book.isbn_13 || 'N/A'} />
                <DetailItem label="Publisher" value={book.publisher || 'N/A'} />
                <DetailItem label="Edition" value={book.edition || 'N/A'} />
                <DetailItem label="Language" value={book.language} />
                <DetailItem
                  label="Page Count"
                  value={book.page_count?.toString() || 'N/A'}
                />
                {book.co_authors && book.co_authors.length > 0 && (
                  <DetailItem
                    label="Co-Authors"
                    value={book.co_authors.join(', ')}
                  />
                )}
                {book.tags && book.tags.length > 0 && (
                  <DetailItem label="Tags" value={book.tags.join(', ')} />
                )}
              </dl>

              {book.summary && (
                <div className="mt-6">
                  <h4 className="mb-2 font-medium">Summary</h4>
                  <p className="text-sm text-text-secondary">{book.summary}</p>
                </div>
              )}

              {book.table_of_contents && (
                <div className="mt-6">
                  <h4 className="mb-2 font-medium">Table of Contents</h4>
                  <pre className="whitespace-pre-wrap text-sm text-text-secondary">
                    {book.table_of_contents}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {book.format !== 'digital' && (
          <TabsContent value="copies">
            <Card>
              <CardHeader
                title="Book Copies"
                subtitle="Physical copies of this book in the library"
                action={
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    Add Copy
                  </Button>
                }
              />
              <CardContent>
                {copies.length === 0 ? (
                  <p className="py-4 text-center text-text-secondary">
                    No copies registered yet
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left font-medium">Barcode</th>
                          <th className="px-4 py-3 text-left font-medium">Location</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Condition</th>
                          <th className="px-4 py-3 text-left font-medium">Borrower</th>
                        </tr>
                      </thead>
                      <tbody>
                        {copies.map((copy) => {
                          const statusConfig = COPY_STATUS_CONFIG[copy.status];
                          return (
                            <tr key={copy.id} className="border-b border-border">
                              <td className="px-4 py-3 font-mono">
                                {copy.barcode}
                              </td>
                              <td className="px-4 py-3">{copy.shelf_location}</td>
                              <td className="px-4 py-3">
                                <Badge variant={statusConfig.variant}>
                                  {statusConfig.label}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 capitalize">
                                {copy.condition}
                              </td>
                              <td className="px-4 py-3">
                                {copy.current_borrower || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="history">
          <Card>
            <CardHeader
              title="Borrow History"
              subtitle="Recent borrowing records for this book"
            />
            <CardContent>
              {!borrowsData || borrowsData.results.length === 0 ? (
                <p className="py-4 text-center text-text-secondary">
                  No borrow history yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-4 py-3 text-left font-medium">Student</th>
                        <th className="px-4 py-3 text-left font-medium">Barcode</th>
                        <th className="px-4 py-3 text-left font-medium">Issue Date</th>
                        <th className="px-4 py-3 text-left font-medium">Due Date</th>
                        <th className="px-4 py-3 text-left font-medium">Return Date</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowsData.results.map((record) => {
                        const statusConfig = BORROW_STATUS_CONFIG[record.status];
                        return (
                          <tr key={record.id} className="border-b border-border">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium">{record.student_name}</p>
                                <p className="text-xs text-text-secondary">
                                  {record.student_class}
                                </p>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono">
                              {record.barcode}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(record.issue_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(record.due_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              {record.return_date
                                ? new Date(record.return_date).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={statusConfig.variant}>
                                {statusConfig.label}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <div className="text-text-secondary">{icon}</div>
      <div>
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function BookDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="rectangular" width={40} height={40} />
        <Skeleton variant="text" width="256px" height="32px" />
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        <Skeleton variant="rectangular" width="100%" height="300px" />
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2">
            <Skeleton variant="text" width="80px" height="24px" />
            <Skeleton variant="text" width="64px" height="24px" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="64px" />
            ))}
          </div>
          <Skeleton variant="rectangular" width="100%" height="96px" />
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
