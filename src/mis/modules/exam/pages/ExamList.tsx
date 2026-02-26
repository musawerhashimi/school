import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Filter, X } from 'lucide-react';
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
import { useExams, useDeleteExam } from '../hooks/useExams';
import { useAcademicYears } from '../../reference/hooks/useAcademicYears';
import type { ExamApiResponse, ExamFilters } from '../types';


export default function ExamList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ExamFilters>({
    page: 1,
    page_size: 10,
    search: '',
    academic_year: undefined,
    exam_type: undefined,
    status: undefined,
    ordering: '-start_date',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<ExamApiResponse | null>(null);

  const { data, isLoading, isError, error } = useExams(filters);
  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const deleteExam = useDeleteExam();

  const academicYears = academicYearsData?.results || [];

  const handleFilterChange = (key: keyof ExamFilters, value: string) => {
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
      exam_type: undefined,
      status: undefined,
      ordering: '-start_date',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.academic_year ||
    filters.exam_type ||
    filters.status !== undefined
  );

  const handleDeleteClick = (exam: ExamApiResponse) => {
    setExamToDelete(exam);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (examToDelete) {
      deleteExam.mutate(examToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setExamToDelete(null);
        },
      });
    }
  };

  const getExamTypeBadge = (type: string) => {
    switch (type) {
      case 'written':
        return <Badge variant="primary">Written</Badge>;
      case 'oral':
        return <Badge variant="info">Oral</Badge>;
      case 'practical':
        return <Badge variant="warning">Practical</Badge>;
      case 'online':
        return <Badge variant="success">Online</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const columns: Column<ExamApiResponse>[] = [
    {
      key: 'name',
      label: 'Exam Name',
      header: 'Exam Name',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-text-primary">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'exam_type',
      label: 'Type',
      header: 'Type',
      render: (row) => getExamTypeBadge(row.exam_type),
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
      key: 'start_date',
      label: 'Start Date',
      header: 'Start Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.start_date}</span>
      ),
    },
    {
      key: 'end_date',
      label: 'End Date',
      header: 'End Date',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">{row.end_date}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => {
        const getStatusBadge = (status: string) => {
          switch (status) {
            case 'scheduled':
              return <Badge variant="info">Scheduled</Badge>;
            case 'in_progress':
              return <Badge variant="warning">In Progress</Badge>;
            case 'completed':
              return <Badge variant="success">Completed</Badge>;
            case 'cancelled':
              return <Badge variant="danger">Cancelled</Badge>;
            default:
              return <Badge variant="secondary">{row.status_display}</Badge>;
          }
        };
        return getStatusBadge(row.status);
      },
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
              navigate(`/mis/exams/${row.id}`);
            }}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/exams/${row.id}/edit`);
            }}
            title="Edit Exam"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title="Delete Exam"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        subtitle="Manage exams, schedule, and grading"
        actions={[
          {
            label: 'Add Exam',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams/new'),
            variant: 'primary',
          },
        ]}
      />

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

      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Search"
                placeholder="Search by name..."
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
                label="Exam Type"
                value={filters.exam_type || ''}
                onChange={(e) => handleFilterChange('exam_type', e.target.value)}
                options={[
                  { label: 'All Types', value: '' },
                  { label: 'Written', value: 'written' },
                  { label: 'Oral', value: 'oral' },
                  { label: 'Practical', value: 'practical' },
                  { label: 'Online', value: 'online' },
                ]}
              />

              <Select
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Scheduled', value: 'scheduled' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Alert variant="error" title="Error Loading Exams">
          {error instanceof Error ? error.message : 'Failed to load exams'}
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading exams..." />
        </div>
      )}

      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/exams/${row.id}`)}
          emptyMessage="No exams found. Create your first exam to get started."
          getRowKey={(row) => String(row.id)}
        />
      )}

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
                  {Math.min(currentPage * pageSize, data.count)} of {data.count} exams
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

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Exam"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-text-secondary">
            Are you sure you want to delete the exam "{examToDelete?.name}"? This action
            cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
