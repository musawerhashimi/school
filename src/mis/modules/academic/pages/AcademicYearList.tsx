import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  CheckCircle,
} from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  DataTable,
  Button,
  Badge,
  Input,
  Select,
  Card,
  CardContent,
  Modal,
  Alert,
  Spinner,
  type Column,
} from '@mis-components/ui';
import {
  useAcademicYears,
  useDeleteAcademicYear,
  useSetCurrentAcademicYear,
} from '../hooks/useAcademicYears';
import type { AcademicYearApiResponse, AcademicYearFilters } from '../types';

export default function AcademicYearList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<AcademicYearFilters>({
    page: 1,
    page_size: 10,
    search: '',
    is_current: undefined,
    is_active: undefined,
    ordering: '-year',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [yearToDelete, setYearToDelete] = useState<AcademicYearApiResponse | null>(null);
  const [setCurrentModalOpen, setSetCurrentModalOpen] = useState(false);
  const [yearToSetCurrent, setYearToSetCurrent] = useState<AcademicYearApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useAcademicYears(filters);
  const deleteYear = useDeleteAcademicYear();
  const setCurrentYear = useSetCurrentAcademicYear();

  // Filter change handlers
  const handleFilterChange = (key: keyof AcademicYearFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      page_size: 10,
      search: '',
      is_current: undefined,
      is_active: undefined,
      ordering: '-year',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.is_current !== undefined ||
    filters.is_active !== undefined
  );

  // Delete handlers
  const handleDeleteClick = (year: AcademicYearApiResponse) => {
    setYearToDelete(year);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (yearToDelete) {
      deleteYear.mutate(yearToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setYearToDelete(null);
        },
      });
    }
  };

  // Set current handlers
  const handleSetCurrentClick = (year: AcademicYearApiResponse) => {
    setYearToSetCurrent(year);
    setSetCurrentModalOpen(true);
  };

  const handleSetCurrentConfirm = () => {
    if (yearToSetCurrent) {
      setCurrentYear.mutate(yearToSetCurrent.id, {
        onSuccess: () => {
          setSetCurrentModalOpen(false);
          setYearToSetCurrent(null);
        },
      });
    }
  };

  // Table columns
  const columns: Column<AcademicYearApiResponse>[] = [
    {
      key: 'year',
      label: 'Hijri Year',
      header: 'Hijri Year',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm font-medium text-primary">
          {row.year}
        </span>
      ),
    },
    {
      key: 'year_gregorian',
      label: 'Gregorian Year',
      header: 'Gregorian Year',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm text-text-secondary">
          {row.year_gregorian}
        </span>
      ),
    },
    {
      key: 'display_name',
      label: 'Display Name',
      header: 'Display Name',
      render: (row) => (
        <span className="font-medium text-text-primary">
          {row.display_name}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Start Date',
      header: 'Start Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.start_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'end_date',
      label: 'End Date',
      header: 'End Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.end_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'is_current',
      label: 'Current',
      header: 'Current',
      render: (row) => (
        row.is_current ? (
          <Badge variant="success">Current</Badge>
        ) : (
          <Badge variant="secondary">-</Badge>
        )
      ),
    },
    {
      key: 'is_ongoing',
      label: 'Status',
      header: 'Status',
      render: (row) => {
        if (row.is_ongoing) {
          return <Badge variant="info">Ongoing</Badge>;
        }
        const endDate = new Date(row.end_date);
        const today = new Date();
        if (endDate < today) {
          return <Badge variant="secondary">Ended</Badge>;
        }
        return <Badge variant="warning">Upcoming</Badge>;
      },
    },
    {
      key: 'is_active',
      label: 'Active',
      header: 'Active',
      render: (row) => (
        row.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Inactive</Badge>
        )
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {!row.is_current && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<CheckCircle className="h-4 w-4 text-success" />}
              onClick={(e) => {
                e.stopPropagation();
                handleSetCurrentClick(row);
              }}
              title="Set as Current"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/academics/years/${row.id}/edit`);
            }}
            title="Edit Year"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Year"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Academic Years"
        subtitle="Manage academic year settings and timelines"
        actions={[
          {
            label: 'Add Academic Year',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/years/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Years</p>
              <p className="text-2xl font-bold text-text-primary">{data.count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Current Page</p>
              <p className="text-2xl font-bold text-primary">
                {data.results.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Current Year</p>
              <p className="text-2xl font-bold text-success">
                {data.results.find((y) => y.is_current)?.year || 'N/A'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Active Years</p>
              <p className="text-2xl font-bold text-text-primary">
                {data.results.filter((y) => y.is_active).length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          leftIcon={<Filter className="h-4 w-4" />}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
          {hasActiveFilters && ` (${Object.values(filters).filter((v) => v && v !== 1 && v !== 10).length})`}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            leftIcon={<X className="h-4 w-4" />}
            size="sm"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                label="Search"
                placeholder="Search by year or description..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                label="Current Status"
                value={String(filters.is_current ?? '')}
                onChange={(e) => handleFilterChange('is_current', e.target.value)}
                options={[
                  { label: 'All Years', value: '' },
                  { label: 'Current Year', value: 'true' },
                  { label: 'Not Current', value: 'false' },
                ]}
              />

              <Select
                label="Active Status"
                value={String(filters.is_active ?? '')}
                onChange={(e) => handleFilterChange('is_active', e.target.value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'true' },
                  { label: 'Inactive', value: 'false' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="error" title="Error Loading Academic Years">
          {error instanceof Error ? error.message : 'Failed to load academic years'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading academic years..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/years/${row.id}/edit`)}
          emptyMessage="No academic years found. Create your first academic year to get started."
          getRowKey={(row) => String(row.id)}
        />
      )}

      {/* Pagination */}
      {!isLoading &&
        data &&
        (() => {
          const currentPage = filters.page || 1;
          const pageSize = filters.page_size || 10;
          const totalPages = Math.ceil(data.count / pageSize);
          return (
            totalPages > 1 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-secondary">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, data.count)} of {data.count} years
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, page }))
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )
          );
        })()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setYearToDelete(null);
        }}
        title="Delete Academic Year"
        size="sm"
      >
        {yearToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {yearToDelete.display_name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setYearToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteYear.isPending}
              >
                Delete Year
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Set Current Confirmation Modal */}
      <Modal
        isOpen={setCurrentModalOpen}
        onClose={() => {
          setSetCurrentModalOpen(false);
          setYearToSetCurrent(null);
        }}
        title="Set Current Academic Year"
        size="sm"
      >
        {yearToSetCurrent && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to set{' '}
              <span className="font-semibold text-text-primary">
                {yearToSetCurrent.display_name}
              </span>{' '}
              as the current academic year? The previous current year will be unmarked.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setSetCurrentModalOpen(false);
                  setYearToSetCurrent(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSetCurrentConfirm}
                loading={setCurrentYear.isPending}
              >
                Set as Current
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
