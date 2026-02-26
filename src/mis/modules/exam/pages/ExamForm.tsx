import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardContent,
  Alert,
  Spinner,
  Badge,
} from '@mis-components/ui';
import { useExam, useCreateExam, useUpdateExam } from '../hooks/useExams';
import { useAcademicYears } from '../../reference/hooks/useAcademicYears';
import { useClassLevels } from '../../reference/hooks/useClassLevels';
import { useClassInstances } from '../../reference/hooks/useClassInstances';
import type { CreateExamData, UpdateExamData } from '../types';

export default function ExamForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateExamData>({
    name: '',
    exam_type: 'midterm',
    academic_year: 0,
    class_levels: [],
    class_instances: [],
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total_marks: 100,
    pass_percentage: 40,
    status: 'draft',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedClassLevels, setSelectedClassLevels] = useState<number[]>([]);

  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const { data: classLevelsData } = useClassLevels({});
  const { data: classInstancesData } = useClassInstances({
    academic_year: formData.academic_year,
    class_level: selectedClassLevels.length > 0 ? selectedClassLevels[0] : undefined,
  });

  const { data: examData, isLoading: isLoadingExam } = useExam(Number(id));
  const createExam = useCreateExam();
  const updateExam = useUpdateExam();

  const academicYears = academicYearsData?.results || [];
  const classLevels = classLevelsData?.results || [];
  const classInstances = classInstancesData?.results || [];

  useEffect(() => {
    if (isEdit && examData) {
      setFormData({
        name: examData.name,
        exam_type: examData.exam_type,
        academic_year: examData.academic_year,
        class_levels: examData.class_levels || [],
        class_instances: examData.class_instances || [],
        start_date: examData.start_date,
        end_date: examData.end_date,
        total_marks: examData.total_marks,
        pass_percentage: examData.pass_percentage,
        status: examData.status,
        description: examData.description || '',
        notes: examData.notes || '',
      });
      setSelectedClassLevels(examData.class_levels || []);
    }
  }, [isEdit, examData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Exam name is required';
    }

    if (!formData.academic_year) {
      newErrors.academic_year = 'Academic year is required';
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (formData.total_marks && formData.total_marks <= 0) {
      newErrors.total_marks = 'Total marks must be greater than 0';
    }

    if (formData.pass_percentage !== undefined) {
      if (formData.pass_percentage < 0 || formData.pass_percentage > 100) {
        newErrors.pass_percentage = 'Pass percentage must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (isEdit) {
      updateExam.mutate(
        { id: Number(id), data: formData as UpdateExamData },
        {
          onSuccess: () => {
            navigate(`/mis/exams/${id}`);
          },
        }
      );
    } else {
      createExam.mutate(formData, {
        onSuccess: (data) => {
          navigate(`/mis/exams/${data.id}`);
        },
      });
    }
  };

  const handleClassLevelChange = (value: string) => {
    const levelId = Number(value);
    const newSelected = selectedClassLevels.includes(levelId)
      ? selectedClassLevels.filter((id) => id !== levelId)
      : [...selectedClassLevels, levelId];

    setSelectedClassLevels(newSelected);
    setFormData((prev) => ({
      ...prev,
      class_levels: newSelected,
    }));
  };

  const handleClassInstanceChange = (value: string) => {
    const instanceId = Number(value);
    const currentInstances = formData.class_instances || [];
    const newSelected = currentInstances.includes(instanceId)
      ? currentInstances.filter((id) => id !== instanceId)
      : [...currentInstances, instanceId];

    setFormData((prev) => ({
      ...prev,
      class_instances: newSelected,
    }));
  };

  if (isLoadingExam) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading exam data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Exam' : 'Create Exam'}
        subtitle={isEdit ? 'Update exam details' : 'Create a new exam'}
        actions={[
          {
            label: 'Back to Exams',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams'),
            variant: 'outline',
          },
        ]}
      />

      {createExam.isError && (
        <Alert variant="error" title="Error Creating Exam">
          {createExam.error instanceof Error ? createExam.error.message : 'Failed to create exam'}
        </Alert>
      )}

      {updateExam.isError && (
        <Alert variant="error" title="Error Updating Exam">
          {updateExam.error instanceof Error ? updateExam.error.message : 'Failed to update exam'}
        </Alert>
      )}

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Exam Name"
                placeholder="Enter exam name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                required
              />

              <Select
                label="Exam Type"
                value={formData.exam_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, exam_type: e.target.value as 'midterm' | 'final' }))}
                options={[
                  { label: 'Midterm', value: 'midterm' },
                  { label: 'Final', value: 'final' },
                ]}
                required
              />

              <Select
                label="Academic Year"
                value={String(formData.academic_year)}
                onChange={(e) => setFormData((prev) => ({ ...prev, academic_year: Number(e.target.value) }))}
                options={[
                  { label: 'Select Academic Year', value: '0' },
                  ...academicYears.map((year) => ({
                    label: year.display_name,
                    value: String(year.id),
                  })),
                ]}
                error={errors.academic_year}
                required
              />

              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' }))}
                options={[
                  { label: 'Draft', value: 'draft' },
                  { label: 'Scheduled', value: 'scheduled' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Total Marks"
                type="number"
                placeholder="100"
                value={String(formData.total_marks)}
                onChange={(e) => setFormData((prev) => ({ ...prev, total_marks: Number(e.target.value) }))}
                error={errors.total_marks}
                required
              />

              <Input
                label="Pass Percentage"
                type="number"
                placeholder="40"
                value={String(formData.pass_percentage)}
                onChange={(e) => setFormData((prev) => ({ ...prev, pass_percentage: Number(e.target.value) }))}
                error={errors.pass_percentage}
                required
              />

              <Input
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, start_date: e.target.value }))}
                required
              />

              <Input
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, end_date: e.target.value }))}
                error={errors.end_date}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              label="Description"
              placeholder="Enter exam description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />

            <Textarea
              label="Notes"
              placeholder="Additional notes or instructions"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">Select Class Levels</label>
                <Badge variant="secondary">{selectedClassLevels.length} selected</Badge>
              </div>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                {classLevels.map((level) => (
                  <label
                    key={level.id}
                    className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClassLevels.includes(level.id)}
                      onChange={() => handleClassLevelChange(String(level.id))}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-primary">{level.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">Select Classes</label>
                <Badge variant="secondary">{(formData.class_instances || []).length} selected</Badge>
              </div>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                {classInstances.map((instance) => (
                  <label
                    key={instance.id}
                    className="flex items-center gap-2 py-2 px-3 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.class_instances || []).includes(instance.id)}
                      onChange={() => handleClassInstanceChange(String(instance.id))}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-primary">{instance.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={() => navigate('/mis/exams')}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={createExam.isPending || updateExam.isPending}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {createExam.isPending || updateExam.isPending ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span>Save</span>
                </div>
              ) : isEdit ? (
                'Update Exam'
              ) : (
                'Create Exam'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
