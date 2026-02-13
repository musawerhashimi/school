import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  Users,
  Clock,
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
  useClassInstances,
  useDeleteClassInstance,
  useClassInstanceStats,
} from '../hooks/useClassInstances';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useClassLevels } from '../hooks/useClassLevels';
import type { ClassInstanceApiResponse, ClassInstanceFilters } from '../types';

export default function ClassInstanceList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<ClassInstanceFilters>({
    page: 1,
    page_size: 10,
    search: '',
    academic_year: undefined,
    class_level: undefined,
    shift: undefined,
    is_active: undefined,
    ordering: '-academic_year__year,class_level__level,section',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassInstanceApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useClassInstances(filters);
  const { data: statsData } = useClassInstanceStats(filters.academic_year);
  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const { data: classLevelsData } = useClassLevels({});
  const deleteClass = useDeleteClassInstance();

  const academicYears = academicYearsData?.results || [];
  const classLevels = classLevelsData?.results || [];

  // Filter change handlers
  const handleFilterChange = (key: keyof ClassInstanceFilters, value: string) => {
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
      academic_year: undefined,
      class_level: undefined,
      shift: undefined,
      is_active: undefined,
      ordering: '-academic_year__year,class_level__level,section',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.academic_year ||
    filters.class_level ||
    filters.shift ||
    filters.is_active !== undefined
  );

  // Delete handlers
  const handleDeleteClick = (classInstance: ClassInstanceApiResponse) => {
    setClassToDelete(classInstance);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (classToDelete) {
      deleteClass.mutate(classToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setClassToDelete(null);
        },
      });
    }
  };

  // Helper functions
  const getShiftVariant = (shift: string): 'success' | 'info' | 'warning' => {
    if (shift === 'morning') return 'success';
    if (shift === 'afternoon') return 'info';
    return 'warning';
  };

  const getEnrollmentVariant = (percentage: number): 'success' | 'warning' | 'danger' => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  // Table columns
  const columns: Column<ClassInstanceApiResponse>[] = [
    {
      key: 'name',
      label: 'Class Name',
      header: 'Class Name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-text-primary">{row.name}</span>
          <p className="text-xs text-text-secondary">{row.display_name}</p>
        </div>
      ),
    },
    {
      key: 'academic_year',
      label: 'Academic Year',
      header: 'Academic Year',
      render: (row) => (
        <span className="text-sm text-text-primary">
          {row.academic_year_display}
        </span>
      ),
    },
    {
      key: 'class_level',
      label: 'Level',
      header: 'Level',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold text-primary">
            {row.class_level_number}
          </span>
          <span className="text-sm text-text-secondary">
            {row.class_level_name}
          </span>
        </div>
      ),
    },
    {
      key: 'section',
      label: 'Section',
      header: 'Section',
      render: (row) => (
        <Badge variant="secondary" className="font-mono">
          {row.section}
        </Badge>
      ),
    },
    {
      key: 'room',
      label: 'Room',
      header: 'Room',
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.room_number || 'Not assigned'}
        </span>
      ),
    },
    {
      key: 'shift',
      label: 'Shift',
      header: 'Shift',
      render: (row) => (
        <Badge variant={getShiftVariant(row.shift)}>
          <Clock className="h-3 w-3 mr-1" />
          {row.shift_display}
        </Badge>
      ),
    },
    {
      key: 'enrollment',
      label: 'Enrollment',
      header: 'Enrollment',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <span className="font-medium">{row.enrolled_count}</span>
          <span className="text-text-secondary">/ {row.capacity}</span>
          <Badge
            variant={getEnrollmentVariant(row.enrollment_percentage)}
            className="text-xs"
          >
            {row.enrollment_percentage}%
          </Badge>
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
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/academics/classes/${row.id}`);
            }}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/academics/classes/${row.id}/edit`);
            }}
            title="Edit Class"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Class"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Class Instances"
        subtitle="Manage classes, sections, and student assignments"
        actions={[
          {
            label: 'Add Class',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/classes/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistics Cards */}
      {statsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Classes</p>
              <p className="text-2xl font-bold text-text-primary">
                {statsData.total_classes}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Capacity</p>
              <p className="text-2xl font-bold text-primary">
                {statsData.total_capacity}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Enrolled</p>
              <p className="text-2xl font-bold text-success">
                {statsData.total_enrolled}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Available Seats</p>
              <p className="text-2xl font-bold text-info">
                {statsData.available_seats}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Enrollment %</p>
              <p className="text-2xl font-bold text-warning">
                {statsData.enrollment_percentage}%
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Search"
                placeholder="Search by name or section..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                label="Academic Year"
                value={String(filters.academic_year || '')}
                onChange={(e) => handleFilterChange('academic_year', e.target.value)}
                options={[
                  { label: 'All Years', value: '' },
                  ...academicYears.map((y) => ({
                    label: y.display_name,
                    value: String(y.id),
                  })),
                ]}
              />

              <Select
                label="Class Level"
                value={String(filters.class_level || '')}
                onChange={(e) => handleFilterChange('class_level', e.target.value)}
                options={[
                  { label: 'All Levels', value: '' },
                  ...classLevels.map((l) => ({
                    label: l.name,
                    value: String(l.id),
                  })),
                ]}
              />

              <Select
                label="Shift"
                value={filters.shift || ''}
                onChange={(e) => handleFilterChange('shift', e.target.value)}
                options={[
                  { label: 'All Shifts', value: '' },
                  { label: 'Morning', value: 'morning' },
                  { label: 'Afternoon', value: 'afternoon' },
                  { label: 'Evening', value: 'evening' },
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
        <Alert variant="error" title="Error Loading Classes">
          {error instanceof Error ? error.message : 'Failed to load classes'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading classes..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/classes/${row.id}`)}
          emptyMessage="No classes found. Create your first class to get started."
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
                  {Math.min(currentPage * pageSize, data.count)} of {data.count} classes
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
          setClassToDelete(null);
        }}
        title="Delete Class"
        size="sm"
      >
        {classToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {classToDelete.name}
              </span>
              ? This action cannot be undone.
            </p>

            {classToDelete.enrolled_count > 0 && (
              <Alert variant="warning" title="Warning">
                This class has {classToDelete.enrolled_count} enrolled students.
                You should reassign them before deleting.
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setClassToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteClass.isPending}
              >
                Delete Class
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
