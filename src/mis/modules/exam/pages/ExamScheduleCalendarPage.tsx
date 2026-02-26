import { PageHeader } from '@mis-components/index';
import {
  Alert,
  Badge,
  Card,
  CardContent,
  Spinner,
} from '@mis-components/ui';
import { Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamScheduleCalendar } from '../components/ExamScheduleCalendar';
import { useExamSchedules } from '../hooks/useExamSchedules';
import type { ExamScheduleApiResponse } from '../types';


export default function ExamScheduleCalendarPage() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedules, setSelectedSchedules] = useState<ExamScheduleApiResponse[]>([]);

  const { data: scheduleData, isLoading } = useExamSchedules({
    page: 1,
    page_size: 100, // Load more schedules for calendar view
  });

  const handleDateClick = (date: Date, schedules: ExamScheduleApiResponse[]) => {
    setSelectedDate(date);
    setSelectedSchedules(schedules);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Exam Schedule Calendar"
        subtitle="View all exams in a calendar format"
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
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" label="Loading exam schedules..." />
            </div>
          ) : (
            <>
              {scheduleData?.results?.length === 0 ? (
                <Alert variant="info" className="mb-4">
                  No exam schedules found. Create your first schedule to get started.
                </Alert>
              ) : (
                <div className="space-y-6">
                  <ExamScheduleCalendar
                    schedules={scheduleData?.results || []}
                    onDateClick={handleDateClick}
                  />

                  {selectedDate && (
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="text-lg font-semibold">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>

                        {selectedSchedules.length === 0 ? (
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            No exams scheduled on this day.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {selectedSchedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3"
                              >
                                <div>
                                  <p className="font-medium">{schedule.subject_name}</p>
                                  <p className="text-sm text-[var(--color-text-secondary)]">
                                    {schedule.class_instance_name} • {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)}
                                  </p>
                                </div>
                                <Badge variant={schedule.is_completed ? 'success' : 'info'}>
                                  {schedule.is_completed ? 'Completed' : 'Scheduled'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
