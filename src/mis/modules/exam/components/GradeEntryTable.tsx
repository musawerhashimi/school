import React, { useState, useEffect } from 'react';
import { DataTable } from '@mis-components/ui';
import { Save } from 'lucide-react';
import { useBulkGradeEntry } from '../hooks/useGrades';
import type { GradeEntryRow, BulkGradeCreateData } from '../types';

interface GradeEntryTableProps {
  students: GradeEntryRow[];
  examId: number;
  classInstanceId: number;
  subjectId: number;
  onSuccess?: () => void;
}

export const GradeEntryTable: React.FC<GradeEntryTableProps> = ({
  students,
  examId,
  classInstanceId,
  subjectId,
  onSuccess,
}) => {
  const [grades, setGrades] = useState<GradeEntryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bulkGradeEntry = useBulkGradeEntry();

  useEffect(() => {
    setGrades(students);
  }, [students]);

  const handleMarksChange = (studentId: number, marks: string) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.studentId === studentId
          ? { ...grade, marksObtained: marks }
          : grade
      )
    );
  };

  const handleAbsentChange = (studentId: number, isAbsent: boolean) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.studentId === studentId
          ? { ...grade, isAbsent, marksObtained: isAbsent ? '' : grade.marksObtained }
          : grade
      )
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) =>
        grade.studentId === studentId
          ? { ...grade, remarks }
          : grade
      )
    );
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Prepare data for bulk entry
      const bulkGradeData: BulkGradeCreateData = {
        exam: examId,
        subject: subjectId,
        class_instance: classInstanceId,
        total_marks: 100, // Default to 100, should be dynamic based on exam type
        grades: grades.map((grade) => ({
          student_id: grade.studentId,
          marks_obtained: grade.isAbsent ? 0 : parseFloat(grade.marksObtained) || 0,
          is_absent: grade.isAbsent,
          remarks: grade.remarks || undefined,
        })),
      };

      await bulkGradeEntry.mutateAsync(bulkGradeData);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save grades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'studentIdNumber',
      header: 'Student ID',
      label: 'Student ID',
      sortable: true,
    },
    {
      key: 'studentName',
      header: 'Student Name',
      label: 'Student Name',
      sortable: true,
    },
    {
      key: 'marksObtained',
      header: 'Marks Obtained',
      label: 'Marks Obtained',
      sortable: false,
      render: (row: GradeEntryRow) => (
        <input
          type="number"
          value={row.marksObtained}
          onChange={(e) => handleMarksChange(row.studentId, e.target.value)}
          disabled={row.isAbsent}
          placeholder="0-100"
          min={0}
          max={100}
          className="w-24 px-2 py-1 border rounded"
        />
      ),
    },
    {
      key: 'isAbsent',
      header: 'Status',
      label: 'Status',
      sortable: false,
      render: (row: GradeEntryRow) => (
        <select
          value={row.isAbsent ? 'absent' : 'present'}
          onChange={(e) => handleAbsentChange(row.studentId, e.target.value === 'absent')}
          className="px-2 py-1 border rounded"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      ),
    },
    {
      key: 'remarks',
      header: 'Remarks',
      label: 'Remarks',
      sortable: false,
      render: (row: GradeEntryRow) => (
        <input
          type="text"
          value={row.remarks}
          onChange={(e) => handleRemarksChange(row.studentId, e.target.value)}
          placeholder="Optional remarks"
          className="w-40 px-2 py-1 border rounded"
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={grades}
        loading={isLoading}
        searchable={true}
        searchKeys={['studentIdNumber', 'studentName']}
        searchPlaceholder="Search students..."
        pagination={false}
        emptyMessage="No students to grade"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          Save Grades
        </button>
      </div>
    </div>
  );
};

export default GradeEntryTable;
