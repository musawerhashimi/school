/**
 * TeamMemberList Page
 * Admin panel for managing team members (teachers & staff)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  GraduationCap,
  Briefcase,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { Button, Modal, ModalFooter, Spinner } from "@mis-components/ui";
import PageHeader from "@mis-components/PageHeader";
import {
  useTeamMembers,
  useDeleteTeamMember,
  useDepartments,
} from "../../hooks/useCmsAbout";
import type { TeamMember, MultiLangText } from "../../types";

type FilterType = "all" | "teacher" | "staff";

export default function TeamMemberList() {
  const navigate = useNavigate();
  const { data: members = [], isLoading } = useTeamMembers();
  const { data: departments = [] } = useDepartments();
  const deleteMutation = useDeleteTeamMember();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterDepartment, setFilterDepartment] = useState<number | "all">(
    "all",
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    member: TeamMember | null;
  }>({ isOpen: false, member: null });

  const getDepartmentName = (deptId: number): string => {
    const dept = departments.find((d) => d.id === deptId);
    return dept ? dept.name.en : `Dept #${deptId}`;
  };

  const getMultiLangText = (text: MultiLangText | undefined): string => {
    if (!text) return "";
    return text.en || text.da || text.pa || "";
  };

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getMultiLangText(member.role)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || member.type === filterType;
    const matchesDept =
      filterDepartment === "all" || member.department_id === filterDepartment;

    return matchesSearch && matchesType && matchesDept;
  });

  const teacherCount = members.filter((m) => m.type === "teacher").length;
  const staffCount = members.filter((m) => m.type === "staff").length;

  const handleDelete = () => {
    if (deleteModal.member) {
      deleteMutation.mutate(deleteModal.member.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, member: null }),
      });
    }
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
        title="Team Members"
        subtitle={`Manage teachers and staff members · ${members.length} total`}
        actions={[
          {
            label: "Add Member",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/mis/cms/about/team/new"),
            variant: "primary",
          },
        ]}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {members.length}
            </div>
            <div className="text-xs text-text-secondary">Total Members</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {teacherCount}
            </div>
            <div className="text-xs text-text-secondary">Teachers</div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-text-primary">
              {staffCount}
            </div>
            <div className="text-xs text-text-secondary">Staff</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name, role, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {(["all", "teacher", "staff"] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterType === type
                  ? "bg-primary text-white"
                  : "bg-card border border-border text-text-secondary hover:text-text-primary hover:border-primary/30"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "teacher"
                  ? "Teachers"
                  : "Staff"}
            </button>
          ))}
        </div>

        {/* Department Filter */}
        <select
          value={filterDepartment}
          onChange={(e) =>
            setFilterDepartment(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="px-4 py-2.5 bg-card border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name.en}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {members.length === 0 ? "No Team Members Yet" : "No Results Found"}
          </h3>
          <p className="text-text-secondary mb-6 max-w-md">
            {members.length === 0
              ? "Add your first team member to display on the about page."
              : "Try adjusting your search or filters."}
          </p>
          {members.length === 0 && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate("/mis/cms/about/team/new")}
            >
              Add First Member
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-lg font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary truncate">
                    {member.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      member.type === "teacher"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {member.type === "teacher" ? (
                      <GraduationCap className="h-3 w-3" />
                    ) : (
                      <Briefcase className="h-3 w-3" />
                    )}
                    {member.type === "teacher" ? "Teacher" : "Staff"}
                  </span>
                </div>
                <p className="text-sm text-text-secondary truncate">
                  {getMultiLangText(member.role)} ·{" "}
                  {getDepartmentName(member.department_id)}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-xs text-muted">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </span>
                  {member.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* Subjects (for teachers) */}
              {member.type === "teacher" &&
                member.subjects &&
                member.subjects.length > 0 && (
                  <div className="hidden lg:flex flex-wrap gap-1 max-w-[200px]">
                    {member.subjects.slice(0, 2).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-secondary/10 text-secondary rounded text-xs"
                      >
                        {subject}
                      </span>
                    ))}
                    {member.subjects.length > 2 && (
                      <span className="px-2 py-0.5 bg-surface text-muted rounded text-xs">
                        +{member.subjects.length - 2}
                      </span>
                    )}
                  </div>
                )}

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() =>
                    navigate(`/mis/cms/about/team/${member.id}/edit`)
                  }
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, member })}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        title="Delete Team Member"
        description="Are you sure you want to delete this team member? This action cannot be undone."
        size="sm"
        footer={
          <ModalFooter
            onCancel={() => setDeleteModal({ isOpen: false, member: null })}
            onConfirm={handleDelete}
            cancelText="Cancel"
            confirmText="Delete"
            confirmVariant="danger"
            loading={deleteMutation.isPending}
          />
        }
      >
        {deleteModal.member && (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            {deleteModal.member.image && (
              <img
                src={deleteModal.member.image}
                alt={deleteModal.member.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div>
              <p className="font-medium text-text-primary">
                {deleteModal.member.name}
              </p>
              <p className="text-sm text-text-secondary">
                {getMultiLangText(deleteModal.member.role)} ·{" "}
                {deleteModal.member.type === "teacher" ? "Teacher" : "Staff"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
