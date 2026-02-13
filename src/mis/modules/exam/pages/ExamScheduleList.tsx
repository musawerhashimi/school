import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  DataTable,
  Button,
  Badge,
  Input,
  Card,
  CardContent,
  Alert,
  Spinner,
  type Column,
} from '@mis-components/ui';
import { useExamSchedules } from '../hooks/useExamSchedules';
import type { ExamScheduleApiResponse, ExamScheduleFilters } from '../types';


export default function ExamScheduleList() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ExamScheduleFilters>({
    page: 1,
    page_size: 10,
    search: '',
  });
  
  const { data: scheduleData, isLoading } = useExamSchedules(filters);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const columns: Column<ExamScheduleApiResponse>[] = [
    {
      key: 'subject_name',
      label: 'Subject',
      header: 'Subject',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-medium text-text-primary">{row.subject_name}</span>
        </div>
      ),
    },
    {
      key: 'exam_name',
      label: 'Exam',
      header: 'Exam',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-primary">{row.exam_name}</span>
      ),
    },
    {
      key: 'class_instance_name',
      label: 'Class',
      header: 'Class',
      render: (row) => (
        <span className="text-sm text-text-primary">{row.class_instance_name}</span>
      ),
    },
    {
      key: 'schedule',
      label: 'Schedule',
      header: 'Schedule',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm text-text-primary">{row.exam_date}</span>
          <span className="text-xs text-text-secondary">{row.start_time} - {row.end_time}</span>
        </div>
      ),
    },
    {
      key: 'is_completed',
      label: 'Status',
      header: 'Status',
      render: (row) => (
        <Badge 
          variant={row.is_completed ? 'success' : 'warning'}
          className="px-2 py-1"
        >
          {row.is_completed ? 'Completed' : 'Scheduled'}
        </Badge>
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
              navigate(`/mis/exams/schedules/${row.id}`);
            }}
            title="View Details"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/exams/schedules/${row.id}/edit`);
            }}
            title="Edit Schedule"
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-red-500" />}
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement delete functionality
            }}
            title="Delete Schedule"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Exam Schedules"
        subtitle="Manage your school's exam schedules"
        actions={[
          {
            label: 'Create Exam Schedule',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams/schedules/new'),
            variant: 'primary',
          },
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search schedules..."
                leftIcon={<Filter className="h-4 w-4 text-gray-500" />}
                value={filters.search || ''}
                onChange={handleSearch}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" label="Loading schedules..." />
            </div>
          ) : (
            <>
              <DataTable
                data={scheduleData?.results || []}
                columns={columns}
                pageSize={filters.page_size || 10}
                onRowClick={(row) => navigate(`/mis/exams/schedules/${row.id}`)}
                loading={isLoading}
              />

              {scheduleData?.count === 0 && (
                <Alert variant="info" className="mt-4">
                  No exam schedules found. Create your first schedule to get started.
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
