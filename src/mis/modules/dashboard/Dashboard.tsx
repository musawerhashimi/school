import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Users,
  CalendarCheck,
  Wallet,
  UserPlus,
  ClipboardCheck,
  BarChart3,
  FileText,
  Bell,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";
import { DashboardCard, PageHeader } from "@mis-components/index";
import {
  Card,
  CardHeader,
  CardContent,
  Badge,
  Avatar,
  Skeleton,
  Button,
} from "@mis-components/ui";
import {
  useDashboardStats,
  useRecentNotices,
  useUpcomingEvents,
  useRecentStudents,
} from "@/mis/queries/useDashboard";

// Mock data for fallback when API is not available
const mockStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  attendanceRate: 94,
  pendingFees: 124500,
  studentsTrend: 12,
  teachersTrend: 5,
  attendanceTrend: 2,
  feesTrend: -8,
};

const mockNotices = [
  {
    id: 1,
    title: "Exam Schedule Released",
    date: "1403/01/15",
    type: "exam" as const,
  },
  {
    id: 2,
    title: "Holiday Notice - Friday",
    date: "1403/01/14",
    type: "holiday" as const,
  },
  {
    id: 3,
    title: "Fee Submission Deadline",
    date: "1403/01/10",
    type: "fee" as const,
  },
];

const mockEvents = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    date: "1403/01/20",
    time: "10:00 AM",
  },
  { id: 2, title: "Mid-Term Exams Start", date: "1403/01/25", time: "8:00 AM" },
  { id: 3, title: "Sports Day", date: "1403/02/01", time: "9:00 AM" },
];

const mockStudents = [
  {
    id: 1,
    name: "Ahmad Ahmadi",
    class: "10-A",
    photo: null,
    status: "active" as const,
    enrollmentDate: "2024-01-01",
  },
  {
    id: 2,
    name: "Fatima Karimi",
    class: "9-B",
    photo: null,
    status: "active" as const,
    enrollmentDate: "2024-01-02",
  },
  {
    id: 3,
    name: "Mohammad Rasooli",
    class: "11-A",
    photo: null,
    status: "active" as const,
    enrollmentDate: "2024-01-03",
  },
];

export default function Dashboard() {
  const { t } = useTranslation();

  // Fetch data using React Query hooks
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const { data: noticesData, isLoading: noticesLoading } = useRecentNotices(3);

  const { data: eventsData, isLoading: eventsLoading } = useUpcomingEvents(3);

  const { data: studentsData, isLoading: studentsLoading } =
    useRecentStudents(3);

  // Use API data or fallback to mock data
  const dashboardStats = statsData || mockStats;
  const recentNotices = noticesData || mockNotices;
  const upcomingEvents = eventsData || mockEvents;
  const recentStudents = studentsData || mockStudents;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `؋${amount.toLocaleString()}`;
  };

  const stats = [
    {
      title: t("mis.dashboard.totalStudents", "Total Students"),
      value: dashboardStats.totalStudents.toLocaleString(),
      icon: GraduationCap,
      color: "primary" as const,
      trend: dashboardStats.studentsTrend
        ? {
            value: Math.abs(dashboardStats.studentsTrend),
            isPositive: dashboardStats.studentsTrend > 0,
            label: "from last month",
          }
        : undefined,
    },
    {
      title: t("mis.dashboard.totalTeachers", "Total Teachers"),
      value: dashboardStats.totalTeachers.toLocaleString(),
      icon: Users,
      color: "success" as const,
      trend: dashboardStats.teachersTrend
        ? {
            value: Math.abs(dashboardStats.teachersTrend),
            isPositive: dashboardStats.teachersTrend > 0,
            label: "from last month",
          }
        : undefined,
    },
    {
      title: t("mis.dashboard.attendance", "Today's Attendance"),
      value: `${dashboardStats.attendanceRate}%`,
      icon: CalendarCheck,
      color: "info" as const,
      trend: dashboardStats.attendanceTrend
        ? {
            value: Math.abs(dashboardStats.attendanceTrend),
            isPositive: dashboardStats.attendanceTrend > 0,
            label: "from yesterday",
          }
        : undefined,
    },
    {
      title: t("mis.dashboard.pendingFees", "Pending Fees"),
      value: formatCurrency(dashboardStats.pendingFees),
      icon: Wallet,
      color: "warning" as const,
      trend: dashboardStats.feesTrend
        ? {
            value: Math.abs(dashboardStats.feesTrend),
            isPositive: dashboardStats.feesTrend > 0,
            label: "overdue",
          }
        : undefined,
    },
  ];

  const quickActions = [
    {
      label: t("mis.dashboard.addStudent", "Add Student"),
      icon: UserPlus,
      href: "/mis/students/new",
      color: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    {
      label: t("mis.dashboard.markAttendance", "Mark Attendance"),
      icon: ClipboardCheck,
      href: "/mis/attendance/mark",
      color: "bg-success-soft text-success hover:bg-success/20",
    },
    {
      label: t("mis.dashboard.enterGrades", "Enter Grades"),
      icon: BarChart3,
      href: "/mis/grades/entry",
      color: "bg-info-soft text-info hover:bg-info/20",
    },
    {
      label: t("mis.dashboard.viewReports", "View Reports"),
      icon: FileText,
      href: "/mis/reports",
      color: "bg-warning-soft text-warning hover:bg-warning/20",
    },
  ];

  const getNoticeBadge = (type: string) => {
    switch (type) {
      case "exam":
        return <Badge variant="info">Exam</Badge>;
      case "holiday":
        return <Badge variant="success">Holiday</Badge>;
      case "fee":
        return <Badge variant="warning">Fee</Badge>;
      default:
        return <Badge>General</Badge>;
    }
  };

  // Stats Skeleton
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );

  // List Item Skeleton
  const ListItemSkeleton = () => (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("mis.dashboard.title", "Dashboard")}
        subtitle={t(
          "mis.dashboard.subtitle",
          "Welcome back! Here's what's happening today."
        )}
        actions={[
          {
            label: t("common.refresh", "Refresh"),
            onClick: refetchStats,
            icon: <RefreshCw className="h-4 w-4" />,
            variant: "outline",
          },
        ]}
      />

      {/* Stats Grid */}
      {statsLoading ? (
        <StatsSkeleton />
      ) : statsError ? (
        <div className="rounded-xl border border-error/20 bg-error/5 p-6 text-center">
          <p className="text-sm text-error mb-2">
            {t("mis.dashboard.statsError", "Failed to load statistics")}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetchStats()}>
            {t("common.retry", "Retry")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <DashboardCard key={index} {...stat} />
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader
          title={t("mis.dashboard.quickActions", "Quick Actions")}
          subtitle="Common tasks you can do right now"
        />
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className={`flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200 ${action.color}`}
                >
                  <Icon className="h-8 w-8" />
                  <span className="text-center text-sm font-medium">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Notices */}
        <Card>
          <CardHeader
            title={t("mis.dashboard.recentNotices", "Recent Notices")}
            action={
              <Link
                to="/mis/notices"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {noticesLoading ? (
                <>
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </>
              ) : (
                recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-hover"
                  >
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {notice.title}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {notice.date}
                      </p>
                    </div>
                    {getNoticeBadge(notice.type)}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader
            title={t("mis.dashboard.upcomingEvents", "Upcoming Events")}
            action={
              <Link
                to="/mis/calendar"
                className="text-sm font-medium text-primary hover:underline"
              >
                View Calendar
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {eventsLoading ? (
                <>
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-hover"
                  >
                    <div className="rounded-lg bg-info-soft p-2">
                      <Calendar className="h-4 w-4 text-info" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {event.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                        <span>{event.date}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Students */}
        <Card>
          <CardHeader
            title={t("mis.dashboard.recentStudents", "Recent Students")}
            action={
              <Link
                to="/mis/students"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {studentsLoading ? (
                <>
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                  <ListItemSkeleton />
                </>
              ) : (
                recentStudents.map((student) => (
                  <Link
                    key={student.id}
                    to={`/mis/students/${student.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-hover"
                  >
                    <Avatar
                      name={student.name}
                      src={student.photo || undefined}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">
                        {student.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Class: {student.class}
                      </p>
                    </div>
                    <Badge
                      variant={
                        student.status === "active" ? "success" : "default"
                      }
                      dot
                    >
                      {student.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
