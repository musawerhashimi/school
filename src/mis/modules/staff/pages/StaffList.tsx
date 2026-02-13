import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  X,
  FileText,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  DataTable,
  Button,
  Badge,
  Avatar,
  Input,
  Select,
  Card,
  CardContent,
  Modal,
  Alert,
  Spinner,
  type Column,
} from "@mis-components/ui";
import {
  useStaff,
  useDeleteStaff,
} from "../hooks/useStaff";
import type {
  StaffListApiResponse,
  StaffFilters,
} from "../types";

export default function StaffList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Filters state
  const [filters, setFilters] = useState<StaffFilters>({
    page: 1,
    page_size: 10,
    search: "",
    position: undefined,
    department: undefined,
    status: undefined,
    employment_type: undefined,
    gender: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] =
    useState<StaffListApiResponse | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // React Query hooks
  const { data, isLoading, isError, error } = useStaff(filters);
  const deleteStaff = useDeleteStaff();

  // Filter change handlers
  const handleFilterChange = (key: keyof StaffFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      page_size: 10,
      search: "",
      position: undefined,
      department: undefined,
      status: undefined,
      employment_type: undefined,
      gender: undefined,
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.position ||
    filters.department ||
    filters.status ||
    filters.employment_type ||
    filters.gender
  );

  // Delete handlers
  const handleDeleteClick = (staff: StaffListApiResponse) => {
    setStaffToDelete(staff);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (staffToDelete) {
      deleteStaff.mutate(staffToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setStaffToDelete(null);
        },
      });
    }
  };

  // Table columns
  const columns: Column<StaffListApiResponse>[] = [
    {
      key: "staff_id",
      label: t("mis.staff.fields.staffId"),
      header: t("mis.staff.fields.staffId"),
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm font-medium text-primary">
          {row.staff_id}
        </span>
      ),
    },
    {
      key: "full_name",
      label: t("mis.staff.list.columnName"),
      header: t("mis.staff.list.columnName"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.full_name} src={row.photo_url} size="sm" />
          <div>
            <p className="font-medium text-text-primary">{row.full_name}</p>
            <p className="text-xs text-text-secondary">{row.father_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      label: t("mis.staff.list.columnPosition"),
      header: t("mis.staff.list.columnPosition"),
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-primary">
          {row.position_display}
        </span>
      ),
    },
    {
      key: "department",
      label: t("mis.staff.list.columnDepartment"),
      header: t("mis.staff.list.columnDepartment"),
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.department_display}
        </span>
      ),
    },
    {
      key: "phone",
      label: t("mis.staff.list.columnPhone"),
      header: t("mis.staff.list.columnPhone"),
      render: (row) => (
        <span className="text-sm text-text-secondary font-mono">
          {row.phone}
        </span>
      ),
    },
    {
      key: "status",
      label: t("mis.staff.list.columnStatus"),
      header: t("mis.staff.list.columnStatus"),
      render: (row) => {
        const getVariant = (
          status: string
        ): "success" | "warning" | "danger" | "secondary" | "info" => {
          if (status === "active") return "success";
          if (status === "inactive" || status === "on_leave") return "warning";
          if (status === "terminated" || status === "suspended") return "danger";
          if (status === "resigned") return "secondary";
          return "secondary";
        };
        return (
          <Badge variant={getVariant(row.status)}>{row.status_display}</Badge>
        );
      },
    },
    {
      key: "current_salary",
      label: t("mis.staff.list.columnSalary"),
      header: t("mis.staff.list.columnSalary"),
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {row.current_salary ? `AFN ${row.current_salary}` : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("mis.staff.list.columnActions"),
      header: t("mis.staff.list.columnActions"),
      render: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/staff/${row.id}`);
            }}
            title={t("mis.staff.actions.viewProfile")}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/staff/${row.id}/edit`);
            }}
            title={t("mis.staff.actions.editProfile")}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title={t("mis.staff.actions.deleteStaff")}
          />
        </div>
      ),
    },
  ];

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, page_size: pageSize, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("mis.staff.pageTitle")}
        subtitle={t("mis.staff.pageSubtitle")}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => setExportModalOpen(true)}
            >
              {t("mis.common.export")}
            </Button>
            <Button
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => navigate("/mis/staff/new")}
            >
              {t("mis.staff.addStaff")}
            </Button>
          </div>
        }
      />

      {/* Filters Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search and Filter Toggle */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder={t("mis.staff.filters.search")}
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  leftIcon={<Filter className="h-4 w-4" />}
                />
              </div>
              <Button
                variant="outline"
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setShowFilters(!showFilters)}
              >
                {t("mis.staff.filters.filterBy")}
                {hasActiveFilters && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {Object.values(filters).filter((v) => v && v !== 1 && v !== 10).length}
                  </Badge>
                )}
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  leftIcon={<X className="h-4 w-4" />}
                  onClick={clearFilters}
                >
                  {t("mis.staff.filters.clearFilters")}
                </Button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
                <Select
                  value={filters.position || ""}
                  onChange={(e) => handleFilterChange("position", e.target.value)}
                >
                  <option value="">{t("mis.staff.filters.allPositions")}</option>
                  <option value="teacher">{t("mis.staff.positions.teacher")}</option>
                  <option value="principal">{t("mis.staff.positions.principal")}</option>
                  <option value="vice_principal">{t("mis.staff.positions.vice_principal")}</option>
                  <option value="admin_staff">{t("mis.staff.positions.admin_staff")}</option>
                  <option value="librarian">{t("mis.staff.positions.librarian")}</option>
                  <option value="accountant">{t("mis.staff.positions.accountant")}</option>
                  <option value="counselor">{t("mis.staff.positions.counselor")}</option>
                  <option value="security">{t("mis.staff.positions.security")}</option>
                  <option value="support_staff">{t("mis.staff.positions.support_staff")}</option>
                </Select>

                <Select
                  value={filters.department || ""}
                  onChange={(e) => handleFilterChange("department", e.target.value)}
                >
                  <option value="">{t("mis.staff.filters.allDepartments")}</option>
                  <option value="administration">{t("mis.staff.departments.administration")}</option>
                  <option value="academic">{t("mis.staff.departments.academic")}</option>
                  <option value="accounts">{t("mis.staff.departments.accounts")}</option>
                  <option value="library">{t("mis.staff.departments.library")}</option>
                  <option value="it">{t("mis.staff.departments.it")}</option>
                  <option value="sports">{t("mis.staff.departments.sports")}</option>
                  <option value="support">{t("mis.staff.departments.support")}</option>
                  <option value="other">{t("mis.staff.departments.other")}</option>
                </Select>

                <Select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">{t("mis.staff.filters.allStatuses")}</option>
                  <option value="active">{t("mis.staff.statuses.active")}</option>
                  <option value="inactive">{t("mis.staff.statuses.inactive")}</option>
                  <option value="on_leave">{t("mis.staff.statuses.on_leave")}</option>
                  <option value="suspended">{t("mis.staff.statuses.suspended")}</option>
                  <option value="terminated">{t("mis.staff.statuses.terminated")}</option>
                  <option value="resigned">{t("mis.staff.statuses.resigned")}</option>
                </Select>

                <Select
                  value={filters.gender || ""}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                >
                  <option value="">{t("mis.staff.filters.allGenders")}</option>
                  <option value="male">{t("mis.common.male")}</option>
                  <option value="female">{t("mis.common.female")}</option>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
              <span className="ml-3 text-text-secondary">
                {t("mis.staff.list.loadingStaff")}
              </span>
            </div>
          ) : isError ? (
            <div className="p-6">
              <Alert variant="danger">
                {error?.message || t("mis.staff.messages.loadError")}
              </Alert>
            </div>
          ) : data && data.results.length > 0 ? (
            <DataTable
              columns={columns}
              data={data.results}
              selectable
              selectedRows={selectedStaff}
              onSelectionChange={setSelectedStaff}
              onRowClick={(row) => navigate(`/mis/staff/${row.id}`)}
              pagination={{
                currentPage: filters.page || 1,
                pageSize: filters.page_size || 10,
                totalItems: data.count,
                onPageChange: handlePageChange,
                onPageSizeChange: handlePageSizeChange,
              }}
            />
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-text-tertiary mb-3" />
              <p className="text-text-secondary">
                {t("mis.staff.list.noStaffFound")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("mis.staff.messages.deleteConfirm")}
      >
        <div className="space-y-4">
          <Alert variant="warning">
            {t("mis.staff.messages.deleteWarning")}
          </Alert>
          {staffToDelete && (
            <p className="text-text-secondary">
              {staffToDelete.full_name} ({staffToDelete.staff_id})
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t("mis.common.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteStaff.isPending}
            >
              {t("mis.common.delete")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={t("mis.staff.list.exportStaff")}
      >
        <div className="space-y-4">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => {
              // TODO: Implement export functionality
              setExportModalOpen(false);
            }}
            className="w-full justify-start"
          >
            <div className="text-left">
              <p className="font-medium">Full Export (CSV)</p>
              <p className="text-xs text-text-secondary">
                All staff details with current filters
              </p>
            </div>
          </Button>
        </div>
      </Modal>
    </div>
  );
}
