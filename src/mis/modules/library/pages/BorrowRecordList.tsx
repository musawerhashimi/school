/**
 * BorrowRecordList Page
 * Display and manage borrow records
 */

import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Button from "@mis-components/ui/Button";
import Input from "@mis-components/ui/Input";
import Select from "@mis-components/ui/Select";
import Modal, { ModalFooter } from "@mis-components/ui/Modal";
import Badge from "@mis-components/ui/Badge";
import {
  useBorrowRecords,
  useRenewBorrow,
  useMarkLost,
} from "../hooks/useLibrary";
import {
  BORROW_STATUS_OPTIONS,
  BORROW_ORDERING_OPTIONS,
  BORROW_STATUS_CONFIG,
  LIBRARY_DEFAULTS,
} from "../constants";
import type {
  BorrowRecordFilters,
  BorrowStatus,
  BorrowRecordListResponse,
} from "../types";
import { format, addDays } from "date-fns";

export function BorrowRecordList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<BorrowRecordListResponse | null>(null);

  // Get filters from URL
  const filters: BorrowRecordFilters = {
    search: searchParams.get("search") || undefined,
    status: (searchParams.get("status") as BorrowStatus) || undefined,
    is_overdue: searchParams.get("is_overdue") === "true" ? true : undefined,
    has_fine: searchParams.get("has_fine") === "true" ? true : undefined,
    ordering: searchParams.get("ordering") || "-issue_date",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    page_size: 20,
  };

  // Query
  const { data, isLoading } = useBorrowRecords(filters);
  // Mutations
  const renewMutation = useRenewBorrow();
  const markLostMutation = useMarkLost();

  // Convert options for Select component
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All Status" },
      ...BORROW_STATUS_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
    ],
    []
  );

  const orderingOptions = useMemo(
    () =>
      BORROW_ORDERING_OPTIONS.map((opt) => ({
        value: opt.value,
        label: opt.label,
      })),
    []
  );

  // Update filters
  const updateFilter = (
    key: string,
    value: string | number | boolean | undefined
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === undefined || value === "" || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = [
    filters.status,
    filters.is_overdue,
    filters.has_fine,
  ].some((v) => v !== undefined);

  // Pagination
  const totalPages = data ? Math.ceil(data.count / 20) : 0;
  const currentPage = filters.page || 1;

  // Handle renew
  const handleRenew = async () => {
    if (!selectedRecord) return;
    try {
      await renewMutation.mutateAsync({
        id: selectedRecord.id,
        data: {
          new_due_date: format(
            addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays),
            "yyyy-MM-dd"
          ),
        },
      });
      setRenewDialogOpen(false);
      setSelectedRecord(null);
    } catch {
      // Error handled by mutation
    }
  };

  // Handle mark lost
  const handleMarkLost = async (record: BorrowRecordListResponse) => {
    if (!confirm(`Mark "${record.book_title}" as lost?`)) return;
    try {
      await markLostMutation.mutateAsync({ id: record.id });
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Borrow Records</h1>
          <p className="text-text-secondary">
            View and manage book borrowing history
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/mis/library/issue">
            <Button>Issue Book</Button>
          </Link>
          <Link to="/mis/library/return">
            <Button variant="outline">Return Book</Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search by book, student, barcode..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-[140px]">
            <Select
              options={statusOptions}
              value={filters.status || ""}
              onChange={(e) =>
                updateFilter("status", e.target.value || undefined)
              }
            />
          </div>

          <div className="w-[160px]">
            <Select
              options={orderingOptions}
              value={filters.ordering || "-issue_date"}
              onChange={(e) => updateFilter("ordering", e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        description="Filter borrow records"
      >
        <div className="space-y-6">
          <Select
            label="Status"
            options={statusOptions}
            value={filters.status || ""}
            onChange={(e) =>
              updateFilter("status", e.target.value || undefined)
            }
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filters.is_overdue ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilter("is_overdue", !filters.is_overdue || undefined)
                }
              >
                Overdue Only
              </Button>
              <Button
                variant={filters.has_fine ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  updateFilter("has_fine", !filters.has_fine || undefined)
                }
              >
                With Fines
              </Button>
            </div>
          </div>

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
              Clear All Filters
            </Button>
          )}
        </div>
      </Modal>

      {/* Results Count */}
      {data && (
        <p className="text-sm text-text-secondary">
          Showing {(currentPage - 1) * 20 + 1} -{" "}
          {Math.min(currentPage * 20, data.count)} of {data.count} records
        </p>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !data || data.results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No records found</p>
          <p className="text-sm text-text-secondary">
            Try adjusting your filters
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-medium">Book</th>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Issue Date</th>
                <th className="px-4 py-3 text-left font-medium">Due Date</th>
                <th className="px-4 py-3 text-left font-medium">Return Date</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Fine</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((record) => {
                const statusConfig = BORROW_STATUS_CONFIG[record.status];
                return (
                  <tr key={record.id} className="border-b border-border">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium line-clamp-1">
                          {record.book_title}
                        </p>
                        <p className="text-xs text-text-secondary font-mono">
                          {record.barcode}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p>{record.student_name}</p>
                        <p className="text-xs text-text-secondary">
                          {record.student_class}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(record.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {new Date(record.due_date).toLocaleDateString()}
                        {record.is_overdue && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {record.return_date
                        ? new Date(record.return_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                        {record.is_overdue && record.status === "active" && (
                          <span className="ml-1">({record.days_overdue}d)</span>
                        )}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {record.fine_amount > 0 ? (
                        <span
                          className={`font-medium ${
                            record.fine_paid ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          ${record.fine_amount.toFixed(2)}
                          {record.fine_paid && " (Paid)"}
                          {record.fine_waived && " (Waived)"}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {record.status === "active" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRecord(record);
                                setRenewDialogOpen(true);
                              }}
                              title="Renew"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkLost(record)}
                              title="Mark Lost"
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => updateFilter("page", currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => updateFilter("page", currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Renew Dialog */}
      <Modal
        isOpen={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        title="Renew Borrow"
        description={`Extend the due date for this borrow by ${LIBRARY_DEFAULTS.loanPeriodDays} days.`}
        footer={
          <ModalFooter
            cancelText="Cancel"
            onCancel={() => setRenewDialogOpen(false)}
            confirmText="Confirm Renewal"
            onConfirm={handleRenew}
            loading={renewMutation.isPending}
          />
        }
      >
        {selectedRecord && (
          <div className="space-y-2 py-4">
            <p>
              <strong>Book:</strong> {selectedRecord.book_title}
            </p>
            <p>
              <strong>Student:</strong> {selectedRecord.student_name}
            </p>
            <p>
              <strong>Current Due Date:</strong>{" "}
              {new Date(selectedRecord.due_date).toLocaleDateString()}
            </p>
            <p>
              <strong>New Due Date:</strong>{" "}
              {format(
                addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays),
                "MMM dd, yyyy"
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default BorrowRecordList;
