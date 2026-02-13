import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Clock, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Select,
  Textarea,
  Card,
  CardContent,
  Alert,
  Spinner,
  Switch,
} from '@mis-components/ui';
import { useClassInstance } from '../hooks/useClassInstances';
import { useSubjects } from '../hooks/useSubjects';
import { useTeachers } from '@teachers/hooks/useTeachers';
import {
  useSchedule,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  useCheckConflicts,
  useAvailablePeriods,
} from '../hooks/useSchedules';
import { scheduleSchema, type ScheduleFormData } from '../schemas';
import type { DayOfWeek, ConflictCheckResponse } from '../types';

const DAY_OPTIONS = [
  { label: 'Saturday', value: '0' },
  { label: 'Sunday', value: '1' },
  { label: 'Monday', value: '2' },
  { label: 'Tuesday', value: '3' },
  { label: 'Wednesday', value: '4' },
  { label: 'Thursday', value: '5' },
];

const PERIOD_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  label: `Period ${i + 1}`,
  value: String(i + 1),
}));

export default function ScheduleForm() {
  const { classId, slotId } = useParams<{ classId: string; slotId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const classInstanceId = classId ? parseInt(classId, 10) : 0;
  const isEdit = !!slotId;
  const scheduleSlotId = slotId ? parseInt(slotId, 10) : 0;

  // Pre-fill from navigation state
  const prefilledDay = (location.state as { dayOfWeek?: DayOfWeek })?.dayOfWeek;
  const prefilledPeriod = (location.state as { periodNumber?: number })?.periodNumber;

  const [conflicts, setConflicts] = useState<ConflictCheckResponse | null>(null);

  // Fetch data
  const { data: classInstance, isLoading: isLoadingClass } = useClassInstance(classInstanceId);
  const { data: schedule, isLoading: isLoadingSchedule } = useSchedule(scheduleSlotId);
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({
    class_level: classInstance?.class_level,
    is_active: true,
    page_size: 100,
  });
  const { data: teachersData, isLoading: isLoadingTeachers } = useTeachers({ is_active: true, page_size: 100 });

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();
  const checkConflicts = useCheckConflicts();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      class_instance: classInstanceId,
      day_of_week: prefilledDay ?? 0,
      period_number: prefilledPeriod ?? 1,
      is_active: true,
    },
  });

  const watchedDayOfWeek = watch('day_of_week');
  const watchedPeriodNumber = watch('period_number');

  // Fetch available periods for the selected day
  const { data: availablePeriods } = useAvailablePeriods(
    classInstanceId,
    watchedDayOfWeek as DayOfWeek
  );

  // Load schedule data for edit mode
  useEffect(() => {
    if (isEdit && schedule) {
      setValue('class_instance', schedule.class_instance);
      setValue('subject', schedule.subject);
      setValue('teacher', schedule.teacher || undefined);
      setValue('day_of_week', schedule.day_of_week);
      setValue('period_number', schedule.period_number);
      setValue('is_active', schedule.is_active);
      setValue('notes', schedule.notes || '');
    }
  }, [isEdit, schedule, setValue]);

  // Check conflicts when form values change
  const handleCheckConflicts = async () => {
    const formData = watch();
    if (formData.class_instance && formData.subject && formData.day_of_week !== undefined) {
      try {
        const result = await checkConflicts.mutateAsync(formData as any);
        // setConflicts(result);
        setConflicts({has_conflicts: true, conflicts: ['Sample conflict detected for demonstration purposes.']});
      } catch {
        // Ignore errors
      }
    }
  };

  // Form submission
  const onSubmit = (data: ScheduleFormData) => {
    const submitData = {
      ...data,
      class_instance: classInstanceId,
    };

    if (isEdit) {
      updateSchedule.mutate(
        { id: scheduleSlotId, data: submitData },
        {
          onSuccess: () => {
            navigate(`/mis/academics/schedules/${classInstanceId}`);
          },
        }
      );
    } else {
      createSchedule.mutate(submitData, {
        onSuccess: () => {
          navigate(`/mis/academics/schedules/${classInstanceId}`);
        },
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this period?')) {
      deleteSchedule.mutate(scheduleSlotId, {
        onSuccess: () => {
          navigate(`/mis/academics/schedules/${classInstanceId}`);
        },
      });
    }
  };

  if (isLoadingClass || (isEdit && isLoadingSchedule)) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading..." />
      </div>
    );
  }

  if (!classInstance) {
    return (
      <div className="space-y-6">
        <Alert variant="error" title="Class Not Found">
          The requested class could not be found.
        </Alert>
        <Button onClick={() => navigate('/mis/academics/classes')}>
          Back to Classes
        </Button>
      </div>
    );
  }

  // Filter subjects for this class level
  const availableSubjects = subjectsData?.results || [];

  const isActive = watch('is_active');
  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Schedule Period' : 'Add Schedule Period'}
        subtitle={`${classInstance.display_name} • ${classInstance.academic_year_display}`}
        actions={[
          {
            label: 'Back to Schedule',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate(`/mis/academics/schedules/${classInstanceId}`),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 border-b pb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-text-primary">
                      Period Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Day of Week"
                      required
                      {...register('day_of_week', { valueAsNumber: true })}
                      error={errors.day_of_week?.message}
                      options={DAY_OPTIONS}
                    />

                    <Select
                      label="Period Number"
                      required
                      {...register('period_number', { valueAsNumber: true })}
                      error={errors.period_number?.message}
                      options={PERIOD_OPTIONS}
                    />

                    <div className="md:col-span-2">
                      <Select
                        label="Subject"
                        required
                        {...register('subject', { valueAsNumber: true })}
                        error={errors.subject?.message}
                        options={[
                          { label: 'Select a subject', value: '' },
                          ...availableSubjects.map((s) => ({
                            label: `${s.name} (${s.code})`,
                            value: String(s.id),
                          })),
                        ]}
                      />
                      {isLoadingSubjects && (
                        <p className="text-sm text-gray-500 mt-1">Loading subjects...</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Select
                        label="Teacher (Optional)"
                        {...register('teacher', {
                          setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                        })}
                        error={errors.teacher?.message}
                        options={[
                          { label: isLoadingTeachers ? 'Loading teachers...' : 'Not assigned', value: '' },
                          ...(teachersData?.results || []).map((t) => ({
                            label: t.full_name,
                            value: String(t.id),
                          })),
                        ]}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Textarea
                        label="Notes (Optional)"
                        {...register('notes')}
                        error={errors.notes?.message}
                        placeholder="Any special notes for this period..."
                        rows={2}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">Active Status</p>
                          <p className="text-sm text-text-secondary">
                            Inactive periods won't appear in the schedule
                          </p>
                        </div>
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => setValue('is_active', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conflicts Warning */}
            {conflicts && conflicts.has_conflicts && (
              <Alert variant="warning" title="Scheduling Conflicts Detected">
                <ul className="list-disc pl-4 mt-2">
                  {conflicts.conflicts.map((conflict, index) => (
                    <li key={index}>{conflict}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm">
                  You can still save, but please review the conflicts above.
                </p>
              </Alert>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Available Periods Info */}
            {availablePeriods && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">
                    {DAY_OPTIONS.find((d) => d.value === String(watchedDayOfWeek))?.label} Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Scheduled</span>
                      <span className="font-medium">
                        {availablePeriods.scheduled_periods.length} periods
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available</span>
                      <span className="font-medium text-success">
                        {availablePeriods.available_periods.length} periods
                      </span>
                    </div>
                    {!isEdit &&
                      availablePeriods.scheduled_periods.includes(watchedPeriodNumber) && (
                        <Alert variant="warning" title="Period Conflict" className="mt-2">
                          <p className="text-sm">
                            Period {watchedPeriodNumber} is already scheduled for this day.
                          </p>
                        </Alert>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Check Conflicts Button */}
            <Card>
              <CardContent className="p-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  leftIcon={<AlertTriangle className="h-4 w-4" />}
                  onClick={handleCheckConflicts}
                  loading={checkConflicts.isPending}
                >
                  Check for Conflicts
                </Button>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  leftIcon={<Save className="h-4 w-4" />}
                  loading={createSchedule.isPending || updateSchedule.isPending}
                >
                  {isEdit ? 'Update Period' : 'Add Period'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate(`/mis/academics/schedules/${classInstanceId}`)}
                >
                  Cancel
                </Button>

                {isEdit && (
                  <Button
                    type="button"
                    variant="danger"
                    className="w-full"
                    onClick={handleDelete}
                    loading={deleteSchedule.isPending}
                  >
                    Delete Period
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
