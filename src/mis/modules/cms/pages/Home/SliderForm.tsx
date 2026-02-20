/**
 * SliderForm Page
 * Create or edit a hero slider
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Globe,
} from "lucide-react";
import { Button, Spinner, Switch } from "@mis-components/ui";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import Input from "@mis-components/ui/Input";
import Textarea from "@mis-components/ui/Textarea";
import {
  useHeroSlider,
  useCreateHeroSlider,
  useUpdateHeroSlider,
} from "../../hooks/useCmsHome";
import type { HeroSliderInput } from "../../types";

type LangTab = "en" | "da" | "pa";

const LANG_LABELS: Record<LangTab, string> = {
  en: "English",
  da: "Dari (دری)",
  pa: "Pashto (پښتو)",
};

export default function SliderForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: slider, isLoading: sliderLoading } = useHeroSlider(
    Number(id) || 0,
  );
  const createMutation = useCreateHeroSlider();
  const updateMutation = useUpdateHeroSlider();

  const [activeLang, setActiveLang] = useState<LangTab>("en");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: { en: "", da: "", pa: "" },
    subtitle: { en: "", da: "", pa: "" },
    description: { en: "", da: "", pa: "" },
    is_active: true,
    order: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load slider data when editing
  useEffect(() => {
    if (slider) {
      setFormData({
        title: { ...slider.title },
        subtitle: { ...slider.subtitle },
        description: { ...slider.description },
        is_active: slider.is_active,
        order: slider.order,
      });
      if (slider.image) {
        setImagePreview(slider.image);
      }
    }
  }, [slider]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMultiLangChange = (
    field: "title" | "subtitle" | "description",
    lang: LangTab,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${field}_${lang}`];
      return newErrors;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.en.trim()) {
      newErrors.title_en = "English title is required";
    }
    if (!formData.subtitle.en.trim()) {
      newErrors.subtitle_en = "English subtitle is required";
    }
    if (!isEdit && !imageFile) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const input: HeroSliderInput = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      image: imageFile,
      is_active: formData.is_active,
      order: formData.order,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: Number(id), input },
        {
          onSuccess: () => navigate("/mis/cms/home/sliders"),
        },
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => navigate("/mis/cms/home/sliders"),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && sliderLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/mis/cms/home/sliders")}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEdit ? "Edit Slider" : "Create New Slider"}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isEdit
              ? "Update the slider content and settings"
              : "Add a new hero slider to the home page"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Slider Image
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-surface">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div>
                <label
                  htmlFor="slider-image"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                    errors.image
                      ? "border-red-400 bg-red-50 dark:bg-red-900/10"
                      : "border-border hover:border-primary/50 hover:bg-surface"
                  }`}
                >
                  <ImageIcon className="h-8 w-8 text-muted mb-2" />
                  <span className="text-sm text-text-secondary">
                    {imagePreview ? "Change image" : "Click to upload image"}
                  </span>
                  <span className="text-xs text-muted mt-1">
                    Recommended: 1920×1080px, JPG or PNG
                  </span>
                  <input
                    id="slider-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-language Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Slider Content
              </h2>
              {/* Language Tabs */}
              <div className="flex gap-1 bg-surface rounded-lg p-1">
                {(Object.keys(LANG_LABELS) as LangTab[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
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
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <Input
                  label={`Title (${LANG_LABELS[activeLang]})`}
                  value={formData.title[activeLang]}
                  onChange={(e) =>
                    handleMultiLangChange("title", activeLang, e.target.value)
                  }
                  placeholder={`Enter title in ${LANG_LABELS[activeLang]}`}
                  error={errors[`title_${activeLang}`]}
                  dir={activeLang === "en" ? "ltr" : "rtl"}
                />
              </div>

              {/* Subtitle */}
              <div>
                <Input
                  label={`Subtitle (${LANG_LABELS[activeLang]})`}
                  value={formData.subtitle[activeLang]}
                  onChange={(e) =>
                    handleMultiLangChange(
                      "subtitle",
                      activeLang,
                      e.target.value,
                    )
                  }
                  placeholder={`Enter subtitle in ${LANG_LABELS[activeLang]}`}
                  error={errors[`subtitle_${activeLang}`]}
                  dir={activeLang === "en" ? "ltr" : "rtl"}
                />
              </div>

              {/* Description */}
              <div>
                <Textarea
                  label={`Description (${LANG_LABELS[activeLang]})`}
                  value={formData.description[activeLang]}
                  onChange={(e) =>
                    handleMultiLangChange(
                      "description",
                      activeLang,
                      e.target.value,
                    )
                  }
                  placeholder={`Enter description in ${LANG_LABELS[activeLang]}`}
                  rows={4}
                  dir={activeLang === "en" ? "ltr" : "rtl"}
                />
              </div>

              {/* Language completion indicators */}
              <div className="flex gap-3 pt-2 border-t border-border">
                {(Object.keys(LANG_LABELS) as LangTab[]).map((lang) => {
                  const hasTitle = formData.title[lang].trim().length > 0;
                  const hasSubtitle = formData.subtitle[lang].trim().length > 0;
                  const hasDesc = formData.description[lang].trim().length > 0;
                  const completedFields = [
                    hasTitle,
                    hasSubtitle,
                    hasDesc,
                  ].filter(Boolean).length;

                  return (
                    <div key={lang} className="flex items-center gap-2 text-xs">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          completedFields === 3
                            ? "bg-green-500"
                            : completedFields > 0
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <span className="text-muted">
                        {LANG_LABELS[lang]}: {completedFields}/3
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary">
              Settings
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Display Order"
                  type="number"
                  value={String(formData.order)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted mt-1">
                  Lower numbers appear first
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  label="Active"
                />
                <span className="text-sm text-text-secondary">
                  {formData.is_active
                    ? "Slider is visible on the home page"
                    : "Slider is hidden from the home page"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/mis/cms/home/sliders")}
            disabled={isSaving}
          >
            Cancel
          </Button>
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
            {isEdit ? "Update Slider" : "Create Slider"}
          </Button>
        </div>
      </form>
    </div>
  );
}
