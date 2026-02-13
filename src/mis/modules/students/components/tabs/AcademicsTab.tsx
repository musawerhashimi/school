import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@mis-components/ui";
import {
  ChevronDown,
  ChevronUp,
  Download,
  TrendingUp
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { StudentApiResponse } from "../../types";
import SubjectPerformanceTable, { type Grade } from "../SubjectPerformanceTable";
import GPASummaryCard from "../GPASummary";

interface AcademicsTabProps {
  student: StudentApiResponse;
}

interface HistoryRecord {
  academicYear: string;
  class: string;
  section: string;
  semester: string;
  status: string;
  gpa: number;
  percentage: number;
  rank: number;
  totalStudents: number;
  attendance: number;
  subjects: Array<{
    name: string;
    midterm: number;
    annual: number;
    total: number;
    grade: string;
    breakdown: {
      midtermHW: number;
      midtermAct: number;
      midtermExam: number;
      annualHW: number;
      annualAct: number;
      annualExam: number;
    };
  }>;
  remarks?: string;
}

// Mock data - will be replaced with real API calls
const mockGrades: Grade[] = [
  {
    subject: "Mathematics",
    teacher: "Mr. Ahmad Karimi",
    midterm: { homework: 2, classActivity: 2, exam: 32, total: 36 },
    annual: { homework: 3, classActivity: 3, exam: 48, total: 54 },
    total: 90,
    grade: "A+",
    percentage: 90,
  },
  {
    subject: "Physics",
    teacher: "Mrs. Fatima Hosseini",
    midterm: { homework: 2, classActivity: 1, exam: 28, total: 31 },
    annual: { homework: 3, classActivity: 2, exam: 44, total: 49 },
    total: 80,
    grade: "B+",
    percentage: 80,
  },
  {
    subject: "Chemistry",
    teacher: "Mr. Hassan Ahmadi",
    midterm: { homework: 2, classActivity: 2, exam: 34, total: 38 },
    annual: { homework: 3, classActivity: 3, exam: 50, total: 56 },
    total: 94,
    grade: "A+",
    percentage: 94,
  },
  {
    subject: "Biology",
    teacher: "Dr. Zainab Rasooli",
    midterm: { homework: 2, classActivity: 2, exam: 30, total: 34 },
    annual: { homework: 3, classActivity: 3, exam: 46, total: 52 },
    total: 86,
    grade: "A",
    percentage: 86,
  },
  {
    subject: "English",
    teacher: "Ms. Sarah Khan",
    midterm: { homework: 2, classActivity: 2, exam: 34, total: 38 },
    annual: { homework: 3, classActivity: 3, exam: 52, total: 58 },
    total: 96,
    grade: "A+",
    percentage: 96,
  },
  {
    subject: "Dari Literature",
    teacher: "Prof. Omar Safi",
    midterm: { homework: 2, classActivity: 1, exam: 26, total: 29 },
    annual: { homework: 2, classActivity: 2, exam: 42, total: 46 },
    total: 75,
    grade: "B",
    percentage: 75,
  },
  {
    subject: "Islamic Studies",
    teacher: "Maulana Abdul Malik",
    midterm: { homework: 2, classActivity: 2, exam: 36, total: 40 },
    annual: { homework: 3, classActivity: 3, exam: 54, total: 60 },
    total: 100,
    grade: "A+",
    percentage: 100,
  },
];

const mockHistory: HistoryRecord[] = [
  {
    academicYear: "2023-2024",
    class: "10",
    section: "A",
    semester: "First Semester",
    status: "Promoted",
    gpa: 3.6,
    percentage: 88,
    rank: 7,
    totalStudents: 45,
    attendance: 94,
    subjects: [
      {
        name: "Mathematics",
        midterm: 34,
        annual: 51,
        total: 85,
        grade: "A-",
        breakdown: { midtermHW: 2, midtermAct: 2, midtermExam: 30, annualHW: 3, annualAct: 2, annualExam: 46 },
      },
      {
        name: "Physics",
        midterm: 32,
        annual: 50,
        total: 82,
        grade: "B+",
        breakdown: { midtermHW: 2, midtermAct: 1, midtermExam: 29, annualHW: 3, annualAct: 3, annualExam: 44 },
      },
    ],
    remarks: "Excellent performance. Showed significant improvement in Physics.",
  },
];

export default function AcademicsTab({ student }: AcademicsTabProps) {
  const { t } = useTranslation();
  const [showHistory, setShowHistory] = useState(false);

  const calculateGPA = () => {
    const avg =
      mockGrades.reduce((sum, grade) => sum + grade.percentage, 0) /
      mockGrades.length;
    if (avg >= 90) return 4.0;
    if (avg >= 80) return 3.0 + (avg - 80) / 10;
    if (avg >= 70) return 2.0 + (avg - 70) / 10;
    if (avg >= 60) return 1.0 + (avg - 60) / 10;
    return 0.0;
  };

  const calculateAverage = () => {
    return (
      mockGrades.reduce((sum, grade) => sum + grade.percentage, 0) /
      mockGrades.length
    ).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Academic Information */}
      <Card>
        <CardHeader title={t("mis.student.profile.academicInformation")} />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.educationLevel")}
              </label>
              <p className="mt-1 text-base text-text-primary font-medium">
                {student.education_level_display}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.class")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.class_name || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.section")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.section || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.rollNumber")}
              </label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.roll_number || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.admissionDate")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.admission_date}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.admissionNumber")}
              </label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.admission_number || t("mis.student.profile.notAssigned")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.status")}
              </label>
              <div className="mt-1">
                <Badge
                  variant={
                    student.status === "active"
                      ? "success"
                      : student.status === "inactive"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {student.status_display}
                </Badge>
              </div>
            </div>

            {student.previous_school && (
              <>
                <div className="md:col-span-2 border-t pt-4 mt-4">
                  <h4 className="text-md font-semibold text-text-primary mb-4">
                    {t("mis.student.profile.previousEducation")}
                  </h4>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.previousSchool")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.previous_school}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.previousClass")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.previous_class || t("mis.student.profile.notSpecified")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.transferCertificateNumber")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.transfer_certificate_number || t("mis.student.profile.notProvided")}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* GPA Summary Card */}
      <GPASummaryCard 
        academicYear={student.academic_year_display || ""}
        gpa={calculateGPA()}
        averageScore={parseFloat(calculateAverage())}
        totalSubjects={mockGrades.length}
      />

      {/* Subject Performance Table */}
      <SubjectPerformanceTable grades={mockGrades} />      
      {/* Academic History Section - Collapsible */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {t("mis.student.profile.academicProgressOverview")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              rightIcon={showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            >
              {showHistory ? "Hide History" : "Show Academic History"}
            </Button>
          </div>

          {showHistory && (
            <div className="space-y-6 mt-6">
              {/* Overall Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">
                    {t("mis.student.profile.yearsCompleted")}
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {mockHistory.length / 2}
                  </p>
                </div>
                <div className="text-center p-4 bg-success/5 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">
                    {t("mis.student.profile.averageGPA")}
                  </p>
                  <p className="text-2xl font-bold text-success">
                    {(
                      mockHistory.reduce((sum, h) => sum + h.gpa, 0) /
                      mockHistory.length
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="text-center p-4 bg-info/5 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">
                    {t("mis.student.profile.overallAvgPercentage")}
                  </p>
                  <p className="text-2xl font-bold text-info">
                    {(
                      mockHistory.reduce((sum, h) => sum + h.percentage, 0) /
                      mockHistory.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
                <div className="text-center p-4 bg-warning/5 rounded-lg">
                  <p className="text-sm text-text-secondary mb-1">
                    {t("mis.student.profile.avgAttendance")}
                  </p>
                  <p className="text-2xl font-bold text-warning">
                    {(
                      mockHistory.reduce((sum, h) => sum + h.attendance, 0) /
                      mockHistory.length
                    ).toFixed(0)}
                    %
                  </p>
                </div>
              </div>

              {/* Academic History Timeline */}
              <div className="space-y-4">
                {mockHistory.map((record, index) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-text-primary">
                              {t("mis.student.profile.classHistory", { level: record.class, section: record.section })}
                            </h3>
                            <Badge variant="success">{record.status}</Badge>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {record.academicYear} • {record.semester}
                          </p>
                        </div>
                        <div className="flex gap-4 text-center">
                          <div>
                            <p className="text-xs text-text-secondary">{t("mis.student.profile.gpa")}</p>
                            <p className="text-lg font-bold text-primary">
                              {record.gpa}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t("mis.student.profile.percentage")}
                            </p>
                            <p className="text-lg font-bold text-success">
                              {record.percentage}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">{t("mis.student.profile.rank")}</p>
                            <p className="text-lg font-bold text-warning">
                              #{record.rank}/{record.totalStudents}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary">
                              {t("mis.student.profile.attendance")}
                            </p>
                            <p className="text-lg font-bold text-info">
                              {record.attendance}%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Remarks */}
                      {record.remarks && (
                        <div className="p-3 bg-info/5 border border-info/20 rounded-md">
                          <p className="text-sm font-medium text-text-primary mb-1">
                            {t("mis.student.profile.teacherRemarks")}:
                          </p>
                          <p className="text-sm text-text-secondary">
                            {record.remarks}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader title={t("mis.student.profile.performanceTrends")} />
        <CardContent className="p-6">
          <Alert variant="info" title={t("mis.student.profile.comingSoon")}>
            {t("mis.student.profile.comingSoonMessage")}
          </Alert>
          <div className="mt-4 flex gap-4">
            <Button
              variant="outline"
              leftIcon={<TrendingUp className="h-4 w-4" />}
            >
              {t("mis.student.profile.viewTrends")}
            </Button>
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              {t("mis.student.profile.downloadReportCard")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
