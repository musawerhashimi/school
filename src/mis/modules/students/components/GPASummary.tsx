import { Card, CardContent } from "@mis-components/ui";
import { useTranslation } from "react-i18next";

interface GPASummaryCardProps {
  academicYear?: string;
  gpa: number;
  averageScore: number;
  totalSubjects: number;
}

export default function GPASummaryCard({ 
  academicYear, 
  gpa, 
  averageScore, 
  totalSubjects 
}: GPASummaryCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {t("mis.student.profile.currentSemesterPerformance")}
            </h3>
            <p className="text-sm text-text-secondary">
              {t("mis.student.profile.academicYear")} {academicYear}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-text-secondary">{t("mis.student.profile.gpa")}</p>
              <p className="text-3xl font-bold text-primary mt-1">
                {gpa}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t("mis.student.profile.outOf", { max: "4.0" })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                {t("mis.student.profile.averageScore")}
              </p>
              <p className="text-3xl font-bold text-success mt-1">
                {averageScore}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t("mis.student.profile.outOf", { max: "100" })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                {t("mis.student.profile.totalSubjects")}
              </p>
              <p className="text-3xl font-bold text-info mt-1">
                {totalSubjects}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t("mis.student.profile.subjects")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
