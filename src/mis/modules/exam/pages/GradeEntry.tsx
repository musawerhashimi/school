import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Select,
  Card,
  CardContent,
} from '@mis-components/ui';
import { useSubjects } from '../../academic/hooks/useSubjects';
import { useClassInstances } from '../../academic/hooks/useClassInstances';
import { useGrades } from '../hooks/useGrades';
import { GradeEntryTable } from '../components/GradeEntryTable';
import type { GradeEntryRow } from '../types';

export default function GradeEntry() {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();

  const [subjectId, setSubjectId] = useState(0);
  const [classInstanceId, setClassInstanceId] = useState(0);

  const { data: subjectsData } = useSubjects({});
  const { data: classInstancesData } = useClassInstances({});
  const { data: studentsData } = useGrades({
    exam: Number(examId),
    subject: subjectId,
    class_instance: classInstanceId,
    is_absent: false,
  });

  const subjects = subjectsData?.results || [];
  const classInstances = classInstancesData?.results || [];
  const students = studentsData?.results || [];

  const studentRows: GradeEntryRow[] = students.map((student) => ({
    studentId: student.student,
    studentIdNumber: student.student_id_number,
    studentName: student.student_name,
    marksObtained: '',
    isAbsent: false,
    remarks: '',
    homeworkMarks: '',
    activityMarks: '',
    examMarks: '',
  }));

  const handleSuccess = () => {
    navigate(`/mis/exams/${examId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grade Entry"
        subtitle="Enter marks for students"
        actions={[
          {
            label: 'Back to Exam',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate(`/mis/exams/${examId}`),
            variant: 'outline',
          },
        ]}
      />

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Subject"
              value={String(subjectId)}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              options={[
                { label: 'Select Subject', value: '0' },
                ...subjects.map((subject) => ({
                  label: subject.name,
                  value: String(subject.id),
                })),
              ]}
              disabled={!subjectId || !classInstanceId}
            />

            <Select
              label="Class"
              value={String(classInstanceId)}
              onChange={(e) => setClassInstanceId(Number(e.target.value))}
              options={[
                { label: 'Select Class', value: '0' },
                ...classInstances.map((cls) => ({
                  label: cls.name,
                  value: String(cls.id),
                })),
              ]}
              disabled={!subjectId || !classInstanceId}
            />
          </div>

          {subjectId > 0 && classInstanceId > 0 && studentRows.length > 0 && (
            <GradeEntryTable
              students={studentRows}
              examId={Number(examId)}
              classInstanceId={classInstanceId}
              subjectId={subjectId}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
