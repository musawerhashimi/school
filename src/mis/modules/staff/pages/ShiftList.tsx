import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2, Filter, X, Clock, Users } from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  DataTable,
  Button,
  Badge,
  Input,
  Select,
  Card,
  CardContent,
  Modal,
  Alert,
  Spinner,
  type Column,
} from "@mis-components/ui";
import { useShifts, useDeleteShift } from "../hooks/useShifts";
import type { ShiftApiResponse, ShiftFilters } from "../types";
import ShiftForm from "../components/ShiftForm";

export default function ShiftList() {
  const { t } = useTranslation();

  // Filters state
  const [filters, setFilters] = useState<ShiftFilters>({
    page: 1,
    page_size: 10,
    search: "",
    shift_type: undefined,
    is_active: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<ShiftApiResponse | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shiftToEdit, setShiftToEdit] = useState<ShiftApiResponse | null>(null);

  // React Query hooks
  const { data, isLoading, isError, error } = useShifts(filters);
  const deleteShift = useDeleteShift();

  // Filter change handlers
  const handleFilterChange = (
    key: keyof ShiftFilters,
    value: string | boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      page_size: 10,
      search: "",
      shift_type: undefined,
      is_active: undefined,
    });
    setShowFilters(false);
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.shift_type ||
    filters.is_active !== undefined
  );

  // Delete handlers
  const handleDeleteClick = (shift: ShiftApiResponse) => {
    setShiftToDelete(shift);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (shiftToDelete) {
      deleteShift.mutate(shiftToDelete.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setShiftToDelete(null);
        },
      });
    }
  };

  // Edit handlers
  const handleEditClick = (shift: ShiftApiResponse) => {
    setShiftToEdit(shift);
    setEditModalOpen(true);
  };

  // Table columns
  const columns: Column<ShiftApiResponse>[] = [
    {
      key: "name",
      label: t("mis.staff.shifts.shiftName"),
      header: t("mis.staff.shifts.shiftName"),
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-text-primary">{row.name}</p>
          {row.name_dari && (
            <p className="text-xs text-text-secondary">{row.name_dari}</p>
          )}
        </div>
      ),
    },
    {
      key: "shift_type",
      label: t("mis.staff.shifts.shiftType"),
      header: t("mis.staff.shifts.shiftType"),
      sortable: true,
      render: (row) => <Badge variant="info">{row.shift_type_display}</Badge>,
    },
    {
      key: "start_time",
      label: t("mis.staff.shifts.startTime"),
      header: t("mis.staff.shifts.startTime"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" />
          <span className="font-mono text-sm">{row.start_time}</span>
        </div>
      ),
    },
    {
      key: "end_time",
      label: t("mis.staff.shifts.endTime"),
      header: t("mis.staff.shifts.endTime"),
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-text-tertiary" />
          <span className="font-mono text-sm">{row.end_time}</span>
        </div>
      ),
    },
    {
      key: "duration_minutes",
      label: t("mis.staff.shifts.duration"),
      header: t("mis.staff.shifts.duration"),
      render: (row) => (
        <span className="text-sm text-text-secondary">
          {Math.floor(row.duration_minutes / 60)}h {row.duration_minutes % 60}m
        </span>
      ),
    },
    {
      key: "working_days",
      label: t("mis.staff.shifts.workingDays"),
      header: t("mis.staff.shifts.workingDays"),
      render: (row) => {
        const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
        const workingDays = row.working_days
          .split(",")
          .map((d) => days[parseInt(d)])
          .join(", ");
        return (
          <span className="text-sm text-text-secondary">{workingDays}</span>
        );
      },
    },
    {
      key: "assigned_staff_count",
      label: t("mis.staff.shifts.assignedStaff"),
      header: t("mis.staff.shifts.assignedStaff"),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-text-tertiary" />
          <span className="font-medium">{row.assigned_staff_count}</span>
        </div>
      ),
    },
    {
      key: "is_active",
      label: t("mis.staff.shifts.isActive"),
      header: t("mis.staff.shifts.isActive"),
      render: (row) => (
        <Badge variant={row.is_active ? "success" : "secondary"}>
          {row.is_active ? t("mis.common.active") : t("mis.common.inactive")}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: t("mis.common.actions"),
      header: t("mis.common.actions"),
      render: (row) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(row);
            }}
            title={t("mis.staff.shifts.editShift")}
          />
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(row);
            }}
            title={t("mis.common.delete")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("mis.staff.shifts.title")}
        subtitle="Manage work shifts and schedules"
        actions={[
          {
            label: t("mis.staff.shifts.addShift"),
            icon: <Plus className="h-4 w-4" />,
            onClick: () => setEditModalOpen(true),
          },
        ]}
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
                    {
                      Object.values(filters).filter(
                        (v) => v && v !== 1 && v !== 10
                      ).length
                    }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                <Select
                  value={filters.shift_type || ""}
                  onChange={(e) =>
                    handleFilterChange("shift_type", e.target.value)
                  }
                  options={[
                    { value: "", label: "All Shift Types" },
                    {
                      value: "morning",
                      label: t("mis.staff.shifts.types.morning"),
                    },
                    {
                      value: "afternoon",
                      label: t("mis.staff.shifts.types.afternoon"),
                    },
                    {
                      value: "evening",
                      label: t("mis.staff.shifts.types.evening"),
                    },
                    {
                      value: "custom",
                      label: t("mis.staff.shifts.types.custom"),
                    },
                  ]}
                />

                <Select
                  value={
                    filters.is_active === undefined
                      ? ""
                      : filters.is_active.toString()
                  }
                  onChange={(e) =>
                    handleFilterChange("is_active", e.target.value === "true")
                  }
                  options={[
                    { value: "", label: "All Statuses" },
                    { value: "true", label: t("mis.common.active") },
                    { value: "false", label: t("mis.common.inactive") },
                  ]}
                />
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
                Loading shifts...
              </span>
            </div>
          ) : isError ? (
            <div className="p-6">
              <Alert variant="error">
                {error?.message || "Failed to load shifts"}
              </Alert>
            </div>
          ) : data && data.results.length > 0 ? (
            <DataTable
              columns={columns}
              data={data.results}
              onRowClick={(row) => handleEditClick(row)}
              pagination={true}
            />
          ) : (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto text-text-tertiary mb-3" />
              <p className="text-text-secondary">
                No shifts found. Create your first shift to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Shift"
      >
        <div className="space-y-4">
          <Alert variant="warning">
            This action cannot be undone. Staff assigned to this shift will be
            unassigned.
          </Alert>
          {shiftToDelete && (
            <p className="text-text-secondary">
              Are you sure you want to delete{" "}
              <strong>{shiftToDelete.name}</strong>?
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              {t("mis.common.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleteShift.isPending}
              
            >
              {t("mis.common.delete")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit/Create Modal */}
      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setShiftToEdit(null);
          }}
          title={
            shiftToEdit
              ? t("mis.staff.shifts.editShift")
              : t("mis.staff.shifts.addShift")
          }
          size="lg"
        >
          <ShiftForm
            shift={shiftToEdit}
            onSuccess={() => {
              setEditModalOpen(false);
              setShiftToEdit(null);
            }}
            onCancel={() => {
              setEditModalOpen(false);
              setShiftToEdit(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
