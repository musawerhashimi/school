import { useParams, useNavigate } from "react-router-dom";
import { mockTeachers, mockStaff } from "../../../data/teachersdata";
import TeamProfile from "./TeamProfile";

export default function TeamProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const member = [...mockTeachers, ...mockStaff].find((m) => m.id === id);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Member not found
      </div>
    );
  }

  return <TeamProfile teacher={member} onBack={() => navigate("/team")} />;
}
