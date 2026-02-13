import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Users, BookOpen, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Card,
  CardContent,
  Select,
  Input,
  Badge,
  Spinner,
  Alert,
  Switch,
} from '@mis-components/ui';
import { useExams, useExam } from '../hooks/useExams';
import { useGradesByClass, useBulkGradeEntry } from '../hooks/useGrades';
import { useClassInstances, useClassInstanceStudents } from '../hooks/useClassInstances';
import { useSubjects } from '../hooks/useSubjects';
import { useAcademicYears } from '../hooks/useAcademicYears';
import type { BulkGradeEntry, ClassInstanceStudent, ExamApiResponse } from '../types';

interface GradeEntryRow {
  studentId: number;
  studentIdNumber: string;
  studentName: string;
  marksObtained: string;
  isAbsent: boolean;
  remarks: string;
  existingGradeId?: number;
}

export default function GradeEntry() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filter states
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    searchParams.get('year') ? Number(searchParams.get('year')) : undefined
  );
  const [selectedExam, setSelectedExam] = useState<number | undefined>(
    searchParams.get('exam') ? Number(searchParams.get('exam')) : undefined
  );
  const [selectedClass, setSelectedClass] = useState<number | undefined>(
    searchParams.get('class') ? Number(searchParams.get('class')) : undefined
  );
  const [selectedSubject, setSelectedSubject] = useState<number | undefined>(
    searchParams.get('subject') ? Number(searchParams.get('subject')) : undefined
  );

  // Grade entry state
  const [gradeEntries, setGradeEntries] = useState<GradeEntryRow[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch data
  const { data: yearsData } = useAcademicYears({ page_size: 50 });
  const { data: examsData, isLoading: isLoadingExams } = useExams({
    academic_year: selectedYear,
    status: 'scheduled',
    page_size: 100,
  });
  const { data: exam } = useExam(selectedExam || 0);
  const { data: classesData, isLoading: isLoadingClasses } = useClassInstances({
    academic_year: selectedYear,
    is_active: true,
    page_size: 100,
  });
  const { data: studentsData, isLoading: isLoadingStudents } = useClassInstanceStudents(
    selectedClass || 0
  );
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({
    class_level: classesData?.results.find((c) => c.id === selectedClass)?.class_level,
    is_active: true,
    page_size: 100,
  });
  const { data: existingGrades, isLoading: isLoadingGrades } = useGradesByClass(
    selectedExam || 0,
    selectedClass || 0
  );

  const bulkEntry = useBulkGradeEntry();

  // Get total marks from exam or subject
  const totalMarks = useMemo(() => {
    return exam?.total_marks || 100;
  }, [exam]);

  // Initialize grade entries when students or existing grades change
  useEffect(() => {
    if (studentsData?.students && selectedSubject) {
      const existingSubjectGrades = existingGrades?.subjects.find(
        (s) => s.subject_id === selectedSubject
      )?.grades;

      const entries: GradeEntryRow[] = studentsData.students.map((student: ClassInstanceStudent) => {
        const existingGrade = existingSubjectGrades?.find((g) => g.student === student.id);
        return {
          studentId: student.id,
          studentIdNumber: student.student_id,
          studentName: student.full_name,
          marksObtained: existingGrade ? String(existingGrade.marks_obtained) : '',
          isAbsent: existingGrade?.is_absent || false,
          remarks: existingGrade?.remarks || '',
          existingGradeId: existingGrade?.id,
        };
      });

      setGradeEntries(entries);
      setHasUnsavedChanges(false);
    }
  }, [studentsData, existingGrades, selectedSubject]);

  // Update a specific entry
  const updateEntry = (studentId: number, field: keyof GradeEntryRow, value: string | boolean) => {
    setGradeEntries((prev) =>
      prev.map((entry) => {
        if (entry.studentId === studentId) {
          const updated = { ...entry, [field]: value };
          // If marking absent, clear marks
          if (field === 'isAbsent' && value === true) {
            updated.marksObtained = '';
          }
          return updated;
        }
        return entry;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Handle save
  const handleSave = () => {
    if (!selectedExam || !selectedClass || !selectedSubject) return;

    const grades: BulkGradeEntry[] = gradeEntries
      .filter((entry) => entry.marksObtained !== '' || entry.isAbsent)
      .map((entry) => ({
        student_id: entry.studentId,
        marks_obtained: entry.isAbsent ? 0 : parseFloat(entry.marksObtained) || 0,
        is_absent: entry.isAbsent,
        remarks: entry.remarks || undefined,
      }));

    if (grades.length === 0) {
      return;
    }

    bulkEntry.mutate(
      {
        exam: selectedExam,
        subject: selectedSubject,
        class_instance: selectedClass,
        total_marks: totalMarks,
        grades,
      },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
        },
      }
    );
  };

  // Calculate summary stats
  const summary = useMemo(() => {
    const entered = gradeEntries.filter((e) => e.marksObtained !== '' || e.isAbsent);
    const absent = gradeEntries.filter((e) => e.isAbsent);
    const passed = gradeEntries.filter((e) => {
      if (e.isAbsent || e.marksObtained === '') return false;
      const marks = parseFloat(e.marksObtained);
      const passMarks = totalMarks * ((exam?.pass_percentage || 40) / 100);
      return marks >= passMarks;
    });
    const failed = entered.length - absent.length - passed.length;

    return {
      total: gradeEntries.length,
      entered: entered.length,
      pending: gradeEntries.length - entered.length,
      passed: passed.length,
      failed: Math.max(0, failed),
      absent: absent.length,
    };
  }, [gradeEntries, totalMarks, exam]);

  const canSave = selectedExam && selectedClass && selectedSubject && hasUnsavedChanges;

  // Check if selections are complete
  const selectionsComplete = selectedExam && selectedClass && selectedSubject;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grade Entry"
        subtitle="Enter marks for students by exam, class, and subject"
        actions={[
          {
            label: 'Back to Exams',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/exams'),
            variant: 'outline',
          },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Academic Year"
              value={selectedYear?.toString() || ''}
              onChange={(e) => {
                setSelectedYear(e.target.value ? Number(e.target.value) : undefined);
                setSelectedExam(undefined);
                setSelectedClass(undefined);
                setSelectedSubject(undefined);
              }}
              options={[
                { label: 'Select Year', value: '' },
                ...(yearsData?.results || []).map((y) => ({
                  label: y.display_name,
                  value: String(y.id),
                })),
              ]}
            />

            <Select
              label="Exam"
              value={selectedExam?.toString() || ''}
              onChange={(e) => {
                setSelectedExam(e.target.value ? Number(e.target.value) : undefined);
              }}
              disabled={!selectedYear || isLoadingExams}
              options={[
                { label: isLoadingExams ? 'Loading...' : 'Select Exam', value: '' },
                ...(examsData?.results || []).map((ex: ExamApiResponse) => ({
                  label: `${ex.name} (${ex.exam_type_display})`,
                  value: String(ex.id),
                })),
              ]}
            />

            <Select
              label="Class"
              value={selectedClass?.toString() || ''}
              onChange={(e) => {
                setSelectedClass(e.target.value ? Number(e.target.value) : undefined);
                setSelectedSubject(undefined);
              }}
              disabled={!selectedYear || isLoadingClasses}
              options={[
                { label: isLoadingClasses ? 'Loading...' : 'Select Class', value: '' },
                ...(classesData?.results || []).map((c) => ({
                  label: c.display_name,
                  value: String(c.id),
                })),
              ]}
            />

            <Select
              label="Subject"
              value={selectedSubject?.toString() || ''}
              onChange={(e) => {
                setSelectedSubject(e.target.value ? Number(e.target.value) : undefined);
              }}
              disabled={!selectedClass || isLoadingSubjects}
              options={[
                { label: isLoadingSubjects ? 'Loading...' : 'Select Subject', value: '' },
                ...(subjectsData?.results || []).map((s) => ({
                  label: `${s.name} (${s.code})`,
                  value: String(s.id),
                })),
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Exam Info */}
      {exam && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-medium">{exam.name}</span>
              </div>
              <Badge variant="secondary">{exam.exam_type_display}</Badge>
              <span>Total: {totalMarks} marks</span>
              <span>Pass: {exam.pass_percentage}%</span>
              <span>Weight: {exam.weight_percentage}%</span>
              <span className="text-text-secondary">
                {exam.start_date} — {exam.end_date}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {selectionsComplete && gradeEntries.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-text-primary">{summary.total}</p>
              <p className="text-sm text-text-secondary">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{summary.entered}</p>
              <p className="text-sm text-text-secondary">Entered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{summary.pending}</p>
              <p className="text-sm text-text-secondary">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{summary.passed}</p>
              <p className="text-sm text-text-secondary">Passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-error">{summary.failed}</p>
              <p className="text-sm text-text-secondary">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{summary.absent}</p>
              <p className="text-sm text-text-secondary">Absent</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grade Entry Table */}
      {selectionsComplete ? (
        isLoadingStudents || isLoadingGrades ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Spinner size="lg" label="Loading students..." />
          </div>
        ) : gradeEntries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No students enrolled</p>
              <p className="text-sm mt-1">
                This class has no enrolled students to enter grades for.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-12">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Student Name
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-32">
                        Marks ({totalMarks})
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">
                        Absent
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-20">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradeEntries.map((entry, index) => {
                      const marks = parseFloat(entry.marksObtained);
                      const passMarks = totalMarks * ((exam?.pass_percentage || 40) / 100);
                      const isPassed = !entry.isAbsent && entry.marksObtained !== '' && marks >= passMarks;
                      const isFailed = !entry.isAbsent && entry.marksObtained !== '' && marks < passMarks;

                      return (
                        <tr
                          key={entry.studentId}
                          className={`border-b hover:bg-gray-50 ${
                            entry.isAbsent ? 'bg-gray-100' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">
                            {entry.studentIdNumber}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-text-primary">
                            {entry.studentName}
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              min={0}
                              max={totalMarks}
                              step="0.5"
                              value={entry.marksObtained}
                              onChange={(e) =>
                                updateEntry(entry.studentId, 'marksObtained', e.target.value)
                              }
                              disabled={entry.isAbsent}
                              className="w-24 text-center"
                              placeholder="--"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Switch
                              checked={entry.isAbsent}
                              onCheckedChange={(checked) =>
                                updateEntry(entry.studentId, 'isAbsent', checked)
                              }
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {entry.isAbsent ? (
                              <Badge variant="secondary">Absent</Badge>
                            ) : isPassed ? (
                              <CheckCircle className="h-5 w-5 text-success mx-auto" />
                            ) : isFailed ? (
                              <XCircle className="h-5 w-5 text-error mx-auto" />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="text"
                              value={entry.remarks}
                              onChange={(e) =>
                                updateEntry(entry.studentId, 'remarks', e.target.value)
                              }
                              placeholder="Optional remarks"
                              className="w-full"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Save Button */}
              <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  {hasUnsavedChanges && (
                    <span className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-4 w-4" />
                      You have unsaved changes
                    </span>
                  )}
                </div>
                <Button
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" />}
                  onClick={handleSave}
                  disabled={!canSave}
                  loading={bulkEntry.isPending}
                >
                  Save Grades
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Select filters to start entering grades</p>
            <p className="text-sm mt-1">
              Choose an academic year, exam, class, and subject to view students.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Alert variant="warning" title="Unsaved Changes">
          You have unsaved changes. Make sure to save before leaving this page.
        </Alert>
      )}
    </div>
  );
}
