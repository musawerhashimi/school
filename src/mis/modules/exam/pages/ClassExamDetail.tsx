import {
  Alert,
  Badge,
  Button,
  Spinner
} from '@mis-components/ui';
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  MapPin,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OverviewTab from '../components/tabs/OverviewTab';
import ReportsTab from '../components/tabs/ReportsTab';
import ScheduleTab from '../components/tabs/ScheduleTab';
import SubjectsTab from '../components/tabs/SubjectsTab';
import {
  useClassExams,
  useClassStudents,
  useClassSubjects,
  useExamClassDetail,
  useExamScheduleGrid,
} from '../hooks/useClassExams';
import type { ExamType } from '../types';

type TabId = 'overview' | 'schedule' | 'subjects' | 'reports';

export default function ClassExamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classId = id ? parseInt(id, 10) : 0;

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [scheduleExamType, setScheduleExamType] = useState<ExamType>('midterm');

  // React Query hooks
  const { data: classInfo, isLoading, isError, error } = useExamClassDetail(classId);
  const { data: classExams } = useClassExams(classId);
  const { data: scheduleData, isLoading: isLoadingSchedule } = useExamScheduleGrid(classId, scheduleExamType);
  const { data: subjects } = useClassSubjects(classId);
  const { data: students } = useClassStudents(classId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading class exam details...</p>
        </div>
      </div>
    );
  }

  if (isError || !classInfo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/mis/exams/classes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
        </div>
        <Alert variant="error" title="Error">
          {error instanceof Error ? error.message : 'Failed to load class details'}
        </Alert>
      </div>
    );
  }

  const getExamStatusInfo = (exam: typeof classInfo.midterm_exam) => {
    if (!exam) {
      return { variant: 'secondary' as const, icon: AlertCircle, text: 'Not Set' };
    }
    switch (exam.status) {
      case 'scheduled':
        return { variant: 'info' as const, icon: Calendar, text: 'Scheduled' };
      case 'in_progress':
        return { variant: 'warning' as const, icon: Clock, text: 'In Progress' };
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle2, text: 'Completed' };
      case 'cancelled':
        return { variant: 'danger' as const, icon: AlertCircle, text: 'Cancelled' };
      default:
        return { variant: 'secondary' as const, icon: AlertCircle, text: exam.status_display || 'Unknown' };
    }
  };

  const midtermStatus = getExamStatusInfo(classInfo.midterm_exam);
  const finalStatus = getExamStatusInfo(classInfo.final_exam);

  const totalScheduleSlots = scheduleData?.days?.reduce((sum, day) => sum + day.slots.length, 0) || 0;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'schedule' as const, label: 'Schedule', icon: CalendarDays, count: totalScheduleSlots },
    { id: 'subjects' as const, label: 'Subjects', icon: BookOpen, count: subjects?.length || 0 },
    { id: 'reports' as const, label: 'Reports', icon: FileText, count: students?.length || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-2xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(99,102,241,0.1)%22/%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/mis/exams/classes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Classes</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Class Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{classInfo.display_name}</h1>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classInfo.is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                  }`}>
                    {classInfo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {classInfo.academic_year_display} &bull; {classInfo.shift_display} Shift
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm">
                      <span className="font-semibold">{classInfo.enrolled_count}</span>
                      <span className="text-gray-500 dark:text-gray-400">/{classInfo.capacity}</span>
                    </span>
                  </div>

                  {classInfo.room_number && (
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                      <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm">{classInfo.room_number}</span>
                    </div>
                  )}

                  {classInfo.class_teacher_name && (
                    <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm">{classInfo.class_teacher_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Exam Status Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Midterm Exam Card */}
            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Midterm Exam</span>
                <Badge variant={midtermStatus.variant} className="flex items-center gap-1">
                  <midtermStatus.icon className="h-3 w-3" />
                  {midtermStatus.text}
                </Badge>
              </div>
              {classInfo.midterm_exam ? (
                <div className="space-y-1">
                  <p className="font-semibold">{classInfo.midterm_exam.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {classInfo.midterm_exam.start_date} - {classInfo.midterm_exam.end_date}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No midterm exam scheduled</p>
              )}
            </div>

            {/* Final Exam Card */}
            <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Final Exam</span>
                <Badge variant={finalStatus.variant} className="flex items-center gap-1">
                  <finalStatus.icon className="h-3 w-3" />
                  {finalStatus.text}
                </Badge>
              </div>
              {classInfo.final_exam ? (
                <div className="space-y-1">
                  <p className="font-semibold">{classInfo.final_exam.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {classInfo.final_exam.start_date} - {classInfo.final_exam.end_date}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No final exam scheduled</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          classInfo={classInfo}
          midtermExam={classExams?.midterm || null}
          finalExam={classExams?.final || null}
          subjects={subjects || []}
          studentsCount={students?.length || 0}
          onViewSchedule={() => setActiveTab('schedule')}
          onViewSubjects={() => setActiveTab('subjects')}
          onViewReports={() => setActiveTab('reports')}
        />
      )}

      {activeTab === 'schedule' && (
        <ScheduleTab
          classId={classId}
          examType={scheduleExamType}
          onExamTypeChange={setScheduleExamType}
          midtermExam={classExams?.midterm || null}
          finalExam={classExams?.final || null}
        />
      )}

      {activeTab === 'subjects' && (
        <SubjectsTab
          classId={classId}
          subjects={subjects || []}
          midtermExam={classExams?.midterm || null}
          finalExam={classExams?.final || null}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsTab
          classId={classId}
          students={students || []}
          className={classInfo.display_name}
        />
      )}
    </div>
  );
}
