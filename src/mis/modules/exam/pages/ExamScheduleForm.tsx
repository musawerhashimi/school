import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Input,
  Select,
  Card,
  CardContent,
  Spinner,
} from '@mis-components/ui';
import { useExamSchedule, useCreateExamSchedule, useUpdateExamSchedule } from '../hooks/useExamSchedules';
import { useExams } from '../hooks/useExams';
import { useSubjects } from '../../reference/hooks/useSubjects';
import { useClassInstances } from '../../reference/hooks/useClassInstances';
import type { CreateExamScheduleData } from '../types';


export default function ExamScheduleForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [formData, setFormData] = useState<CreateExamScheduleData>({
    exam: 0,
    subject: 0,
    class_instance: 0,
    exam_date: '',
    start_time: '',
    end_time: '',
    // room: 0,
    invigilators: [],
    notes: '',
  });

  const { data: scheduleById, isLoading: isLoadingSchedule } = useExamSchedule(Number(id));
  const { data: examsData } = useExams({ page_size: 100 });
  const { data: subjectsData } = useSubjects({ page_size: 100 });
  const { data: classInstancesData } = useClassInstances({ page_size: 100 });

  const createExamSchedule = useCreateExamSchedule();
  const updateExamSchedule = useUpdateExamSchedule();

  // Load existing schedule data if editing
  useEffect(() => {
    if (isEdit && id) {
      const schedule = scheduleById;
      if (schedule) {
        setFormData({
          exam: Number(schedule.exam),
          subject: Number(schedule.subject),
          class_instance: Number(schedule.class_instance),
          exam_date: schedule.exam_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          room: schedule.room || undefined,
          invigilators: schedule.invigilators || [],
          notes: schedule.notes || '',
        });
      }
    }
  }, [isEdit, id, scheduleById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && id) {
      updateExamSchedule.mutate({
        id: parseInt(id),
        data: {
          ...formData,
          exam: Number(formData.exam),
          subject: Number(formData.subject),
          class_instance: Number(formData.class_instance),
        },
      });
    } else {
      createExamSchedule.mutate({
        ...formData,
        exam: Number(formData.exam),
        subject: Number(formData.subject),
        class_instance: Number(formData.class_instance),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const numericFields = new Set(['exam', 'subject', 'class_instance']);
    const value = numericFields.has(e.target.name) ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  if (isEdit && isLoadingSchedule) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading exam schedule..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isEdit ? 'Edit Exam Schedule' : 'Create Exam Schedule'}
        subtitle={isEdit ? 'Modify existing exam schedule details' : 'Create a new exam schedule'}
        actions={[
          {
            label: 'Back to List',
            icon: <Eye className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams/schedules'),
            variant: 'outline',
          },
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Exam"
                  name="exam"
                  value={String(formData.exam || '')}
                  onChange={handleChange}
                  options={[
                    { label: 'Select Exam', value: '0' },
                    ...(examsData?.results?.map((exam) => ({
                      label: exam.name,
                      value: String(exam.id),
                    })) || []),
                  ]}
                  required
                />
              </div>

              <div>
                <Select
                  label="Subject"
                  name="subject"
                  value={String(formData.subject || '')}
                  onChange={handleChange}
                  options={[
                    { label: 'Select Subject', value: '0' },
                    ...(subjectsData?.results?.map((subject) => ({
                      label: subject.name,
                      value: String(subject.id),
                    })) || []),
                  ]}
                  required
                />
              </div>

              <div>
                <Select
                  label="Class"
                  name="class_instance"
                  value={String(formData.class_instance || '')}
                  onChange={handleChange}
                  options={[
                    { label: 'Select Class', value: '0' },
                    ...(classInstancesData?.results?.map((classInstance) => ({
                      label: classInstance.name,
                      value: String(classInstance.id),
                    })) || []),
                  ]}
                  required
                />
              </div>

              <div>
                <Input
                  label="Exam Date"
                  name="exam_date"
                  type="date"
                  value={formData.exam_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="Start Time"
                  name="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Input
                  label="End Time"
                  name="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Input
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the exam..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/mis/exams/schedules')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createExamSchedule.isPending || updateExamSchedule.isPending}
              >
                {createExamSchedule.isPending || updateExamSchedule.isPending ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Saving...</span>
                  </div>
                ) : isEdit ? (
                  'Update Schedule'
                ) : (
                  'Create Schedule'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
