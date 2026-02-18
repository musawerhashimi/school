import {
  Award,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ProfileSkeleton from "./Skilton";
import { Link, useParams } from "react-router-dom";
import { useAbout, useTeamMember } from "../Api/useAbout";
import { formatLocalDateTime } from "@/utils/formatLocalDateTime";

export default function TeamProfile() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "en" | "da" | "pa";
  const { team } = useAbout();
  const departments = team?.departments || [];
  // Fetch team member data using the id
  const {
    teamMember,
    isLoading: isLoadingMember,
    error: memberError,
  } = useTeamMember(Number(id));

  // Safely get multi-language text
  const getMultiLangText = (text: any): string => {
    if (!text || typeof text !== "object") {
      return "";
    }
    return text[currentLang] || text.en || "";
  };
  // Get department name by ID
  const getDepartmentName = (deptId: number) => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name[currentLang] : `Department ${deptId}`;
  };
  // Handle loading state
  if (isLoadingMember) {
    return <ProfileSkeleton />;
  }

  // Handle error state
  if (memberError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-text-secondary">
            Unable to load team member details
          </p>
          <Link
            to="/team"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  // Handle case when team member is not found
  if (!teamMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Member Not Found
          </h2>
          <Link
            to="/team"
            className="mt-4 inline-block text-primary hover:underline"
          >
            Back to Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background m-10">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-primary/10 via-surface to-secondary/10 text-text-primary mt-20 relative overflow-hidden p-10 rounded-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <Link
            to={"/team"}
            className="mb-6 text-text-secondary hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t("Back to Team")}</span>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
            <div className="relative">
              <img
                src={teamMember.image || "/default-avatar.png"}
                alt={teamMember.name}
                className="w-48 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-text-primary">
                {teamMember.name}
              </h1>
              <p className="text-xl text-text-secondary mb-4">
                {getMultiLangText(teamMember.role)}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium border border-primary/20">
                  {getDepartmentName(teamMember.department_id)}
                </span>
                <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-lg font-medium border border-secondary/20">
                  {getMultiLangText(teamMember.experience)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">About</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              {getMultiLangText(teamMember.bio)}
            </p>
          </div>

          {/* Education Section */}
          <div className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 text-text-primary">
              <Award className="w-6 h-6 text-primary" />
              {t("Education")}
            </h2>
            <ul className="space-y-4">
              {teamMember.education.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-text-secondary"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-lg">{getMultiLangText(e)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              {t("Contact Information")}
            </h3>
            <div className="space-y-4">
              <a
                href={`mailto:${teamMember.email}`}
                className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm break-all">{teamMember.email}</span>
              </a>
              <a
                href={`tel:${teamMember.phone}`}
                className="flex items-center gap-3 text-text-secondary hover:text-primary transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">{teamMember.phone}</span>
              </a>
            </div>
          </div>

          {/* Subjects Card */}
          {teamMember.member_type === "teacher" && teamMember.subjects && (
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-text-primary">
                <BookOpen className="w-5 h-5 text-primary" />
                {t("Subjects")}
              </h3>
              <div className="space-y-2">
                {teamMember.subjects.map((s, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 bg-surface rounded-lg text-text-secondary border border-border/50"
                  >
                    {getMultiLangText(s)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joined Date Card */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-xl border border-border shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-text-primary">
              <Calendar className="w-5 h-5 text-primary" />
              {t("Member Since")}
            </h3>
            <p className="text-lg font-medium text-text-secondary">
              {formatLocalDateTime(teamMember.joined_date)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
