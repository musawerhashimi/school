/**
 * AboutDashboard Page
 * Overview of About page CMS sections (Team & Departments)
 */

import { useNavigate } from "react-router-dom";
import {
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button, Spinner } from "@mis-components/ui";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import PageHeader from "@mis-components/PageHeader";
import { useTeamMembers, useDepartments } from "../../hooks/useCmsAbout";
import type { MultiLangText } from "../../types";

export default function AboutDashboard() {
  const navigate = useNavigate();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers();
  const { data: departments = [], isLoading: deptsLoading } = useDepartments();

  const isLoading = membersLoading || deptsLoading;

  const teachers = members.filter((m) => m.type === "teacher");
  const staff = members.filter((m) => m.type === "staff");

  const getDepartmentName = (deptId: number): string => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name.en : `Dept #${deptId}`;
  };

  const getMultiLangText = (text: MultiLangText | undefined): string => {
    if (!text) return "";
    return text.en || text.da || text.pa || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="About Page CMS"
        subtitle="Manage team members, departments, and about page content"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {members.length}
          </div>
          <div className="text-xs text-text-secondary">Total Members</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {teachers.length}
          </div>
          <div className="text-xs text-text-secondary">Teachers</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-2">
            <Briefcase className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {staff.length}
          </div>
          <div className="text-xs text-text-secondary">Staff</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-2">
            <Building2 className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {departments.length}
          </div>
          <div className="text-xs text-text-secondary">Departments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Team Members
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {members.length} members · {teachers.length} teachers ·{" "}
                    {staff.length} staff
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/about/team/new")}
                >
                  Add New
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/about/team")}
                >
                  Manage All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted mb-3" />
                <p className="text-text-secondary mb-4">No team members yet</p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/about/team/new")}
                >
                  Add First Member
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.slice(0, 6).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-all"
                    onClick={() =>
                      navigate(`/mis/cms/about/team/${member.id}/edit`)
                    }
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted text-sm font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-primary truncate">
                        {member.name}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {getMultiLangText(member.role)}
                      </p>
                      {member.department_id && (
                        <p className="text-xs text-muted truncate">
                          {getDepartmentName(member.department_id)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        member.type === "teacher"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {member.type === "teacher" ? "T" : "S"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {members.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate("/mis/cms/about/team")}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all {members.length} members →
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Departments Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Departments
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {departments.length} departments
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => navigate("/mis/cms/about/departments")}
              >
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {departments.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 mx-auto text-muted mb-3" />
                <p className="text-text-secondary">No departments yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {departments.map((dept) => {
                  const memberCount = members.filter(
                    (m) => m.department_id === dept.id,
                  ).length;
                  return (
                    <div
                      key={dept.id}
                      className="p-3 rounded-xl border border-border bg-surface/50 text-center"
                    >
                      <Building2 className="h-5 w-5 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-text-primary">
                        {dept.name.en}
                      </h4>
                      <p className="text-xs text-muted mt-1">
                        {memberCount} member{memberCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
