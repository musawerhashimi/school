/**
 * TeamMemberForm Page
 * Create or edit a team member (teacher/staff)
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Loader2, User, Globe, Plus, X } from "lucide-react";
import { Button, Spinner } from "@mis-components/ui";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import Input from "@mis-components/ui/Input";
import Textarea from "@mis-components/ui/Textarea";
import Select from "@mis-components/ui/Select";
import {
  useTeamMemberDetail,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDepartments,
} from "../../hooks/useCmsAbout";
import type {
  TeamMemberInput,
  MultiLangText,
  TeamMemberType,
} from "../../types";

type LangTab = "en" | "da" | "pa";

const LANG_LABELS: Record<LangTab, string> = {
  en: "English",
  da: "Dari (دری)",
  pa: "Pashto (پښتو)",
};

const EMPTY_MULTILANG: MultiLangText = { en: "", da: "", pa: "" };

export default function TeamMemberForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: memberDetail, isLoading: memberLoading } = useTeamMemberDetail(
    Number(id) || 0,
  );
  const { data: departments = [] } = useDepartments();
  const createMutation = useCreateTeamMember();
  const updateMutation = useUpdateTeamMember();

  const [activeLang, setActiveLang] = useState<LangTab>("en");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "teacher" as TeamMemberType,
    role: { ...EMPTY_MULTILANG },
    department_id: 0,
    email: "",
    phone: "",
    experience: { ...EMPTY_MULTILANG },
    bio: { ...EMPTY_MULTILANG },
    education: [{ ...EMPTY_MULTILANG }] as MultiLangText[],
    joinedDate: "",
    subjects: [] as string[],
  });

  const [newSubject, setNewSubject] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load member data when editing
  useEffect(() => {
    if (memberDetail) {
      setFormData({
        name: memberDetail.name,
        type: memberDetail.type ?? memberDetail.member_type ?? "teacher",
        role: { ...memberDetail.role },
        department_id: memberDetail.department_id,
        email: memberDetail.email,
        phone: memberDetail.phone,
        experience: { ...memberDetail.experience },
        bio: { ...memberDetail.bio },
        education: memberDetail.education.map((e) => ({ ...e })),
        joinedDate: memberDetail.joinedDate ?? memberDetail.joined_date ?? "",
        subjects: memberDetail.subjects
          ? memberDetail.subjects.map((s) => (typeof s === "string" ? s : s.en))
          : [],
      });
      if (memberDetail.image) {
        setImagePreview(memberDetail.image);
      }
    }
  }, [memberDetail]);

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
    field: "role" | "experience" | "bio",
    lang: LangTab,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${field}_${lang}`];
      return newErrors;
    });
  };

  const handleEducationChange = (
    index: number,
    lang: LangTab,
    value: string,
  ) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = { ...newEducation[index], [lang]: value };
      return { ...prev, education: newEducation };
    });
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { ...EMPTY_MULTILANG }],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addSubject = () => {
    if (newSubject.trim()) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }));
      setNewSubject("");
    }
  };

  const removeSubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.role.en.trim())
      newErrors.role_en = "English role is required";
    if (formData.department_id === 0)
      newErrors.department_id = "Department is required";
    if (!formData.joinedDate) newErrors.joinedDate = "Joined date is required";
    if (!isEdit && !imageFile) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const input: TeamMemberInput = {
      name: formData.name,
      type: formData.type,
      role: formData.role,
      image: imageFile,
      department_id: formData.department_id,
      email: formData.email,
      phone: formData.phone,
      experience: formData.experience,
      bio: formData.bio,
      education: formData.education,
      joinedDate: formData.joinedDate,
      subjects: formData.type === "teacher" ? formData.subjects : undefined,
    };

    if (isEdit) {
      updateMutation.mutate(
        { id: Number(id), input },
        { onSuccess: () => navigate("/mis/cms/about/team") },
      );
    } else {
      createMutation.mutate(input, {
        onSuccess: () => navigate("/mis/cms/about/team"),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isEdit && memberLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const departmentOptions = departments.map((d) => ({
    value: String(d.id),
    label: d.name.en,
  }));

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/mis/cms/about/team")}
          className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEdit ? "Edit Team Member" : "Add New Team Member"}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {isEdit
              ? "Update team member information"
              : "Add a new teacher or staff member"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <User className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="member-image"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
                        errors.image
                          ? "bg-red-50 text-red-600 border border-red-300 dark:bg-red-900/10"
                          : "bg-surface text-text-secondary hover:bg-surface-hover border border-border"
                      }`}
                    >
                      {imagePreview ? "Change Photo" : "Upload Photo"}
                      <input
                        id="member-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="Enter full name"
                error={errors.name}
              />

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Member Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: "teacher" }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      formData.type === "teacher"
                        ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700"
                        : "bg-card text-text-secondary border-border hover:border-primary/30"
                    }`}
                  >
                    Teacher
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: "staff" }))
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      formData.type === "staff"
                        ? "bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                        : "bg-card text-text-secondary border-border hover:border-primary/30"
                    }`}
                  >
                    Staff
                  </button>
                </div>
              </div>

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, email: e.target.value }));
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="email@example.com"
                error={errors.email}
              />

              {/* Phone */}
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+93 700 000 000"
              />

              {/* Department */}
              <Select
                label="Department"
                value={String(formData.department_id)}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    department_id: Number(e.target.value),
                  }));
                  setErrors((prev) => ({ ...prev, department_id: "" }));
                }}
                options={[
                  { value: "0", label: "Select Department" },
                  ...departmentOptions,
                ]}
                error={errors.department_id}
              />

              {/* Joined Date */}
              <Input
                label="Joined Date"
                type="date"
                value={formData.joinedDate}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    joinedDate: e.target.value,
                  }));
                  setErrors((prev) => ({ ...prev, joinedDate: "" }));
                }}
                error={errors.joinedDate}
              />
            </div>
          </CardContent>
        </Card>

        {/* Multi-language Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Multi-language Content
              </h2>
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
              {/* Role */}
              <Input
                label={`Role / Position (${LANG_LABELS[activeLang]})`}
                value={formData.role[activeLang]}
                onChange={(e) =>
                  handleMultiLangChange("role", activeLang, e.target.value)
                }
                placeholder={`Enter role in ${LANG_LABELS[activeLang]}`}
                error={errors[`role_${activeLang}`]}
                dir={activeLang === "en" ? "ltr" : "rtl"}
              />

              {/* Experience */}
              <Input
                label={`Experience (${LANG_LABELS[activeLang]})`}
                value={formData.experience[activeLang]}
                onChange={(e) =>
                  handleMultiLangChange(
                    "experience",
                    activeLang,
                    e.target.value,
                  )
                }
                placeholder={`e.g., 10 years of experience`}
                dir={activeLang === "en" ? "ltr" : "rtl"}
              />

              {/* Bio */}
              <Textarea
                label={`Biography (${LANG_LABELS[activeLang]})`}
                value={formData.bio[activeLang]}
                onChange={(e) =>
                  handleMultiLangChange("bio", activeLang, e.target.value)
                }
                placeholder={`Enter biography in ${LANG_LABELS[activeLang]}`}
                rows={4}
                dir={activeLang === "en" ? "ltr" : "rtl"}
              />

              {/* Education */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-text-primary">
                    Education ({LANG_LABELS[activeLang]})
                  </label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                  >
                    <Plus className="h-3 w-3" />
                    Add Education
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={edu[activeLang]}
                        onChange={(e) =>
                          handleEducationChange(
                            index,
                            activeLang,
                            e.target.value,
                          )
                        }
                        placeholder={`e.g., Bachelor's in Computer Science`}
                        dir={activeLang === "en" ? "ltr" : "rtl"}
                      />
                      {formData.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Language completion indicators */}
              <div className="flex gap-3 pt-2 border-t border-border">
                {(Object.keys(LANG_LABELS) as LangTab[]).map((lang) => {
                  const hasRole = formData.role[lang].trim().length > 0;
                  const hasBio = formData.bio[lang].trim().length > 0;
                  const hasExp = formData.experience[lang].trim().length > 0;
                  const completedFields = [hasRole, hasBio, hasExp].filter(
                    Boolean,
                  ).length;

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

        {/* Subjects (Teachers only) */}
        {formData.type === "teacher" && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-text-primary">
                Subjects
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Enter subject name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubject();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addSubject}
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Add
                  </Button>
                </div>
                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 text-secondary rounded-lg text-sm"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => removeSubject(index)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formData.subjects.length === 0 && (
                  <p className="text-sm text-muted">
                    No subjects added yet. Type a subject name and press Enter
                    or click Add.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/mis/cms/about/team")}
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
            {isEdit ? "Update Member" : "Create Member"}
          </Button>
        </div>
      </form>
    </div>
  );
}
