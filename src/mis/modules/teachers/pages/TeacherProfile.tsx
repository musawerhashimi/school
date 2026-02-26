import { PageHeader } from "@mis-components/index";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Spinner,
  Tabs
} from "@mis-components/ui";
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  useTeacherClasses,
  useTeacherDetail,
  useTeacherSchedule,
  useTeacherStudents,
} from "../hooks/useTeachers";

export default function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const teacherId = parseInt(id || "0");

  // Fetch data
  const { data: teacher, isLoading, error } = useTeacherDetail(teacherId);
  const { data: schedule } = useTeacherSchedule(teacherId);
  const { data: classes } = useTeacherClasses(teacherId);
  const { data: students } = useTeacherStudents(teacherId);

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
          {t("mis.common.errorLoading", {
            resource: t("mis.teachers.teacher"),
          })}
        </Alert>
      </div>
    );
  }

  const staff = teacher.staff_detail;

  const tabs = [
    {
      id: "overview",
      label: t("mis.teachers.tabs.overview"),
      icon: FileText,
    },
    {
      id: "schedule",
      label: t("mis.teachers.tabs.schedule"),
      icon: Clock,
    },
    {
      id: "classes",
      label: t("mis.teachers.tabs.classes"),
      icon: BookOpen,
    },
    {
      id: "students",
      label: t("mis.teachers.tabs.students"),
      icon: Users,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title={staff.full_name}
        subtitle={`${staff.staff_id} • ${teacher.employee_code}`}
        breadcrumb={
          <Button onClick={() => navigate("/mis/teachers")}>
            t("mis.common.back")
          </Button>
        }
        actions={[
          {
            label: t("mis.common.edit"),
            icon: <Edit className="h-4 w-4" />,
            onClick: () => navigate(`/mis/staff/${staff.id}/edit`),
          },
        ]}
      />

      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar
              src={staff.photo_url}
              alt={staff.full_name}
              size="xl"
              fallback={staff.full_name.charAt(0)}
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <Mail className="h-4 w-4" />
                <span>{staff.email || t("mis.common.notSet")}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Phone className="h-4 w-4" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="h-4 w-4" />
                <span>
                  {staff.city}, {staff.province}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("mis.staff.fields.joinDate")}:{" "}
                  {new Date(staff.join_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{staff.position_display}</Badge>
              <Badge variant="secondary">{staff.department_display}</Badge>
              <Badge
                variant={staff.status === "active" ? "success" : "secondary"}
              >
                {staff.status_display}
              </Badge>
              {teacher.is_class_teacher && (
                <Badge variant="info">
                  {t("mis.teachers.fields.classTeacher")}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.fields.experience")}
                </p>
                <p className="text-lg font-semibold">
                  {teacher.teaching_experience_years}{" "}
                  {t("mis.teachers.fields.years")}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.totalClasses")}
                </p>
                <p className="text-lg font-semibold">{classes?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.totalStudents")}
                </p>
                <p className="text-lg font-semibold">{students?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.fields.rating")}
                </p>
                <p className="text-lg font-semibold flex items-center gap-1">
                  {teacher.average_rating ? (
                    <>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      {parseFloat(teacher.average_rating).toFixed(1)}
                    </>
                  ) : (
                    t("mis.common.notRated")
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        
      />

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Specializations */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("mis.teachers.fields.specializations")}
            </h3>
            <p className="text-text-secondary whitespace-pre-line">
              {teacher.specializations || t("mis.common.notSet")}
            </p>
          </Card>

          {/* Certifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {t("mis.teachers.fields.certifications")}
            </h3>
            <p className="text-text-secondary whitespace-pre-line">
              {teacher.certifications || t("mis.common.notSet")}
            </p>
          </Card>

          {/* Training Courses */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t("mis.teachers.fields.trainingCourses")}
            </h3>
            <p className="text-text-secondary whitespace-pre-line">
              {teacher.training_courses || t("mis.common.notSet")}
            </p>
          </Card>

          {/* Teaching Subjects */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t("mis.teachers.fields.teachingSubjects")}
            </h3>
            {teacher.teaching_subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.teaching_subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">{t("mis.common.notSet")}</p>
            )}
          </Card>
        </div>
      )}

      {activeTab === "schedule" && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t("mis.teachers.tabs.schedule")}
            </h3>
            <div className="text-sm text-text-secondary">
              {t("mis.teachers.stats.weeklyHours")}:{" "}
              <span className="font-semibold">
                {teacher.total_teaching_hours_per_week}h
              </span>
            </div>
          </div>

          {schedule && Object.keys(schedule.schedule).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(schedule.schedule).map(
                ([day, slots]) => (
                  <div
                    key={day}
                    className="border border-border rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-3">{day}</h4>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-text-secondary">
                              P{slot.period_number}
                            </div>
                            <div>
                              <div className="font-medium">{slot.subject}</div>
                              <div className="text-sm text-text-secondary">
                                {slot.class} •{" "}
                                {slot.room || t("mis.common.noRoom")}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-text-secondary">
                            {slot.start_time} - {slot.end_time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <Alert variant="info">
              {t("mis.teachers.messages.noSchedule")}
            </Alert>
          )}
        </Card>
      )}

      {activeTab === "classes" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("mis.teachers.tabs.classes")}
          </h3>

          {classes && classes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <Card
                  key={cls.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/mis/academics/classes/${cls.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{cls.display_name}</h4>
                    {cls.is_homeroom && (
                      <Badge variant="primary" size="sm">
                        {t("mis.teachers.fields.homeroom")}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-text-secondary">
                    <div>
                      {t("mis.classes.fields.shift")}: {cls.shift}
                    </div>
                    <div>
                      {t("mis.classes.fields.students")}: {cls.enrolled_count}/
                      {cls.capacity}
                    </div>
                    {cls.academic_year && (
                      <div>
                        {t("mis.classes.fields.academicYear")}:{" "}
                        {cls.academic_year}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Alert variant="info">{t("mis.teachers.messages.noClasses")}</Alert>
          )}
        </Card>
      )}

      {activeTab === "students" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("mis.teachers.tabs.students")}
          </h3>

          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("mis.students.fields.studentId")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("mis.students.fields.name")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("mis.students.fields.class")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("mis.students.fields.rollNumber")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("mis.common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t border-border hover:bg-bg-secondary"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary">
                          {student.student_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">{student.full_name}</td>
                      <td className="px-4 py-3">
                        {student.class || t("mis.common.notSet")}
                      </td>
                      <td className="px-4 py-3">
                        {student.roll_number || t("mis.common.notSet")}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/mis/students/${student.id}`)
                          }
                        >
                          {t("mis.common.view")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Alert variant="info">
              {t("mis.teachers.messages.noStudents")}
            </Alert>
          )}
        </Card>
      )}
    </div>
  );
}
