import { Badge, Card, CardContent, CardHeader } from "@mis-components/ui";
import { useTranslation } from "react-i18next";

// Grade data structure
export interface Grade {
  subject: string;
  teacher: string;
  midterm: {
    homework: number;
    classActivity: number;
    exam: number;
    total: number;
  };
  annual: {
    homework: number;
    classActivity: number;
    exam: number;
    total: number;
  };
  total: number;
  grade: string;
  percentage: number;
}

interface SubjectPerformanceTableProps {
  grades: Grade[];
}

const SubjectPerformanceTable = ({ grades }: SubjectPerformanceTableProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("mis.student.profile.subjectPerformance")} />
      <CardContent className="p-6">
        <div className="mb-4 p-3 bg-info/5 border border-info/20 rounded-md">
          <p className="text-sm text-text-secondary">
            {t("mis.student.profile.gradingSystemNote")}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th
                  className="pb-3 text-left text-sm font-semibold text-text-primary"
                  rowSpan={2}
                >
                  {t("mis.student.profile.subject")}
                </th>
                <th
                  className="pb-3 text-left text-sm font-semibold text-text-primary"
                  rowSpan={2}
                >
                  {t("mis.student.profile.teacher")}
                </th>
                <th
                  className="pb-3 text-center text-sm font-semibold text-text-primary"
                  colSpan={4}
                >
                  {t("mis.student.profile.midterm", { points: 40 })}
                </th>
                <th
                  className="pb-3 text-center text-sm font-semibold text-text-primary"
                  colSpan={4}
                >
                  {t("mis.student.profile.annual", { points: 60 })}
                </th>
                <th
                  className="pb-3 text-center text-sm font-semibold text-text-primary"
                  rowSpan={2}
                >
                  {t("mis.student.profile.total", { points: 100 })}
                </th>
                <th
                  className="pb-3 text-center text-sm font-semibold text-text-primary"
                  rowSpan={2}
                >
                  {t("mis.student.profile.grade")}
                </th>
              </tr>
              <tr className="border-b border-border">
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.hw", { points: 2 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.act", { points: 2 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.exam", { points: 36 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.total")}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.hw", { points: 3 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.act", { points: 3 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.exam", { points: 54 })}
                </th>
                <th className="pb-2 text-center text-xs text-text-secondary">
                  {t("mis.student.profile.total")}
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-bg-secondary"
                >
                  <td className="py-3">
                    <p className="font-medium text-text-primary text-sm">
                      {grade.subject}
                    </p>
                  </td>
                  <td className="py-3 text-xs text-text-secondary">
                    {grade.teacher}
                  </td>
                  {/* Midterm Breakdown */}
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.midterm.homework}
                  </td>
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.midterm.classActivity}
                  </td>
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.midterm.exam}
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-sm font-semibold text-text-primary">
                      {grade.midterm.total}
                    </span>
                  </td>
                  {/* Annual Breakdown */}
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.annual.homework}
                  </td>
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.annual.classActivity}
                  </td>
                  <td className="py-3 text-center text-xs text-text-secondary">
                    {grade.annual.exam}
                  </td>
                  <td className="py-3 text-center">
                    <span className="text-sm font-semibold text-text-primary">
                      {grade.annual.total}
                    </span>
                  </td>
                  {/* Total */}
                  <td className="py-3 text-center">
                    <span
                      className={`text-base font-bold ${
                        grade.total >= 90
                          ? "text-success"
                          : grade.total >= 80
                          ? "text-info"
                          : grade.total >= 70
                          ? "text-warning"
                          : "text-error"
                      }`}
                    >
                      {grade.total}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge
                      variant={
                        grade.grade.includes("A")
                          ? "success"
                          : grade.grade.includes("B")
                          ? "info"
                          : grade.grade.includes("C")
                          ? "warning"
                          : "danger"
                      }
                    >
                      {grade.grade}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectPerformanceTable;
