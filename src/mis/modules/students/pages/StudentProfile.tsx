import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  GraduationCap,
  Download,
  Printer,
  ArrowLeft,
  Users,
  Heart,
  FileText,
  CalendarDays,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Avatar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Spinner,
  Alert,
  Modal,
} from "@mis-components/ui";
import { useStudent, useDeleteStudent } from "../hooks/useStudents";
import PersonalHealthTab from "../components/tabs/PersonalHealthTab";
import AcademicsTab from "../components/tabs/AcademicsTab";
import GuardianTab from "../components/tabs/GuardianTab";
import DocumentsTab from "../components/tabs/DocumentsTab";
import ScheduleTab from "../components/tabs/ScheduleTab";
import AssignmentTab from "../components/tabs/AssignmentTab";

export default function StudentProfile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const studentId = id ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: student, isLoading, isError, error } = useStudent(studentId);
  const deleteStudentMutation = useDeleteStudent();

  const handleDelete = () => {
    if (studentId) {
      deleteStudentMutation.mutate(studentId, {
        onSuccess: () => {
          navigate("/mis/students");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label={t("mis.student.profile.loadingProfile")} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error" title={t("mis.student.profile.errorLoadingStudent")}>
          {error instanceof Error
            ? error.message
            : t("mis.student.profile.failedToLoadProfile")}
        </Alert>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mis/students")}
          className="mt-4"
        >
          {t("mis.student.profile.backToList")}
        </Button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Alert variant="warning" title={t("mis.student.profile.studentNotFound")}>
          {t("mis.student.profile.studentNotFoundMessage")}
        </Alert>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mis/students")}
          className="mt-4"
        >
          {t("mis.student.profile.backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("mis.student.profile.pageTitle")}
        subtitle={`${student.student_id} - ${student.full_name}`}
        actions={[
          {
            label: t("mis.student.profile.backToList"),
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate("/mis/students"),
            variant: "ghost",
          },
          {
            label: t("mis.student.profile.edit"),
            icon: <Edit className="h-4 w-4" />,
            onClick: () => navigate(`/mis/students/${id}/edit`),
            variant: "primary",
          },
          {
            label: t("mis.student.profile.print"),
            icon: <Printer className="h-4 w-4" />,
            onClick: () => window.print(),
            variant: "outline",
          },
          {
            label: t("mis.student.profile.download"),
            icon: <Download className="h-4 w-4" />,
            onClick: () => console.log("Download"),
            variant: "outline",
          },
          {
            label: t("mis.student.profile.delete"),
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => setDeleteModalOpen(true),
            variant: "danger",
          },
        ]}
      />

      {/* Student Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar
              name={student.full_name}
              src={student.photo_url}
              size="xl"
            />
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {student.full_name}
                  </h2>
                  <p className="mt-1 text-lg text-text-secondary">
                    Student ID: {student.student_id}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Father's Name: {student.father_name}
                  </p>
                </div>
                <Badge
                  variant={
                    student.status === "active"
                      ? "success"
                      : student.status === "inactive"
                      ? "warning"
                      : student.status === "graduated"
                      ? "info"
                      : student.status === "suspended" ||
                        student.status === "expelled"
                      ? "danger"
                      : "secondary"
                  }
                >
                  {student.status_display}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.class")}</p>
                    <p className="font-medium text-text-primary">
                      {student.class_name || "N/A"}
                      {student.section ? `-${student.section}` : ""}{" "}
                      {student.roll_number
                        ? `(${t("mis.student.profile.rollNumber")} #${student.roll_number})`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-info/10 p-2">
                    <Mail className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.email")}</p>
                    <p className="font-medium text-text-primary">
                      {student.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-success/10 p-2">
                    <Phone className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.phone")}</p>
                    <p className="font-medium text-text-primary">
                      {student.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-warning/10 p-2">
                    <Calendar className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.dateOfBirth")}</p>
                    <p className="font-medium text-text-primary">
                      {student.date_of_birth} ({t("mis.student.profile.age")}: {student.age})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-error/10 p-2">
                    <User className="h-5 w-5 text-error" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.gender")}</p>
                    <p className="font-medium text-text-primary">
                      {student.gender_display}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">{t("mis.student.profile.location")}</p>
                    <p className="font-medium text-text-primary">
                      {student.city}, {student.province_display}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm text-text-secondary">{t("mis.student.profile.admissionDate")}</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {student.admission_date}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-info mb-2" />
              <p className="text-sm text-text-secondary">{t("mis.student.profile.educationLevel")}</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {student.education_level_display}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <User className="h-8 w-8 mx-auto text-warning mb-2" />
              <p className="text-sm text-text-secondary">{t("mis.student.profile.nationality")}</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {student.nationality}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto text-error mb-2" />
              <p className="text-sm text-text-secondary">{t("mis.student.profile.bloodGroup")}</p>
              <p className="mt-1 text-lg font-bold text-text-primary">
                {student.blood_group || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal & Health
          </TabsTrigger>
          <TabsTrigger value="academic">
            <GraduationCap className="h-4 w-4 mr-2" />
            Academics
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <CalendarDays className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="guardian">
            <Users className="h-4 w-4 mr-2" />
            {t("mis.student.profile.tabParent")}
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <FileText className="h-4 w-4 mr-2" />
            {t("mis.student.profile.tabAssignments")}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            {t("mis.student.profile.tabDocuments")}
          </TabsTrigger>
        </TabsList>

        {/* Personal & Health Information Tab */}
        <TabsContent value="personal">
          <PersonalHealthTab student={student} />
        </TabsContent>

        {/* Academic Tab (includes Grades, Scores, and History) */}
        <TabsContent value="academic">
          <AcademicsTab student={student} />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <ScheduleTab student={student} />
        </TabsContent>

        {/* Parent/Guardian Tab */}
        <TabsContent value="guardian">
          <GuardianTab student={student} />
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <AssignmentTab student={student} />
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <DocumentsTab student={student} studentId={studentId} />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("mis.student.profile.deleteStudent")}
        size="sm"
      >
        <div className="space-y-4">
          <Alert variant="warning" title={t("mis.student.profile.warning")}>
            {t("mis.student.profile.deleteWarningMessage")}
          </Alert>

          <p className="text-text-secondary">
            {t("mis.student.profile.deleteConfirmation")}{" "}
            <span className="font-semibold text-text-primary">
              {student.full_name}
            </span>{" "}
            ({student.student_id})?
          </p>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              {t("mis.student.profile.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteStudentMutation.isPending}
            >
              {t("mis.student.profile.deleteStudent")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
