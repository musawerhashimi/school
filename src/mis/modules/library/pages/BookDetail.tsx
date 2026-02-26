/**
 * BookDetail Page
 * Displays detailed information about a library book with tabs
 */

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Book,
  Users,
  Clock,
  Plus,
  Download,
  Calendar,
  Globe,
  Hash,
  FileText,
  BookOpen,
  ExternalLink,
  MapPin,
  Tag,
  Copy,
  Layers,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Button from "@mis-components/ui/Button";
import Badge from "@mis-components/ui/Badge";
import Input from "@mis-components/ui/Input";
import Select from "@mis-components/ui/Select";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mis-components/ui/Tabs";
import Modal, { ModalFooter } from "@mis-components/ui/Modal";
import Skeleton from "@mis-components/ui/Skeleton";
import {
  useLibraryItem,
  useItemCopies,
  useDeleteLibraryItem,
  useBorrowRecords,
  useCreateBookCopy,
} from "../hooks/useLibrary";
import {
  FORMAT_CONFIG,
  COPY_STATUS_CONFIG,
  BORROW_STATUS_CONFIG,
  CONDITION_OPTIONS,
} from "../constants";
import type { BookCopyInput } from "../types";

export function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = Number(id) || 0;
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addCopyModalOpen, setAddCopyModalOpen] = useState(false);

  // Add Copy form state
  const [copyForm, setCopyForm] = useState<BookCopyInput>({
    library_item: bookId,
    barcode: "",
    shelf_location: "",
    status: "available",
    condition: "good",
    building: "",
    floor: "",
    section: "",
    accession_number: "",
    is_reference_only: false,
    notes: "",
  });

  // Queries
  const { data: book, isLoading } = useLibraryItem(bookId);
  const { data: copies = [] } = useItemCopies(bookId);
  const { data: borrowsData } = useBorrowRecords({ library_item: bookId });

  // Mutations
  const deleteMutation = useDeleteLibraryItem();
  const createCopyMutation = useCreateBookCopy();

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(bookId);
      navigate("/mis/library/catalog");
    } catch {
      // Error handled by mutation
    }
  };

  const handleAddCopy = async () => {
    try {
      await createCopyMutation.mutateAsync({
        ...copyForm,
        library_item: bookId,
      });
      setAddCopyModalOpen(false);
      // Reset form
      setCopyForm({
        library_item: bookId,
        barcode: "",
        shelf_location: "",
        status: "available",
        condition: "good",
        building: "",
        floor: "",
        section: "",
        accession_number: "",
        is_reference_only: false,
        notes: "",
      });
    } catch {
      // Error handled by mutation
    }
  };

  const handleReadOnline = () => {
    if (book?.digital_file) {
      window.open(book.digital_file, "_blank", "noopener,noreferrer");
    } else if (book?.id) {
      window.open(`/api/library/items/${book.id}/read/`, "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return (
      <div className="flex h-96 flex-col items-center justify-center bg-surface rounded-2xl border border-border">
        <div className="p-6 rounded-full bg-error/10 mb-4">
          <AlertCircle className="h-12 w-12 text-error" />
        </div>
        <p className="text-lg font-semibold text-text-primary mb-2">Book not found</p>
        <p className="text-sm text-text-secondary mb-6">The book you're looking for doesn't exist or has been removed.</p>
        <Link to="/mis/library/catalog">
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
        <div className="flex items-start gap-3">
          <Link to="/mis/library/catalog">
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{book.title}</h1>
            {book.subtitle && (
              <p className="text-text-secondary mt-1">{book.subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/mis/library/catalog/${book.id}/edit`}>
            <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
              Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)} className="px-3">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Book"
        footer={
          <ModalFooter
            cancelText="Cancel"
            onCancel={() => setDeleteModalOpen(false)}
            confirmText="Delete"
            confirmVariant="danger"
            onConfirm={handleDelete}
            loading={deleteMutation.isPending}
          />
        }
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-error/10">
            <Trash2 className="h-6 w-6 text-error" />
          </div>
          <div>
            <p className="font-medium text-text-primary">Are you sure you want to delete this book?</p>
            <p className="text-sm text-text-secondary mt-1">
              "{book.title}" will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* Add Copy Modal */}
      <Modal
        isOpen={addCopyModalOpen}
        onClose={() => setAddCopyModalOpen(false)}
        title="Add New Copy"
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-2">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Barcode *"
              placeholder="e.g., LIB-001234"
              value={copyForm.barcode}
              onChange={(e) => setCopyForm({ ...copyForm, barcode: e.target.value })}
              leftIcon={<Hash className="h-4 w-4" />}
            />
            <Input
              label="Accession Number"
              placeholder="e.g., ACC-2024-001"
              value={copyForm.accession_number}
              onChange={(e) => setCopyForm({ ...copyForm, accession_number: e.target.value })}
            />
          </div>

          <Input
            label="Shelf Location *"
            placeholder="e.g., A-12-3"
            value={copyForm.shelf_location}
            onChange={(e) => setCopyForm({ ...copyForm, shelf_location: e.target.value })}
            leftIcon={<MapPin className="h-4 w-4" />}
          />

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Building"
              placeholder="e.g., Main Library"
              value={copyForm.building}
              onChange={(e) => setCopyForm({ ...copyForm, building: e.target.value })}
            />
            <Input
              label="Floor"
              placeholder="e.g., 2"
              value={copyForm.floor}
              onChange={(e) => setCopyForm({ ...copyForm, floor: e.target.value })}
            />
            <Input
              label="Section"
              placeholder="e.g., Science"
              value={copyForm.section}
              onChange={(e) => setCopyForm({ ...copyForm, section: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Condition"
              options={CONDITION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
              value={copyForm.condition}
              onChange={(e) => setCopyForm({ ...copyForm, condition: e.target.value as BookCopyInput['condition'] })}
            />
            <Select
              label="Status"
              options={[
                { value: "available", label: "Available" },
                { value: "reserved", label: "Reserved" },
              ]}
              value={copyForm.status}
              onChange={(e) => setCopyForm({ ...copyForm, status: e.target.value as BookCopyInput['status'] })}
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/5 border border-warning/20">
            <input
              type="checkbox"
              id="reference-only"
              checked={copyForm.is_reference_only}
              onChange={(e) => setCopyForm({ ...copyForm, is_reference_only: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="reference-only" className="text-sm font-medium text-text-primary">
              Reference Only (cannot be borrowed)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Notes</label>
            <textarea
              placeholder="Additional notes about this copy..."
              value={copyForm.notes}
              onChange={(e) => setCopyForm({ ...copyForm, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 mt-4 border-t border-border">
          <Button variant="outline" fullWidth onClick={() => setAddCopyModalOpen(false)}>
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={handleAddCopy}
            loading={createCopyMutation.isPending}
            disabled={!copyForm.barcode || !copyForm.shelf_location}
          >
            Add Copy
          </Button>
        </div>
      </Modal>

      {/* Hero Section */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Cover Image */}
        <div className="lg:col-span-1">
          <div className="aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-surface to-surface-hover border border-border shadow-sm">
            {book.cover_image ? (
              <img
                src={book.cover_image}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center p-6">
                  <Book className="h-16 w-16 mx-auto text-primary/30 mb-3" />
                  <p className="text-xs text-text-secondary">No cover image</p>
                </div>
              </div>
            )}
          </div>

          {/* Digital Actions */}
          {book.has_digital && (
            <div className="mt-4 space-y-2">
              <Button
                fullWidth
                onClick={handleReadOnline}
                leftIcon={<ExternalLink className="h-4 w-4" />}
                className="bg-gradient-to-r from-primary to-primary-dark text-white"
              >
                Read Online
              </Button>
              {book.is_downloadable && (
                <Button variant="outline" fullWidth leftIcon={<Download className="h-4 w-4" />}>
                  Download
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="lg:col-span-3 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={formatConfig.variant} className="px-3 py-1">
              {formatConfig.label}
            </Badge>
            <Badge variant={book.is_active ? "success" : "default"} className="px-3 py-1">
              {book.is_active ? "Active" : "Inactive"}
            </Badge>
            {book.has_digital && (
              <Badge variant="info" className="px-3 py-1">
                <BookOpen className="h-3 w-3 mr-1" />
                Digital Available
              </Badge>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<Users className="h-5 w-5 text-primary" />}
              label="Author"
              value={book.author}
            />
            <InfoCard
              icon={<Tag className="h-5 w-5 text-secondary" />}
              label="Category"
              value={book.category_name}
            />
            <InfoCard
              icon={<Calendar className="h-5 w-5 text-accent" />}
              label="Published"
              value={book.publication_year?.toString() || "N/A"}
            />
            <InfoCard
              icon={<TrendingUp className="h-5 w-5 text-success" />}
              label="Times Borrowed"
              value={book.times_borrowed.toString()}
            />
          </div>

          {/* Quick Stats for Physical Books */}
          {book.format !== "digital" && (
            <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-gradient-to-r from-surface to-surface-hover border border-border">
              <StatBadge
                value={book.available_copies}
                label="Available"
                color="success"
              />
              <StatBadge
                value={book.total_copies}
                label="Total Copies"
                color="primary"
              />
              <StatBadge
                value={book.current_borrows}
                label="Currently Issued"
                color="warning"
              />
            </div>
          )}

          {/* Description */}
          {book.description && (
            <div className="p-4 rounded-xl bg-surface border border-border">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Description
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Book className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          {book.format !== "digital" && (
            <TabsTrigger value="copies">
              <Layers className="h-4 w-4 mr-2" />
              Copies ({copies.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader title="Book Details" />
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem icon={<Hash />} label="ISBN" value={book.isbn || "N/A"} />
                <DetailItem icon={<Hash />} label="ISBN-13" value={book.isbn_13 || "N/A"} />
                <DetailItem icon={<Users />} label="Publisher" value={book.publisher || "N/A"} />
                <DetailItem icon={<Copy />} label="Edition" value={book.edition || "N/A"} />
                <DetailItem icon={<Globe />} label="Language" value={book.language} />
                <DetailItem icon={<FileText />} label="Page Count" value={book.page_count?.toString() || "N/A"} />
                {book.co_authors && book.co_authors.length > 0 && (
                  <DetailItem icon={<Users />} label="Co-Authors" value={book.co_authors.join(", ")} />
                )}
                {book.tags && book.tags.length > 0 && (
                  <DetailItem icon={<Tag />} label="Tags" value={book.tags.join(", ")} />
                )}
              </dl>

              {book.summary && (
                <div className="mt-6 p-4 rounded-lg bg-surface-hover">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Summary</h4>
                  <p className="text-sm text-text-secondary">{book.summary}</p>
                </div>
              )}

              {book.table_of_contents && (
                <div className="mt-4 p-4 rounded-lg bg-surface-hover">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Table of Contents</h4>
                  <pre className="whitespace-pre-wrap text-sm text-text-secondary font-sans">
                    {book.table_of_contents}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {book.format !== "digital" && (
          <TabsContent value="copies">
            <Card>
              <CardHeader
                title="Book Copies"
                subtitle="Physical copies of this book in the library"
                action={
                  <Button
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setAddCopyModalOpen(true)}
                  >
                    Add Copy
                  </Button>
                }
              />
              <CardContent>
                {copies.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                      <Layers className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-text-primary font-medium mb-1">No copies registered</p>
                    <p className="text-sm text-text-secondary mb-4">Add your first copy to start lending this book.</p>
                    <Button
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setAddCopyModalOpen(true)}
                    >
                      Add First Copy
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-surface-hover">
                          <th className="px-4 py-3 text-left font-semibold text-text-primary">Barcode</th>
                          <th className="px-4 py-3 text-left font-semibold text-text-primary">Location</th>
                          <th className="px-4 py-3 text-left font-semibold text-text-primary">Status</th>
                          <th className="px-4 py-3 text-left font-semibold text-text-primary">Condition</th>
                          <th className="px-4 py-3 text-left font-semibold text-text-primary">Borrower</th>
                        </tr>
                      </thead>
                      <tbody>
                        {copies.map((copy) => {
                          const statusConfig = COPY_STATUS_CONFIG[copy.status];
                          return (
                            <tr key={copy.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                              <td className="px-4 py-3">
                                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {copy.barcode}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-text-secondary">
                                {copy.shelf_location}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant={statusConfig.variant} size="sm">
                                  {statusConfig.label}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 capitalize text-text-secondary">
                                {copy.condition}
                              </td>
                              <td className="px-4 py-3 text-text-secondary">
                                {copy.current_borrower || "-"}
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
                <div className="py-12 text-center">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-text-primary font-medium mb-1">No borrow history</p>
                  <p className="text-sm text-text-secondary">This book hasn't been borrowed yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-hover">
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Student</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Barcode</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Issue Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Due Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Return Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-text-primary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowsData.results.map((record) => {
                        const statusConfig = BORROW_STATUS_CONFIG[record.status];
                        return (
                          <tr key={record.id} className="border-b border-border hover:bg-surface-hover transition-colors">
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-text-primary">{record.student_name}</p>
                                <p className="text-xs text-text-secondary">{record.student_class}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {record.barcode}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-text-secondary">
                              {new Date(record.issue_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-text-secondary">
                              {new Date(record.due_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-text-secondary">
                              {record.return_date ? new Date(record.return_date).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={statusConfig.variant} size="sm">
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
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/30 transition-colors">
      <div className="p-2 rounded-lg bg-surface">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="font-medium text-text-primary truncate">{value}</p>
      </div>
    </div>
  );
}

function StatBadge({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: "success" | "primary" | "warning" | "error";
}) {
  const colorClasses = {
    success: "text-success",
    primary: "text-primary",
    warning: "text-warning",
    error: "text-error",
  };

  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</span>
      <span className="text-sm text-text-secondary">{label}</span>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 rounded-md bg-surface-hover text-text-secondary">
        {icon}
      </div>
      <div>
        <dt className="text-xs text-text-secondary">{label}</dt>
        <dd className="font-medium text-text-primary">{value}</dd>
      </div>
    </div>
  );
}

function BookDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="256px" height="32px" />
      </div>
      <div className="grid gap-6 lg:grid-cols-4">
        <Skeleton variant="rectangular" width="100%" height="350px" className="rounded-xl" />
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2">
            <Skeleton variant="rectangular" width="80px" height="28px" className="rounded-full" />
            <Skeleton variant="rectangular" width="64px" height="28px" className="rounded-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="72px" className="rounded-xl" />
            ))}
          </div>
          <Skeleton variant="rectangular" width="100%" height="80px" className="rounded-xl" />
          <Skeleton variant="rectangular" width="100%" height="120px" className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
