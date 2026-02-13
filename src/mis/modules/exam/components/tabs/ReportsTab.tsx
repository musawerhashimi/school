import { useState } from 'react';
import { FileText, Users, ChevronRight, Search, ArrowLeft, GraduationCap, TrendingUp, Award } from 'lucide-react';
import {
  Card,
  CardContent,
  DataTable,
  Avatar,
  Badge,
  Button,
  Input,
  Spinner,
  type Column,
} from '@mis-components/ui';
import { useStudentExamReport } from '../../hooks/useClassExams';
import GPASummary from '../GPASummary';
import SubjectPerformanceTable, { type Grade } from '../../../students/components/SubjectPerformanceTable';
import type { ClassStudent, SubjectPerformance } from '../../types';

// Map SubjectPerformance from exam module to Grade format expected by SubjectPerformanceTable
function mapSubjectPerformanceToGrade(subject: SubjectPerformance): Grade {
  return {
    subject: subject.subject,
    teacher: subject.teacher,
    midterm: {
      homework: subject.midterm.assignment,
      classActivity: subject.midterm.activity,
      exam: subject.midterm.exam,
      total: subject.midterm.total,
    },
    annual: {
      homework: subject.final.assignment,
      classActivity: subject.final.activity,
      exam: subject.final.exam,
      total: subject.final.total,
    },
    total: subject.total,
    grade: subject.grade,
    percentage: subject.percentage,
  };
}

interface ReportsTabProps {
  classId: number;
  students: ClassStudent[];
  className: string;
}

export default function ReportsTab({ classId, students }: ReportsTabProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: reportData,
    isLoading: isLoadingReport,
  } = useStudentExamReport(classId, selectedStudentId || 0);

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<ClassStudent>[] = [
    {
      key: 'student_id',
      label: 'ID',
      header: 'ID',
      render: (row) => (
        <span className="font-mono text-xs bg-[var(--color-surface)] px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)]">
          {row.student_id}
        </span>
      ),
    },
    {
      key: 'full_name',
      label: 'Student',
      header: 'Student',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} src={row.photo_url} size="sm" />
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">{row.full_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'gender',
      label: 'Gender',
      header: 'Gender',
      render: (row) => (
        <Badge variant={row.gender === 'male' ? 'info' : 'secondary'} className="capitalize">
          {row.gender}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      header: '',
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStudentId(row.id);
          }}
          className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:bg-[var(--color-info-soft)]"
        >
          View Report
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      ),
    },
  ];

  // If a student is selected, show their report
  if (selectedStudentId) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedStudentId(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Students List</span>
        </button>

        {isLoadingReport ? (
          <Card className="border-[var(--color-border)]">
            <CardContent className="p-16">
              <div className="flex flex-col items-center justify-center gap-4">
                <Spinner size="lg" />
                <p className="text-[var(--color-text-secondary)]">Loading student report...</p>
              </div>
            </CardContent>
          </Card>
        ) : reportData ? (
          <>
            {/* Student Header Card */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Avatar
                      name={reportData.student_name}
                      src={reportData.student_photo}
                      size="lg"
                      className="ring-4 ring-white/30"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full">
                      <GraduationCap className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {reportData.student_name}
                    </h2>
                    <p className="text-white/80 mt-1">
                      <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-sm">{reportData.student_id_number}</span>
                      <span className="mx-2">•</span>
                      {reportData.class_name}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="h-4 w-4 text-amber-300" />
                      <span className="text-xs text-white/70">GPA</span>
                    </div>
                    <p className="text-2xl font-bold">{reportData.gpa.toFixed(2)}</p>
                  </div>
                  <div className="text-center px-4 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-emerald-300" />
                      <span className="text-xs text-white/70">Average</span>
                    </div>
                    <p className="text-2xl font-bold">{reportData.average_score.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* GPA Summary */}
            <GPASummary
              gpa={reportData.gpa}
              averageScore={reportData.average_score}
              totalSubjects={reportData.total_subjects}
            />

            {/* Subject Performance */}
            <SubjectPerformanceTable grades={reportData.subjects.map(mapSubjectPerformanceToGrade)} />
          </>
        ) : (
          <Card className="border-[var(--color-border)]">
            <CardContent className="p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-warning-soft)] mb-6">
                <FileText className="h-10 w-10 text-[var(--color-warning)]" />
              </div>
              <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">No Report Available</h4>
              <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
                This student doesn't have any exam scores yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Show student list
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Student Reports</h2>
              <p className="text-white/80 text-sm">
                View detailed exam reports for each student
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium">{students.length} Students</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-[var(--color-border)]">
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <p className="text-[var(--color-text-secondary)]">
              Click on a student row to view their detailed exam report
            </p>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)]" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--color-surface)] border-[var(--color-border)] focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {students.length > 0 ? (
            <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredStudents}
                searchable={false}
                onRowClick={(row) => setSelectedStudentId(row.id)}
                emptyMessage="No students match your search."
                getRowKey={(row) => String(row.id)}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-info-soft)] mb-6">
                <Users className="h-10 w-10 text-[var(--color-primary)]" />
              </div>
              <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">No Students Enrolled</h4>
              <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
                No students are enrolled in this class yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend/Help */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-1 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-info)]" />
            <span>Male</span>
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-secondary)]" />
            <span>Female</span>
          </span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Click any row to view the student's detailed exam report
        </p>
      </div>
    </div>
  );
}
