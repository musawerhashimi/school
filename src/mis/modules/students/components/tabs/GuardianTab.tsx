import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@mis-components/ui";
import type { StudentApiResponse } from "../../types";

interface GuardianTabProps {
  student: StudentApiResponse;
}

export default function GuardianTab({ student }: GuardianTabProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader title={t("mis.student.profile.guardianInformation")} />
      <CardContent className="p-6">
        {student.primary_guardian && (
          <>
            <h4 className="text-md font-semibold text-text-primary mb-4">
              {t("mis.student.profile.primaryGuardian")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianName")}
                </label>
                <p className="mt-1 text-base text-text-primary font-medium">
                  {student.primary_guardian.full_name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianRelation")}
                </label>
                <p className="mt-1 text-base text-text-primary capitalize">
                  {student.primary_guardian.relation_type.replace(
                    "_",
                    " "
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianPrimaryPhone")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.primary_guardian.phone}
                </p>
              </div>

              {student.primary_guardian.phone_secondary && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.guardianSecondaryPhone")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.primary_guardian.phone_secondary}
                  </p>
                </div>
              )}

              {student.primary_guardian.email && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.emailAddress")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.primary_guardian.email}
                  </p>
                </div>
              )}

              {student.primary_guardian.occupation && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.guardianOccupation")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.primary_guardian.occupation}
                  </p>
                </div>
              )}

              {student.primary_guardian.national_id && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.nationalId")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.primary_guardian.national_id}
                  </p>
                </div>
              )}

              {student.primary_guardian.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary">
                    {t("mis.student.profile.guardianAddress")}
                  </label>
                  <p className="mt-1 text-base text-text-primary">
                    {student.primary_guardian.address}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {student.secondary_guardian && (
          <>
            <div className="border-t pt-6 mb-4">
              <h4 className="text-md font-semibold text-text-primary mb-4">
                {t("mis.student.profile.secondaryGuardian")}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianName")}
                </label>
                <p className="mt-1 text-base text-text-primary font-medium">
                  {student.secondary_guardian.full_name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianRelation")}
                </label>
                <p className="mt-1 text-base text-text-primary capitalize">
                  {student.secondary_guardian.relation_type.replace(
                    "_",
                    " "
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.phone")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.secondary_guardian.phone}
                </p>
              </div>
            </div>
          </>
        )}

        {(student.emergency_contact_name ||
          student.emergency_contact_phone) && (
          <>
            <div className="border-t pt-6 mb-4">
              <h4 className="text-md font-semibold text-text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                {t("mis.student.profile.emergencyContact")}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.emergencyContactName")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.emergency_contact_name || t("mis.student.profile.notProvided")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.guardianRelation")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.emergency_contact_relation || t("mis.student.profile.notSpecified")}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">
                  {t("mis.student.profile.phoneNumber")}
                </label>
                <p className="mt-1 text-base text-text-primary">
                  {student.emergency_contact_phone || t("mis.student.profile.notProvided")}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
