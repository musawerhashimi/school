import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Spinner,
} from "@mis-components/ui";
import {
  ChevronDown,
  ChevronUp,
  Download,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StudentApiResponse } from "../../types";
import SubjectPerformanceTable, { type Grade } from "../SubjectPerformanceTable";
import GPASummaryCard from "../GPASummary";
import { useStudentAcademicPerformance } from "../../hooks/useStudents";

interface AcademicsTabProps {
  student: StudentApiResponse;
}


export default function AcademicsTab({ student }: AcademicsTabProps) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);
  const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

  // Fetch academic performance data
  const { data: academicData, isLoading, error } = useStudentAcademicPerformance(student.id);

  // Convert backend data to Grade format for SubjectPerformanceTable
  const convertToGrades = (): Grade[] => {
    if (!academicData?.current_grades) return [];

    // const grades: Grade[] = [];
    const midterm = academicData.current_grades.midterm;
    const annual = academicData.current_grades.annual;

    // Combine subjects from both exams
    const subjectMap = new Map<number, Grade>();

    // Process midterm grades
    if (midterm?.subjects) {
      midterm.subjects.forEach(subject => {
        subjectMap.set(subject.subject_id, {
          subject: subject.subject_name,
          teacher: subject.teacher || "N/A",
          midterm: {
            homework: round2(subject.assignment_marks),
            classActivity: round2(subject.activity_marks),
            exam: round2(subject.exam_marks),
            total: round2(subject.marks_obtained),
          },
          annual: { homework: 0, classActivity: 0, exam: 0, total: 0 },
          total: round2(subject.marks_obtained),
          grade: subject.grade_letter,
          percentage: round2(subject.percentage),
        });
      });
    }

    // Add annual grades
    if (annual?.subjects) {
      annual.subjects.forEach(subject => {
        const existing = subjectMap.get(subject.subject_id);
        if (existing) {
          existing.annual = {
            homework: round2(subject.assignment_marks),
            classActivity: round2(subject.activity_marks),
            exam: round2(subject.exam_marks),
            total: round2(subject.marks_obtained),
          };
          existing.total = round2(existing.midterm.total + subject.marks_obtained);
          const totalPossible = existing.midterm.total + subject.total_marks;
          existing.percentage = totalPossible > 0
            ? round2((existing.total / totalPossible) * 100)
            : 0;
        } else {
          subjectMap.set(subject.subject_id, {
            subject: subject.subject_name,
            teacher: subject.teacher || "N/A",
            midterm: { homework: 0, classActivity: 0, exam: 0, total: 0 },
            annual: {
              homework: round2(subject.assignment_marks),
              classActivity: round2(subject.activity_marks),
              exam: round2(subject.exam_marks),
              total: round2(subject.marks_obtained),
            },
            total: round2(subject.marks_obtained),
            grade: subject.grade_letter,
            percentage: round2(subject.percentage),
          });
        }
      });
    }

    return Array.from(subjectMap.values());
  };

  const grades = convertToGrades();

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-16">
            <div className="flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" />
              <p className="text-text-secondary">Loading academic performance...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Alert variant="error" title="Error loading academic data">
              {error instanceof Error ? error.message : 'Failed to load academic performance data'}
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show no data state
  if (!academicData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <Alert variant="info" title="No academic data available">
              Academic performance data is not available for this student yet.
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <Card>
        <CardHeader title={t("mis.student.profile.academicInformation")} />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.educationLevel")}
              </label>
              <p className="mt-1 text-base text-text-primary font-medium">
                {student.education_level_display}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.class")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.class_name || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.section")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.section || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.rollNumber")}
              </label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.roll_number || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.admissionDate")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.admission_date}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.admissionNumber")}
              </label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.admission_number || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.status")}
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    student.status === "active"
                      ? "success"
                      : student.status === "inactive"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {student.status_display}
                </Badge>
              </div>
            </div>

            {student.previous_school && (
              <>
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h4 className="text-md font-semibold text-text-primary mb-4">
                    {t("mis.student.profile.previousEducation")}
                  </h4>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.previousSchool")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.previous_school}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.previousClass")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.previous_class || t("mis.student.profile.notSpecified")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.transferCertificateNumber")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.transfer_certificate_number || t("mis.student.profile.notProvided")}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GPA Summary Card */}
      <GPASummaryCard
        academicYear={academicData.current_grades.academic_year || student.academic_year_display || ""}
        gpa={academicData.performance_metrics.gpa}
        averageScore={academicData.current_grades.combined_average}
        totalSubjects={grades.length}
      />

      {/* Subject Performance Table */}
      {grades.length > 0 ? (
        <SubjectPerformanceTable grades={grades} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <Alert variant="info" title="No grades available">
              This student doesn't have any exam scores for the current academic year yet.
            </Alert>
          </CardContent>
        </Card>
      )}
      {/* Academic History Section - Collapsible */}
      {academicData.academic_history.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.student.profile.academicProgressOverview")}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                rightIcon={showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              >
                {showHistory ? "Hide History" : "Show Academic History"}
              </Button>
            </div>

            {showHistory && (
              <div className="space-y-6 mt-6">
                {/* Overall Progress Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">
                      {t("mis.student.profile.yearsCompleted")}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {academicData.performance_metrics.years_completed}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">
                      Current GPA
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {academicData.performance_metrics.gpa.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-info/5 rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">
                      {t("mis.student.profile.overallAvgPercentage")}
                    </p>
                    <p className="text-2xl font-bold text-info">
                      {academicData.performance_metrics.cumulative_average.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center p-4 bg-warning/5 rounded-lg">
                    <p className="text-sm text-text-secondary mb-1">
                      Pass Rate
                    </p>
                    <p className="text-2xl font-bold text-warning">
                      {academicData.performance_metrics.all_time_pass_rate.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* Academic History Timeline */}
                <div className="space-y-4">
                  {academicData.academic_history.map((record, index) => (
                    <Card key={index} className="border border-border">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-text-primary">
                                {record.class_name}
                              </h3>
                              {record.promotion_status && (
                                <Badge variant={record.promotion_status === 'promoted' ? 'success' : 'warning'}>
                                  {record.promotion_status.replace('_', ' ')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">
                              {record.academic_year}
                            </p>
                          </div>
                          <div className="flex gap-4 text-center">
                            <div>
                              <p className="text-xs text-text-secondary">
                                {t("mis.student.profile.percentage")}
                              </p>
                              <p className="text-lg font-bold text-success">
                                {record.overall_percentage.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-text-secondary">Grade</p>
                              <p className="text-lg font-bold text-primary">
                                {record.overall_grade}
                              </p>
                            </div>
                            {record.rank_in_class && record.total_students && (
                              <div>
                                <p className="text-xs text-text-secondary">{t("mis.student.profile.rank")}</p>
                                <p className="text-lg font-bold text-warning">
                                  #{record.rank_in_class}/{record.total_students}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-text-secondary">
                                Pass/Fail
                              </p>
                              <p className="text-lg font-bold text-info">
                                {record.subjects_passed}/{record.total_subjects}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader title={t("mis.student.profile.performanceTrends")} />
        <CardContent className="p-6">
          <Alert variant="info" title={t("mis.student.profile.comingSoon")}>
            {t("mis.student.profile.comingSoonMessage")}
          </Alert>
          <div className="mt-4 flex gap-4">
            <Button
              variant="outline"
              leftIcon={<TrendingUp className="h-4 w-4" />}
            >
              {t("mis.student.profile.viewTrends")}
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              {t("mis.student.profile.downloadReportCard")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
