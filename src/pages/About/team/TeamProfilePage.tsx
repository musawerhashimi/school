import { useParams, useNavigate } from "react-router-dom";

import TeamProfile from "./TeamProfile";
import { teamMembers } from "../../../data/team";
import { useTranslation } from "react-i18next";

export default function TeamProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const member = [...teamMembers].find((m) => m.id === Number(id));

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        {t("Member not found")}
      </div>
    );
  }

  return <TeamProfile teacher={member} onBack={() => navigate("/team")} />;
}
