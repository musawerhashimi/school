import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BookOpen,
  User,
  MapPin,
  Calendar,
  Hash,
  Edit3,
  Trash2,
  Save,
  FileText,
  Clock,
  X,
  Plus,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  Modal,
  Button,
  Badge,
  Select,
  Textarea,
  Switch,
  Alert,
  Spinner,
} from '@mis-components/ui';
import { useSubjects } from '../hooks/useSubjects';
import { useAvailableTeachers } from '@teachers/hooks/useTeachers';
import {
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from '../hooks/useSchedules';
import { scheduleSchema, scheduleUpdateSchema } from '../schemas';
import type { ScheduleApiResponse, DayOfWeek } from '../types';
import { useTheme } from '@/hooks/useTheme';

interface ScheduleSlotModalProps {
  slot?: ScheduleApiResponse | null;
  createMode?: boolean;
  dayOfWeek?: DayOfWeek;
  periodNumber?: number;
  classInstanceId?: number;
  isOpen: boolean;
  onClose: () => void;
  classLevelId?: number;
  onSuccess?: () => void;
}

const DAY_NAMES: Record<DayOfWeek, string> = {
  0: 'Saturday',
  1: 'Sunday',
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
};

const DAY_OPTIONS = [
  { label: 'Saturday', value: '0' },
  { label: 'Sunday', value: '1' },
  { label: 'Monday', value: '2' },
  { label: 'Tuesday', value: '3' },
  { label: 'Wednesday', value: '4' },
  { label: 'Thursday', value: '5' },
];

const PERIOD_OPTIONS = Array.from({ length: 8 }, (_, i) => ({
  label: `Period ${i + 1}`,
  value: String(i + 1),
}));

export default function ScheduleSlotModal({
  slot,
  createMode = false,
  dayOfWeek,
  periodNumber,
  classInstanceId,
  isOpen,
  onClose,
  classLevelId,
  onSuccess,
}: ScheduleSlotModalProps) {
  const {theme} = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCreateMode = createMode && !slot;
  const currentDay = isCreateMode ? dayOfWeek : slot?.day_of_week;
  const currentPeriod = isCreateMode ? periodNumber : slot?.period_number;
  const isDark = theme === 'dark';

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({
    class_level: classLevelId,
    is_active: true,
    page_size: 100,
  });

  const { data: availableTeachersData, isLoading: isLoadingTeachers } = useAvailableTeachers(
    currentDay ?? 0,
    currentPeriod ?? 1,
    isOpen && (isCreateMode || isEditing) && currentDay !== undefined && currentPeriod !== undefined,
    isEditing && slot ? slot.id : undefined
  );

  const schema = isCreateMode ? scheduleSchema : scheduleUpdateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isCreateMode
      ? {
          class_instance: classInstanceId,
          day_of_week: dayOfWeek,
          period_number: periodNumber,
          is_active: true,
        }
      : undefined,
  });

  useEffect(() => {
    if (isOpen) {
      if (isCreateMode) {
        reset({
          class_instance: classInstanceId,
          day_of_week: dayOfWeek,
          period_number: periodNumber,
          is_active: true,
          notes: '',
        });
      } else if (slot) {
        reset({
          subject: slot.subject,
          teacher: slot.teacher_profile || undefined,
          day_of_week: slot.day_of_week,
          period_number: slot.period_number,
          is_active: slot.is_active,
          notes: slot.notes || '',
        });
      }
      setIsEditing(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, slot, isCreateMode, classInstanceId, dayOfWeek, periodNumber, reset]);

  const handleEdit = () => {
    if (slot) {
      reset({
        subject: slot.subject,
        teacher: slot.teacher_profile || undefined,
        day_of_week: slot.day_of_week,
        period_number: slot.period_number,
        is_active: slot.is_active,
        notes: slot.notes || '',
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  const handleSave = handleSubmit((data) => {
    if (isCreateMode) {
      createSchedule.mutate(
        {
          class_instance: classInstanceId!,
          subject: data.subject,
          teacher_profile: data.teacher || null,
          day_of_week: data.day_of_week,
          period_number: data.period_number,
          is_active: data.is_active ?? true,
          notes: data.notes || '',
        },
        {
          onSuccess: () => {
            onClose();
            onSuccess?.();
          },
        }
      );
    } else if (slot) {
      const updateData = {
        ...data,
        teacher_profile: data.teacher || null,
      };
      delete (updateData as Record<string, unknown>).teacher;

      updateSchedule.mutate(
        { id: slot.id, data: updateData },
        {
          onSuccess: () => {
            setIsEditing(false);
            onClose();
            onSuccess?.();
          },
        }
      );
    }
  });

  const handleDelete = () => {
    if (!slot) return;

    deleteSchedule.mutate(slot.id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        onClose();
        onSuccess?.();
      },
    });
  };

  const handleModalClose = () => {
    setIsEditing(false);
    setShowDeleteConfirm(false);
    reset();
    onClose();
  };

  const isActive = watch('is_active') ?? slot?.is_active ?? true;
  const isPending = createSchedule.isPending || updateSchedule.isPending;
  const teacherOptions = availableTeachersData?.teachers || [];

  const modalTitle = isCreateMode
    ? 'Add New Period'
    : isEditing
    ? 'Edit Period'
    : 'Period Details';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleModalClose} 
      title={modalTitle} 
      size="lg"
      className={isDark ? 'dark' : ''}
    >
      <div className="space-y-5">
        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Alert 
            variant="error" 
            title="Delete Period?"
            className={isDark ? 'bg-red-900/20 border-red-800' : ''}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  This will permanently remove <strong>{slot?.subject_name}</strong> from the schedule. 
                  This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    className={isDark ? 'text-gray-300 hover:bg-gray-700' : ''}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={handleDelete}
                    loading={deleteSchedule.isPending}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete Period
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        )}

        {/* View Mode */}
        {!isCreateMode && !isEditing && !showDeleteConfirm && slot && (
          <div className="space-y-4">
            {/* Header Card */}
            <div className={`p-4 rounded-lg border-l-4 border-primary
                           ${isDark ? 'bg-gray-800/50' : 'bg-primary/5'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className={`h-5 w-5 ${isDark ? 'text-primary-400' : 'text-primary'}`} />
                    <h3 className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {slot.subject_name}
                    </h3>
                  </div>
                  <p className={`text-sm font-mono ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {slot.subject_code}
                  </p>
                </div>
                <Badge variant={slot.is_active ? 'success' : 'warning'} className="flex-shrink-0">
                  {slot.is_active ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    'Inactive'
                  )}
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg
                           ${isDark ? 'bg-gray-800/30 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
              {/* Day */}
              <div className="space-y-1">
                <div className={`text-xs font-medium uppercase tracking-wide
                               ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Day
                </div>
                <div className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {slot.day_name}
                </div>
              </div>

              {/* Period */}
              <div className="space-y-1">
                <div className={`text-xs font-medium uppercase tracking-wide
                               ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Hash className="h-3 w-3 inline mr-1" />
                  Period
                </div>
                <div>
                  <Badge className={isDark ? 'bg-gray-700' : ''}>
                    Period {slot.period_number}
                  </Badge>
                </div>
              </div>

              {/* Teacher */}
              <div className="space-y-1">
                <div className={`text-xs font-medium uppercase tracking-wide
                               ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <User className="h-3 w-3 inline mr-1" />
                  Teacher
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {slot.teacher_name || (
                    <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Not assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Room */}
              <div className="space-y-1">
                <div className={`text-xs font-medium uppercase tracking-wide
                               ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Room
                </div>
                <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  {slot.room_number || (
                    <span className={`italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Not specified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {slot.notes && (
              <div className={`p-4 rounded-lg
                             ${isDark ? 'bg-gray-800/30 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-start gap-2">
                  <FileText className={`h-4 w-4 mt-0.5 flex-shrink-0
                                      ${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                  <div className="flex-1">
                    <h4 className={`text-xs font-semibold uppercase tracking-wide mb-1
                                  ${isDark ? 'text-gray-400' : 'text-blue-900'}`}>
                      Notes
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {slot.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setShowDeleteConfirm(true)}
                className={`text-red-600 hover:text-red-700 hover:bg-red-50
                          ${isDark ? 'hover:bg-red-900/20' : ''}`}
              >
                Delete Period
              </Button>
              <Button
                variant="primary"
                leftIcon={<Edit3 className="h-4 w-4" />}
                onClick={handleEdit}
              >
                Edit Period
              </Button>
            </div>
          </div>
        )}

        {/* Create / Edit Mode */}
        {(isCreateMode || isEditing) && !showDeleteConfirm && (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Time slot info for create mode */}
            {isCreateMode && (
              <div className={`p-4 rounded-lg border-l-4 border-primary
                             ${isDark ? 'bg-primary-900/20' : 'bg-primary-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg
                                 ${isDark ? 'bg-primary-900/40' : 'bg-primary-100'}`}>
                    <Plus className={`h-5 w-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                  </div>
                  <div>
                    <p className={`font-bold ${isDark ? 'text-gray-200' : 'text-primary-900'}`}>
                      {DAY_NAMES[dayOfWeek as DayOfWeek]} - Period {periodNumber}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-primary-700'}`}>
                      Adding a new class to this time slot
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Details Section */}
            <div className={`p-4 rounded-lg border
                           ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2
                            ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                <Clock className="h-4 w-4" />
                Schedule Details
              </h4>

              {/* Day & Period selectors (only in edit mode) */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Select
                    label="Day of Week"
                    {...register('day_of_week', { valueAsNumber: true })}
                    error={errors.day_of_week?.message?.toString()}
                    options={DAY_OPTIONS}
                    className={isDark ? 'dark-select' : ''}
                  />
                  <Select
                    label="Period Number"
                    {...register('period_number', { valueAsNumber: true })}
                    error={errors.period_number?.message?.toString()}
                    options={PERIOD_OPTIONS}
                    className={isDark ? 'dark-select' : ''}
                  />
                </div>
              )}

              {/* Subject */}
              <div className="mb-4">
                <Select
                  label="Subject"
                  {...register('subject', { valueAsNumber: true })}
                  error={errors.subject?.message?.toString()}
                  disabled={isLoadingSubjects}
                  options={[
                    { label: 'Select a subject', value: '' },
                    ...(subjectsData?.results || []).map((s) => ({
                      label: `${s.name} (${s.code})`,
                      value: String(s.id),
                    })),
                  ]}
                  className={isDark ? 'dark-select' : ''}
                />
                {isLoadingSubjects && (
                  <p className={`mt-1 text-xs flex items-center gap-1
                               ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Spinner size="xs" /> Loading subjects...
                  </p>
                )}
              </div>

              {/* Teacher with availability info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium
                                   ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Teacher (Optional)
                  </label>
                  {isLoadingTeachers ? (
                    <span className={`text-xs flex items-center gap-1
                                    ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Spinner size="xs" /> Checking availability...
                    </span>
                  ) : teacherOptions.length > 0 ? (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {teacherOptions.length} available
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      None available
                    </Badge>
                  )}
                </div>
                <Select
                  {...register('teacher', {
                    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                  })}
                  error={errors.teacher?.message?.toString()}
                  disabled={isLoadingTeachers}
                  options={[
                    { label: 'Not assigned', value: '' },
                    ...teacherOptions.map((t) => ({
                      label: t.full_name,
                      value: String(t.id),
                    })),
                  ]}
                  className={isDark ? 'dark-select' : ''}
                />
                {!isLoadingTeachers && teacherOptions.length === 0 && (
                  <div className={`mt-2 p-2 rounded text-xs flex items-start gap-2
                                 ${isDark ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>
                      No teachers are available for this time slot. The period can still be created without a teacher.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className={`p-4 rounded-lg border
                           ${isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2
                            ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                <FileText className="h-4 w-4" />
                Additional Information
              </h4>

              {/* Notes */}
              <Textarea
                label="Notes (Optional)"
                {...register('notes')}
                error={errors.notes?.message?.toString()}
                placeholder="Add any special notes or instructions for this period..."
                rows={3}
                className={isDark ? 'dark-textarea' : ''}
              />
            </div>

            {/* Active Status Toggle */}
            <div className={`flex items-center justify-between p-4 border rounded-lg
                           ${isDark ? 'border-gray-700 bg-gray-800/20' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg
                               ${isActive 
                                 ? (isDark ? 'bg-green-900/20' : 'bg-green-100')
                                 : (isDark ? 'bg-gray-700' : 'bg-gray-100')}`}>
                  {isActive ? (
                    <CheckCircle className={`h-5 w-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  ) : (
                    <X className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {isActive ? 'Period Active' : 'Period Inactive'}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isActive 
                      ? 'This period will appear in the schedule'
                      : 'This period will be hidden from the schedule'}
                  </p>
                </div>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
            </div>

            {/* Form Actions */}
            <div className={`flex justify-end gap-3 pt-2 border-t
                           ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <Button
                type="button"
                variant="ghost"
                onClick={isCreateMode ? handleModalClose : handleCancelEdit}
                className={isDark ? 'text-gray-300 hover:bg-gray-700' : ''}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={isPending}
              >
                {isCreateMode ? 'Add Period' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}