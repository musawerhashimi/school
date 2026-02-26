import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  ChevronRight,
  ClipboardList,
  MapPin,
} from "lucide-react";
import { Card, Spinner, Alert, Badge, Button } from "@mis-components/ui";
import { PageHeader } from "@mis-components/index";
import {
  useTeacherDetail,
  useTeacherSchedule,
  useTeacherClasses,
  useTeacherStudents,
} from "../hooks/useTeachers";
import type { TeacherScheduleSlot } from "../types";
import { useUserStore } from "@auth/index";
import {
  TEACHING_DAYS,
  getSlotTimeRange,
  getTodayTeachingDay,
} from "../utils/schedule";

type TeacherClassSummary = {
  id: number;
  display_name: string;
  enrolled_count: number;
  is_homeroom: boolean;
};

/**
 * TeacherDashboard - Personal dashboard for logged-in teachers
 * Shows their schedule, classes, students, and performance
 */
export default function TeacherDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userProfile } = useUserStore();

  // Get teacher ID from user's staff profile
  const teacherId = userProfile?.teacherProfile?.id || 1;

  // Fetch data
  const { data: teacher, isLoading, error } = useTeacherDetail(teacherId ?? 0);
  const { data: schedule } = useTeacherSchedule(teacherId ?? 0);
  const { data: classes } = useTeacherClasses(teacherId ?? 0);
  const { data: students } = useTeacherStudents(teacherId ?? 0);

  if (!teacherId) {
    return (
      <div className="p-6">
        <Alert variant="warning">
          {t("mis.teachers.messages.teacherProfileMissing")}
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="p-6">
        <Alert variant="error">
          {t("mis.teachers.dashboard.errorLoadingDashboard")}
        </Alert>
      </div>
    );
  }

  // Get today's schedule
  const todayName = getTodayTeachingDay();
  const todaySchedule: TeacherScheduleSlot[] = todayName
    ? schedule?.schedule?.[todayName] || []
    : [];
  const classList = (classes || []) as TeacherClassSummary[];

  const upcomingDays = todayName
    ? [
        ...TEACHING_DAYS.slice(TEACHING_DAYS.indexOf(todayName)),
        ...TEACHING_DAYS.slice(0, TEACHING_DAYS.indexOf(todayName)),
      ]
    : TEACHING_DAYS;

  const nextClass =
    upcomingDays
      .map((day) => {
        const daySlots = [...(schedule?.schedule?.[day] || [])].sort(
          (a: TeacherScheduleSlot, b: TeacherScheduleSlot) =>
            a.period_number - b.period_number
        );
        if (daySlots.length === 0) return null;
        return { day, slot: daySlots[0] };
      })
      .find(Boolean) ?? null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title={t("mis.teachers.dashboard.welcome", {
          name: teacher.staff_detail.full_name,
        })}
        subtitle={t("mis.teachers.dashboard.subtitle")}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                {t("mis.teachers.stats.myClasses")}
              </p>
              <p className="text-2xl font-bold">{classes?.length || 0}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                {t("mis.teachers.stats.myStudents")}
              </p>
              <p className="text-2xl font-bold">{students?.length || 0}</p>
            </div>
            <Users className="h-8 w-8 text-success opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                {t("mis.teachers.stats.weeklyHours")}
              </p>
              <p className="text-2xl font-bold">
                {teacher.total_teaching_hours_per_week}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-info opacity-50" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">
                {t("mis.teachers.stats.rating")}
              </p>
              <p className="text-2xl font-bold">
                {teacher.average_rating
                  ? parseFloat(teacher.average_rating).toFixed(1)
                  : "N/A"}
              </p>
            </div>
            <Award className="h-8 w-8 text-yellow-500 opacity-50" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {t("mis.teachers.dashboard.todaySchedule")}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/mis/teachers/schedule")}
            >
              View Full Schedule
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {todaySchedule.length > 0 ? (
            <div className="space-y-3">
              {todaySchedule.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() =>
                    navigate(`/mis/teachers/classes/${slot.class_id}`)
                  }
                  className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg hover:shadow-md transition-all cursor-pointer hover:bg-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-white rounded-lg px-3 py-2 text-center min-w-[52px]">
                      <div className="text-xs font-medium">
                        P{slot.period_number}
                      </div>
                      <div className="text-xs">
                        {getSlotTimeRange(slot).start || "--:--"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{slot.subject}</div>
                      <div className="text-sm text-text-secondary flex items-center gap-1">
                        {slot.class}
                        {slot.room && (
                          <>
                            <span className="text-gray-300 mx-1">•</span>
                            <MapPin className="h-3 w-3" />
                            {slot.room}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-text-secondary">
                      {slot.duration_minutes} {t("mis.common.minutes")}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert variant="info">
              {t("mis.teachers.dashboard.noClassesToday")}
            </Alert>
          )}
        </Card>

        {/* My Classes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {t("mis.teachers.dashboard.myClasses")}
          </h3>

          {classList.length > 0 ? (
            <div className="space-y-2">
              {classList.slice(0, 5).map((cls) => (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/mis/teachers/classes/${cls.id}`)}
                  className="p-3 bg-bg-secondary rounded-lg hover:bg-primary/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {cls.display_name}
                      </div>
                      <div className="text-sm text-text-secondary flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {cls.enrolled_count} {t("mis.common.students")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cls.is_homeroom && (
                        <Badge variant="primary" size="sm">
                          {t("mis.teachers.fields.homeroom")}
                        </Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              ))}
              {classList.length > 5 && (
                <div className="text-sm text-text-secondary text-center pt-2">
                  +{classList.length - 5} {t("mis.common.more")}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">
              {t("mis.teachers.messages.noClasses")}
            </p>
          )}
        </Card>
      </div>

      {/* Teaching Subjects */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {t("mis.teachers.dashboard.teachingSubjects")}
        </h3>

        {teacher.teaching_subjects.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {teacher.teaching_subjects.map((subject, index) => (
              <Badge key={index} variant="secondary" size="lg">
                {subject}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">
            {t("mis.teachers.messages.noSubjectsAssigned")}
          </p>
        )}
      </Card>

      {/* Quick Actions / Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("mis.teachers.dashboard.recentActivity")}
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary">
              <ClipboardList className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <div className="font-medium">Schedule synced</div>
                <div className="text-sm text-text-secondary">
                  {schedule?.total_slots || 0} periods loaded this week
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary">
              <Users className="h-4 w-4 mt-0.5 text-success" />
              <div>
                <div className="font-medium">Class roster updated</div>
                <div className="text-sm text-text-secondary">
                  {students?.length || 0} students across {classes?.length || 0}{" "}
                  classes
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {t("mis.teachers.dashboard.upcomingEvents")}
          </h3>
          <div className="space-y-3">
            {nextClass ? (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="font-medium">{nextClass.slot.subject}</div>
                <div className="text-sm text-text-secondary">
                  {nextClass.day} • Period {nextClass.slot.period_number} •{" "}
                  {getSlotTimeRange(nextClass.slot).start || "--:--"}
                </div>
                <div className="text-sm text-text-secondary">
                  {nextClass.slot.class}
                </div>
              </div>
            ) : (
              <Alert variant="info">
                {t("mis.teachers.dashboard.noClassesToday")}
              </Alert>
            )}

            <div className="p-3 rounded-lg bg-bg-secondary">
              <div className="font-medium">
                {t("mis.teachers.dashboard.comingSoon")}
              </div>
              <div className="text-sm text-text-secondary">
                Gradebook and upcoming exam reminders will appear here.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
