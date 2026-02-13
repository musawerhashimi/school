import { PageHeader } from '@mis-components/index';
import {
  Alert,
  Card,
  CardContent,
  Spinner,
} from '@mis-components/ui';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExamScheduleCalendar } from '../components/ExamScheduleCalendar';
import { useExamSchedules } from '../hooks/useExamSchedules';
import type { ExamScheduleApiResponse } from '../types';


export default function ExamScheduleCalendarPage() {
  const navigate = useNavigate();

  const { data: scheduleData, isLoading } = useExamSchedules({
    page: 1,
    page_size: 100, // Load more schedules for calendar view
  });

  const handleDateClick = (date: Date, schedules: ExamScheduleApiResponse[]) => {
    console.log('Date clicked:', date);
    console.log('Schedules:', schedules);
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
                <ExamScheduleCalendar
                  schedules={scheduleData?.results || []}
                  onDateClick={handleDateClick}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
