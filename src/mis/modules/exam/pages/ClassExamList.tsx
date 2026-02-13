import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Filter, X, School, Users, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  DataTable,
  Button,
  Badge,
  Input,
  Select,
  Card,
  CardContent,
  Alert,
  Spinner,
  type Column,
} from '@mis-components/ui';
import { useExamClasses } from '../hooks/useClassExams';
import { useAcademicYears } from '../../academic/hooks/useAcademicYears';
import { useClassLevels } from '../../academic/hooks/useClassLevels';
import type { ClassExamInfo } from '../types';
import type { ClassExamFilters } from '../services/classExamService';

export default function ClassExamList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ClassExamFilters>({
    page: 1,
    page_size: 10,
    search: '',
    academic_year: undefined,
    class_level: undefined,
    ordering: 'class_level__level_number,section',
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError, error } = useExamClasses(filters);
  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const { data: classLevelsData } = useClassLevels();

  const academicYears = academicYearsData?.results || [];
  const classLevels = classLevelsData?.results || [];

  const handleFilterChange = (key: keyof ClassExamFilters, value: string) => {
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
      ordering: 'class_level__level_number,section',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.academic_year ||
    filters.class_level
  );

  const getExamStatusBadge = (exam: ClassExamInfo['midterm_exam'] | ClassExamInfo['final_exam'], label: string) => {
    if (!exam) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {label}: Not Set
        </Badge>
      );
    }

    switch (exam.status) {
      case 'scheduled':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {label}: Scheduled
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {label}: In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {label}: Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <X className="h-3 w-3" />
            {label}: Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            {label}: {exam.status_display}
          </Badge>
        );
    }
  };

  const columns: Column<ClassExamInfo>[] = [
    {
      key: 'name',
      label: 'Class',
      header: 'Class',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <School className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-medium text-text-primary">{row.display_name}</span>
            <p className="text-xs text-text-secondary">
              {row.class_level_name} - Section {row.section}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'shift',
      label: 'Shift',
      header: 'Shift',
      render: (row) => (
        <Badge variant="outline">{row.shift_display}</Badge>
      ),
    },
    {
      key: 'enrolled_count',
      label: 'Students',
      header: 'Students',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <span className="text-sm">
            {row.enrolled_count} / {row.capacity}
          </span>
        </div>
      ),
    },
    {
      key: 'midterm_status',
      label: 'Midterm',
      header: 'Midterm',
      render: (row) => getExamStatusBadge(row.midterm_exam, 'Mid'),
    },
    {
      key: 'final_status',
      label: 'Final',
      header: 'Final',
      render: (row) => getExamStatusBadge(row.final_exam, 'Final'),
    },
    {
      key: 'grades_entered',
      label: 'Grades',
      header: 'Grades',
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.grades_entered_count} entered
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      header: 'Actions',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/mis/exams/classes/${row.id}`);
          }}
          title="View Details"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Exams"
        subtitle="View and manage exams by class"
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
            ` (${Object.values(filters).filter((v) => v && v !== 1 && v !== 10).length - 1})`}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Search"
                placeholder="Search by class name..."
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
            </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Alert variant="error" title="Error Loading Classes">
          {error instanceof Error ? error.message : 'Failed to load classes'}
        </Alert>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading classes..." />
        </div>
      )}

      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/exams/classes/${row.id}`)}
          emptyMessage="No classes found. Classes will appear here once they are created."
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
    </div>
  );
}
