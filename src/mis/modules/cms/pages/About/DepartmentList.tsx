/**
 * DepartmentList Page
 * Admin panel for managing departments
 */

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Save,
  X,
  Loader2,
  Globe,
} from "lucide-react";
import { Button, Modal, ModalFooter, Spinner } from "@mis-components/ui";
import Input from "@mis-components/ui/Input";
import PageHeader from "@mis-components/PageHeader";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "../../hooks/useCmsAbout";
import type { Department, DepartmentInput, MultiLangText } from "../../types";

type LangTab = "en" | "da" | "pa";

const LANG_LABELS: Record<LangTab, string> = {
  en: "English",
  da: "Dari (دری)",
  pa: "Pashto (پښتو)",
};

const EMPTY_MULTILANG: MultiLangText = { en: "", da: "", pa: "" };

export default function DepartmentList() {
  const { data: departments = [], isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();

  const [showForm, setShowForm] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<MultiLangText>({
    ...EMPTY_MULTILANG,
  });
  const [activeLang, setActiveLang] = useState<LangTab>("en");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    department: Department | null;
  }>({ isOpen: false, department: null });

  const openCreateForm = () => {
    setEditingDept(null);
    setFormData({ ...EMPTY_MULTILANG });
    setActiveLang("en");
    setErrors({});
    setShowForm(true);
  };

  const openEditForm = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ ...dept.name });
    setActiveLang("en");
    setErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingDept(null);
    setFormData({ ...EMPTY_MULTILANG });
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.en.trim()) newErrors.name_en = "English name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const input: DepartmentInput = { name: formData };

    if (editingDept) {
      updateMutation.mutate(
        { id: editingDept.id, input },
        { onSuccess: closeForm },
      );
    } else {
      createMutation.mutate(input, { onSuccess: closeForm });
    }
  };

  const handleDelete = () => {
    if (deleteModal.department) {
      deleteMutation.mutate(deleteModal.department.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, department: null }),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
        title="Departments"
        subtitle={`Manage departments for team members · ${departments.length} total`}
        actions={[
          {
            label: "Add Department",
            icon: <Plus className="h-4 w-4" />,
            onClick: openCreateForm,
            variant: "primary",
          },
        ]}
      />

      {/* Inline Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-card border border-primary/20 rounded-xl shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingDept ? "Edit Department" : "New Department"}
              </h3>
              <div className="flex gap-1 bg-surface rounded-lg p-1">
                {(Object.keys(LANG_LABELS) as LangTab[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      activeLang === lang
                        ? "bg-primary text-white shadow-sm"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                    }`}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  label={`Department Name (${LANG_LABELS[activeLang]})`}
                  value={formData[activeLang]}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      [activeLang]: e.target.value,
                    }));
                    setErrors({});
                  }}
                  placeholder={`Enter name in ${LANG_LABELS[activeLang]}`}
                  error={errors[`name_${activeLang}`]}
                  dir={activeLang === "en" ? "ltr" : "rtl"}
                />
              </div>
              <div className="flex gap-2 pb-0.5">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSaving}
                  leftIcon={
                    isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )
                  }
                >
                  {editingDept ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="ghost" onClick={closeForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Language completion */}
            <div className="flex gap-3 mt-3">
              {(Object.keys(LANG_LABELS) as LangTab[]).map((lang) => (
                <div key={lang} className="flex items-center gap-1.5 text-xs">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData[lang].trim() ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-muted">{LANG_LABELS[lang]}</span>
                </div>
              ))}
            </div>
          </form>
        </div>
      )}

      {/* Department List */}
      {departments.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No Departments Yet
          </h3>
          <p className="text-text-secondary mb-6 max-w-md">
            Create departments to organize your team members.
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={openCreateForm}
          >
            Add First Department
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary">
                  {dept.name.en || "Untitled"}
                </h3>
                <div className="flex gap-3 mt-1">
                  {dept.name.da && (
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      DA: {dept.name.da}
                    </span>
                  )}
                  {dept.name.pa && (
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      PA: {dept.name.pa}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEditForm(dept)}
                  className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: true, department: dept })
                  }
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
        onClose={() => setDeleteModal({ isOpen: false, department: null })}
        title="Delete Department"
        description="Are you sure you want to delete this department? Team members in this department will need to be reassigned."
        size="sm"
        footer={
          <ModalFooter
            onCancel={() => setDeleteModal({ isOpen: false, department: null })}
            onConfirm={handleDelete}
            cancelText="Cancel"
            confirmText="Delete"
            confirmVariant="danger"
            loading={deleteMutation.isPending}
          />
        }
      >
        {deleteModal.department && (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-text-primary">
                {deleteModal.department.name.en || "Untitled"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
