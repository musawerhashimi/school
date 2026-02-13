import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, FileDown, Users, UserCheck, Star, BookOpen } from "lucide-react";
import {
  Button,
  Card,
  Input,
  Select,
  DataTable,
  Badge,
  Avatar,
  Alert,
  type Column,
} from "@mis-components/ui";
import { PageHeader } from "@mis-components/index";
import { useTeachers, useTeacherStats } from "../hooks/useTeachers";
import type { TeacherFilters, TeacherProfileListApiResponse } from "../types";
import { TEACHER_STATUS_OPTIONS } from "../types";

interface TeacherRow extends TeacherProfileListApiResponse {
  [key: string]: unknown;
}

export default function TeacherList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Filters state
  const [filters, setFilters] = useState<TeacherFilters>({
    page: 1,
    page_size: 20,
  });

  // Fetch data
  const { data: teachersData, isLoading, error } = useTeachers(filters);
  const { data: stats } = useTeacherStats();

  // Handle filter changes
  const handleFilterChange = (
    key: keyof TeacherFilters,
    value: string | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  // Table columns
  const columns: Column<TeacherRow>[] = [
    {
      key: "photo_url",
      header: t("mis.teachers.fields.photo"),
      label: t("mis.teachers.fields.photo"),
      render: (row) => (
        <Avatar src={row.photo_url} alt={row.full_name} name={row.full_name} />
      ),
    },
    {
      key: "staff_id",
      header: t("mis.teachers.fields.staffId"),
      label: t("mis.teachers.fields.staffId"),
      render: (row) => (
        <span className="font-medium text-primary">{row.staff_id}</span>
      ),
    },
    {
      key: "full_name",
      header: t("mis.teachers.fields.name"),
      label: t("mis.teachers.fields.name"),
      render: (row) => (
        <div>
          <div className="font-medium">{row.full_name}</div>
          <div className="text-sm text-text-secondary">{row.employee_code}</div>
        </div>
      ),
    },
    {
      key: "specializations",
      header: t("mis.teachers.fields.specializations"),
      label: t("mis.teachers.fields.specializations"),
      render: (row) => (
        <span className="text-sm">
          {row.specializations || t("mis.common.notSet")}
        </span>
      ),
    },
    {
      key: "teaching_experience_years",
      header: t("mis.teachers.fields.experience"),
      label: t("mis.teachers.fields.experience"),
      render: (row) => (
        <span className="text-sm">
          {row.teaching_experience_years} {t("mis.teachers.fields.years")}
        </span>
      ),
    },
    {
      key: "is_class_teacher",
      header: t("mis.teachers.fields.classTeacher"),
      label: t("mis.teachers.fields.classTeacher"),
      render: (row) =>
        row.is_class_teacher ? (
          <Badge variant="success">
            <UserCheck className="h-3 w-3 mr-1" />
            {t("mis.common.yes")}
          </Badge>
        ) : (
          <Badge variant="secondary">{t("mis.common.no")}</Badge>
        ),
    },
    {
      key: "average_rating",
      header: t("mis.teachers.fields.rating"),
      label: t("mis.teachers.fields.rating"),
      render: (row) =>
        row.average_rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium">
              {parseFloat(row.average_rating).toFixed(1)}
            </span>
          </div>
        ) : (
          <span className="text-text-secondary text-sm">
            {t("mis.common.notRated")}
          </span>
        ),
    },
    {
      key: "status",
      header: t("mis.staff.fields.status"),
      label: t("mis.staff.fields.status"),
      render: (row) => {
        const statusColors: Record<string, "success" | "secondary" | "warning"> =
          {
            active: "success",
            inactive: "secondary",
            on_leave: "warning",
          };
        return (
          <Badge variant={statusColors[row.status] || "secondary"}>
            {t(`mis.staff.status.${row.status}`)}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: t("mis.common.actions"),
      label: t("mis.common.actions"),
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/mis/teachers/${row.id}`)}
        >
          {t("mis.common.view")}
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">
          {t("mis.common.errorLoading", {
            resource: t("mis.teachers.title"),
          })}
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title={t("mis.teachers.title")}
        subtitle={t("mis.teachers.subtitle")}
        // icon={Users}
        actions={[
          {
            label: t("mis.common.export"),
            icon: <FileDown className="h-4 w-4" />,
            variant: "outline",
            onClick() {},
          },
          {
            label: t("mis.teachers.addTeacher"),
            icon: <Plus className="h-4 w-4" />,
            onClick() {
              navigate("/mis/staff/new?position=teacher");
            },
          },
        ]}
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.total")}
                </p>
                <p className="text-2xl font-bold">{stats.total_teachers}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.active")}
                </p>
                <p className="text-2xl font-bold">{stats.active_teachers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-success opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.classTeachers")}
                </p>
                <p className="text-2xl font-bold">{stats.class_teachers}</p>
              </div>
              <BookOpen className="h-8 w-8 text-info opacity-50" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">
                  {t("mis.teachers.stats.avgRating")}
                </p>
                <p className="text-2xl font-bold">
                  {stats.average_rating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500 opacity-50 fill-yellow-500" />
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder={t("mis.common.search")}
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />

          <Select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={TEACHER_STATUS_OPTIONS.map((opt) => ({
              label: t(`mis.staff.status.${opt.value}`) || opt.label,
              value: opt.value,
            }))}
          />

          <Select
            value={
              filters.is_class_teacher === undefined
                ? ""
                : filters.is_class_teacher.toString()
            }
            onChange={(e) =>
              handleFilterChange(
                "is_class_teacher",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            options={[
              { label: t("mis.teachers.filters.allTeachers"), value: "" },
              { label: t("mis.teachers.filters.classTeachers"), value: "true" },
              {
                label: t("mis.teachers.filters.subjectTeachers"),
                value: "false",
              },
            ]}
          />

          <Select
            value={
              filters.is_available_for_substitution === undefined
                ? ""
                : filters.is_available_for_substitution.toString()
            }
            onChange={(e) =>
              handleFilterChange(
                "is_available_for_substitution",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            options={[
              {
                label: t("mis.teachers.filters.availableForSubstitution"),
                value: "",
              },
              { label: t("mis.common.yes"), value: "true" },
              { label: t("mis.common.no"), value: "false" },
            ]}
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DataTable<TeacherRow>
          columns={columns}
          data={(teachersData?.results || []) as TeacherRow[]}
          loading={isLoading}
          pagination
          pageSize={filters.page_size || 20}
          onRowClick={(row) => navigate(`/mis/teachers/${row.id}`)}
          getRowKey={(row) => row.id}
          emptyMessage={t("mis.teachers.noTeachersFound")}
        />
      </Card>
    </div>
  );
}
