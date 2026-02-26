import { Calendar, Clock, MapPin, User, Plus, CheckCircle2 } from 'lucide-react';
import { Badge } from '@mis-components/ui';
import type { ExamScheduleGridResponse, ExamScheduleDetailApiResponse } from '../types';

interface ExamScheduleGridProps {
  scheduleData: ExamScheduleGridResponse;
  onSlotClick?: (slot: ExamScheduleDetailApiResponse) => void;
  onEmptySlotClick?: (date: string) => void;
  editable?: boolean;
}

// MIS-themed color palette for subjects
const SUBJECT_COLORS = [
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hover: 'hover:bg-indigo-100' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', hover: 'hover:bg-cyan-100' },
  { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
  { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', hover: 'hover:bg-violet-100' },
  { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hover: 'hover:bg-rose-100' },
  { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', hover: 'hover:bg-sky-100' },
  { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', border: 'border-fuchsia-200', hover: 'hover:bg-fuchsia-100' },
];

const getSubjectColor = (subjectId: number) => {
  return SUBJECT_COLORS[subjectId % SUBJECT_COLORS.length];
};

// Backend sends Afghan weekday mapping where Friday is 6.
const isFriday = (dayOfWeek: number) => dayOfWeek === 6;

export default function ExamScheduleGrid({
  scheduleData,
  onSlotClick,
  onEmptySlotClick,
  editable = false,
}: ExamScheduleGridProps) {
  const { days, max_slots_per_day } = scheduleData;

  // Filter out Fridays (holiday) using backend Afghan weekday mapping.
  const filteredDays = days.filter(day => !isFriday(day.day_of_week));

  // Generate column indices (for subjects per day) - up to 6 subjects
  const columnCount = Math.min(Math.max(max_slots_per_day, 1), 6);
  const columns = Array.from({ length: columnCount }, (_, i) => i + 1);

  if (filteredDays.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-info-soft)] mb-4">
          <Calendar className="h-8 w-8 text-[var(--color-primary)]" />
        </div>
        <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          No Exam Days Scheduled
        </h4>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm mx-auto">
          Click on any empty slot in the grid to start scheduling exams for this class.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
            <th className="p-4 text-left text-sm font-semibold text-white w-36 first:rounded-tl-xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-80" />
                <span>Date</span>
              </div>
            </th>
            {columns.map((col, idx) => (
              <th
                key={col}
                className={`p-4 text-center text-sm font-semibold text-white min-w-[160px] ${
                  idx === columns.length - 1 ? 'last:rounded-tr-xl' : ''
                }`}
              >
                Subject {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {filteredDays.map((day, rowIdx) => {
            const isEvenRow = rowIdx % 2 === 0;
            return (
              <tr
                key={day.exam_date}
                className={`
                  transition-colors duration-150
                  ${isEvenRow ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-card)]'}
                  hover:bg-[var(--color-surface-hover)]
                `}
              >
                <td className="p-4 border-r border-[var(--color-border)]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {day.day_name}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(day.exam_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </td>
                {columns.map((colIndex) => {
                  const slot = day.slots[colIndex - 1];

                  if (slot) {
                    const colors = getSubjectColor(slot.subject);
                    return (
                      <td key={colIndex} className="p-2">
                        <button
                          onClick={() => onSlotClick?.(slot)}
                          className={`
                            w-full p-3 rounded-xl border-2
                            ${colors.bg} ${colors.border} ${colors.hover}
                            hover:shadow-lg hover:scale-[1.02]
                            transition-all duration-200 text-left
                            focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] focus:ring-offset-1
                          `}
                        >
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <span className={`font-semibold ${colors.text} truncate text-sm`}>
                                {slot.subject_name}
                              </span>
                              {slot.is_completed && (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                              <Clock className="h-3 w-3" />
                              <span>
                                {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                              </span>
                            </div>
                            {slot.room_detail?.room_number && (
                              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                <MapPin className="h-3 w-3" />
                                <span>Room {slot.room_detail.room_number}</span>
                              </div>
                            )}
                            {slot.teacher_detail?.full_name && (
                              <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                                <User className="h-3 w-3" />
                                <span className="truncate">
                                  {slot.teacher_detail.full_name}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      </td>
                    );
                  }

                  // Empty slot - clickable to add exam for this specific date
                  return (
                    <td key={colIndex} className="p-2">
                      {editable ? (
                        <button
                          onClick={() => onEmptySlotClick?.(day.exam_date)}
                          className="
                            w-full h-[100px]
                            border-2 border-dashed border-[var(--color-border)]
                            rounded-xl
                            hover:border-[var(--color-primary)] hover:bg-[var(--color-info-soft)]
                            transition-all duration-200
                            flex flex-col items-center justify-center gap-2
                            text-[var(--color-muted)] hover:text-[var(--color-primary)]
                            group
                          "
                        >
                          <Plus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Add Exam
                          </span>
                        </button>
                      ) : (
                        <div className="w-full h-[100px] border-2 border-dashed border-[var(--color-border)]/50 rounded-xl flex items-center justify-center text-[var(--color-muted)]">
                          <span className="text-xs">—</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
