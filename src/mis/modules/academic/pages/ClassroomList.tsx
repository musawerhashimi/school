import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Filter, X, DoorOpen, Users } from 'lucide-react';
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
  useClassrooms,
  useDeleteClassroom,
} from '../hooks/useClassrooms';
import type { PhysicalClassroomApiResponse, PhysicalClassroomFilters } from '../types';

export default function ClassroomList() {
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<PhysicalClassroomFilters>({
    page: 1,
    page_size: 10,
    search: '',
    room_type: undefined,
    building: undefined,
    is_available: undefined,
    ordering: 'room_number',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [classroomToDelete, setClassroomToDelete] = useState<PhysicalClassroomApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useClassrooms(filters);
  const deleteClassroom = useDeleteClassroom();

  // Filter change handlers
  const handleFilterChange = (key: keyof PhysicalClassroomFilters, value: string) => {
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
      room_type: undefined,
      building: undefined,
      is_available: undefined,
      ordering: 'room_number',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.room_type ||
    filters.building ||
    filters.is_available !== undefined
  );

  // Delete handlers
  const handleDeleteClick = (classroom: PhysicalClassroomApiResponse) => {
    setClassroomToDelete(classroom);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (classroomToDelete) {
      deleteClassroom.mutate(classroomToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setClassroomToDelete(null);
        },
      });
    }
  };

  // Helper functions
  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      classroom: 'Classroom',
      lab: 'Laboratory',
      computer_lab: 'Computer Lab',
      library: 'Library',
      hall: 'Hall',
      outdoor: 'Outdoor',
      workshop: 'Workshop',
    };
    return labels[type] || type;
  };

  const getRoomTypeVariant = (
    type: string
  ): 'success' | 'info' | 'warning' | 'secondary' => {
    if (type === 'classroom') return 'success';
    if (type === 'lab' || type === 'computer_lab') return 'info';
    if (type === 'library' || type === 'hall') return 'warning';
    return 'secondary';
  };

  // Table columns
  const columns: Column<PhysicalClassroomApiResponse>[] = [
    {
      key: 'room_number',
      label: 'Room Number',
      header: 'Room Number',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-lg font-bold text-primary">
          {row.room_number}
        </span>
      ),
    },
    {
      key: 'room_name',
      label: 'Room Name',
      header: 'Room Name',
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-primary">{row.room_name}</span>
      ),
    },
    {
      key: 'room_type',
      label: 'Type',
      header: 'Type',
      render: (row) => (
        <Badge variant={getRoomTypeVariant(row.room_type)}>
          {getRoomTypeLabel(row.room_type)}
        </Badge>
      ),
    },
    {
      key: 'building',
      label: 'Building',
      header: 'Building',
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.building || 'N/A'}</span>
      ),
    },
    {
      key: 'floor_number',
      label: 'Floor',
      header: 'Floor',
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.floor_number ? `Floor ${row.floor_number}` : 'N/A'}
        </span>
      ),
    },
    {
      key: 'capacity',
      label: 'Capacity',
      header: 'Capacity',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <span className="font-medium text-text-primary">{row.capacity}</span>
        </div>
      ),
    },
    {
      key: 'is_available',
      label: 'Availability',
      header: 'Availability',
      render: (row) =>
        row.is_available ? (
          <Badge variant="success">Available</Badge>
        ) : (
          <Badge variant="danger">In Use</Badge>
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
              navigate(`/mis/academics/classrooms/${row.id}/edit`);
            }}
            title="Edit Classroom"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Classroom"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Physical Classrooms"
        subtitle="Manage physical classroom spaces and facilities"
        actions={[
          {
            label: 'Add Classroom',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/classrooms/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Classrooms</p>
              <p className="text-2xl font-bold text-text-primary">{data.count}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Available</p>
              <p className="text-2xl font-bold text-success">
                {data.results.filter((c) => c.is_available).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">In Use</p>
              <p className="text-2xl font-bold text-danger">
                {data.results.filter((c) => !c.is_available).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">Total Capacity</p>
              <p className="text-2xl font-bold text-primary">
                {data.results.reduce((sum, c) => sum + c.capacity, 0)}
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
                placeholder="Search by room number or name..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                label="Room Type"
                value={filters.room_type || ''}
                onChange={(e) => handleFilterChange('room_type', e.target.value)}
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Classroom', value: 'classroom' },
                  { label: 'Laboratory', value: 'lab' },
                  { label: 'Computer Lab', value: 'computer_lab' },
                  { label: 'Library', value: 'library' },
                  { label: 'Hall', value: 'hall' },
                  { label: 'Outdoor', value: 'outdoor' },
                  { label: 'Workshop', value: 'workshop' },
                ]}
              />

              <Input
                label="Building"
                placeholder="Filter by building..."
                value={filters.building || ''}
                onChange={(e) => handleFilterChange('building', e.target.value)}
              />

              <Select
                label="Availability"
                value={String(filters.is_available ?? '')}
                onChange={(e) => handleFilterChange('is_available', e.target.value)}
                options={[
                  { label: 'All Rooms', value: '' },
                  { label: 'Available', value: 'true' },
                  { label: 'In Use', value: 'false' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="error" title="Error Loading Classrooms">
          {error instanceof Error ? error.message : 'Failed to load classrooms'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading classrooms..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/classrooms/${row.id}/edit`)}
          emptyMessage="No classrooms found. Create your first classroom to get started."
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
                  classrooms
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
          setClassroomToDelete(null);
        }}
        title="Delete Classroom"
        size="sm"
      >
        {classroomToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {classroomToDelete.room_name}
              </span>{' '}
              ({classroomToDelete.room_number})? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setClassroomToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteClassroom.isPending}
              >
                Delete Classroom
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
