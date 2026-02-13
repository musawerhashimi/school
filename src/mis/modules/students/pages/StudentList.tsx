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
  Printer,
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
  useStudents,
  useDeleteStudent,
  useBulkUpdateStudentStatus,
} from "../hooks/useStudents";
import type {
  StudentListApiResponse,
  StudentFilters,
} from "../types";
import {
  exportFilteredStudents,
  exportStudentsSummary,
  printStudentList,
} from "../utils/exportStudents";

export default function StudentList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Filters state
  const [filters, setFilters] = useState<StudentFilters>({
    page: 1,
    page_size: 10,
    search: "",
    class_id: undefined,
    section: "",
    status: "",
    gender: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] =
    useState<StudentListApiResponse | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // React Query hooks
  const { data, isLoading, isError, error } = useStudents(filters);
  const deleteStudent = useDeleteStudent();
  const bulkUpdateStatus = useBulkUpdateStudentStatus();

  // Filter change handlers
  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
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
      class_id: undefined,
      section: "",
      status: "",
      gender: "",
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.class_id ||
    filters.section ||
    filters.status ||
    filters.gender
  );

  // Delete handlers
  const handleDeleteClick = (student: StudentListApiResponse) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      deleteStudent.mutate(studentToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        },
      });
    }
  };

  // Bulk actions
  const handleBulkStatusUpdate = (status: string) => {
    bulkUpdateStatus.mutate(
      { ids: selectedStudents, status },
      {
        onSuccess: () => {
          setSelectedStudents([]);
        },
      }
    );
  };

  // Table columns
  const columns: Column<StudentListApiResponse>[] = [
    {
      key: "student_id",
      label: t("mis.student.list.columnStudentId"),
      header: t("mis.student.list.columnStudentId"),
      sortable: true,
      render: (row) => (
        <span className="font-mono text-sm font-medium text-primary">
          {row.student_id}
        </span>
      ),
    },
    {
      key: "full_name",
      label: t("mis.student.list.columnStudent"),
      header: t("mis.student.list.columnStudent"),
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
      key: "class_name",
      label: t("mis.student.list.columnClass"),
      header: t("mis.student.list.columnClass"),
      sortable: true,
      render: (row) => (
        <span className="font-medium text-text-primary">
          {row.class_name || "N/A"} {row.section ? `- ${row.section}` : ""}
        </span>
      ),
    },
    {
      key: "roll_number",
      label: t("mis.student.list.columnRollNo"),
      header: t("mis.student.list.columnRollNo"),
      sortable: true,
      render: (row) => (
        <span className="text-sm text-text-secondary font-mono">
          {row.roll_number || "N/A"}
        </span>
      ),
    },
    {
      key: "primary_guardian_name",
      label: t("mis.student.list.columnParentGuardian"),
      header: t("mis.student.list.columnParentGuardian"),
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm text-text-primary">
            {row.primary_guardian_name || "N/A"}
          </p>
          <p className="text-xs text-text-secondary">
            {row.primary_guardian_phone || ""}
          </p>
        </div>
      ),
    },
    {
      key: "gender",
      label: t("mis.student.list.columnGender"),
      header: t("mis.student.list.columnGender"),
      render: (row) => (
        <span className="text-sm text-text-secondary capitalize">
          {row.gender_display}
        </span>
      ),
    },
    {
      key: "status",
      label: t("mis.student.list.columnStatus"),
      header: t("mis.student.list.columnStatus"),
      render: (row) => {
        const getVariant = (
          status: string
        ): "success" | "warning" | "danger" | "secondary" | "info" => {
          if (status === "active") return "success";
          if (status === "inactive") return "warning";
          if (status === "graduated") return "info";
          if (status === "transferred") return "secondary";
          if (status === "suspended" || status === "expelled") return "danger";
          return "secondary";
        };
        return (
          <Badge variant={getVariant(row.status)}>{row.status_display}</Badge>
        );
      },
    },
    {
      key: "actions",
      label: t("mis.student.list.columnActions"),
      header: t("mis.student.list.columnActions"),
      render: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/students/${row.id}`);
            }}
            title={t("mis.student.list.viewDetails")}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/mis/students/${row.id}/edit`);
            }}
            title={t("mis.student.list.editStudent")}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4 text-error" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title={t("mis.student.list.deleteStudent")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={t("mis.student.list.pageTitle")}
        subtitle={t("mis.student.list.pageSubtitle")}
        actions={[
          {
            label: t("mis.student.list.addStudent"),
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/mis/students/new"),
            variant: "primary",
          },
          {
            label: t("mis.student.list.export"),
            icon: <Download className="h-4 w-4" />,
            onClick: () => setExportModalOpen(true),
            variant: "outline",
          },
        ]}
      />

      {/* Statistics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">{t("mis.student.list.totalStudents")}</p>
              <p className="text-2xl font-bold text-text-primary">
                {data.count}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">{t("mis.student.list.currentPage")}</p>
              <p className="text-2xl font-bold text-primary">
                {data.results.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">{t("mis.student.list.totalPages")}</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.ceil(data.count / (filters.page_size || 10))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">{t("mis.student.list.page")}</p>
              <p className="text-2xl font-bold text-text-primary">
                {filters.page || 1} /{" "}
                {Math.ceil(data.count / (filters.page_size || 10))}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-text-secondary">{t("mis.student.list.perPage")}</p>
              <p className="text-2xl font-bold text-text-primary">
                {filters.page_size || 10}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={showFilters ? "primary" : "outline"}
          leftIcon={<Filter className="h-4 w-4" />}
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          {t("mis.student.list.filters")}{" "}
          {hasActiveFilters &&
            `(${
              Object.values(filters).filter((v) => v && v !== 1 && v !== 10)
                .length
            })`}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            leftIcon={<X className="h-4 w-4" />}
            size="sm"
            onClick={clearFilters}
          >
            {t("mis.student.list.clearFilters")}
          </Button>
        )}

        {selectedStudents.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="primary">{selectedStudents.length} {t("mis.student.list.selected")}</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusUpdate("active")}
            >
              {t("mis.student.list.markActive")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusUpdate("inactive")}
            >
              {t("mis.student.list.markInactive")}
            </Button>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label={t("mis.nav.search")}
                placeholder={t("mis.student.list.searchPlaceholder")}
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />

              <Select
                label={t("mis.student.list.classFilter")}
                value={String(filters.class_id || "")}
                onChange={(e) => handleFilterChange("class_id", e.target.value)}
                options={[
                  { label: t("mis.student.list.allClasses"), value: "" },
                  { label: "Class 9", value: "c9" },
                  { label: "Class 10", value: "c10" },
                  { label: "Class 11", value: "c11" },
                  { label: "Class 12", value: "c12" },
                ]}
              />

              <Select
                label={t("mis.student.list.sectionFilter")}
                value={filters.section || ""}
                onChange={(e) => handleFilterChange("section", e.target.value)}
                options={[
                  { label: t("mis.student.list.allSections"), value: "" },
                  { label: "Section A", value: "A" },
                  { label: "Section B", value: "B" },
                  { label: "Section C", value: "C" },
                ]}
              />

              <Select
                label={t("mis.student.list.statusFilter")}
                value={filters.status || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={[
                  { label: t("mis.student.list.allStatuses"), value: "" },
                  { label: t("mis.student.list.statusActive"), value: "active" },
                  { label: t("mis.student.list.statusInactive"), value: "inactive" },
                  { label: t("mis.student.list.statusGraduated"), value: "graduated" },
                  { label: t("mis.student.list.statusTransferred"), value: "transferred" },
                  { label: t("mis.student.list.statusSuspended"), value: "suspended" },
                ]}
              />

              <Select
                label={t("mis.student.list.genderFilter")}
                value={filters.gender || ""}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                options={[
                  { label: t("mis.student.list.allGenders"), value: "" },
                  { label: t("mis.student.male"), value: "male" },
                  { label: t("mis.student.female"), value: "female" },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="error" title={t("mis.student.list.errorLoading")}>
          {error instanceof Error ? error.message : t("mis.student.list.errorLoading")}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label={t("mis.student.list.loadingStudents")} />
        </div>
      )}

      {/* Data Table */}
      {!isLoading && data && (
        <DataTable
          columns={columns}
          data={data.results}
          searchable={false} // We handle search with filters
          selectable
          selectedRows={data.results.filter((s) =>
            selectedStudents.includes(s.id)
          )}
          onSelectionChange={(selected) =>
            setSelectedStudents(selected.map((s) => s.id))
          }
          onRowClick={(row) => navigate(`/mis/students/${row.id}`)}
          emptyMessage={t("mis.student.list.noStudentsFound")}
          getRowKey={(row) => String(row.id)}
        />
      )}

      {/* Pagination */}
      {!isLoading &&
        data &&
        (() => {
          const currentPage = filters.page || 1;
          const pageSize = filters.page_size || 10;
          const totalPages = Math.ceil(data.count / pageSize);
          const from = (currentPage - 1) * pageSize + 1;
          const to = Math.min(currentPage * pageSize, data.count);
          const total = data.count;
          return (
            totalPages > 1 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-secondary">
                  {t("mis.student.list.showingResults", { from, to, total })}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) - 1,
                      }))
                    }
                    disabled={currentPage === 1}
                  >
                    {t("mis.student.list.previous")}
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "primary" : "outline"}
                          size="sm"
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, page }))
                          }
                        >
                          {page}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        page: (prev.page || 1) + 1,
                      }))
                    }
                    disabled={currentPage === totalPages}
                  >
                    {t("mis.student.list.next")}
                  </Button>
                </div>
              </div>
            )
          );
        })()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        title={t("mis.student.list.deleteModalTitle")}
        size="sm"
      >
        {studentToDelete && (
          <div className="space-y-4">
            <p className="text-text-secondary">
              {t("mis.student.list.deleteModalConfirm")}{" "}
              <span className="font-semibold text-text-primary">
                {studentToDelete.full_name}
              </span>{" "}
              ({studentToDelete.student_id})? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setStudentToDelete(null);
                }}
              >
                {t("mis.student.list.cancel")}
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteStudent.isPending}
              >
                {t("mis.student.list.delete")}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Export Options Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={t("mis.student.list.exportModalTitle")}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {t("mis.student.list.exportPrompt")}{" "}
            <span className="font-semibold text-text-primary">
              {data?.results.length || 0} students
            </span>
            {hasActiveFilters && " (filtered results)"}
          </p>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={() => {
                if (data?.results) {
                  exportFilteredStudents(data.results, filters);
                  setExportModalOpen(false);
                }
              }}
            >
              <div className="text-left flex-1">
                <p className="font-medium">{t("mis.student.list.fullExportCsv")}</p>
                <p className="text-xs text-text-secondary">
                  {t("mis.student.list.fullExportDesc")}
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon={<FileText className="h-4 w-4" />}
              onClick={() => {
                if (data?.results) {
                  exportStudentsSummary(data.results);
                  setExportModalOpen(false);
                }
              }}
            >
              <div className="text-left flex-1">
                <p className="font-medium">{t("mis.student.list.summaryExportCsv")}</p>
                <p className="text-xs text-text-secondary">
                  {t("mis.student.list.summaryExportDesc")}
                </p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => {
                if (data?.results) {
                  printStudentList(data.results);
                  setExportModalOpen(false);
                }
              }}
            >
              <div className="text-left flex-1">
                <p className="font-medium">{t("mis.student.list.printList")}</p>
                <p className="text-xs text-text-secondary">
                  {t("mis.student.list.printListDesc")}
                </p>
              </div>
            </Button>
          </div>

          <Alert variant="info" title="Note">
            {t("mis.student.list.exportNote")}
          </Alert>

          <div className="flex justify-end pt-2 border-t">
            <Button variant="ghost" onClick={() => setExportModalOpen(false)}>
              {t("mis.student.list.cancel")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
