import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@mis-components/ui";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Library
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useStudent } from "../hooks/useStudents";
import {
  useStudentAttendance,
  useStudentBooks,
  useStudentFees,
  useStudentGrades,
  useStudentPendingActions,
  useStudentQuickStats,
  useStudentReportCard,
} from "../hooks/useStudentIntegration";

/**
 * StudentDashboard Component
 *
 * Comprehensive dashboard for student portal showing:
 * - Quick stats (Attendance, Grades, Fees, Library)
 * - Pending actions and alerts
 * - Recent activity across all modules
 * - Detailed views for Attendance, Grades, Fees, Library
 */
export default function StudentDashboard() {
  const { t } = useTranslation();
  const { studentId="1" } = useParams<{ studentId: string }>();
  const numericStudentId = Number(studentId);

  const { data: student, isLoading: studentLoading } = useStudent(numericStudentId);
  const { data: quickStats, isLoading: statsLoading } = useStudentQuickStats(numericStudentId);
  const { data: pendingActions } = useStudentPendingActions(numericStudentId);

  const [activeTab, setActiveTab] = useState("overview");

  if (studentLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return (
      <Alert variant="error" title={t("mis.student.profile.pageTitle")}>
        {t("mis.student.dashboard.loadError")}
      </Alert>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Student Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                name={student.full_name}
                src={student.photo_url}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {student.full_name}
                </h1>
                <p className="text-text-secondary">
                  Student ID: <span className="font-mono">{student.student_id}</span>
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="default">{student.class_name}</Badge>
                  {student.section && (
                    <Badge variant="outline">Section {student.section}</Badge>
                  )}
                  <Badge variant="success">{student.status_display}</Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">{t("mis.student.dashboard.fatherName")}</p>
              <p className="font-medium">{student.father_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Actions Alert */}
      {pendingActions && (
        <>
          {pendingActions.overdue_fees > 0 && (
            <Alert variant="warning" title={t("mis.student.dashboard.overdueFees")}>
              {t("mis.student.dashboard.overdueFeesMessage", { amount: pendingActions.overdue_fees })}
            </Alert>
          )}
          {pendingActions.overdue_books > 0 && (
            <Alert variant="warning" title={t("mis.student.dashboard.overdueBooks")}>
              {t("mis.student.dashboard.overdueBooksMessage", { count: pendingActions.overdue_books })}
            </Alert>
          )}
          {pendingActions.low_attendance && (
            <Alert variant="error" title={t("mis.student.dashboard.lowAttendance")}>
              {t("mis.student.dashboard.lowAttendanceMessage")}
            </Alert>
          )}
        </>
      )}

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {t("mis.student.dashboard.attendance")}
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            {quickStats?.attendance ? (
              <>
                <div className="text-2xl font-bold text-text-primary">
                  {quickStats.attendance.attendance_percentage.toFixed(1)}%
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {quickStats.attendance.present_days} of{" "}
                  {quickStats.attendance.total_days} days
                </p>
                <Progress
                  value={quickStats.attendance.attendance_percentage}
                  className="mt-2"
                  variant={
                    quickStats.attendance.attendance_percentage >= 90
                      ? "success"
                      : quickStats.attendance.attendance_percentage >= 75
                      ? "warning"
                      : "error"
                  }
                />
              </>
            ) : (
              <p className="text-sm text-text-secondary">{t("mis.student.dashboard.noDataAvailable")}</p>
            )}
          </CardContent>
        </Card>

        {/* Grades Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {t("mis.student.dashboard.academicPerformance")}
            </CardTitle>
            <Award className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            {quickStats?.grades ? (
              <>
                <div className="text-2xl font-bold text-text-primary">
                  {quickStats.grades.overall_percentage.toFixed(1)}%
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  {t("mis.student.profile.grade")}: {quickStats.grades.overall_grade}
                </p>
                {quickStats.grades.class_rank && (
                  <p className="text-xs text-text-secondary">
                    {t("mis.student.profile.rank")}: {quickStats.grades.class_rank} /{" "}
                    {quickStats.grades.total_students}
                  </p>
                )}
                <Progress
                  value={quickStats.grades.overall_percentage}
                  className="mt-2"
                  variant="success"
                />
              </>
            ) : (
              <p className="text-sm text-text-secondary">{t("mis.student.dashboard.noDataAvailable")}</p>
            )}
          </CardContent>
        </Card>

        {/* Fees Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {t("mis.student.dashboard.feeStatus")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            {quickStats?.fees ? (
              <>
                <div className="text-2xl font-bold text-text-primary">
                  {quickStats.fees.total_remaining} AFN
                </div>
                <p className="text-xs text-text-secondary mt-1">{t("mis.student.dashboard.remaining")}</p>
                {quickStats.fees.overdue_amount > 0 && (
                  <p className="text-xs text-error-600 font-medium mt-1">
                    {t("mis.student.dashboard.overdue")}: {quickStats.fees.overdue_amount} AFN
                  </p>
                )}
                <Progress
                  value={
                    (quickStats.fees.total_paid / quickStats.fees.total_fees) * 100
                  }
                  className="mt-2"
                  variant={
                    quickStats.fees.total_remaining === 0
                      ? "success"
                      : quickStats.fees.overdue_amount > 0
                      ? "error"
                      : "warning"
                  }
                />
              </>
            ) : (
              <p className="text-sm text-text-secondary">{t("mis.student.dashboard.noDataAvailable")}</p>
            )}
          </CardContent>
        </Card>

        {/* Library Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              {t("mis.student.dashboard.library")}
            </CardTitle>
            <Library className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            {quickStats?.library ? (
              <>
                <div className="text-2xl font-bold text-text-primary">
                  {quickStats.library.currently_issued}
                </div>
                <p className="text-xs text-text-secondary mt-1">{t("mis.student.dashboard.booksIssued")}</p>
                {quickStats.library.overdue_books > 0 && (
                  <p className="text-xs text-error-600 font-medium mt-1">
                    {t("mis.student.dashboard.overdue")}: {quickStats.library.overdue_books}
                  </p>
                )}
                {quickStats.library.total_fines > 0 && (
                  <p className="text-xs text-warning-600 font-medium">
                    {t("mis.student.dashboard.fines")}: {quickStats.library.total_fines} AFN
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-text-secondary">{t("mis.student.dashboard.noDataAvailable")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="border-b">
            <TabsList>
              <TabsTrigger value="overview">{t("mis.student.dashboard.tabOverview")}</TabsTrigger>
              <TabsTrigger value="attendance">{t("mis.student.dashboard.tabAttendance")}</TabsTrigger>
              <TabsTrigger value="grades">{t("mis.student.dashboard.tabGrades")}</TabsTrigger>
              <TabsTrigger value="fees">{t("mis.student.dashboard.tabFees")}</TabsTrigger>
              <TabsTrigger value="library">{t("mis.student.dashboard.tabLibrary")}</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            <TabsContent value="overview">
              <OverviewTab student={student} quickStats={quickStats} />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTab studentId={numericStudentId} />
            </TabsContent>

            <TabsContent value="grades">
              <GradesTab studentId={numericStudentId} />
            </TabsContent>

            <TabsContent value="fees">
              <FeesTab studentId={numericStudentId} />
            </TabsContent>

            <TabsContent value="library">
              <LibraryTab studentId={numericStudentId} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

function OverviewTab({ student, quickStats }: { student: any; quickStats: any }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("mis.student.dashboard.personalInfo")}</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.fullName")}:</dt>
              <dd className="font-medium">{student.full_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.fatherName")}:</dt>
              <dd className="font-medium">{student.father_name}</dd>
            </div>
            {student.grandfather_name && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.profile.grandfatherName")}:</dt>
                <dd className="font-medium">{student.grandfather_name}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.dateOfBirth")}:</dt>
              <dd className="font-medium">{student.date_of_birth}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.gender")}:</dt>
              <dd className="font-medium">{student.gender_display}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.bloodGroup")}:</dt>
              <dd className="font-medium">{student.blood_group || "N/A"}</dd>
            </div>
          </dl>
        </div>

        {/* Academic Information */}
        <div>
          <h3 className="font-semibold text-lg mb-4">{t("mis.student.dashboard.academicInfo")}</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.class")}:</dt>
              <dd className="font-medium">{student.class_name}</dd>
            </div>
            {student.section && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.dashboard.section")}:</dt>
                <dd className="font-medium">{student.section}</dd>
              </div>
            )}
            {student.roll_number && (
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.dashboard.rollNumber")}:</dt>
                <dd className="font-medium">{student.roll_number}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.educationLevel")}:</dt>
              <dd className="font-medium">{student.education_level_display}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.admissionDate")}:</dt>
              <dd className="font-medium">{student.admission_date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.status")}:</dt>
              <dd>
                <Badge variant="success">{student.status_display}</Badge>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="font-semibold text-lg mb-4">{t("mis.student.dashboard.contactGuardian")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.address")}:</dt>
              <dd className="font-medium text-right">{student.address || "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.city")}:</dt>
              <dd className="font-medium">{student.city || "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">{t("mis.student.dashboard.province")}:</dt>
              <dd className="font-medium">{student.province_display || "N/A"}</dd>
            </div>
          </dl>
          {student.primary_guardian && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.dashboard.guardian")}:</dt>
                <dd className="font-medium">{student.primary_guardian.full_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.dashboard.relation")}:</dt>
                <dd className="font-medium">{student.primary_guardian.relation_type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">{t("mis.student.dashboard.phone")}:</dt>
                <dd className="font-medium">{student.primary_guardian.phone}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function AttendanceTab({ studentId }: { studentId: number }) {
  const { t } = useTranslation();
  const { data: attendance, isLoading } = useStudentAttendance(studentId, {
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("mis.student.dashboard.recentAttendance")}</h3>
        <p className="text-sm text-text-secondary">{t("mis.student.dashboard.last30Days")}</p>
      </div>

      {attendance && attendance.length > 0 ? (
        <div className="space-y-2">
          {attendance.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {record.status === "present" ? (
                  <CheckCircle className="h-5 w-5 text-success-600" />
                ) : record.status === "late" ? (
                  <Clock className="h-5 w-5 text-warning-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-error-600" />
                )}
                <div>
                  <p className="font-medium">
                    {new Date(record.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  {record.remarks && (
                    <p className="text-sm text-text-secondary">{record.remarks}</p>
                  )}
                </div>
              </div>
              <Badge
                variant={
                  record.status === "present"
                    ? "success"
                    : record.status === "late"
                    ? "warning"
                    : "error"
                }
              >
                {record.status === "present"
                  ? t("mis.student.dashboard.present")
                  : record.status === "late"
                  ? t("mis.student.dashboard.late")
                  : t("mis.student.dashboard.absent")}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <Alert variant="info" title={t("mis.student.dashboard.noRecords")}>
          {t("mis.student.dashboard.noAttendanceRecords")}
        </Alert>
      )}
    </div>
  );
}

function GradesTab({ studentId }: { studentId: number }) {
  const { t } = useTranslation();
  const { data: grades, isLoading } = useStudentGrades(studentId);
  const generateReportCard = useStudentReportCard();

  if (isLoading) {
    return <Spinner />;
  }

  const handleDownloadReportCard = () => {
    const currentYear = new Date().getFullYear();
    generateReportCard.mutate({
      studentId,
      academicYear: `${currentYear}-${currentYear + 1}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{t("mis.student.dashboard.gradesAssessments")}</h3>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleDownloadReportCard}
          loading={generateReportCard.isPending}
        >
          {t("mis.student.dashboard.downloadReportCard")}
        </Button>
      </div>

      {grades && grades.length > 0 ? (
        <div className="space-y-4">
          {grades.reduce((acc: any[], grade) => {
            const existingSubject = acc.find((g) => g.subject_id === grade.subject_id);
            if (existingSubject) {
              existingSubject.grades.push(grade);
            } else {
              acc.push({
                subject_id: grade.subject_id,
                subject_name: grade.subject_name,
                grades: [grade],
              });
            }
            return acc;
          }, []).map((subject) => (
            <Card key={subject.subject_id}>
              <CardHeader>
                <CardTitle className="text-base">{subject.subject_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subject.grades.map((grade: any) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-2 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {grade.assessment_type.charAt(0).toUpperCase() +
                            grade.assessment_type.slice(1)}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {new Date(grade.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {t("mis.student.dashboard.score", {
                            obtained: grade.marks_obtained,
                            total: grade.total_marks,
                          })}
                        </p>
                        <p className="text-sm">
                          <Badge
                            variant={
                              grade.percentage >= 80
                                ? "success"
                                : grade.percentage >= 60
                                ? "warning"
                                : "error"
                            }
                          >
                            {t("mis.student.dashboard.percentageGrade", {
                              percentage: grade.percentage.toFixed(1),
                              grade: grade.grade,
                            })}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info" title={t("mis.student.dashboard.noGrades")}>
          {t("mis.student.dashboard.noGradesRecorded")}
        </Alert>
      )}
    </div>
  );
}

function FeesTab({ studentId }: { studentId: number }) {
  const { t } = useTranslation();
  const { data: fees, isLoading } = useStudentFees(studentId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{t("mis.student.dashboard.feeRecords")}</h3>

      {fees && fees.length > 0 ? (
        <div className="space-y-3">
          {fees.map((fee) => (
            <Card key={fee.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{fee.fee_type}</p>
                    <p className="text-sm text-text-secondary mt-1">
                      {t("mis.student.dashboard.dueDate")}: {new Date(fee.due_date).toLocaleDateString()}
                    </p>
                    {fee.payment_date && (
                      <p className="text-sm text-success-600 mt-1">
                        {t("mis.student.dashboard.paidOn")}: {new Date(fee.payment_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{fee.amount} AFN</p>
                    <p className="text-sm text-text-secondary">
                      {t("mis.student.dashboard.paid")}: {fee.paid_amount} AFN
                    </p>
                    {fee.remaining_amount > 0 && (
                      <p className="text-sm font-medium text-error-600">
                        {t("mis.student.dashboard.remaining")}: {fee.remaining_amount} AFN
                      </p>
                    )}
                    <Badge
                      variant={
                        fee.status === "paid"
                          ? "success"
                          : fee.status === "overdue"
                          ? "error"
                          : "warning"
                      }
                      className="mt-2"
                    >
                      {fee.status === "paid"
                        ? t("mis.student.dashboard.feePaid")
                        : fee.status === "overdue"
                        ? t("mis.student.dashboard.feeOverdue")
                        : t("mis.student.dashboard.feePending")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info" title={t("mis.student.dashboard.noFeeRecords")}>
          {t("mis.student.dashboard.noFeeRecordsFound")}
        </Alert>
      )}
    </div>
  );
}

function LibraryTab({ studentId }: { studentId: number }) {
  const { t } = useTranslation();
  const { data: books, isLoading } = useStudentBooks(studentId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{t("mis.student.dashboard.libraryBooks")}</h3>

      {books && books.length > 0 ? (
        <div className="space-y-3">
          {books.map((book) => (
            <Card key={book.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <BookOpen className="h-5 w-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-semibold">{book.book_title}</p>
                      {book.book_isbn && (
                        <p className="text-xs text-text-secondary mt-1">
                          {t("mis.student.dashboard.isbn")}: {book.book_isbn}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-text-secondary">{t("mis.student.dashboard.issued")}:</span>{" "}
                          {new Date(book.issue_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-text-secondary">{t("mis.student.dashboard.due")}:</span>{" "}
                          {new Date(book.due_date).toLocaleDateString()}
                        </div>
                        {book.return_date && (
                          <div>
                            <span className="text-text-secondary">{t("mis.student.dashboard.returned")}:</span>{" "}
                            {new Date(book.return_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      {book.fine_amount && book.fine_amount > 0 && (
                        <p className="text-sm text-error-600 font-medium mt-2">
                          {t("mis.student.dashboard.fine")}: {book.fine_amount} AFN
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      book.status === "returned"
                        ? "success"
                        : book.status === "overdue"
                        ? "error"
                        : book.status === "lost"
                        ? "error"
                        : "warning"
                    }
                  >
                    {book.status === "returned"
                      ? t("mis.student.dashboard.bookReturned")
                      : book.status === "overdue"
                      ? t("mis.student.dashboard.bookOverdue")
                      : book.status === "lost"
                      ? t("mis.student.dashboard.bookLost")
                      : t("mis.student.dashboard.bookIssued")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info" title={t("mis.student.dashboard.noBooks")}>
          {t("mis.student.dashboard.noBooksIssued")}
        </Alert>
      )}
    </div>
  );
}
