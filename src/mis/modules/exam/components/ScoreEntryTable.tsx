import { useState, useEffect, useMemo } from 'react';
import { Save, AlertCircle, Users, Pencil } from 'lucide-react';
import { Button, Input, Avatar, Checkbox } from '@mis-components/ui';
import type { ClassSubjectScore, ExamMaxMarks, BulkScoreSaveInput } from '../types';

// Grade color configuration
const GRADE_CONFIG = {
  'A+': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  'A': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  'B': { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  'C': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  'D': { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  'F': { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
  'Absent': { bg: 'bg-gray-100', text: 'text-gray-500', border: 'border-gray-200' },
};

interface ScoreEntryTableProps {
  scores: ClassSubjectScore[];
  maxMarks: ExamMaxMarks;
  onSave: (scores: BulkScoreSaveInput[]) => void;
  isSaving: boolean;
}

interface ScoreRow {
  student_id: number;
  student_name: string;
  student_id_number: string;
  activity_marks: string;
  assignment_marks: string;
  exam_marks: string;
  is_absent: boolean;
  remarks: string;
  total: number;
  percentage: number;
  hasChanges: boolean;
}

export default function ScoreEntryTable({
  scores,
  maxMarks,
  onSave,
  isSaving,
}: ScoreEntryTableProps) {
  const [rows, setRows] = useState<ScoreRow[]>([]);

  // Initialize rows from scores
  useEffect(() => {
    console.log("SCORES: ", scores);
    const initialRows = scores.map((score) => ({
      student_id: score.student_id,
      student_name: score.student_name,
      student_id_number: score.student_id_number,
      activity_marks: score.activity_marks?.toString() || '',
      assignment_marks: score.assignment_marks?.toString() || '',
      exam_marks: score.exam_marks?.toString() || '',
      is_absent: score.is_absent,
      remarks: score.remarks || '',
      total: score.total,
      percentage: score.percentage || 0,
      hasChanges: false,
    }));
    setRows(initialRows);
  }, [scores]);

  // Calculate totals and check for changes
  const updateRow = (index: number, field: keyof ScoreRow, value: string | boolean) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      const row = { ...newRows[index] };

      if (field === 'is_absent') {
        row.is_absent = value as boolean;
        if (row.is_absent) {
          row.activity_marks = '';
          row.assignment_marks = '';
          row.exam_marks = '';
        }
      } else if (field === 'activity_marks' || field === 'assignment_marks' || field === 'exam_marks') {
        const numValue = value as string;
        const maxValue =
          field === 'activity_marks'
            ? maxMarks.activity
            : field === 'assignment_marks'
            ? maxMarks.assignment
            : maxMarks.exam;

        // Validate numeric input
        if (numValue === '' || (!isNaN(parseFloat(numValue)) && parseFloat(numValue) >= 0 && parseFloat(numValue) <= maxValue)) {
          (row as any)[field] = numValue;
        }
      } else if (field === 'remarks') {
        row.remarks = value as string;
      }

      // Calculate new total
      const activity = parseFloat(row.activity_marks) || 0;
      const assignment = parseFloat(row.assignment_marks) || 0;
      const exam = parseFloat(row.exam_marks) || 0;
      row.total = activity + assignment + exam;
      row.percentage = maxMarks.total > 0 ? Math.round((row.total / maxMarks.total) * 100) : 0;

      // Check if changed from original
      const originalScore = scores.find((s) => s.student_id === row.student_id);
      row.hasChanges =
        row.activity_marks !== (originalScore?.activity_marks?.toString() || '') ||
        row.assignment_marks !== (originalScore?.assignment_marks?.toString() || '') ||
        row.exam_marks !== (originalScore?.exam_marks?.toString() || '') ||
        row.is_absent !== (originalScore?.is_absent || false);

      newRows[index] = row;
      return newRows;
    });
  };

  const hasAnyChanges = useMemo(() => rows.some((row) => row.hasChanges), [rows]);

  const handleSave = () => {
    const changedScores: BulkScoreSaveInput[] = rows
      .filter((row) => row.hasChanges)
      .map((row) => ({
        student_id: row.student_id,
        activity_marks: parseFloat(row.activity_marks) || 0,
        assignment_marks: parseFloat(row.assignment_marks) || 0,
        exam_marks: parseFloat(row.exam_marks) || 0,
        is_absent: row.is_absent,
        remarks: row.remarks || undefined,
      }));

    if (changedScores.length > 0) {
      onSave(changedScores);
    }
  };

  const getGradeInfo = (percentage: number, isAbsent: boolean): { grade: string; config: typeof GRADE_CONFIG['A+'] } => {
    if (isAbsent) return { grade: 'Absent', config: GRADE_CONFIG['Absent'] };
    if (percentage >= 90) return { grade: 'A+', config: GRADE_CONFIG['A+'] };
    if (percentage >= 80) return { grade: 'A', config: GRADE_CONFIG['A'] };
    if (percentage >= 70) return { grade: 'B', config: GRADE_CONFIG['B'] };
    if (percentage >= 60) return { grade: 'C', config: GRADE_CONFIG['C'] };
    if (percentage >= 50) return { grade: 'D', config: GRADE_CONFIG['D'] };
    return { grade: 'F', config: GRADE_CONFIG['F'] };
  };

  const changedCount = rows.filter((r) => r.hasChanges).length;

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{rows.length} Students</span>
          </div>
          {changedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-warning-soft)] border border-[var(--color-warning)]/20">
              <Pencil className="h-3.5 w-3.5 text-[var(--color-warning)]" />
              <span className="text-sm font-medium text-[var(--color-warning)]">
                {changedCount} unsaved {changedCount === 1 ? 'change' : 'changes'}
              </span>
            </div>
          )}
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
          disabled={!hasAnyChanges}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Scores
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">
              <th className="p-4 text-left text-sm font-semibold text-white">
                Student
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-24">
                <span>Activity</span>
                <span className="block text-xs font-normal text-white/70 mt-0.5">
                  Max: {maxMarks.activity}
                </span>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-24">
                <span>Assignment</span>
                <span className="block text-xs font-normal text-white/70 mt-0.5">
                  Max: {maxMarks.assignment}
                </span>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-24">
                <span>Exam</span>
                <span className="block text-xs font-normal text-white/70 mt-0.5">
                  Max: {maxMarks.exam}
                </span>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-24">
                <span>Total</span>
                <span className="block text-xs font-normal text-white/70 mt-0.5">
                  Max: {maxMarks.total}
                </span>
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-20">
                Grade
              </th>
              <th className="p-4 text-center text-sm font-semibold text-white w-20">
                Absent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((row, index) => {
              const gradeInfo = getGradeInfo(row.percentage, row.is_absent);
              const isEvenRow = index % 2 === 0;
              return (
                <tr
                  key={row.student_id}
                  className={`
                    transition-colors duration-150
                    ${isEvenRow ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-card)]'}
                    ${row.hasChanges ? 'bg-[var(--color-warning-soft)]/30' : ''}
                    hover:bg-[var(--color-surface-hover)]
                  `}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={row.student_name} size="sm" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[var(--color-text-primary)] truncate">
                            {row.student_name}
                          </p>
                          {row.hasChanges && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--color-warning-soft)]">
                              <AlertCircle className="h-3 w-3 text-[var(--color-warning)]" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] font-mono">
                          {row.student_id_number}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      value={row.activity_marks}
                      onChange={(e) => updateRow(index, 'activity_marks', e.target.value)}
                      disabled={row.is_absent}
                      className={`text-center ${row.is_absent ? 'opacity-50' : ''}`}
                      min={0}
                      max={maxMarks.activity}
                      step={0.5}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      value={row.assignment_marks}
                      onChange={(e) => updateRow(index, 'assignment_marks', e.target.value)}
                      disabled={row.is_absent}
                      className={`text-center ${row.is_absent ? 'opacity-50' : ''}`}
                      min={0}
                      max={maxMarks.assignment}
                      step={0.5}
                    />
                  </td>
                  <td className="p-3">
                    <Input
                      type="number"
                      value={row.exam_marks}
                      onChange={(e) => updateRow(index, 'exam_marks', e.target.value)}
                      disabled={row.is_absent}
                      className={`text-center ${row.is_absent ? 'opacity-50' : ''}`}
                      min={0}
                      max={maxMarks.exam}
                      step={0.5}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-[var(--color-text-primary)]">
                        {row.total}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {row.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <span
                        className={`
                          inline-flex items-center justify-center
                          px-3 py-1.5 rounded-lg text-sm font-semibold
                          border
                          ${gradeInfo.config.bg} ${gradeInfo.config.text} ${gradeInfo.config.border}
                        `}
                      >
                        {gradeInfo.grade}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={row.is_absent}
                        onChange={(e) => updateRow(index, 'is_absent', e.target.checked)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-info-soft)] mb-4">
            <Users className="h-8 w-8 text-[var(--color-primary)]" />
          </div>
          <p className="text-[var(--color-text-secondary)]">No students enrolled in this class.</p>
        </div>
      )}
    </div>
  );
}
