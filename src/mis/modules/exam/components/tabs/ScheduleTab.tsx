import { useState } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent, Select, Spinner } from '@mis-components/ui';
import { useExamScheduleGrid } from '../../hooks/useClassExams';
import ExamScheduleGrid from '../ExamScheduleGrid';
import ExamScheduleSlotModal from '../ExamScheduleSlotModal';
import type { ExamType, ExamApiResponse, ExamScheduleDetailApiResponse } from '../../types';

interface ScheduleTabProps {
  classId: number;
  examType: ExamType;
  onExamTypeChange: (type: ExamType) => void;
  midtermExam: ExamApiResponse | null;
  finalExam: ExamApiResponse | null;
}

export default function ScheduleTab({
  classId,
  examType,
  onExamTypeChange,
  midtermExam,
  finalExam,
}: ScheduleTabProps) {
  const [selectedSlot, setSelectedSlot] = useState<ExamScheduleDetailApiResponse | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<string | undefined>(undefined);

  const { data: scheduleData, isLoading, refetch } = useExamScheduleGrid(classId, examType);

  const currentExam = examType === 'midterm' ? midtermExam : finalExam;
  const totalSlots = scheduleData?.days?.reduce((sum, day) => sum + day.slots.length, 0) || 0;

  // Calculate exam duration in days
  const getExamDuration = () => {
    if (!currentExam) return null;
    const start = new Date(currentExam.start_date);
    const end = new Date(currentExam.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSlotClick = (slot: ExamScheduleDetailApiResponse) => {
    setSelectedSlot(slot);
  };

  const handleEmptySlotClick = (date: string) => {
    setCreateModalDate(date);
    setCreateModalOpen(true);
  };

  const handleSlotModalClose = () => {
    setSelectedSlot(null);
    refetch();
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setCreateModalDate(undefined);
    refetch();
  };

  if (!currentExam) {
    return (
      <Card className="border-[var(--color-border)]">
        <CardContent className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-warning-soft)] mb-4">
            <AlertCircle className="h-8 w-8 text-[var(--color-warning)]" />
          </div>
          <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
            No {examType === 'midterm' ? 'Midterm' : 'Final'} Exam Scheduled
          </h4>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            Please schedule a {examType} exam first before adding schedule slots.
          </p>
          <Select
            value={examType}
            onChange={(e) => onExamTypeChange(e.target.value as ExamType)}
            options={[
              { label: 'Midterm Exam', value: 'midterm' },
              { label: 'Final Exam', value: 'final' },
            ]}
            className="max-w-xs mx-auto"
          />
        </CardContent>
      </Card>
    );
  }

  const examDuration = getExamDuration();

  return (
    <div className="space-y-6">
      {/* Schedule Header Card */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{currentExam.name}</h3>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                {totalSlots} {totalSlots === 1 ? 'Slot' : 'Slots'} Scheduled
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(currentExam.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' - '}
                {new Date(currentExam.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              {examDuration && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  {examDuration} days
                </span>
              )}
            </div>
          </div>
          <Select
            value={examType}
            onChange={(e) => onExamTypeChange(e.target.value as ExamType)}
            options={[
              { label: 'Midterm', value: 'midterm', disabled: !midtermExam },
              { label: 'Final', value: 'final', disabled: !finalExam },
            ]}
            className="w-32 bg-white/10 border-white/20 text-white [&>option]:text-gray-900"
          />
        </div>
      </div>

      {/* Schedule Content */}
      {isLoading ? (
        <Card className="border-[var(--color-border)]">
          <CardContent className="p-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" />
              <p className="text-[var(--color-text-secondary)]">Loading schedule...</p>
            </div>
          </CardContent>
        </Card>
      ) : scheduleData ? (
        <div className="space-y-4">
          {/* Schedule Grid */}
          <ExamScheduleGrid
            scheduleData={scheduleData}
            onSlotClick={handleSlotClick}
            onEmptySlotClick={handleEmptySlotClick}
            editable
          />

          {/* Schedule Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 px-1">
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-center">
                  <span className="text-[10px] text-[var(--color-muted)]">+</span>
                </div>
                <span>Click to add exam</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 bg-indigo-50 border border-indigo-200 rounded-lg" />
                <span>Click to view/edit</span>
              </span>
            </div>
            <p className="text-xs text-[var(--color-muted)]">
              Fridays (holidays) are excluded from schedule
            </p>
          </div>
        </div>
      ) : null}

      {/* View/Edit Slot Modal */}
      {selectedSlot && (
        <ExamScheduleSlotModal
          slot={selectedSlot}
          isOpen={!!selectedSlot}
          onClose={handleSlotModalClose}
          classId={classId}
          examId={currentExam.id}
        />
      )}

      {/* Create New Slot Modal */}
      <ExamScheduleSlotModal
        isOpen={createModalOpen}
        onClose={handleCreateModalClose}
        classId={classId}
        examId={currentExam.id}
        createMode
        prefilledDate={createModalDate}
      />
    </div>
  );
}
