/**
 * SliderList Page
 * Admin panel for managing hero sliders
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import { Button, Modal, ModalFooter, Spinner } from "@mis-components/ui";
import PageHeader from "@mis-components/PageHeader";
import {
  useHeroSliders,
  useDeleteHeroSlider,
  useToggleHeroSlider,
} from "../../hooks/useCmsHome";
import type { HeroSlider } from "../../types";

export default function SliderList() {
  const navigate = useNavigate();
  const { data: sliders = [], isLoading } = useHeroSliders();
  const deleteMutation = useDeleteHeroSlider();
  const toggleMutation = useToggleHeroSlider();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    slider: HeroSlider | null;
  }>({ isOpen: false, slider: null });

  const handleDelete = () => {
    if (deleteModal.slider) {
      deleteMutation.mutate(deleteModal.slider.id, {
        onSuccess: () => setDeleteModal({ isOpen: false, slider: null }),
      });
    }
  };

  const handleToggleActive = (slider: HeroSlider) => {
    toggleMutation.mutate({
      id: slider.id,
      isActive: !slider.is_active,
    });
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
        title="Hero Sliders"
        subtitle="Manage the hero slider images and content on the home page"
        actions={[
          {
            label: "Add Slider",
            icon: <Plus className="h-4 w-4" />,
            onClick: () => navigate("/mis/cms/home/sliders/new"),
            variant: "primary",
          },
        ]}
      />

      {sliders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No Sliders Yet
          </h3>
          <p className="text-text-secondary mb-6 max-w-md">
            Create your first hero slider to display on the home page. Sliders
            help showcase important content to visitors.
          </p>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/mis/cms/home/sliders/new")}
          >
            Add First Slider
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders
            .sort((a, b) => a.order - b.order)
            .map((slider) => (
              <div
                key={slider.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  slider.is_active
                    ? "bg-card border-border hover:border-primary/30"
                    : "bg-surface/50 border-border/50 opacity-70"
                }`}
              >
                {/* Drag Handle */}
                <div className="cursor-grab text-muted hover:text-text-secondary">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Image Preview */}
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                  {slider.image ? (
                    <img
                      src={slider.image}
                      alt={slider.title.en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary truncate">
                      {slider.title.en || "Untitled"}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        slider.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {slider.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="text-xs text-muted">
                      Order: {slider.order}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">
                    {slider.subtitle.en || "No subtitle"}
                  </p>
                  <p className="text-xs text-muted mt-1 truncate">
                    {slider.description.en || "No description"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggleActive(slider)}
                    className={`p-2 rounded-lg transition-colors ${
                      slider.is_active
                        ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                        : "text-muted hover:bg-surface-hover"
                    }`}
                    title={slider.is_active ? "Deactivate" : "Activate"}
                  >
                    {slider.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/mis/cms/home/sliders/${slider.id}/edit`)
                    }
                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, slider })}
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
        onClose={() => setDeleteModal({ isOpen: false, slider: null })}
        title="Delete Slider"
        description="Are you sure you want to delete this slider? This action cannot be undone."
        size="sm"
        footer={
          <ModalFooter
            onCancel={() => setDeleteModal({ isOpen: false, slider: null })}
            onConfirm={handleDelete}
            cancelText="Cancel"
            confirmText="Delete"
            confirmVariant="danger"
            loading={deleteMutation.isPending}
          />
        }
      >
        {deleteModal.slider && (
          <div className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            {deleteModal.slider.image && (
              <img
                src={deleteModal.slider.image}
                alt={deleteModal.slider.title.en}
                className="w-16 h-10 rounded object-cover"
              />
            )}
            <div>
              <p className="font-medium text-text-primary">
                {deleteModal.slider.title.en || "Untitled"}
              </p>
              <p className="text-sm text-text-secondary">
                {deleteModal.slider.subtitle.en || "No subtitle"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
