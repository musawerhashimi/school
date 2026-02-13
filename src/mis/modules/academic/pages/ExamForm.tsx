import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardContent,
  Spinner,
  Alert,
} from '@mis-components/ui';
import { useExam, useCreateExam, useUpdateExam } from '../hooks/useExams';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useClassLevels } from '../hooks/useClassLevels';
import { examSchema, type ExamFormData } from '../schemas';

export default function ExamForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const examId = id ? parseInt(id, 10) : 0;

  const { data: exam, isLoading: isLoadingExam } = useExam(examId);
  const { data: yearsData } = useAcademicYears({ page_size: 50 });
  const { data: levelsData } = useClassLevels({ page_size: 50 });

  const createExam = useCreateExam();
  const updateExam = useUpdateExam();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      exam_type: 'midterm',
      total_marks: 100,
      pass_percentage: 40,
      weight_percentage: 100,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (isEdit && exam) {
      reset({
        name: exam.name,
        exam_type: exam.exam_type,
        academic_year: exam.academic_year,
        class_levels: exam.class_levels,
        start_date: exam.start_date,
        end_date: exam.end_date,
        total_marks: exam.total_marks,
        pass_percentage: exam.pass_percentage,
        weight_percentage: exam.weight_percentage,
        status: exam.status,
        description: exam.description || '',
        notes: exam.notes || '',
      });
    }
  }, [isEdit, exam, reset]);

  const onSubmit = (data: ExamFormData) => {
    if (isEdit) {
      updateExam.mutate(
        { id: examId, data },
        { onSuccess: () => navigate('/mis/academics/exams') }
      );
    } else {
      createExam.mutate(data, {
        onSuccess: () => navigate('/mis/academics/exams'),
      });
    }
  };

  if (isEdit && isLoadingExam) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading exam..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Exam' : 'Create Exam'}
        subtitle={isEdit ? `Editing: ${exam?.name}` : 'Create a new examination'}
        actions={[
          {
            label: 'Back to Exams',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/exams'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold border-b pb-3">Exam Details</h3>

                <Input
                  label="Exam Name"
                  required
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="e.g., Midterm Exam Q1"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Exam Type"
                    required
                    {...register('exam_type')}
                    error={errors.exam_type?.message}
                    options={[
                      { label: 'Midterm Exam', value: 'midterm' },
                      { label: 'Final Exam', value: 'final' },
                      { label: 'Quarterly Exam', value: 'quarterly' },
                      { label: 'Monthly Test', value: 'monthly' },
                      { label: 'Quiz', value: 'quiz' },
                      { label: 'Assignment', value: 'assignment' },
                      { label: 'Practical Exam', value: 'practical' },
                    ]}
                  />

                  <Select
                    label="Academic Year"
                    required
                    {...register('academic_year', { valueAsNumber: true })}
                    error={errors.academic_year?.message}
                    options={[
                      { label: 'Select Year', value: '' },
                      ...(yearsData?.results || []).map((y) => ({
                        label: y.display_name,
                        value: String(y.id),
                      })),
                    ]}
                  />

                  <Input
                    label="Start Date"
                    type="date"
                    required
                    {...register('start_date')}
                    error={errors.start_date?.message}
                  />

                  <Input
                    label="End Date"
                    type="date"
                    required
                    {...register('end_date')}
                    error={errors.end_date?.message}
                  />
                </div>

                <h3 className="text-lg font-semibold border-b pb-3 pt-4">Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Total Marks"
                    type="number"
                    {...register('total_marks', { valueAsNumber: true })}
                    error={errors.total_marks?.message}
                  />
                  <Input
                    label="Pass Percentage (%)"
                    type="number"
                    step="0.01"
                    {...register('pass_percentage', { valueAsNumber: true })}
                    error={errors.pass_percentage?.message}
                  />
                  <Input
                    label="Weight (%)"
                    type="number"
                    step="0.01"
                    {...register('weight_percentage', { valueAsNumber: true })}
                    error={errors.weight_percentage?.message}
                  />
                </div>

                <Textarea
                  label="Description"
                  {...register('description')}
                  rows={3}
                  placeholder="Exam description..."
                />
                <Textarea
                  label="Notes"
                  {...register('notes')}
                  rows={2}
                  placeholder="Internal notes..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4 space-y-4">
                <Select
                  label="Status"
                  {...register('status')}
                  error={errors.status?.message}
                  options={[
                    { label: 'Draft', value: 'draft' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'In Progress', value: 'in_progress' },
                    { label: 'Completed', value: 'completed' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ]}
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  leftIcon={<Save className="h-4 w-4" />}
                  loading={createExam.isPending || updateExam.isPending}
                >
                  {isEdit ? 'Update Exam' : 'Create Exam'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/mis/academics/exams')}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
