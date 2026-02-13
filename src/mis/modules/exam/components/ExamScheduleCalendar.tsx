import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import type { ExamScheduleApiResponse } from '../types';
import { Card, CardContent, CardHeader, Badge, Button } from '@mis-components/ui';

interface ExamScheduleCalendarProps {
  schedules: ExamScheduleApiResponse[];
  onDateClick: (date: Date, schedules: ExamScheduleApiResponse[]) => void;
}

export const ExamScheduleCalendar: React.FC<ExamScheduleCalendarProps> = ({
  schedules,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentDate]);

  const getDaySchedules = (date: Date) => {
    return schedules.filter((schedule) => 
      isSameDay(new Date(schedule.exam_date), date)
    );
  };

  const renderDayCell = (date: Date) => {
    const daySchedules = getDaySchedules(date);
    const hasExams = daySchedules.length > 0;
    const isToday = isSameDay(date, new Date());

    return (
      <div
        key={date.toISOString()}
        className={`p-2 border rounded-lg min-h-[100px] cursor-pointer transition-all ${
          hasExams 
            ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
        onClick={() => onDateClick(date, daySchedules)}
      >
        <div className="flex justify-between items-start mb-2">
          <div className={`text-sm font-medium ${
            format(date, 'EEE') === 'Sun' ? 'text-red-600' : 
            format(date, 'EEE') === 'Sat' ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {format(date, 'd')}
          </div>
          {hasExams && (
            <Badge className="text-xs">
              {daySchedules.length} Exam{daySchedules.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        {hasExams && (
          <div className="space-y-1">
            {daySchedules.slice(0, 2).map((schedule) => (
              <div
                key={schedule.id}
                className="text-xs p-1 bg-blue-100 rounded text-blue-800 truncate"
                title={`${schedule.subject_name} - ${schedule.start_time}`}
              >
                {schedule.subject_name}
              </div>
            ))}
            {daySchedules.length > 2 && (
              <div className="text-xs text-gray-500">
                +{daySchedules.length - 2} more
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const days = [];
    const firstDayOfMonth = calendarDays[0];
    const startingDayOfWeek = firstDayOfMonth.getDay();

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-0" />);
    }

    days.push(...calendarDays.map(renderDayCell));

    return days;
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </div>
          <div className="text-sm text-gray-600">
            {schedules.length} Total Exams
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentDate(prev => 
              new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
            )}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentDate(prev => 
              new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
            )}
          >
            Next
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className={`text-center text-sm font-medium ${
                day === 'Sun' ? 'text-red-600' : 
                day === 'Sat' ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarGrid()}
        </div>
      </CardContent>
    </Card>
  );
};
