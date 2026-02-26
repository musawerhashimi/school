import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, BookOpen, Clock } from 'lucide-react';
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
  useSubjects,
  useDeleteSubject,
} from '../hooks/useSubjects';
import type { SubjectApiResponse, SubjectFilters } from '../types';

export default function SubjectList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<SubjectFilters>({
    page: 1,
    page_size: 10,
    search: '',
    subject_type: undefined,
    is_active: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useSubjects(filters);
  const deleteSubject = useDeleteSubject();

  // Filter change handlers
  const handleFilterChange = (key: keyof SubjectFilters, value: string) => {
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
      subject_type: undefined,
      is_active: undefined,
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.subject_type ||
    filters.is_active !== undefined
  );

  // Delete handlers
  const handleDeleteClick = (subject: SubjectApiResponse) => {
    setSubjectToDelete(subject);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (subjectToDelete) {
      deleteSubject.mutate(subjectToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSubjectToDelete(null);
        },
      });
    }
  };

  // Helper functions
  const getSubjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      core: 'Core',
      elective: 'Elective',
      religious: 'Religious',
      language: 'Language',
      science: 'Science',
      arts: 'Arts',
      practical: 'Practical',
    };
    return labels[type] || type;
  };

  const getSubjectTypeVariant = (
    type: string
  ): 'success' | 'info' | 'warning' | 'secondary' => {
    if (type === 'core') return 'success';
    if (type === 'science' || type === 'language') return 'info';
    if (type === 'elective' || type === 'arts') return 'warning';
    return 'secondary';
  };

  // Table columns
  const columns: Column<SubjectApiResponse>[] = [
    {
      key: 'code',
      label: 'Code',
      header: 'Code',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm font-bold text-primary">
          {row.code}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Subject Name',
      header: 'Subject Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-text-secondary" />
          <span className="font-medium text-text-primary">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'subject_type',
      label: 'Type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <Badge variant={getSubjectTypeVariant(row.subject_type)}>
          {getSubjectTypeLabel(row.subject_type)}
        </Badge>
      ),
    },
    {
      key: 'total_credit_hours',
      label: 'Total Credits',
      header: 'Total Credits',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-secondary" />
          <span className="font-medium text-text-primary">{row.total_credit_hours || 0}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      header: 'Status',
      render: (row) =>
        row.is_active ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="danger">Inactive</Badge>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/academics/subjects/${row.id}/edit`);
            }}
            title="Edit Subject"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Subject"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Subjects"
        subtitle="Manage academic subjects and curriculum"
        actions={[
          {
            label: 'Add Subject',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/subjects/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Subjects</p>
              <p className="text-2xl font-bold text-text-primary">{data.count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Core Subjects</p>
              <p className="text-2xl font-bold text-success">
                {data.results.filter((s) => s.subject_type === 'core').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Elective Subjects</p>
              <p className="text-2xl font-bold text-warning">
                {data.results.filter((s) => s.subject_type === 'elective').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Active Subjects</p>
              <p className="text-2xl font-bold text-info">
                {data.results.filter((s) => s.is_active).length}
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
          {hasActiveFilters &&
            ` (${Object.values(filters).filter((v) => v && v !== 1 && v !== 10).length})`}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search"
                placeholder="Search by name or code..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                label="Subject Type"
                value={filters.subject_type || ''}
                onChange={(e) => handleFilterChange('subject_type', e.target.value)}
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Core', value: 'core' },
                  { label: 'Elective', value: 'elective' },
                  { label: 'Religious', value: 'religious' },
                  { label: 'Language', value: 'language' },
                  { label: 'Science', value: 'science' },
                  { label: 'Arts', value: 'arts' },
                  { label: 'Practical', value: 'practical' },
                ]}
              />

              <Select
                label="Status"
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
        <Alert variant="error" title="Error Loading Subjects">
          {error instanceof Error ? error.message : 'Failed to load subjects'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading subjects..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/subjects/${row.id}/edit`)}
          emptyMessage="No subjects found. Create your first subject to get started."
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
                  {Math.min(currentPage * pageSize, data.count)} of {data.count}{' '}
                  subjects
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
                          onClick={() => setFilters((prev) => ({ ...prev, page }))}
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
          setSubjectToDelete(null);
        }}
        title="Delete Subject"
        size="sm"
      >
        {subjectToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {subjectToDelete.name}
              </span>{' '}
              ({subjectToDelete.code})? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSubjectToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteSubject.isPending}
              >
                Delete Subject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
