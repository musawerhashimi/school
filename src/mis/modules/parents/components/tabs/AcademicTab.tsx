/**
 * AcademicTab Component
 * Displays academic performance for parents (reuses student components)
 */

import { useState } from "react";
import { ChevronDown, ChevronUp, Download, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Spinner,
  Alert,
  Badge,
} from "@mis-components/ui";
import { useStudentAcademicPerformance } from "@students/hooks/useStudents";
import SubjectPerformanceTable, { type Grade } from "@students/components/SubjectPerformanceTable";
import GPASummaryCard from "@students/components/GPASummary";
import type { ChildDetailResponse } from "../../types";

interface AcademicTabProps {
  studentId: number;
  student: ChildDetailResponse;
}

export default function AcademicTab({ studentId, student }: AcademicTabProps) {
  const [showHistory, setShowHistory] = useState(false);
  const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

  // Fetch academic performance data using the same hook as student module
  const { data: academicData, isLoading, error } = useStudentAcademicPerformance(studentId);

  // Convert backend data to Grade format for SubjectPerformanceTable
  const convertToGrades = (): Grade[] => {
    if (!academicData?.current_grades) return [];

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
      {/* Academic Information Card */}
      <Card>
        <CardHeader title="Academic Information" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">Education Level</label>
              <p className="mt-1 text-base text-text-primary font-medium">
                {student.education_level_display || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Class</label>
              <p className="mt-1 text-base text-text-primary">
                {student.class_name || "Not Assigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Section</label>
              <p className="mt-1 text-base text-text-primary">
                {student.section || "Not Assigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Roll Number</label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.roll_number || "Not Assigned"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Admission Date</label>
              <p className="mt-1 text-base text-text-primary">
                {student.admission_date}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Status</label>
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
          </div>
        </CardContent>
      </Card>

      {/* GPA Summary Card - Reusing student component */}
      <GPASummaryCard
        academicYear={academicData.current_grades.academic_year || ""}
        gpa={academicData.performance_metrics.gpa}
        averageScore={academicData.current_grades.combined_average}
        totalSubjects={grades.length}
      />

      {/* Subject Performance Table - Reusing student component */}
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
                Academic Progress Overview
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
                      Years Completed
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
                      Overall Average
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
                                Percentage
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
                                <p className="text-xs text-text-secondary">Rank</p>
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

      {/* Performance Trends */}
      <Card>
        <CardHeader title="Performance Trends" />
        <CardContent className="p-6">
          <Alert variant="info" title="Coming Soon">
            Performance charts and trend analysis will be available in a future update.
          </Alert>
          <div className="mt-4 flex gap-4">
            <Button variant="outline" leftIcon={<TrendingUp className="h-4 w-4" />}>
              View Trends
            </Button>
            <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
              Download Report Card
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
