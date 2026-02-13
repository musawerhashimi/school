import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Card,
  CardContent,
  Alert,
  Spinner,
  Modal,
  Badge,
} from '@mis-components/ui';
import { useClassInstance } from '../hooks/useClassInstances';
import { useWeeklySchedule, useClearClassSchedule } from '../hooks/useSchedules';
import WeeklyScheduleTable from '../components/WeeklyScheduleTable';
import ScheduleSlotModal from '../components/ScheduleSlotModal';
import type { ScheduleApiResponse, DayOfWeek } from '../types';

export default function ScheduleView() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const classInstanceId = classId ? parseInt(classId, 10) : 0;

  // State for viewing existing slot
  const [selectedSlot, setSelectedSlot] = useState<ScheduleApiResponse | null>(null);

  // State for creating new slot from empty cell
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState<DayOfWeek | undefined>();
  const [newSlotPeriod, setNewSlotPeriod] = useState<number | undefined>();

  const [clearModalOpen, setClearModalOpen] = useState(false);

  // Fetch class details
  const {
    data: classInstance,
    isLoading: isLoadingClass,
    isError: isClassError,
    error: classError,
  } = useClassInstance(classInstanceId);

  // Fetch weekly schedule
  const {
    data: scheduleData,
    isLoading: isLoadingSchedule,
    isError: isScheduleError,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useWeeklySchedule(classInstanceId);

  const clearSchedule = useClearClassSchedule();

  const handleSlotClick = (slot: ScheduleApiResponse) => {
    setSelectedSlot(slot);
  };

  const handleEmptySlotClick = (dayOfWeek: DayOfWeek, periodNumber: number) => {
    // Open create modal instead of navigating
    setNewSlotDay(dayOfWeek);
    setNewSlotPeriod(periodNumber);
    setCreateModalOpen(true);
  };

  const handleClearSchedule = () => {
    clearSchedule.mutate(classInstanceId, {
      onSuccess: () => {
        setClearModalOpen(false);
      },
    });
  };

  const handleSlotModalClose = () => {
    setSelectedSlot(null);
    refetchSchedule();
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewSlotDay(undefined);
    setNewSlotPeriod(undefined);
  };

  const handleScheduleSuccess = () => {
    refetchSchedule();
  };

  if (isLoadingClass || isLoadingSchedule) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading schedule..." />
      </div>
    );
  }

  if (isClassError || !classInstance) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Schedule Not Found"
          subtitle="The requested class could not be found"
          actions={[
            {
              label: 'Back to Classes',
              icon: <ArrowLeft className="h-4 w-4" />,
              onClick: () => navigate('/mis/academics/classes'),
              variant: 'outline',
            },
          ]}
        />
        <Alert variant="error" title="Error">
          {classError instanceof Error ? classError.message : 'Failed to load class details'}
        </Alert>
      </div>
    );
  }

  const totalPeriods = scheduleData?.weekly_schedule.reduce(
    (sum, day) => sum + day.periods.length,
    0
  ) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Schedule: ${classInstance.display_name}`}
        subtitle={`${classInstance.academic_year_display} • ${classInstance.shift_display}`}
        actions={[
          {
            label: 'Back to Class',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate(`/mis/academics/classes/${classInstanceId}`),
            variant: 'outline',
          },
        ]}
      />

      {/* Schedule Stats */}
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="info">
          {totalPeriods} Periods Scheduled
        </Badge>
        {classInstance.class_teacher_name && (
          <Badge variant="secondary">
            Teacher: {classInstance.class_teacher_name}
          </Badge>
        )}
        {classInstance.room_number && (
          <Badge variant="secondary">
            Room: {classInstance.room_number}
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      {totalPeriods > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={() => setClearModalOpen(true)}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Schedule Error */}
      {isScheduleError && (
        <Alert variant="error" title="Error Loading Schedule">
          {scheduleError instanceof Error ? scheduleError.message : 'Failed to load schedule'}
        </Alert>
      )}

      {/* Weekly Schedule Table */}
      {scheduleData && (
        <Card>
          <CardContent className="p-4">
            <WeeklyScheduleTable
              weeklySchedule={scheduleData.weekly_schedule}
              onSlotClick={handleSlotClick}
              onEmptySlotClick={handleEmptySlotClick}
              showTeacher
              showRoom
              mode="edit"
              maxPeriods={6}
            />
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {scheduleData && totalPeriods === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Schedule Yet
            </h3>
            <p className="text-gray-500 mb-4">
              This class doesn't have a schedule yet. Click on any empty slot or use the button below to add periods.
            </p>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate(`/mis/academics/schedules/${classInstanceId}/new`)}
            >
              Add First Period
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Slot Details Modal (for viewing/editing existing slots) */}
      <ScheduleSlotModal
        slot={selectedSlot}
        isOpen={!!selectedSlot}
        onClose={handleSlotModalClose}
        classLevelId={classInstance.class_level}
        onSuccess={handleScheduleSuccess}
      />

      {/* Create New Slot Modal (for empty cells) */}
      <ScheduleSlotModal
        createMode
        isOpen={createModalOpen}
        onClose={handleCreateModalClose}
        dayOfWeek={newSlotDay}
        periodNumber={newSlotPeriod}
        classInstanceId={classInstanceId}
        classLevelId={classInstance.class_level}
        onSuccess={handleScheduleSuccess}
      />

      {/* Clear Schedule Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Schedule"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to clear all {totalPeriods} scheduled periods for{' '}
            <span className="font-semibold">{classInstance.display_name}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearSchedule}
              loading={clearSchedule.isPending}
            >
              Clear All Periods
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
