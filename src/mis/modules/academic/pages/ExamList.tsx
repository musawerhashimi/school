import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Calendar, BarChart3 } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Select,
  Spinner,
  Alert,
  Modal,
} from '@mis-components/ui';
import { useExams, useDeleteExam, useUpdateExamStatus } from '../hooks/useExams';
import { useAcademicYears } from '../hooks/useAcademicYears';
import type { ExamFilters, ExamApiResponse, ExamStatus } from '../types';

const STATUS_COLORS: Record<ExamStatus, string> = {
  draft: 'secondary',
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
};

export default function ExamList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ExamFilters>({ page: 1, page_size: 20 });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; exam?: ExamApiResponse }>({
    open: false,
  });

  const { data: examsData, isLoading, isError, error } = useExams(filters);
  const { data: yearsData } = useAcademicYears({ page_size: 50 });
  const deleteExam = useDeleteExam();
  const updateStatus = useUpdateExamStatus();

  const handleDelete = () => {
    if (deleteModal.exam) {
      deleteExam.mutate(deleteModal.exam.id, {
        onSuccess: () => setDeleteModal({ open: false }),
      });
    }
  };

  const handleStatusChange = (examId: number, newStatus: string) => {
    updateStatus.mutate({ examId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading exams..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exams"
        subtitle="Manage examinations and assessments"
        actions={[
          {
            label: 'Create Exam',
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/exams/new'),
            variant: 'primary',
          },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4">
          <Select
            label="Academic Year"
            value={filters.academic_year?.toString() || ''}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                academic_year: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              }))
            }
            options={[
              { label: 'All Years', value: '' },
              ...(yearsData?.results || []).map((y) => ({
                label: y.display_name,
                value: String(y.id),
              })),
            ]}
          />
          <Select
            label="Type"
            value={filters.exam_type || ''}
            onChange={(e) =>
              setFilters((f) => ({ ...f, exam_type: (e.target.value as any) || undefined, page: 1 }))
            }
            options={[
              { label: 'All Types', value: '' },
              { label: 'Midterm', value: 'midterm' },
              { label: 'Final', value: 'final' },
              { label: 'Quarterly', value: 'quarterly' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Quiz', value: 'quiz' },
              { label: 'Assignment', value: 'assignment' },
              { label: 'Practical', value: 'practical' },
            ]}
          />
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: (e.target.value as any) || undefined, page: 1 }))
            }
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Draft', value: 'draft' },
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'In Progress', value: 'in_progress' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' },
            ]}
          />
        </CardContent>
      </Card>

      {isError && (
        <Alert variant="error" title="Error">
          {error instanceof Error ? error.message : 'Failed to load exams'}
        </Alert>
      )}

      {/* Exam List */}
      <div className="space-y-4">
        {examsData?.results.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-text-primary">{exam.name}</h3>
                    <Badge variant={STATUS_COLORS[exam.status] as any}>
                      {exam.status_display}
                    </Badge>
                    <Badge variant="secondary">{exam.exam_type_display}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {exam.start_date} — {exam.end_date}
                    </span>
                    <span>{exam.academic_year_display}</span>
                    <span>Total: {exam.total_marks} marks</span>
                    <span>Pass: {exam.pass_percentage}%</span>
                    <span>Grades: {exam.grade_count}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {exam.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<BarChart3 className="h-4 w-4" />}
                      onClick={() => navigate(`/mis/academics/exams/${exam.id}`)}
                    >
                      Results
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={() => navigate(`/mis/academics/exams/${exam.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => navigate(`/mis/academics/exams/${exam.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModal({ open: true, exam })}
                  >
                    <Trash2 className="h-4 w-4 text-error" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {examsData?.results.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No exams found</p>
              <p className="text-sm mt-1">Create your first exam to get started.</p>
              <Button
                variant="primary"
                className="mt-4"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => navigate('/mis/academics/exams/new')}
              >
                Create Exam
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false })}
        title="Delete Exam"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-semibold">{deleteModal.exam?.name}</span>?
            This will also delete all associated grades.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteExam.isPending}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
