import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardContent, Alert } from "@mis-components/ui";
import type { StudentApiResponse } from "../../types";

interface PersonalHealthTabProps {
  student: StudentApiResponse;
}

export default function PersonalHealthTab({ student }: PersonalHealthTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card>
        <CardHeader title={t("mis.student.profile.personalInformation")} />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.fullName")}
              </label>
              <p className="mt-1 text-base text-text-primary font-medium">
                {student.full_name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.fatherName")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.father_name}
              </p>
            </div>

            {student.grandfather_name && (
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.grandfatherName")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.grandfather_name}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.dateOfBirth")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.date_of_birth} ({t("mis.student.profile.age")}: {student.age})
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.gender")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.gender_display}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.nationality")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.nationality}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.religion")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.religion || t("mis.student.profile.notSpecified")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.studentId")}
              </label>
              <p className="mt-1 text-base text-text-primary font-mono">
                {student.student_id}
              </p>
            </div>

            {student.national_id && (
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.nationalId")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.national_id}
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.address")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.address}, {student.city},{" "}
                {student.province_display}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.phoneNumber")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.phone || t("mis.student.profile.notProvided")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.emailAddress")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.email || t("mis.student.profile.notProvided")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Information Section */}
      <Card>
        <CardHeader title={t("mis.student.profile.healthInformation")} />
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.bloodGroup")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.blood_group || t("mis.student.profile.notSpecified")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.medicalConditions")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.medical_conditions || t("mis.student.profile.noneReported")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.allergies")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.allergies || t("mis.student.profile.noneReported")}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary">
                {t("mis.student.profile.regularMedications")}
              </label>
              <p className="mt-1 text-base text-text-primary">
                {student.medications || t("mis.student.profile.none")}
              </p>
            </div>

            {!student.medical_conditions &&
              !student.allergies &&
              !student.medications && (
                <Alert variant="info" title={t("mis.student.profile.noHealthInformation")}>
                  {t("mis.student.profile.noHealthInformationMessage")}
                </Alert>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
