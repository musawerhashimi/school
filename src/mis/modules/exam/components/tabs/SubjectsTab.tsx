import { Card, CardContent, Select, Spinner } from '@mis-components/ui';
import { AlertCircle, BookOpen, ChevronRight, GraduationCap, ClipboardList, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SubjectApiResponse } from '../../../reference/types';
import { useSaveSubjectScores, useSubjectScores } from '../../hooks/useClassExams';
import type { BulkScoreSaveInput, ExamApiResponse, ExamType } from '../../types';
import ScoreEntryTable from '../ScoreEntryTable';

// Subject color palette for visual distinction
const SUBJECT_COLORS = [
  { bg: 'bg-indigo-50', active: 'bg-indigo-100', icon: 'bg-indigo-600', border: 'border-indigo-200', text: 'text-indigo-600' },
  { bg: 'bg-cyan-50', active: 'bg-cyan-100', icon: 'bg-cyan-600', border: 'border-cyan-200', text: 'text-cyan-600' },
  { bg: 'bg-amber-50', active: 'bg-amber-100', icon: 'bg-amber-600', border: 'border-amber-200', text: 'text-amber-600' },
  { bg: 'bg-emerald-50', active: 'bg-emerald-100', icon: 'bg-emerald-600', border: 'border-emerald-200', text: 'text-emerald-600' },
  { bg: 'bg-violet-50', active: 'bg-violet-100', icon: 'bg-violet-600', border: 'border-violet-200', text: 'text-violet-600' },
  { bg: 'bg-rose-50', active: 'bg-rose-100', icon: 'bg-rose-600', border: 'border-rose-200', text: 'text-rose-600' },
];

const getSubjectColor = (index: number) => SUBJECT_COLORS[index % SUBJECT_COLORS.length];

interface SubjectsTabProps {
  classId: number;
  subjects: SubjectApiResponse[];
  midtermExam: ExamApiResponse | null;
  finalExam: ExamApiResponse | null;
}

export default function SubjectsTab({
  classId,
  subjects,
  midtermExam,
  finalExam,
}: SubjectsTabProps) {
  const [examType, setExamType] = useState<ExamType>('midterm');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(
    subjects.length > 0 ? subjects[0].id : null
  );

  // Update selected subject when subjects load
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  const { data: scoresData, isLoading, isError, error, refetch } = useSubjectScores(
    classId,
    selectedSubjectId || 0,
    examType
  );

  const saveScores = useSaveSubjectScores();

  const currentExam = examType === 'midterm' ? midtermExam : finalExam;
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleSaveScores = (scores: BulkScoreSaveInput[]) => {
    if (!selectedSubjectId) return;

    saveScores.mutate(
      {
        classId,
        subjectId: selectedSubjectId,
        examType,
        scores,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  if (subjects.length === 0) {
    return (
      <Card className="border-[var(--color-border)]">
        <CardContent className="p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-info-soft)] mb-6">
            <BookOpen className="h-10 w-10 text-[var(--color-primary)]" />
          </div>
          <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">No Subjects Assigned</h4>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            This class doesn't have any subjects assigned. Please assign subjects to the class level first.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentExam) {
    return (
      <Card className="border-[var(--color-border)]">
        <CardContent className="p-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-warning-soft)] mb-6">
            <AlertCircle className="h-10 w-10 text-[var(--color-warning)]" />
          </div>
          <h4 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
            No {examType === 'midterm' ? 'Midterm' : 'Final'} Exam Scheduled
          </h4>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            Please schedule a {examType} exam first before entering scores.
          </p>
          <Select
            value={examType}
            onChange={(e) => setExamType(e.target.value as ExamType)}
            options={[
              { label: 'Midterm Exam', value: 'midterm' },
              { label: 'Final Exam', value: 'final' },
            ]}
            className="max-w-xs mx-auto"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Exam Type Selector */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Score Entry</h2>
              <p className="text-white/80 text-sm">
                Enter and manage exam scores for each subject
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium">{subjects.length} Subjects</span>
            </div>
            <Select
              value={examType}
              onChange={(e) => setExamType(e.target.value as ExamType)}
              options={[
                { label: 'Midterm', value: 'midterm', disabled: !midtermExam },
                { label: 'Final', value: 'final', disabled: !finalExam },
              ]}
              className="w-32 bg-white/10 border-white/20 text-white [&>option]:text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Subject List */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-[var(--color-border)] overflow-hidden">
            <div className="p-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <h3 className="font-semibold text-[var(--color-text-primary)]">Select Subject</h3>
            </div>
            <CardContent className="p-3">
              {/* Subject List */}
              <div className="space-y-2">
                {subjects.map((subject, index) => {
                  const colors = getSubjectColor(index);
                  const isSelected = selectedSubjectId === subject.id;
                  return (
                    <button
                      key={subject.id}
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left
                        border-2
                        ${isSelected
                          ? `${colors.active} ${colors.border} shadow-sm`
                          : `bg-[var(--color-surface)] border-transparent hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border)]`
                        }
                      `}
                    >
                      <div
                        className={`
                          w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                          ${isSelected ? `${colors.icon} text-white shadow-md` : 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'}
                        `}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isSelected ? colors.text : 'text-[var(--color-text-primary)]'}`}>
                          {subject.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{subject.code}</p>
                      </div>
                      {isSelected && (
                        <ChevronRight className={`h-5 w-5 ${colors.text} flex-shrink-0`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Score Entry Table */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-[var(--color-border)]">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-4">
                  {selectedSubject && (
                    <div className={`p-3 rounded-xl ${getSubjectColor(subjects.findIndex(s => s.id === selectedSubjectId)).icon}`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                      {selectedSubject?.name || 'Select a Subject'}
                    </h3>
                    {selectedSubject && (
                      <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                        {selectedSubject.code} • {examType === 'midterm' ? 'Midterm' : 'Final'} Exam
                      </p>
                    )}
                  </div>
                </div>

                {scoresData && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                      <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
                      <div className="text-sm">
                        <span className="text-[var(--color-text-secondary)]">Max: </span>
                        <span className="font-semibold text-[var(--color-text-primary)]">{scoresData.max_marks.total}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="px-2 py-1 rounded bg-[var(--color-info-soft)]">Activity: {scoresData.max_marks.activity}</span>
                      <span className="px-2 py-1 rounded bg-[var(--color-success-soft)]">Assignment: {scoresData.max_marks.assignment}</span>
                      <span className="px-2 py-1 rounded bg-[var(--color-warning-soft)]">Exam: {scoresData.max_marks.exam}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Score Entry */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Spinner size="lg" />
                  <p className="text-[var(--color-text-secondary)]">Loading scores...</p>
                </div>
              ) : isError ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-error-soft)] mb-4">
                    <AlertCircle className="h-8 w-8 text-[var(--color-danger)]" />
                  </div>
                  <p className="font-semibold text-[var(--color-text-primary)] mb-2">Failed to load scores</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {error instanceof Error ? error.message : 'Unknown error'}
                  </p>
                </div>
              ) : scoresData ? (
                <ScoreEntryTable
                  scores={scoresData.scores}
                  maxMarks={scoresData.max_marks}
                  onSave={handleSaveScores}
                  isSaving={saveScores.isPending}
                />
              ) : selectedSubjectId ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <Spinner size="lg" />
                  <p className="text-[var(--color-text-secondary)]">Loading...</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-info-soft)] mb-4">
                    <BookOpen className="h-8 w-8 text-[var(--color-primary)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)]">Select a subject to view and enter scores</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Text */}
          <div className="p-5 bg-[var(--color-info-soft)] rounded-xl border border-[var(--color-primary)]/20">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[var(--color-primary)]/10">
                <AlertCircle className="h-4 w-4 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="font-semibold text-[var(--color-text-primary)] mb-2">Score Entry Guide</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--color-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    <span><strong>Midterm:</strong> Activity (2) + Assignment (2) + Exam (36) = 40</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                    <span><strong>Final:</strong> Activity (3) + Assignment (3) + Exam (54) = 60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                    <span>Click "Save Scores" after entering data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                    <span>Mark students as absent if needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
