import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Award,
  CheckCircle,
  XCircle,
  Edit,
  Send,
  Printer,
} from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Spinner,
  Alert,
  Textarea,
  Select,
} from '@mis-components/ui';
import {
  useReportCard,
  useUpdateReportCard,
  useApproveReportCard,
  usePublishReportCards,
} from '../hooks/useReportCards';
import type { PromotionStatus, ReportCardStatus, SubjectResult } from '../types';
import { useState, useEffect } from 'react';

const STATUS_COLORS: Record<ReportCardStatus, string> = {
  draft: 'secondary',
  generated: 'info',
  approved: 'warning',
  published: 'success',
};

const GRADE_COLORS: Record<string, string> = {
  'A+': 'success',
  A: 'success',
  'A-': 'success',
  'B+': 'info',
  B: 'info',
  'B-': 'info',
  'C+': 'warning',
  C: 'warning',
  'C-': 'warning',
  D: 'error',
  F: 'error',
};

export default function ReportCardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reportCardId = id ? parseInt(id, 10) : 0;

  const [isEditing, setIsEditing] = useState(false);
  const [remarks, setRemarks] = useState({
    class_teacher_remarks: '',
    principal_remarks: '',
    promotion_status: 'pending' as PromotionStatus,
  });

  const { data: reportCard, isLoading, isError, error } = useReportCard(reportCardId);
  const updateReportCard = useUpdateReportCard();
  const approveReportCard = useApproveReportCard();
  const publishReportCards = usePublishReportCards();

  // Initialize remarks when data loads
  useEffect(() => {
    if (reportCard) {
      setRemarks({
        class_teacher_remarks: reportCard.class_teacher_remarks || '',
        principal_remarks: reportCard.principal_remarks || '',
        promotion_status: reportCard.promotion_status,
      });
    }
  }, [reportCard]);

  const handleSaveRemarks = () => {
    updateReportCard.mutate(
      { id: reportCardId, data: remarks },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleApprove = () => {
    approveReportCard.mutate(reportCardId);
  };

  const handlePublish = () => {
    publishReportCards.mutate({ ids: [reportCardId] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading report card..." />
      </div>
    );
  }

  if (isError || !reportCard) {
    return (
      <div className="space-y-6">
        <Alert variant="error" title="Error">
          {error instanceof Error ? error.message : 'Failed to load report card'}
        </Alert>
        <Button onClick={() => navigate('/mis/exams/report-cards')}>
          Back to Report Cards
        </Button>
      </div>
    );
  }

  const subjectResults = Object.values(reportCard.subject_results || {}) as SubjectResult[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Card"
        subtitle={reportCard.display_name}
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/exams/report-cards'),
            variant: 'outline',
          },
          ...(reportCard.status !== 'published'
            ? [
                {
                  label: 'Print',
                  icon: <Printer className="h-4 w-4" />,
                  onClick: () => window.print(),
                  variant: 'outline' as const,
                },
              ]
            : []),
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                  {reportCard.student_photo ? (
                    <img
                      src={reportCard.student_photo}
                      alt={reportCard.student_name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-text-primary">
                    {reportCard.student_name}
                  </h2>
                  <p className="text-text-secondary">ID: {reportCard.student_id_number}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1 text-text-secondary">
                      <Calendar className="h-4 w-4" />
                      {reportCard.academic_year_display}
                    </span>
                    <span className="text-text-secondary">
                      Class: {reportCard.class_instance_name}
                    </span>
                    <Badge variant={STATUS_COLORS[reportCard.status] as any}>
                      {reportCard.status_display}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Results */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Results
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">
                    {reportCard.overall_percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-text-secondary mt-1">Overall Percentage</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Badge
                    variant={GRADE_COLORS[reportCard.overall_grade] as any}
                    className="text-2xl px-4 py-2"
                  >
                    {reportCard.overall_grade}
                  </Badge>
                  <p className="text-sm text-text-secondary mt-2">Final Grade</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">
                    {reportCard.rank_in_class || '—'}
                    {reportCard.rank_in_class && (
                      <span className="text-lg text-text-secondary">
                        /{reportCard.total_students_in_class}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">Class Rank</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">
                    {reportCard.is_overall_pass ? (
                      <CheckCircle className="h-8 w-8 text-success mx-auto" />
                    ) : (
                      <XCircle className="h-8 w-8 text-error mx-auto" />
                    )}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {reportCard.is_overall_pass ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>

              <div className="flex justify-center gap-8 mt-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-success">{reportCard.subjects_passed}</p>
                  <p className="text-sm text-text-secondary">Subjects Passed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-error">{reportCard.subjects_failed}</p>
                  <p className="text-sm text-text-secondary">Subjects Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-text-primary">
                    {reportCard.total_subjects}
                  </p>
                  <p className="text-sm text-text-secondary">Total Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Results */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Subject-wise Results
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        Marks
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        Percentage
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        Grade
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectResults.map((subject, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-text-primary">{subject.subject_name}</p>
                          <p className="text-sm text-text-secondary">{subject.subject_code}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-medium">
                            {subject.weighted_marks.toFixed(1)}
                          </span>
                          <span className="text-text-secondary">
                            /{subject.weighted_total.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {subject.final_percentage.toFixed(1)}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={GRADE_COLORS[subject.final_grade] as any}>
                            {subject.final_grade}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {subject.is_pass ? (
                            <CheckCircle className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <XCircle className="h-5 w-5 text-error mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-center">
                        {reportCard.total_marks_obtained?.toFixed(1)} /
                        {reportCard.total_marks_possible?.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {reportCard.overall_percentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={GRADE_COLORS[reportCard.overall_grade] as any}>
                          {reportCard.overall_grade}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {reportCard.is_overall_pass ? (
                          <CheckCircle className="h-5 w-5 text-success mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-error mx-auto" />
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardContent className="p-4 space-y-3">
              {reportCard.status === 'generated' && (
                <Button
                  variant="primary"
                  className="w-full"
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                  onClick={handleApprove}
                  loading={approveReportCard.isPending}
                >
                  Approve Report Card
                </Button>
              )}

              {reportCard.status === 'approved' && (
                <Button
                  variant="primary"
                  className="w-full"
                  leftIcon={<Send className="h-4 w-4" />}
                  onClick={handlePublish}
                  loading={publishReportCards.isPending}
                >
                  Publish Report Card
                </Button>
              )}

              {reportCard.status !== 'published' && (
                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<Edit className="h-4 w-4" />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Remarks'}
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full"
                leftIcon={<Printer className="h-4 w-4" />}
                onClick={() => window.print()}
              >
                Print Report Card
              </Button>
            </CardContent>
          </Card>

          {/* Promotion Status */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Promotion Status</h4>
              {isEditing ? (
                <Select
                  value={remarks.promotion_status}
                  onChange={(e) =>
                    setRemarks((r) => ({
                      ...r,
                      promotion_status: e.target.value as PromotionStatus,
                    }))
                  }
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Promoted', value: 'promoted' },
                    { label: 'Repeated', value: 'repeated' },
                    { label: 'Conditionally Promoted', value: 'conditionally_promoted' },
                  ]}
                />
              ) : (
                <Badge
                  variant={
                    {
                      pending: 'secondary',
                      promoted: 'success',
                      repeated: 'error',
                      conditionally_promoted: 'warning',
                    }[reportCard.promotion_status] as any
                  }
                >
                  {reportCard.promotion_status_display}
                </Badge>
              )}
            </CardContent>
          </Card>

          {/* Remarks */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Class Teacher Remarks</h4>
                {isEditing ? (
                  <Textarea
                    value={remarks.class_teacher_remarks}
                    onChange={(e) =>
                      setRemarks((r) => ({ ...r, class_teacher_remarks: e.target.value }))
                    }
                    rows={3}
                    placeholder="Enter class teacher remarks..."
                  />
                ) : (
                  <p className="text-sm text-text-secondary">
                    {reportCard.class_teacher_remarks || 'No remarks added'}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Principal Remarks</h4>
                {isEditing ? (
                  <Textarea
                    value={remarks.principal_remarks}
                    onChange={(e) =>
                      setRemarks((r) => ({ ...r, principal_remarks: e.target.value }))
                    }
                    rows={3}
                    placeholder="Enter principal remarks..."
                  />
                ) : (
                  <p className="text-sm text-text-secondary">
                    {reportCard.principal_remarks || 'No remarks added'}
                  </p>
                )}
              </div>

              {isEditing && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSaveRemarks}
                  loading={updateReportCard.isPending}
                >
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Approval Info */}
          {reportCard.approved_by_name && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Approved By</h4>
                <p className="text-sm text-text-secondary">{reportCard.approved_by_name}</p>
                {reportCard.approved_at && (
                  <p className="text-xs text-text-secondary mt-1">
                    {new Date(reportCard.approved_at).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
