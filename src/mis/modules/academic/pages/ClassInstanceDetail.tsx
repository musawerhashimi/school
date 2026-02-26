import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Edit,
  Users,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  UserPlus,
  FileText,
  BarChart3,
  CalendarDays,
  MapPin,
  Trash2,
  ClipboardList,
  Plus,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Alert,
  Spinner,
  Avatar,
  DataTable,
  Modal,
  type Column,
} from '@mis-components/ui';
import {
  useClassInstance,
  useClassInstanceStudents,
} from '../hooks/useClassInstances';
import { useWeeklySchedule, useClearClassSchedule } from '../hooks/useSchedules';
import { useClassAssignments, useCreateAssignment } from '@/mis/modules/assignment/hooks/useAssignments';
import { ASSIGNMENT_STATUS } from '@/mis/modules/assignment/constants';
import type { AssignmentListItem } from '@/mis/modules/assignment/types';
import WeeklyScheduleTable from '../components/WeeklyScheduleTable';
import ScheduleSlotModal from '../components/ScheduleSlotModal';
import type { ClassInstanceStudent, ScheduleApiResponse, DayOfWeek } from '../types';
import { format, isPast } from 'date-fns';

export default function ClassInstanceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const classId = id ? parseInt(id, 10) : 0;
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'schedule' | 'subjects' | 'assignments'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Schedule modal state
  const [selectedSlot, setSelectedSlot] = useState<ScheduleApiResponse | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSlotDay, setNewSlotDay] = useState<DayOfWeek | undefined>();
  const [newSlotPeriod, setNewSlotPeriod] = useState<number | undefined>();
  const [clearModalOpen, setClearModalOpen] = useState(false);

  // React Query hooks
  const { data: classInstance, isLoading, isError, error } = useClassInstance(classId);
  const { data: studentsData, isLoading: isLoadingStudents } = useClassInstanceStudents(classId);
  const { data: scheduleData, isLoading: isLoadingSchedule, refetch: refetchSchedule } = useWeeklySchedule(classId);
  const clearSchedule = useClearClassSchedule();
  const { data: assignments, isLoading: isLoadingAssignments } = useClassAssignments(classId);
  const createAssignment = useCreateAssignment();

  // Schedule handlers
  const handleSlotClick = (slot: ScheduleApiResponse) => {
    setSelectedSlot(slot);
  };

  const handleEmptySlotClick = (dayOfWeek: DayOfWeek, periodNumber: number) => {
    setNewSlotDay(dayOfWeek);
    setNewSlotPeriod(periodNumber);
    setCreateModalOpen(true);
  };

  const handleClearSchedule = () => {
    clearSchedule.mutate(classId, {
      onSuccess: () => {
        setClearModalOpen(false);
      },
    });
  };

  const handleSlotModalClose = () => {
    setSelectedSlot(null);
    refetchSchedule();
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setNewSlotDay(undefined);
    setNewSlotPeriod(undefined);
  };

  const handleScheduleSuccess = () => {
    refetchSchedule();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-500">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (isError || !classInstance) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/mis/academics/classes')}
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

  // Get today's schedule
  const today = new Date().getDay();
  const todayAfghan = today === 0 ? 5 : today - 1;
  const todaySchedule = scheduleData?.weekly_schedule?.find(
    (day) => day.day_of_week === todayAfghan
  )?.periods || [];

  const totalPeriods = scheduleData?.weekly_schedule?.reduce(
    (sum, day) => sum + day.periods.length,
    0
  ) || 0;

  // Student columns
  const studentColumns: Column<ClassInstanceStudent>[] = [
    {
      key: 'student_id',
      label: 'ID',
      header: 'ID',
      render: (row) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
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
            <p className="font-medium text-gray-900">{row.full_name}</p>
            <p className="text-xs text-gray-500">Roll #{row.roll_number || 'N/A'}</p>
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
      key: 'status',
      label: 'Status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status}
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
            navigate(`/mis/students/${row.id}`);
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users, count: classInstance.enrolled_count },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays, count: totalPeriods },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, count: classInstance.subjects?.length || 0 },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList, count: assignments?.length || 0 },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Hero Section - Light/Dark Mode Support */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-2xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(99,102,241,0.1)%22/%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width=%2230%22 height=%2230%22 viewBox=%220 0 30 30%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative p-6 md:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/mis/academics/classes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Classes</span>
          </button>
        
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              {/* Class Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-blue-600 dark:text-white" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{classInstance.display_name}</h1>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classInstance.is_active
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                  }`}>
                    {classInstance.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {classInstance.academic_year_display} &bull; {classInstance.shift_display} Shift
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm">
                      <span className="font-semibold">{classInstance.enrolled_count}</span>
                      <span className="text-gray-500 dark:text-gray-400">/{classInstance.capacity}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm">
                      {classInstance.room_number || 'No Room'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm">
                      {classInstance.class_teacher_name || 'No Teacher'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-white/50 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/20"
                onClick={() => navigate(`/mis/academics/classes/${classId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Enrollment Progress */}
          <div className="mt-6 bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Enrollment Progress</span>
              <span className="text-sm font-semibold">{classInstance.enrollment_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  classInstance.enrollment_percentage >= 90
                    ? 'bg-red-500 dark:bg-red-400'
                    : classInstance.enrollment_percentage >= 70
                    ? 'bg-yellow-500 dark:bg-yellow-400'
                    : 'bg-green-500 dark:bg-green-400'
                }`}
                style={{ width: `${Math.min(classInstance.enrollment_percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{classInstance.enrolled_count} enrolled</span>
              <span>{classInstance.available_seats} seats available</span>
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
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                    Today's Schedule
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('schedule')}
                  >
                    View Full
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {isLoadingSchedule ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : todaySchedule.length > 0 ? (
                  <div className="space-y-2">
                    {todaySchedule.slice(0, 6).map((slot: ScheduleApiResponse) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-4 p-3 bg-primary/15 hover:bg-primary/30 rounded-xl transition-colors cursor-pointer"
                        onClick={() => handleSlotClick(slot)}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-semibold">
                          P{slot.period_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{slot.subject_name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {slot.teacher_name || 'No teacher'} {slot.room_number && `• Room ${slot.room_number}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {slot.duration_minutes}m
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No classes scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Students */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Students
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('students')}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {isLoadingStudents ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="sm" />
                  </div>
                ) : studentsData && studentsData.students.length > 0 ? (
                  <div className="space-y-3">
                    {studentsData.students.slice(0, 5).map((student) => (
                      <div
                        key={student.id}
                        onClick={() => navigate(`/mis/students/${student.id}`)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                      >
                        <Avatar name={student.full_name} src={student.photo_url} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{student.full_name}</p>
                          <p className="text-sm text-gray-500">Roll #{student.roll_number || 'N/A'}</p>
                        </div>
                        <Badge variant={student.status === 'active' ? 'success' : 'warning'}>
                          {student.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No students enrolled yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate('/mis/students')}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Students
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-info/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Total Students</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{classInstance.enrolled_count}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-success/80" />
                      </div>
                      <span>Subjects</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{classInstance.subjects?.length || 0}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-error/10 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <span>Capacity Used</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">{classInstance.enrollment_percentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Grade Level</dt>
                    <dd className="font-medium">Grade {classInstance.class_level_number}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Section</dt>
                    <dd className="font-medium">{classInstance.section}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Shift</dt>
                    <dd>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        classInstance.shift === 'morning'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {classInstance.shift_display}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500 text-sm">Gender Policy</dt>
                    <dd className="font-medium text-sm">{classInstance.gender_segregation_display}</dd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <dt className="text-gray-500 text-sm">Room</dt>
                    <dd className="font-medium">{classInstance.room_name || 'Not Assigned'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Class Teacher */}
            {classInstance.class_teacher_name && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Class Teacher</h3>
                  <div className="flex items-center gap-4">
                    <Avatar name={classInstance.class_teacher_name} size="lg" />
                    <div>
                      <p className="font-semibold text-gray-900">{classInstance.class_teacher_name}</p>
                      <p className="text-sm text-gray-500">Class Teacher</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                Enrolled Students
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {studentsData?.enrolled_count || 0}
                </span>
              </h3>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            {isLoadingStudents ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" label="Loading students..." />
              </div>
            ) : studentsData && studentsData.students.length > 0 ? (
              <DataTable
                columns={studentColumns}
                data={studentsData.students}
                searchable
                onRowClick={(row) => navigate(`/mis/students/${row.id}`)}
                emptyMessage="No students enrolled in this class."
                getRowKey={(row) => String(row.id)}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Students Yet</h4>
                <p className="text-gray-500 mb-4">Get started by enrolling students in this class.</p>
                <Button onClick={() => navigate('/mis/students')}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Go to Students
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-4">
          {/* Schedule Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">Weekly Schedule</h3>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {totalPeriods} Periods
              </span>
            </div>
            <div className="flex gap-2">
              {totalPeriods > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setClearModalOpen(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Schedule Content */}
          {isLoadingSchedule ? (
            <Card>
              <CardContent className="p-12">
                <div className="flex justify-center">
                  <Spinner size="lg" label="Loading schedule..." />
                </div>
              </CardContent>
            </Card>
          ) : scheduleData ? (
            <>
              <Card>
                <CardContent className="p-4">
                  <WeeklyScheduleTable
                    weeklySchedule={scheduleData.weekly_schedule}
                    onSlotClick={handleSlotClick}
                    onEmptySlotClick={handleEmptySlotClick}
                    showTeacher
                    showRoom
                    editable
                    maxPeriods={6}
                  />
                </CardContent>
              </Card>

              {/* Empty State for no schedule */}
              {totalPeriods === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Schedule Yet</h4>
                    <p className="text-gray-500 mb-4">
                      Click on any empty slot in the grid above to add a period.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}

          {/* Schedule Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-dashed border-gray-300 rounded"></div>
              Click empty slot to add
            </span>
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              Click period to edit
            </span>
          </div>
        </div>
      )}

      {activeTab === 'subjects' && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-gray-600" />
                Subjects
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {classInstance.subjects?.length || 0}
                </span>
              </h3>
            </div>

            {classInstance.subjects && classInstance.subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classInstance.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-primary truncate">{subject.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="text-xs font-mono px-2 py-0.5">{subject.code}</Badge>
                        <span className="text-xs text-gray-500">{subject.subject_type_display}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">{subject.credit_hours}h</p>
                      <p className="text-xs text-text-secondary">Credits</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Subjects</h4>
                <p className="text-gray-500">No subjects are assigned to this class level.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignments Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-gray-600" />
                Class Assignments
                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {assignments?.length || 0}
                </span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                View and manage assignments for this class
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          {/* Assignments List */}
          <Card>
            <CardContent className="p-6">
              {isLoadingAssignments ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" label="Loading assignments..." />
                </div>
              ) : assignments && assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center gap-4 p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-xl transition-colors cursor-pointer"
                      onClick={() => navigate(`/mis/assignments/${assignment.id}`)}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-text-primary truncate">{assignment.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="text-xs">{assignment.subject_name}</Badge>
                          <Badge variant={ASSIGNMENT_STATUS[assignment.status].variant}>
                            {assignment.status_display}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">
                          {isPast(new Date(assignment.due_date)) && assignment.status !== 'graded' ? (
                            <span className="text-red-600">Overdue</span>
                          ) : (
                            format(new Date(assignment.due_date), 'MMM d, yyyy')
                          )}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {assignment.submitted_count}/{assignment.total_students} submitted
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Assignments</h4>
                  <p className="text-gray-500 mb-4">No assignments have been created for this class yet.</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Description & Notes */}
      {(classInstance.description || classInstance.notes) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Notes & Description
            </h3>
            {classInstance.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-700">{classInstance.description}</p>
              </div>
            )}
            {classInstance.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <p className="text-gray-700">{classInstance.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Slot Details Modal (for viewing/editing existing slots) */}
      <ScheduleSlotModal
        slot={selectedSlot}
        isOpen={!!selectedSlot}
        onClose={handleSlotModalClose}
        classLevelId={classInstance.class_level}
        onSuccess={handleScheduleSuccess}
      />

      {/* Create New Slot Modal (for empty cells) */}
      <ScheduleSlotModal
        createMode
        isOpen={createModalOpen}
        onClose={handleCreateModalClose}
        dayOfWeek={newSlotDay}
        periodNumber={newSlotPeriod}
        classInstanceId={classId}
        classLevelId={classInstance.class_level}
        onSuccess={handleScheduleSuccess}
      />

      {/* Clear Schedule Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Schedule"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to clear all {totalPeriods} scheduled periods for{' '}
            <span className="font-semibold">{classInstance.display_name}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearSchedule}
              loading={clearSchedule.isPending}
            >
              Clear All Periods
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
