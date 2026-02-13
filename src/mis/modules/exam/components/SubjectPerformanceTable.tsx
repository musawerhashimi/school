import { BookOpen } from 'lucide-react';
import { Card, CardContent, Badge } from '@mis-components/ui';
import type { SubjectPerformance } from '../types';

interface SubjectPerformanceTableProps {
  subjects: SubjectPerformance[];
}

export default function SubjectPerformanceTable({ subjects }: SubjectPerformanceTableProps) {
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return <Badge variant="success">{grade}</Badge>;
      case 'A-':
      case 'B+':
      case 'B':
        return <Badge variant="info">{grade}</Badge>;
      case 'B-':
      case 'C+':
      case 'C':
        return <Badge variant="warning">{grade}</Badge>;
      default:
        return <Badge variant="danger">{grade}</Badge>;
    }
  };

  const getScoreBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (subjects.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Subject Data</h4>
          <p className="text-gray-500">No subject performance data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          Subject Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                  Subject
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                  <div>Midterm</div>
                  <div className="text-xs font-normal text-gray-500">(40 marks)</div>
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                  <div>Final</div>
                  <div className="text-xs font-normal text-gray-500">(60 marks)</div>
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200">
                  <div>Total</div>
                  <div className="text-xs font-normal text-gray-500">(100 marks)</div>
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200 w-20">
                  %
                </th>
                <th className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-200 w-20">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-900">{subject.subject}</p>
                      <p className="text-xs text-gray-500">{subject.teacher}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {subject.midterm.total}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span title="Activity">A:{subject.midterm.activity}</span>
                        {' | '}
                        <span title="Assignment">W:{subject.midterm.assignment}</span>
                        {' | '}
                        <span title="Exam">E:{subject.midterm.exam}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">
                        {subject.final.total}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span title="Activity">A:{subject.final.activity}</span>
                        {' | '}
                        <span title="Assignment">W:{subject.final.assignment}</span>
                        {' | '}
                        <span title="Exam">E:{subject.final.exam}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-lg font-bold text-gray-900">{subject.total}</span>
                  </td>
                  <td className="p-3">
                    <div className="text-center">
                      <span className="font-semibold text-gray-900">{subject.percentage}%</span>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${getScoreBarColor(subject.percentage)}`}
                          style={{ width: `${Math.min(subject.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {getGradeBadge(subject.grade)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold">
                <td className="p-3 text-gray-700">Average</td>
                <td className="p-3 text-center text-gray-700">
                  {subjects.length > 0
                    ? (subjects.reduce((sum, s) => sum + s.midterm.total, 0) / subjects.length).toFixed(1)
                    : '-'}
                </td>
                <td className="p-3 text-center text-gray-700">
                  {subjects.length > 0
                    ? (subjects.reduce((sum, s) => sum + s.final.total, 0) / subjects.length).toFixed(1)
                    : '-'}
                </td>
                <td className="p-3 text-center text-gray-700">
                  {subjects.length > 0
                    ? (subjects.reduce((sum, s) => sum + s.total, 0) / subjects.length).toFixed(1)
                    : '-'}
                </td>
                <td className="p-3 text-center text-gray-700">
                  {subjects.length > 0
                    ? (subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length).toFixed(1)
                    : '-'}%
                </td>
                <td className="p-3"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            <strong>A</strong> = Activity Marks | <strong>W</strong> = Assignment/Homework Marks | <strong>E</strong> = Exam Marks
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
