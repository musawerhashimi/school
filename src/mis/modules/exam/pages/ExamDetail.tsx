import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, GraduationCap, BookOpen, Users, FileText, Edit2 } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Spinner,
  Alert,
} from '@mis-components/ui';
import { useExam, useExamGradesSummary, useExamStatistics } from '../hooks/useExams';

export default function ExamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const examId = Number(id);

  const { data: examData, isLoading, isError, error } = useExam(examId);
  const { data: gradesSummary } = useExamGradesSummary(examId);
  const { data: statistics } = useExamStatistics(examId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" label="Loading exam details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Exam Not Found"
          subtitle="The requested exam could not be found"
          actions={[
            {
              label: 'Back to Exams',
              icon: <ArrowLeft className="h-4 w-4" />,
              onClick: () => navigate('/mis/exams'),
              variant: 'outline',
            },
          ]}
        />
        <Alert variant="error" title="Error Loading Exam">
          {error instanceof Error ? error.message : 'Failed to load exam details'}
        </Alert>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Exam Not Found"
          subtitle="The requested exam could not be found"
          actions={[
            {
              label: 'Back to Exams',
              icon: <ArrowLeft className="h-4 w-4" />,
              onClick: () => navigate('/mis/exams'),
              variant: 'outline',
            },
          ]}
        />
        <Alert variant="warning" title="Exam Not Found">
          The requested exam does not exist or you don't have permission to view it.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={examData.name}
        subtitle={examData.description}
        actions={[
          {
            label: 'Back to Exams',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams'),
            variant: 'outline',
          },
          {
            label: 'Edit Exam',
            icon: <Edit2 className="h-4 w-4" />,
            onClick: () => navigate(`/mis/exams/${id}/edit`),
            variant: 'primary',
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Exam Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Exam Type</p>
                  <Badge variant={examData.exam_type === 'midterm' ? 'info' : 'primary'}>
                    {examData.exam_type_display}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Status</p>
                  <Badge variant={getStatusBadgeVariant(examData.status)}>
                    {examData.status_display}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Academic Year</p>
                  <p className="font-medium">{examData.academic_year_display}</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Marks</p>
                  <p className="font-medium">{examData.total_marks}</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Pass Percentage</p>
                  <p className="font-medium">{examData.pass_percentage}%</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Pass Marks</p>
                  <p className="font-medium">{examData.pass_marks}</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">Start Date</p>
                  <p className="font-medium">{examData.start_date}</p>
                </div>

                <div>
                  <p className="text-sm text-text-secondary mb-1">End Date</p>
                  <p className="font-medium">{examData.end_date}</p>
                </div>
              </div>

              {examData.notes && (
                <div>
                  <p className="text-sm text-text-secondary mb-1">Notes</p>
                  <p className="text-text-primary">{examData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statistics ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{statistics.total_schedules}</span>
                    <p className="text-sm text-text-secondary">Total Schedules</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-success">{statistics.completed_schedules}</span>
                    <p className="text-sm text-text-secondary">Completed</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-warning">{statistics.total_schedules - statistics.completed_schedules}</span>
                    <p className="text-sm text-text-secondary">Pending</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-info">{statistics.total_grades}</span>
                    <p className="text-sm text-text-secondary">Total Grades</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-success">{statistics.pass_count}</span>
                    <p className="text-sm text-text-secondary">Passed</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-error">{statistics.fail_count}</span>
                    <p className="text-sm text-text-secondary">Failed</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-warning">{statistics.absent_count}</span>
                    <p className="text-sm text-text-secondary">Absent</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-primary">{Math.round(statistics.pass_rate)}%</span>
                    <p className="text-sm text-text-secondary">Pass Rate</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-info">{Math.round(statistics.average_percentage)}%</span>
                    <p className="text-sm text-text-secondary">Avg Percentage</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No statistics available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {examData.class_levels_detail && examData.class_levels_detail.length > 0 ? (
                <div className="space-y-3">
                  {examData.class_levels_detail.map((level) => (
                    <div key={level.id} className="flex items-center justify-between">
                      <span className="font-medium">{level.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary">No class levels specified</p>
              )}
            </CardContent>
          </Card>

          {gradesSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Average Marks</span>
                    <span className="font-medium">{Math.round(gradesSummary.overall_avg_marks)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Pass Rate</span>
                    <span className="font-medium">{Math.round(gradesSummary.overall_pass_rate)}%</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Total Students</span>
                    <span className="font-medium">{gradesSummary.total_students}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="primary" className="w-full">
                <GraduationCap className="h-4 w-4 mr-2" />
                Grade Entry
              </Button>
              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                View Schedules
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                View Results
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'scheduled':
      return 'info';
    case 'in_progress':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
}
