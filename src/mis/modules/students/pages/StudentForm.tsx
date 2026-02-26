import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Save,
  School,
  User,
  Users,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@mis-components/ui";
import {
  useCreateStudent,
  useGuardians,
  useStudent,
  useUpdateStudent,
} from "../hooks/useStudents";
import { studentSchema, type StudentFormData } from "../schemas/studentSchema";
import type { CreateStudentData, GuardianApiResponse, UpdateStudentData } from "../types";
import { useCurrentAcademicYear } from "@academic/hooks/useAcademicYears";
import { useClassInstances } from "@academic/hooks/useClassInstances";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Contact", icon: User },
  { id: 3, title: "Academic", icon: School },
  { id: 4, title: "Guardian", icon: Users },
  { id: 5, title: "Health & Previous", icon: Heart },
];

const PROVINCES = [
  { value: "kabul", label: "Kabul" },
  { value: "balkh", label: "Balkh" },
  { value: "herat", label: "Herat" },
  { value: "kandahar", label: "Kandahar" },
  { value: "nangarhar", label: "Nangarhar" },
  { value: "kunduz", label: "Kunduz" },
  { value: "baghlan", label: "Baghlan" },
  { value: "takhar", label: "Takhar" },
  { value: "badakhshan", label: "Badakhshan" },
  { value: "ghazni", label: "Ghazni" },
  { value: "paktia", label: "Paktia" },
  { value: "paktika", label: "Paktika" },
  { value: "khost", label: "Khost" },
  { value: "logar", label: "Logar" },
  { value: "wardak", label: "Wardak" },
  { value: "kapisa", label: "Kapisa" },
  { value: "parwan", label: "Parwan" },
  { value: "panjshir", label: "Panjshir" },
  { value: "bamyan", label: "Bamyan" },
  { value: "daykundi", label: "Daykundi" },
  { value: "ghor", label: "Ghor" },
  { value: "faryab", label: "Faryab" },
  { value: "jawzjan", label: "Jawzjan" },
  { value: "sar_e_pol", label: "Sar-e Pol" },
  { value: "samangan", label: "Samangan" },
  { value: "helmand", label: "Helmand" },
  { value: "farah", label: "Farah" },
  { value: "nimroz", label: "Nimroz" },
  { value: "uruzgan", label: "Uruzgan" },
  { value: "zabul", label: "Zabul" },
  { value: "kunar", label: "Kunar" },
  { value: "laghman", label: "Laghman" },
  { value: "nuristan", label: "Nuristan" },
  { value: "badghis", label: "Badghis" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const RELATION_OPTIONS = [
  { label: "Father", value: "father" },
  { label: "Mother", value: "mother" },
  { label: "Guardian", value: "guardian" },
  { label: "Uncle", value: "uncle" },
  { label: "Aunt", value: "aunt" },
  { label: "Grandfather", value: "grandfather" },
  { label: "Grandmother", value: "grandmother" },
  { label: "Brother", value: "brother" },
  { label: "Sister", value: "sister" },
  { label: "Other", value: "other" },
];

const EDUCATION_LEVEL_RANGES: Record<"primary" | "lower_secondary" | "upper_secondary", [number, number]> = {
  primary: [1, 6],
  lower_secondary: [7, 9],
  upper_secondary: [10, 12],
};

type GuardianMode = "existing" | "new";
type SecondaryGuardianMode = "none" | "existing" | "new";

export default function StudentForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== "new";
  const studentId = isEdit ? parseInt(id || "0", 10) : 0;

  const [currentStep, setCurrentStep] = useState(1);
  const [primaryGuardianMode, setPrimaryGuardianMode] = useState<GuardianMode>("new");
  const [secondaryGuardianMode, setSecondaryGuardianMode] = useState<SecondaryGuardianMode>("none");
  const [guardianSearch, setGuardianSearch] = useState("");

  const { data: student, isLoading: isLoadingStudent } = useStudent(studentId);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const { data: guardiansData, isLoading: isLoadingGuardians } = useGuardians({
    search: guardianSearch || undefined,
    page_size: 100,
  });

  const { data: currentAcademicYear } = useCurrentAcademicYear();
  const { data: classInstances } = useClassInstances({
    academic_year: currentAcademicYear?.id,
    is_active: true,
    page_size: 100,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nationality: "Afghan",
      education_level: "upper_secondary",
      status: "active",
    },
  });

  const selectedEducationLevel = watch("education_level");

  const guardianOptions = useMemo(() => {
    return (guardiansData?.results || []).map((guardian: GuardianApiResponse) => ({
      value: guardian.id.toString(),
      label: `${guardian.full_name} - ${guardian.phone} (${guardian.relation_type})`,
    }));
  }, [guardiansData]);

  const filteredClasses = useMemo(() => {
    const allClasses = classInstances?.results || [];
    if (!selectedEducationLevel) return allClasses;

    const range = EDUCATION_LEVEL_RANGES[selectedEducationLevel];
    if (!range) return allClasses;

    return allClasses.filter(
      (classItem) =>
        classItem.class_level_number >= range[0] && classItem.class_level_number <= range[1]
    );
  }, [classInstances, selectedEducationLevel]);

  useEffect(() => {
    if (primaryGuardianMode === "new") {
      setValue("primary_guardian_id", undefined);
      if (!getValues("primary_guardian")) {
        setValue("primary_guardian", {
          first_name: "",
          last_name: "",
          relation_type: "father",
          phone: "",
          phone_secondary: "",
          email: "",
          occupation: "",
          address: "",
          national_id: "",
        });
      }
    } else {
      setValue("primary_guardian", undefined);
      clearErrors("primary_guardian");
    }
  }, [primaryGuardianMode, setValue, getValues, clearErrors]);

  useEffect(() => {
    if (secondaryGuardianMode === "none") {
      setValue("secondary_guardian_id", null);
      setValue("secondary_guardian", undefined);
      clearErrors("secondary_guardian");
      return;
    }

    if (secondaryGuardianMode === "existing") {
      setValue("secondary_guardian", undefined);
      clearErrors("secondary_guardian");
      return;
    }

    setValue("secondary_guardian_id", undefined);
    if (!getValues("secondary_guardian")) {
      setValue("secondary_guardian", {
        first_name: "",
        last_name: "",
        relation_type: "guardian",
        phone: "",
        phone_secondary: "",
        email: "",
        occupation: "",
        address: "",
        national_id: "",
      });
    }
  }, [secondaryGuardianMode, setValue, getValues, clearErrors]);

  useEffect(() => {
    if (!isEdit || !student) return;

    setValue("first_name", student.first_name);
    setValue("last_name", student.last_name);
    setValue("father_name", student.father_name);
    setValue("grandfather_name", student.grandfather_name || "");
    setValue("date_of_birth", student.date_of_birth);
    setValue("gender", student.gender);
    setValue("nationality", student.nationality || "Afghan");
    setValue("religion", student.religion || "");
    setValue("blood_group", student.blood_group as StudentFormData["blood_group"]);
    setValue("national_id", student.national_id || "");

    setValue("address", student.address);
    setValue("city", student.city);
    setValue("province", student.province as StudentFormData["province"]);
    setValue("phone", student.phone || "");
    setValue("email", student.email || "");

    setValue("education_level", student.education_level);
    setValue("current_class", student.current_class);
    setValue("roll_number", student.roll_number || "");
    setValue("admission_date", student.admission_date);
    setValue("admission_number", student.admission_number || "");
    setValue("status", student.status);

    setValue("emergency_contact_name", student.emergency_contact_name || "");
    setValue("emergency_contact_phone", student.emergency_contact_phone || "");
    setValue("emergency_contact_relation", student.emergency_contact_relation || "");

    setValue("medical_conditions", student.medical_conditions || "");
    setValue("allergies", student.allergies || "");
    setValue("medications", student.medications || "");

    setValue("previous_school", student.previous_school || "");
    setValue("previous_class", student.previous_class || "");
    setValue("transfer_certificate_number", student.transfer_certificate_number || "");

    if (student.primary_guardian?.id) {
      setPrimaryGuardianMode("existing");
      setValue("primary_guardian_id", student.primary_guardian.id);
    } else {
      setPrimaryGuardianMode("new");
    }

    if (student.secondary_guardian?.id) {
      setSecondaryGuardianMode("existing");
      setValue("secondary_guardian_id", student.secondary_guardian.id);
    } else {
      setSecondaryGuardianMode("none");
    }
  }, [isEdit, student, setValue]);

  const getFieldsForStep = (step: number): string[] => {
    if (step === 1) {
      return ["first_name", "last_name", "father_name", "date_of_birth", "gender"];
    }
    if (step === 2) {
      return ["address", "city", "province"];
    }
    if (step === 3) {
      return ["education_level", "current_class", "admission_date"];
    }
    if (step === 5) {
      return [];
    }
    return [];
  };

  const validateGuardianStep = async () => {
    let isValid = true;

    if (primaryGuardianMode === "existing") {
      const guardianId = getValues("primary_guardian_id");
      if (!guardianId) {
        setError("primary_guardian_id", {
          type: "manual",
          message: "Please select a guardian.",
        });
        isValid = false;
      } else {
        clearErrors("primary_guardian_id");
      }
    } else {
      const primaryValid = await trigger([
        "primary_guardian.first_name",
        "primary_guardian.last_name",
        "primary_guardian.relation_type",
        "primary_guardian.phone",
      ]);
      isValid = isValid && primaryValid;
    }

    if (secondaryGuardianMode === "existing") {
      const guardianId = getValues("secondary_guardian_id");
      if (!guardianId) {
        setError("secondary_guardian_id", {
          type: "manual",
          message: "Please select a secondary guardian or set mode to None.",
        });
        isValid = false;
      } else {
        clearErrors("secondary_guardian_id");
      }
    } else if (secondaryGuardianMode === "new") {
      const secondaryValid = await trigger([
        "secondary_guardian.first_name",
        "secondary_guardian.last_name",
        "secondary_guardian.relation_type",
        "secondary_guardian.phone",
      ]);
      isValid = isValid && secondaryValid;
    }

    return isValid;
  };

  const handleNext = async () => {
    if (currentStep === 4) {
      const guardianOk = await validateGuardianStep();
      if (guardianOk) {
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      }
      return;
    }

    const fields = getFieldsForStep(currentStep);
    const isValid = await trigger(fields as never[]);
    if (currentStep === 3 && !getValues("current_class")) {
      setError("current_class", {
        type: "manual",
        message: "Please select a class.",
      });
      return;
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const normalizeOptional = (value?: string) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  const cleanGuardian = (guardian?: StudentFormData["primary_guardian"]) => {
    if (!guardian) return undefined;

    return {
      first_name: guardian.first_name,
      last_name: guardian.last_name,
      relation_type: guardian.relation_type,
      phone: guardian.phone,
      phone_secondary: normalizeOptional(guardian.phone_secondary),
      email: normalizeOptional(guardian.email),
      occupation: normalizeOptional(guardian.occupation),
      address: normalizeOptional(guardian.address),
      national_id: normalizeOptional(guardian.national_id),
    };
  };

  const onSubmit = (data: StudentFormData) => {
    if (currentStep < STEPS.length) {
      return;
    }

    const payload: CreateStudentData | UpdateStudentData = {
      first_name: data.first_name,
      last_name: data.last_name,
      father_name: data.father_name,
      grandfather_name: normalizeOptional(data.grandfather_name),
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      nationality: data.nationality,
      religion: normalizeOptional(data.religion),
      blood_group: data.blood_group,
      national_id: normalizeOptional(data.national_id),
      address: data.address,
      city: data.city,
      province: data.province,
      phone: normalizeOptional(data.phone),
      email: normalizeOptional(data.email),
      current_class: data.current_class,
      roll_number: normalizeOptional(data.roll_number),
      admission_date: data.admission_date,
      admission_number: normalizeOptional(data.admission_number),
      education_level: data.education_level,
      status: data.status,
      emergency_contact_name: normalizeOptional(data.emergency_contact_name),
      emergency_contact_phone: normalizeOptional(data.emergency_contact_phone),
      emergency_contact_relation: normalizeOptional(data.emergency_contact_relation),
      medical_conditions: normalizeOptional(data.medical_conditions),
      allergies: normalizeOptional(data.allergies),
      medications: normalizeOptional(data.medications),
      previous_school: normalizeOptional(data.previous_school),
      previous_class: normalizeOptional(data.previous_class),
      transfer_certificate_number: normalizeOptional(data.transfer_certificate_number),
    };

    if (primaryGuardianMode === "existing") {
      payload.primary_guardian_id = data.primary_guardian_id;
      payload.primary_guardian = undefined;
    } else {
      payload.primary_guardian = cleanGuardian(data.primary_guardian);
      payload.primary_guardian_id = undefined;
    }

    if (secondaryGuardianMode === "none") {
      payload.secondary_guardian = undefined;
      payload.secondary_guardian_id = null;
    } else if (secondaryGuardianMode === "existing") {
      payload.secondary_guardian_id = data.secondary_guardian_id ?? null;
      payload.secondary_guardian = undefined;
    } else {
      payload.secondary_guardian = cleanGuardian(data.secondary_guardian);
      payload.secondary_guardian_id = undefined;
    }

    if (isEdit) {
      updateStudent.mutate(
        {
          id: studentId,
          data: payload as UpdateStudentData,
        },
        {
          onSuccess: () => navigate("/mis/students"),
        }
      );
    } else {
      createStudent.mutate(payload as CreateStudentData, {
        onSuccess: () => navigate("/mis/students"),
      });
    }
  };

  if (isLoadingStudent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" label={t("mis.common.loading")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? "Edit Student" : "Add Student"}
        subtitle={isEdit ? "Update student details" : "Create a new student profile"}
        actions={[
          {
            label: "Back to List",
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate("/mis/students"),
            variant: "outline",
          },
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isCompleted
                          ? "bg-success text-white"
                          : isActive
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-text-secondary"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium md:text-sm ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-success"
                          : "text-text-secondary"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`mx-3 h-1 flex-1 ${isCompleted ? "bg-success" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input label="First Name" required {...register("first_name")} error={errors.first_name?.message} />
                  <Input label="Last Name" required {...register("last_name")} error={errors.last_name?.message} />
                  <Input label="Father Name" required {...register("father_name")} error={errors.father_name?.message} />
                  <Input label="Grandfather Name" {...register("grandfather_name")} error={errors.grandfather_name?.message} />
                  <Input
                    label="Date of Birth"
                    type="date"
                    required
                    {...register("date_of_birth")}
                    error={errors.date_of_birth?.message}
                  />
                  <Select
                    label="Gender"
                    required
                    {...register("gender")}
                    error={errors.gender?.message}
                    options={[
                      { value: "", label: "Select Gender" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]}
                  />
                  <Input label="Nationality" {...register("nationality")} error={errors.nationality?.message} />
                  <Input label="Religion" {...register("religion")} error={errors.religion?.message} />
                  <Select
                    label="Blood Group"
                    {...register("blood_group")}
                    error={errors.blood_group?.message}
                    options={[
                      { value: "", label: "Select Blood Group" },
                      ...BLOOD_GROUPS.map((group) => ({ value: group, label: group })),
                    ]}
                  />
                  <Input label="National ID (Tazkira)" {...register("national_id")} error={errors.national_id?.message} />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Textarea
                      label="Address"
                      required
                      {...register("address")}
                      error={errors.address?.message}
                      rows={3}
                    />
                  </div>
                  <Input label="City" required {...register("city")} error={errors.city?.message} />
                  <Select
                    label="Province"
                    required
                    {...register("province")}
                    error={errors.province?.message}
                    options={[{ value: "", label: "Select Province" }, ...PROVINCES]}
                  />
                  <Input label="Phone" {...register("phone")} error={errors.phone?.message} />
                  <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Academic Information</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Select
                    label="Educational Level"
                    required
                    {...register("education_level")}
                    error={errors.education_level?.message}
                    onChange={(event) => {
                      const level = event.target.value as "primary" | "lower_secondary" | "upper_secondary";
                      setValue("education_level", level);
                      setValue("current_class", undefined);
                    }}
                    options={[
                      { value: "", label: "Select Education Level" },
                      { value: "primary", label: "Primary (1-6)" },
                      { value: "lower_secondary", label: "Lower Secondary (7-9)" },
                      { value: "upper_secondary", label: "Upper Secondary (10-12)" },
                    ]}
                  />

                  <Select
                    label="Class"
                    required
                    {...register("current_class")}
                    error={errors.current_class?.message}
                    onChange={(event) => {
                      const classId = event.target.value ? parseInt(event.target.value, 10) : undefined;
                      setValue("current_class", classId);
                    }}
                    options={[
                      { value: "", label: "Select Class" },
                      ...filteredClasses.map((classItem) => ({
                        value: classItem.id.toString(),
                        label: `${classItem.class_level_number}-${classItem.section} (${classItem.name})`,
                      })),
                    ]}
                  />

                  <Input
                    label="Admission Date"
                    type="date"
                    required
                    {...register("admission_date")}
                    error={errors.admission_date?.message}
                  />
                  <Input label="Admission Number" {...register("admission_number")} error={errors.admission_number?.message} />
                  <Input label="Roll Number" {...register("roll_number")} error={errors.roll_number?.message} />
                  <Select
                    label="Status"
                    {...register("status")}
                    error={errors.status?.message}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "graduated", label: "Graduated" },
                      { value: "transferred", label: "Transferred" },
                      { value: "suspended", label: "Suspended" },
                      { value: "expelled", label: "Expelled" },
                      { value: "withdrawn", label: "Withdrawn" },
                    ]}
                  />
                </div>

                {currentAcademicYear && (
                  <Alert variant="info" title="Academic Year">
                    Classes are loaded from current academic year: {currentAcademicYear.year}
                  </Alert>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Parent / Guardian Information</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Select
                    label="Primary Guardian Source"
                    value={primaryGuardianMode}
                    onChange={(event) => setPrimaryGuardianMode(event.target.value as GuardianMode)}
                    options={[
                      { value: "existing", label: "Choose Existing Guardian" },
                      { value: "new", label: "Create New Guardian" },
                    ]}
                  />

                  <Input
                    label="Search Existing Guardians"
                    value={guardianSearch}
                    onChange={(event) => setGuardianSearch(event.target.value)}
                    placeholder="Search by name or phone"
                  />
                </div>

                {primaryGuardianMode === "existing" ? (
                  <Select
                    label="Primary Guardian"
                    required
                    {...register("primary_guardian_id")}
                    error={errors.primary_guardian_id?.message}
                    onChange={(event) => {
                      const guardianId = event.target.value ? parseInt(event.target.value, 10) : undefined;
                      setValue("primary_guardian_id", guardianId);
                    }}
                    options={[
                      {
                        value: "",
                        label: isLoadingGuardians ? "Loading guardians..." : "Select Guardian",
                      },
                      ...guardianOptions,
                    ]}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      label="First Name"
                      required
                      {...register("primary_guardian.first_name")}
                      error={errors.primary_guardian?.first_name?.message}
                    />
                    <Input
                      label="Last Name"
                      required
                      {...register("primary_guardian.last_name")}
                      error={errors.primary_guardian?.last_name?.message}
                    />
                    <Select
                      label="Relation"
                      required
                      {...register("primary_guardian.relation_type")}
                      error={errors.primary_guardian?.relation_type?.message}
                      options={[{ value: "", label: "Select Relation" }, ...RELATION_OPTIONS]}
                    />
                    <Input
                      label="Phone"
                      required
                      {...register("primary_guardian.phone")}
                      error={errors.primary_guardian?.phone?.message}
                    />
                    <Input
                      label="Secondary Phone"
                      {...register("primary_guardian.phone_secondary")}
                      error={errors.primary_guardian?.phone_secondary?.message}
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register("primary_guardian.email")}
                      error={errors.primary_guardian?.email?.message}
                    />
                    <Input
                      label="Occupation"
                      {...register("primary_guardian.occupation")}
                      error={errors.primary_guardian?.occupation?.message}
                    />
                    <Input
                      label="National ID"
                      {...register("primary_guardian.national_id")}
                      error={errors.primary_guardian?.national_id?.message}
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        label="Address"
                        rows={2}
                        {...register("primary_guardian.address")}
                        error={errors.primary_guardian?.address?.message}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <Select
                    label="Secondary Guardian (Optional)"
                    value={secondaryGuardianMode}
                    onChange={(event) => setSecondaryGuardianMode(event.target.value as SecondaryGuardianMode)}
                    options={[
                      { value: "none", label: "None" },
                      { value: "existing", label: "Choose Existing Guardian" },
                      { value: "new", label: "Create New Guardian" },
                    ]}
                  />

                  {secondaryGuardianMode === "existing" && (
                    <div className="mt-4">
                      <Select
                        label="Secondary Guardian"
                        {...register("secondary_guardian_id")}
                        error={errors.secondary_guardian_id?.message}
                        onChange={(event) => {
                          const guardianId = event.target.value ? parseInt(event.target.value, 10) : undefined;
                          setValue("secondary_guardian_id", guardianId);
                        }}
                        options={[{ value: "", label: "Select Secondary Guardian" }, ...guardianOptions]}
                      />
                    </div>
                  )}

                  {secondaryGuardianMode === "new" && (
                    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Input
                        label="First Name"
                        required
                        {...register("secondary_guardian.first_name")}
                        error={errors.secondary_guardian?.first_name?.message}
                      />
                      <Input
                        label="Last Name"
                        required
                        {...register("secondary_guardian.last_name")}
                        error={errors.secondary_guardian?.last_name?.message}
                      />
                      <Select
                        label="Relation"
                        required
                        {...register("secondary_guardian.relation_type")}
                        error={errors.secondary_guardian?.relation_type?.message}
                        options={[{ value: "", label: "Select Relation" }, ...RELATION_OPTIONS]}
                      />
                      <Input
                        label="Phone"
                        required
                        {...register("secondary_guardian.phone")}
                        error={errors.secondary_guardian?.phone?.message}
                      />
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="mb-4 text-md font-medium">Emergency Contact</h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Input label="Name" {...register("emergency_contact_name")} error={errors.emergency_contact_name?.message} />
                    <Input label="Phone" {...register("emergency_contact_phone")} error={errors.emergency_contact_phone?.message} />
                    <Input
                      label="Relation"
                      {...register("emergency_contact_relation")}
                      error={errors.emergency_contact_relation?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Health & Previous Education</h3>

                <div className="grid grid-cols-1 gap-6">
                  <Textarea
                    label="Medical Conditions"
                    rows={3}
                    {...register("medical_conditions")}
                    error={errors.medical_conditions?.message}
                  />
                  <Textarea label="Allergies" rows={2} {...register("allergies")} error={errors.allergies?.message} />
                  <Textarea label="Medications" rows={2} {...register("medications")} error={errors.medications?.message} />
                </div>

                <div className="border-t pt-6">
                  <h4 className="mb-4 text-md font-medium">Previous Education</h4>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Input
                      label="Previous School"
                      {...register("previous_school")}
                      error={errors.previous_school?.message}
                    />
                    <Input label="Previous Class" {...register("previous_class")} error={errors.previous_class?.message} />
                    <Input
                      label="Transfer Certificate Number"
                      {...register("transfer_certificate_number")}
                      error={errors.transfer_certificate_number?.message}
                    />
                  </div>
                </div>

                <Alert variant="info" title="Review">
                  Review all information before saving. This form is synced to backend student model fields.
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Badge variant="secondary">
                Step {currentStep} of {STEPS.length}
              </Badge>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleNext();
                  }}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  loading={createStudent.isPending || updateStudent.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Update Student" : "Create Student"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
