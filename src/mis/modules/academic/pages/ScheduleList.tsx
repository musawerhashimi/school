import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Filter,
  X,
  Users,
  Clock,
  BookOpen,
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
  Alert,
  Spinner,
  type Column,
} from '@mis-components/ui';
import {
  useClassInstances,
  useClassInstanceStats,
} from '../hooks/useClassInstances';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useClassLevels } from '../hooks/useClassLevels';
import type { ClassInstanceApiResponse, ClassInstanceFilters } from '../types';

export default function ScheduleList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Filters state
  const [filters, setFilters] = useState<ClassInstanceFilters>({
    page: 1,
    page_size: 10,
    search: '',
    academic_year: undefined,
    class_level: undefined,
    shift: undefined,
    is_active: true, // Only show active classes by default
    ordering: '-academic_year__year,class_level__level,section',
  });

  const [showFilters, setShowFilters] = useState(false);

  // React Query hooks
  const { data, isLoading, isError, error } = useClassInstances(filters);
  const { data: statsData } = useClassInstanceStats(filters.academic_year);
  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const { data: classLevelsData } = useClassLevels({});

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
      is_active: true,
      ordering: '-academic_year__year,class_level__level,section',
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.academic_year ||
    filters.class_level ||
    filters.shift
  );

  // Helper functions
  const getShiftVariant = (shift: string): 'success' | 'info' | 'warning' => {
    if (shift === 'morning') return 'success';
    if (shift === 'afternoon') return 'info';
    return 'warning';
  };

  // Table columns
  const columns: Column<ClassInstanceApiResponse>[] = [
    {
      key: 'name',
      label: t('mis.schedule.list.columnClass', 'Class'),
      header: t('mis.schedule.list.columnClass', 'Class'),
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
      label: t('mis.schedule.list.columnAcademicYear', 'Academic Year'),
      header: t('mis.schedule.list.columnAcademicYear', 'Academic Year'),
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
            {row.section}
          </span>
        </div>
      ),
    },
    {
      key: 'shift',
      label: t('mis.schedule.list.columnShift', 'Shift'),
      header: t('mis.schedule.list.columnShift', 'Shift'),
      render: (row) => (
        <Badge variant={getShiftVariant(row.shift)}>
          <Clock className="h-3 w-3 mr-1" />
          {row.shift_display}
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
      key: 'enrollment',
      label: t('mis.schedule.list.columnEnrollment', 'Enrollment'),
      header: t('mis.schedule.list.columnEnrollment', 'Enrollment'),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-secondary" />
          <span className="font-medium">{row.enrolled_count}</span>
          <span className="text-text-secondary">/ {row.capacity}</span>
        </div>
      ),
    },
    {
      key: 'class_teacher',
      label: 'Class Teacher',
      header: 'Class Teacher',
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.class_teacher_name || 'Not assigned'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('mis.schedule.list.columnActions', 'Actions'),
      header: t('mis.schedule.list.columnActions', 'Actions'),
      render: (row) => (
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Calendar className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/mis/academics/schedules/${row.id}`);
          }}
        >
          {t('mis.schedule.list.viewSchedule', 'View Schedule')}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t('mis.schedule.list.pageTitle', 'Class Schedules')}
        subtitle={t(
          'mis.schedule.list.pageSubtitle',
          'View and manage schedules for all classes'
        )}
        actions={[]}
      />

      {/* Statistics Cards */}
      {statsData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">
                    {t('mis.schedule.list.totalClasses', 'Total Classes')}
                  </p>
                  <p className="text-2xl font-bold text-text-primary">
                    {statsData.total_classes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Total Students</p>
                  <p className="text-2xl font-bold text-success">
                    {statsData.total_enrolled}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">
                    {t('mis.schedule.list.withSchedules', 'Active Schedules')}
                  </p>
                  <p className="text-2xl font-bold text-info">
                    {statsData.total_classes}
                  </p>
                </div>
              </div>
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
          {t('mis.common.filters', 'Filters')}
          {hasActiveFilters &&
            ` (${Object.values(filters).filter((v) => v && v !== 1 && v !== 10 && v !== true).length})`}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            leftIcon={<X className="h-4 w-4" />}
            size="sm"
            onClick={clearFilters}
          >
            {t('mis.common.clearFilters', 'Clear Filters')}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label={t('mis.common.search', 'Search')}
                placeholder={t(
                  'mis.schedule.list.searchPlaceholder',
                  'Search by class name...'
                )}
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                label={t('mis.schedule.list.filterByYear', 'Filter by Year')}
                value={String(filters.academic_year || '')}
                onChange={(e) => handleFilterChange('academic_year', e.target.value)}
                options={[
                  { label: t('mis.common.allYears', 'All Years'), value: '' },
                  ...academicYears.map((y) => ({
                    label: y.display_name,
                    value: String(y.id),
                  })),
                ]}
              />

              <Select
                label={t('mis.schedule.list.filterByLevel', 'Filter by Level')}
                value={String(filters.class_level || '')}
                onChange={(e) => handleFilterChange('class_level', e.target.value)}
                options={[
                  { label: t('mis.common.allLevels', 'All Levels'), value: '' },
                  ...classLevels.map((l) => ({
                    label: l.name,
                    value: String(l.id),
                  })),
                ]}
              />

              <Select
                label={t('mis.schedule.list.filterByShift', 'Filter by Shift')}
                value={filters.shift || ''}
                onChange={(e) => handleFilterChange('shift', e.target.value)}
                options={[
                  { label: t('mis.common.allShifts', 'All Shifts'), value: '' },
                  { label: t('mis.common.morning', 'Morning'), value: 'morning' },
                  { label: t('mis.common.afternoon', 'Afternoon'), value: 'afternoon' },
                  { label: t('mis.common.evening', 'Evening'), value: 'evening' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="error" title="Error Loading Schedules">
          {error instanceof Error ? error.message : 'Failed to load class schedules'}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label="Loading schedules..." />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false}
          onRowClick={(row) => navigate(`/mis/academics/schedules/${row.id}`)}
          emptyMessage={t(
            'mis.schedule.list.noSchedulesMessage',
            'No classes match your search criteria'
          )}
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
                    {t('mis.common.previous', 'Previous')}
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
                    {t('mis.common.next', 'Next')}
                  </Button>
                </div>
              </div>
            )
          );
        })()}
    </div>
  );
}
