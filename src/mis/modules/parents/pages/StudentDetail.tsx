/**
 * StudentDetail Page
 * Hub page for parents to view their child's detailed information
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  Receipt,
  LayoutDashboard,
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
} from "@mis-components/ui";
import { useChild } from "../hooks/useParents";
import { STUDENT_STATUS_CONFIG } from "../constants";
import OverviewTab from "../components/tabs/OverviewTab";
import AttendanceTab from "../components/tabs/AttendanceTab";
import AcademicTab from "../components/tabs/AcademicTab";
import AssignmentsTab from "../components/tabs/AssignmentsTab";
import TimetableTab from "../components/tabs/TimetableTab";
import FeesTab from "../components/tabs/FeesTab";

export default function StudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const id = studentId ? parseInt(studentId, 10) : 0;
  const { data: student, isLoading, isError, error } = useChild(id);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading student details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error" title="Error Loading Student">
          {error instanceof Error ? error.message : "Failed to load student details."}
        </Alert>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mis/parents/dashboard")}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Alert variant="warning" title="Student Not Found">
          The requested student could not be found or you don't have permission to view them.
        </Alert>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mis/parents/dashboard")}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const statusConfig = STUDENT_STATUS_CONFIG[student.status as keyof typeof STUDENT_STATUS_CONFIG] ||
    STUDENT_STATUS_CONFIG.active;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Student Profile"
        subtitle={`${student.student_id} - ${student.full_name}`}
        actions={[
          {
            label: "Back to Dashboard",
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate("/mis/parents/dashboard"),
            variant: "ghost",
          },
          {
            label: "Print",
            icon: <Printer className="h-4 w-4" />,
            onClick: () => window.print(),
            variant: "outline",
          },
          {
            label: "Download",
            icon: <Download className="h-4 w-4" />,
            onClick: () => console.log("Download"),
            variant: "outline",
          },
        ]}
      />

      {/* Student Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar name={student.full_name} src={student.photo_url} size="xl" />
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">{student.full_name}</h2>
                  <p className="mt-1 text-lg text-text-secondary">
                    Student ID: {student.student_id}
                  </p>
                  {student.father_name && (
                    <p className="mt-1 text-sm text-text-secondary">
                      Father's Name: {student.father_name}
                    </p>
                  )}
                </div>
                <Badge variant={statusConfig.variant}>{student.status_display}</Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Class</p>
                    <p className="font-medium text-text-primary">
                      {student.class_name || "N/A"}
                      {student.section ? `-${student.section}` : ""}
                      {student.roll_number ? ` (Roll #${student.roll_number})` : ""}
                    </p>
                  </div>
                </div>

                {student.email && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-info/10 p-2">
                      <Mail className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Email</p>
                      <p className="font-medium text-text-primary">{student.email}</p>
                    </div>
                  </div>
                )}

                {student.phone && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2">
                      <Phone className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Phone</p>
                      <p className="font-medium text-text-primary">{student.phone}</p>
                    </div>
                  </div>
                )}

                {student.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-warning/10 p-2">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Date of Birth</p>
                      <p className="font-medium text-text-primary">
                        {student.date_of_birth}
                        {student.age && ` (Age: ${student.age})`}
                      </p>
                    </div>
                  </div>
                )}
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
              <CalendarCheck className="h-8 w-8 mx-auto text-success mb-2" />
              <p className="text-sm text-text-secondary">Attendance</p>
              <p className="mt-1 text-lg font-bold text-success">
                {student.attendance_summary?.attendance_percentage?.toFixed(0) || "N/A"}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-info mb-2" />
              <p className="text-sm text-text-secondary">Avg Score</p>
              <p className="mt-1 text-lg font-bold text-info">
                {student.academic_summary?.average_percentage?.toFixed(0) || "N/A"}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <ClipboardList className="h-8 w-8 mx-auto text-warning mb-2" />
              <p className="text-sm text-text-secondary">Pending Tasks</p>
              <p className="mt-1 text-lg font-bold text-warning">
                {/* This would come from assignments data */}
                {student.academic_summary?.pending_tasks || 0}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Receipt className="h-8 w-8 mx-auto text-error mb-2" />
              <p className="text-sm text-text-secondary">Unpaid Fees</p>
              <p className="mt-1 text-lg font-bold text-error">
                ${student.fee_summary?.pending_amount?.toFixed(0) || "0"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <CalendarCheck className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="academic">
            <GraduationCap className="h-4 w-4 mr-2" />
            Academic
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <ClipboardList className="h-4 w-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="timetable">
            <Calendar className="h-4 w-4 mr-2" />
            Timetable
          </TabsTrigger>
          <TabsTrigger value="fees">
            <Receipt className="h-4 w-4 mr-2" />
            Fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab studentId={id} student={student} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTab studentId={id} />
        </TabsContent>

        <TabsContent value="academic">
          <AcademicTab studentId={id} student={student} />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab studentId={id} />
        </TabsContent>

        <TabsContent value="timetable">
          <TimetableTab studentId={id} student={student} />
        </TabsContent>

        <TabsContent value="fees">
          <FeesTab studentId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
