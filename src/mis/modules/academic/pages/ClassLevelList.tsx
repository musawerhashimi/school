import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, BookOpen } from 'lucide-react';
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
  useClassLevels,
  useDeleteClassLevel,
} from '../hooks/useClassLevels';
import type { ClassLevelApiResponse, ClassLevelFilters } from '../types';

export default function ClassLevelList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<ClassLevelFilters>({
    page: 1,
    // page_size: 10,
    search: '',
    category: undefined,
    // ordering: 'level',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<ClassLevelApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useClassLevels(filters);
  const deleteLevel = useDeleteClassLevel();

  // Filter change handlers
  const handleFilterChange = (key: keyof ClassLevelFilters, value: string) => {
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
      category: undefined,
      // ordering: 'level',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.category
  );

  // Delete handlers
  const handleDeleteClick = (level: ClassLevelApiResponse) => {
    setLevelToDelete(level);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (levelToDelete) {
      deleteLevel.mutate(levelToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setLevelToDelete(null);
        },
      });
    }
  };

  // Helper functions
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      primary: 'Primary',
      lower_secondary: 'Lower Secondary',
      upper_secondary: 'Upper Secondary',
    };
    return labels[category] || category;
  };

  const getCategoryVariant = (
    category: string
  ): 'success' | 'info' | 'warning' => {
    if (category === 'primary') return 'success';
    if (category === 'lower_secondary') return 'info';
    return 'warning';
  };

  // Table columns
  const columns: Column<ClassLevelApiResponse>[] = [
    {
      key: 'level',
      label: 'Level',
      header: 'Level',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-lg font-bold text-primary">
          {row.level}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      header: 'Name',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-primary">{row.name}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      header: 'Category',
      render: (row) => (
        <Badge variant={getCategoryVariant(row.category)}>
          {getCategoryLabel(row.category)}
        </Badge>
      ),
    },
    {
      key: 'moe_code',
      label: 'MoE Code',
      header: 'MoE Code',
      render: (row) => (
        <span className="font-mono text-sm text-text-secondary">
          {row.moe_code || 'N/A'}
        </span>
      ),
    },
    {
      key: 'total_subjects',
      label: 'Subjects',
      header: 'Subjects',
      render: (row) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-text-secondary" />
          <span className="text-sm text-text-primary">
            {row.subjects_count || 0}
          </span>
        </div>
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
              navigate(`/mis/academics/levels/${row.id}/edit`);
            }}
            title="Edit Level"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Level"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Class Levels"
        subtitle="Manage class levels (Grades 1-12) and curriculum structure"
        actions={[
          {
            label: 'Add Class Level',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/levels/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Levels</p>
              <p className="text-2xl font-bold text-text-primary">{data.count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Primary</p>
              <p className="text-2xl font-bold text-success">
                {data.results.filter((l) => l.category === 'primary').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Lower Secondary</p>
              <p className="text-2xl font-bold text-info">
                {data.results.filter((l) => l.category === 'lower_secondary').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Upper Secondary</p>
              <p className="text-2xl font-bold text-warning">
                {data.results.filter((l) => l.category === 'upper_secondary').length}
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
                label="Category"
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                options={[
                  { label: 'All Categories', value: '' },
                  { label: 'Primary (Grades 1-6)', value: 'primary' },
                  { label: 'Lower Secondary (Grades 7-9)', value: 'lower_secondary' },
                  { label: 'Upper Secondary (Grades 10-12)', value: 'upper_secondary' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="error" title="Error Loading Class Levels">
          {error instanceof Error ? error.message : 'Failed to load class levels'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading class levels..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/levels/${row.id}/edit`)}
          emptyMessage="No class levels found. Create your first class level to get started."
          getRowKey={(row) => String(row.id)}
        />
      )}

      {/* Pagination */}
      {!isLoading &&
        data &&
        (() => {
          const currentPage = filters.page || 1;
          const pageSize = filters.page_size || 20;
          const totalPages = Math.ceil(data.count / pageSize);
          return (
            totalPages > 1 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-secondary">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, data.count)} of {data.count} levels
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
          setLevelToDelete(null);
        }}
        title="Delete Class Level"
        size="sm"
      >
        {levelToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {levelToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setLevelToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteLevel.isPending}
              >
                Delete Level
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
