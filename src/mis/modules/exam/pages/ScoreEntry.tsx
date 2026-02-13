import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Save, Download } from 'lucide-react';
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
import { useScores, useBulkScoreEntry } from '../hooks/useScores';
import { useExam } from '../hooks/useExams';
import { useSubjects } from '../../academic/hooks/useSubjects';
import { useClassInstances } from '../../academic/hooks/useClassInstances';
import type { ScoreApiResponse, ScoreEntryRow, ScoreFilters } from '../types';

export default function ScoreEntry() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<ScoreFilters>({
    exam: Number(examId),
    subject: 0,
    class_instance: 0,
    page: 1,
    page_size: 10,
  });

  const [scores, setScores] = useState<ScoreEntryRow[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: scoresData, isLoading, isError, error } = useScores(filters);
  const { data: examData } = useExam(Number(examId));
  const { data: subjectsData } = useSubjects({});
  const { data: classInstancesData } = useClassInstances({});

  const bulkCreateScores = useBulkScoreEntry();

  const exam = examData;
  const subjects = subjectsData?.results || [];
  const classInstances = classInstancesData?.results || [];

  useEffect(() => {
    if (scoresData?.results) {
      const scoreRows: ScoreEntryRow[] = scoresData.results.map((score: ScoreApiResponse) => ({
        studentId: score.student,
        studentIdNumber: 'N/A', // Not available in ScoreApiResponse
        studentName: score.student_name,
        homeworkMarks: score.homework_marks.toString(),
        activityMarks: score.activity_marks.toString(),
        examMarks: score.exam_marks.toString(),
        totalMarks: score.total_marks,
        existingScoreId: score.id,
      }));
      setScores(scoreRows);
    }
  }, [scoresData]);

  const handleFilterChange = (key: keyof ScoreFilters, value: string | number | boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const handleScoreChange = (studentId: number, field: keyof ScoreEntryRow, value: string) => {
    setScores((prev) =>
      prev.map((score) =>
        score.studentId === studentId ? { ...score, [field]: value } : score
      )
    );
  };

  const handleSave = async () => {
    if (!filters.subject || !filters.class_instance) {
      console.error('Subject and class instance are required');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data for bulk update
      const bulkScoreData = {
        exam: Number(examId),
        subject: filters.subject,
        class_instance: filters.class_instance,
        scores: scores.map((score) => ({
          student_id: score.studentId,
          homework_marks: parseFloat(score.homeworkMarks) || 0,
          activity_marks: parseFloat(score.activityMarks) || 0,
          exam_marks: parseFloat(score.examMarks) || 0,
        })),
      };

      await bulkCreateScores.mutateAsync(bulkScoreData);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Failed to save scores:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadReport = () => {
    console.log('Downloading score report...');
  };

  const columns = [
    {
      key: 'studentName',
      header: 'Student',
      label: 'Student',
      sortable: true,
      render: (row: ScoreEntryRow) => (
        <div>
          <div className="font-medium">{row.studentName}</div>
          <div className="text-sm text-text-secondary">{row.studentIdNumber}</div>
        </div>
      ),
    },
    {
      key: 'homeworkMarks',
      header: 'Homework',
      label: 'Homework',
      sortable: true,
      render: (row: ScoreEntryRow) => (
        <Input
          type="number"
          value={row.homeworkMarks}
          onChange={(e) => handleScoreChange(row.studentId, 'homeworkMarks', e.target.value)}
          min={0}
          max={100}
        />
      ),
    },
    {
      key: 'activityMarks',
      header: 'Activity',
      label: 'Activity',
      sortable: true,
      render: (row: ScoreEntryRow) => (
        <Input
          type="number"
          value={row.activityMarks}
          onChange={(e) => handleScoreChange(row.studentId, 'activityMarks', e.target.value)}
          min={0}
          max={100}
        />
      ),
    },
    {
      key: 'examMarks',
      header: 'Exam',
      label: 'Exam',
      sortable: true,
      render: (row: ScoreEntryRow) => (
        <Input
          type="number"
          value={row.examMarks}
          onChange={(e) => handleScoreChange(row.studentId, 'examMarks', e.target.value)}
          min={0}
          max={100}
        />
      ),
    },
    {
      key: 'totalMarks',
      header: 'Total',
      label: 'Total',
      sortable: true,
      render: (row: ScoreEntryRow) => {
        const total = parseFloat(row.homeworkMarks) + parseFloat(row.activityMarks) + parseFloat(row.examMarks);
        const percentage = (total / 300) * 100;

        return (
          <div>
            <div className="font-medium">{total.toFixed(1)}/300</div>
            <Badge 
              variant={percentage >= 90 ? 'success' : 
                      percentage >= 70 ? 'info' : 
                      percentage >= 50 ? 'warning' : 'danger'} 
              className="text-xs mt-1"
            >
              {percentage.toFixed(0)}%
            </Badge>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Score Entry"
        subtitle={exam ? `Score entry for ${exam.name}` : 'Manage score breakdowns'}
        actions={[
          {
            label: 'Back to Exam',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate(`/mis/exams/${examId}`),
            variant: 'outline',
          },
          {
            label: 'Save Scores',
            icon: <Save className="h-4 w-4" />,
            onClick: () => setShowSaveModal(true),
            variant: 'primary',
          },
          {
            label: 'Download Report',
            icon: <Download className="h-4 w-4" />,
            onClick: handleDownloadReport,
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
          </div>
        </CardHeader>

        <CardContent>
          {isError ? (
            <Alert variant="error" title="Error Loading Scores">
              {error instanceof Error ? error.message : 'Failed to load scores'}
            </Alert>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : scores.length > 0 ? (
            <DataTable
              columns={columns}
              data={scores}
              searchable={false}
              emptyMessage="No scores found"
            />
          ) : (
            <div className="text-center py-8 text-text-secondary">
              No scores have been entered for this exam yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Save Scores"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSaveModal(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" />
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-text-secondary">
            Are you sure you want to save the scores? This will update all the score entries.
          </p>
        </div>
      </Modal>
    </div>
  );
}
