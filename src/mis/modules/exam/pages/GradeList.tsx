import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Download, Eye, Trash2 } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Select,
  Badge,
  DataTable,
  Modal,
  Alert,
  Spinner,
} from '@mis-components/ui';
import { useGrades, useDeleteGrade } from '../hooks/useGrades';
import { useExam } from '../hooks/useExams';
import { useSubjects } from '../../academic/hooks/useSubjects';
import { useClassInstances } from '../../academic/hooks/useClassInstances';
import type { GradeApiResponse, GradeFilters } from '../types';

export default function GradeList() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<GradeFilters>({
    exam: Number(examId),
    subject: 0,
    class_instance: 0,
    is_pass: undefined,
    is_absent: undefined,
    grade_letter: undefined,
    search: '',
    page: 1,
    page_size: 10,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<GradeApiResponse | null>(null);

  const { data: gradesData, isLoading, isError, error } = useGrades(filters);
  const { data: examData } = useExam(Number(examId));
  const { data: subjectsData } = useSubjects({});
  const { data: classInstancesData } = useClassInstances({});

  const deleteGrade = useDeleteGrade();

  const exam = examData;
  const subjects = subjectsData?.results || [];
  const classInstances = classInstancesData?.results || [];
  const grades = gradesData?.results || [];

  const handleFilterChange = (key: keyof GradeFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handleDeleteClick = (grade: GradeApiResponse) => {
    setGradeToDelete(grade);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (gradeToDelete) {
      deleteGrade.mutate(gradeToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setGradeToDelete(null);
        },
      });
    }
  };

  const handleViewGrade = (grade: GradeApiResponse) => {
    // Navigate to grade detail or edit page
    console.log('View grade:', grade);
  };

  const columns = [
    {
      key: 'student_name',
      header: 'Student',
      label: 'Student',
      sortable: true,
      render: (row: GradeApiResponse) => (
        <div>
          <div className="font-medium">{row.student_name}</div>
          <div className="text-sm text-text-secondary">{row.student_id_number}</div>
        </div>
      ),
    },
    {
      key: 'subject_name',
      header: 'Subject',
      label: 'Subject',
      sortable: true,
      render: (row: GradeApiResponse) => (
        <div>
          <div className="font-medium">{row.subject_name}</div>
          <div className="text-sm text-text-secondary">{row.subject_code}</div>
        </div>
      ),
    },
    {
      key: 'marks_obtained',
      header: 'Marks',
      label: 'Marks',
      sortable: true,
      render: (row: GradeApiResponse) => (
        <div>
          <div className="font-medium">{row.marks_obtained}/{row.total_marks}</div>
          <div className="text-sm text-text-secondary">
            {row.percentage}%
            {row.is_absent && <span className="ml-2 text-warning">Absent</span>}
          </div>
        </div>
      ),
    },
    {
      key: 'grade_letter',
      header: 'Grade',
      label: 'Grade',
      sortable: true,
      render: (row: GradeApiResponse) => {
        const variant = row.is_pass ? 'success' : 'danger';
        return <Badge variant={variant}>{row.grade_letter}</Badge>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      label: 'Status',
      sortable: true,
      render: (row: GradeApiResponse) => {
        if (row.is_absent) {
          return <Badge variant="warning">Absent</Badge>;
        }
        return <Badge variant={row.is_pass ? 'success' : 'danger'}>
          {row.is_pass ? 'Pass' : 'Fail'}
        </Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      label: 'Actions',
      sortable: false,
      render: (row: GradeApiResponse) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="w-4 h-4" />}
            onClick={() => handleViewGrade(row)}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDeleteClick(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grades"
        subtitle={exam ? `Grades for ${exam.name}` : 'View and manage grades'}
        actions={[
          {
            label: 'Back to Exam',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate(`/mis/exams/${examId}`),
            variant: 'outline',
          },
          {
            label: 'Download Report',
            icon: <Download className="h-4 w-4" />,
            onClick: () => console.log('Download grades report'),
            variant: 'outline',
          },
        ]}
      />

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search students..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={String(filters.subject)}
              onChange={(e) => handleFilterChange('subject', Number(e.target.value))}
              options={[
                { label: 'All Subjects', value: '0' },
                ...subjects.map((subject) => ({
                  label: subject.name,
                  value: String(subject.id),
                })),
              ]}
            />

            <Select
              value={String(filters.class_instance)}
              onChange={(e) => handleFilterChange('class_instance', Number(e.target.value))}
              options={[
                { label: 'All Classes', value: '0' },
                ...classInstances.map((cls) => ({
                  label: cls.name,
                  value: String(cls.id),
                })),
              ]}
            />

            <Select
              value={filters.is_pass === undefined ? '' : String(filters.is_pass)}
              onChange={(e) => handleFilterChange('is_pass', e.target.value === 'true')}
              options={[
                { label: 'All Status', value: '' },
                { label: 'Pass', value: 'true' },
                { label: 'Fail', value: 'false' },
              ]}
            />

            <Select
              value={filters.is_absent === undefined ? '' : String(filters.is_absent)}
              onChange={(e) => handleFilterChange('is_absent', e.target.value === 'true')}
              options={[
                { label: 'All Present/Absent', value: '' },
                { label: 'Present', value: 'false' },
                { label: 'Absent', value: 'true' },
              ]}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isError ? (
            <Alert variant="error" title="Error Loading Grades">
              {error instanceof Error ? error.message : 'Failed to load grades'}
            </Alert>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : grades.length > 0 ? (
            <DataTable
              columns={columns}
              data={grades}
              searchable={false}
              emptyMessage="No grades found"
            />
          ) : (
            <div className="text-center py-8 text-text-secondary">
              No grades have been entered for this exam yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Grade"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-text-secondary">
            Are you sure you want to delete this grade? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}
