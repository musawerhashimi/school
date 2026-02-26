import {
  Calendar,
  Users,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@mis-components/ui';
import type { ClassExamInfo, ExamApiResponse } from '../../types';
import type { SubjectApiResponse } from '../../../reference/types';

interface OverviewTabProps {
  classInfo: ClassExamInfo;
  midtermExam: ExamApiResponse | null;
  finalExam: ExamApiResponse | null;
  subjects: SubjectApiResponse[];
  studentsCount: number;
  onViewSchedule: () => void;
  onViewSubjects: () => void;
  onViewReports: () => void;
}

export default function OverviewTab({
  classInfo,
  midtermExam,
  finalExam,
  subjects,
  studentsCount,
  onViewSchedule,
  onViewSubjects,
  onViewReports,
}: OverviewTabProps) {
  const getExamStatusBadge = (exam: ExamApiResponse | null) => {
    if (!exam) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Not Set
        </Badge>
      );
    }
    switch (exam.status) {
      case 'scheduled':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Scheduled
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{exam.status_display}</Badge>;
    }
  };

  const calculateProgress = (exam: ExamApiResponse | null) => {
    if (!exam) return 0;
    if (exam.status === 'completed') return 100;
    if (exam.status === 'cancelled' || exam.status === 'draft') return 0;

    // Calculate based on grades entered vs expected
    const expectedGrades = studentsCount * subjects.length;
    if (expectedGrades === 0) return 0;
    return Math.round((exam.grade_count / expectedGrades) * 100);
  };

  const midtermProgress = calculateProgress(midtermExam);
  const finalProgress = calculateProgress(finalExam);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Exam Status */}
      <div className="lg:col-span-2 space-y-6">
        {/* Midterm Exam Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Midterm Exam
              </h3>
              {getExamStatusBadge(midtermExam)}
            </div>

            {midtermExam ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{midtermExam.start_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{midtermExam.end_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Marks</p>
                    <p className="font-medium">{midtermExam.total_marks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pass Marks</p>
                    <p className="font-medium">{midtermExam.pass_marks}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Grade Entry Progress</span>
                    <span className="text-sm font-medium">{midtermProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${midtermProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {midtermExam.grade_count} of {studentsCount * subjects.length} grades entered
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onViewSchedule}>
                    View Schedule
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={onViewSubjects}>
                    Enter Grades
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No midterm exam scheduled for this class</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Final Exam Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Final Exam
              </h3>
              {getExamStatusBadge(finalExam)}
            </div>

            {finalExam ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">{finalExam.start_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{finalExam.end_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Marks</p>
                    <p className="font-medium">{finalExam.total_marks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pass Marks</p>
                    <p className="font-medium">{finalExam.pass_marks}</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Grade Entry Progress</span>
                    <span className="text-sm font-medium">{finalProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${finalProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {finalExam.grade_count} of {studentsCount * subjects.length} grades entered
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onViewSchedule}>
                    View Schedule
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={onViewSubjects}>
                    Enter Grades
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No final exam scheduled for this class</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={onViewSchedule}
                className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Schedule</p>
                  <p className="text-sm text-gray-500">Exam timetable</p>
                </div>
              </button>

              <button
                onClick={onViewSubjects}
                className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Enter Scores</p>
                  <p className="text-sm text-gray-500">By subject</p>
                </div>
              </button>

              <button
                onClick={onViewReports}
                className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-500">Student results</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Stats */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Class Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Students</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{studentsCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-green-600" />
                  </div>
                  <span>Subjects</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{subjects.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <span>Schedules</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">{classInfo.schedule_count}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  <span>Grades</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">{classInfo.grades_entered_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects List */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Subjects</h3>
              <Button variant="ghost" size="sm" onClick={onViewSubjects}>
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {subjects.length > 0 ? (
              <div className="space-y-2">
                {subjects.slice(0, 5).map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{subject.name}</p>
                      <p className="text-xs text-gray-500">{subject.code}</p>
                    </div>
                  </div>
                ))}
                {subjects.length > 5 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    +{subjects.length - 5} more subjects
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <BookOpen className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>No subjects assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
