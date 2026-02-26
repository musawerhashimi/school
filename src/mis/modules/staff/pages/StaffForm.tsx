import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  User,
  Briefcase,
  Phone,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  Award,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardContent,
  Alert,
  Spinner,
} from "@mis-components/ui";
import {
  useStaffDetail,
  useCreateStaff,
  useUpdateStaff,
} from "../hooks/useStaff";
import { useShifts } from "../hooks/useShifts";
import { staffSchema, type StaffFormData } from "../schemas/staffSchema";

type StaffFormValues = StaffFormData;

const STEPS = [
  { id: 1, title: "Personal Info", translationKey: "stepPersonal", icon: User },
  {
    id: 2,
    title: "Contact & Address",
    translationKey: "stepContact",
    icon: Phone,
  },
  {
    id: 3,
    title: "Employment",
    translationKey: "stepEmployment",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Qualifications",
    translationKey: "stepQualifications",
    icon: Award,
  },
  { id: 5, title: "Review", translationKey: "stepReview", icon: CheckCircle2 },
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

export default function StaffForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const staffId = isEdit ? parseInt(id, 10) : 0;

  const [currentStep, setCurrentStep] = useState(1);

  // React Query hooks
  const { data: staff, isLoading: isLoadingStaff } = useStaffDetail(staffId);
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const { data: shiftsData, isLoading: isLoadingShifts } = useShifts({
    is_active: true,
    page_size: 100,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      nationality: "Afghan",
      employment_type: "full_time",
      work_hours_per_week: 40,
      years_of_experience: 0,
      shift_effective_from: "",
    },
  });

  const requiresShiftForEmploymentType = (
    employmentType?: StaffFormValues["employment_type"]
  ) => employmentType && employmentType !== "full_time";

  const selectedEmploymentType = watch("employment_type");
  const selectedShiftId = watch("initial_shift_id");
  const requiresShift = requiresShiftForEmploymentType(selectedEmploymentType);

  const shiftOptions = useMemo(() => {
    const shifts = shiftsData?.results || [];
    return shifts.map((shift) => ({
      value: shift.id.toString(),
      label: `${shift.name} (${shift.start_time} - ${shift.end_time})`,
    }));
  }, [shiftsData]);

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (staff && isEdit) {
      setValue("first_name", staff.first_name);
      setValue("last_name", staff.last_name);
      setValue("father_name", staff.father_name);
      setValue("grandfather_name", staff.grandfather_name || "");
      setValue("date_of_birth", staff.date_of_birth);
      setValue("gender", staff.gender);
      setValue("nationality", staff.nationality);
      setValue("marital_status", staff.marital_status);
      setValue("phone", staff.phone);
      setValue("phone_secondary", staff.phone_secondary || "");
      setValue("email", staff.email || "");
      setValue("emergency_contact_name", staff.emergency_contact_name || "");
      setValue("emergency_contact_phone", staff.emergency_contact_phone || "");
      setValue(
        "emergency_contact_relation",
        staff.emergency_contact_relation || ""
      );
      setValue("address", staff.address);
      setValue("city", staff.city);
      setValue("province", staff.province as StaffFormValues["province"]);
      setValue("tazkira_number", staff.tazkira_number);
      setValue("tazkira_page_number", staff.tazkira_page_number || "");
      setValue("tazkira_volume_number", staff.tazkira_volume_number || "");
      setValue("position", staff.position);
      setValue("department", staff.department);
      setValue("employment_type", staff.employment_type);
      setValue("join_date", staff.join_date);
      setValue("end_date", staff.end_date || "");
      setValue("highest_qualification", staff.highest_qualification || "");
      setValue("specialization", staff.specialization || "");
      setValue("years_of_experience", staff.years_of_experience);
      setValue("work_hours_per_week", parseFloat(staff.work_hours_per_week));
      setValue("notes", staff.notes || "");

      const activeShift = staff.shifts.find((shift) => shift.is_active);
      setValue("initial_shift_id", activeShift?.shift);
      setValue("shift_effective_from", activeShift?.effective_from || staff.join_date);
    }
  }, [staff, isEdit, setValue]);

  useEffect(() => {
    if (requiresShift) return;
    setValue("initial_shift_id", undefined);
    setValue("shift_effective_from", "");
    clearErrors("initial_shift_id");
  }, [requiresShift, setValue, clearErrors]);

  const normalizeOptional = (value?: string) => {
    if (!value) return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };

  // Form submission
  const onSubmit = async (data: StaffFormValues) => {
    const requiresShiftForPayload = requiresShiftForEmploymentType(
      data.employment_type
    );

    if (requiresShiftForPayload && !data.initial_shift_id) {
      setError("initial_shift_id", {
        type: "manual",
        message: t("mis.staff.validation.shiftRequired"),
      });
      return;
    }

    const payload: StaffFormValues = {
      ...data,
      grandfather_name: normalizeOptional(data.grandfather_name),
      phone_secondary: normalizeOptional(data.phone_secondary),
      email: normalizeOptional(data.email),
      emergency_contact_name: normalizeOptional(data.emergency_contact_name),
      emergency_contact_phone: normalizeOptional(data.emergency_contact_phone),
      emergency_contact_relation: normalizeOptional(data.emergency_contact_relation),
      tazkira_page_number: normalizeOptional(data.tazkira_page_number),
      tazkira_volume_number: normalizeOptional(data.tazkira_volume_number),
      end_date: normalizeOptional(data.end_date),
      highest_qualification: normalizeOptional(data.highest_qualification),
      specialization: normalizeOptional(data.specialization),
      notes: normalizeOptional(data.notes),
      initial_shift_id: requiresShiftForPayload ? data.initial_shift_id : undefined,
      shift_effective_from:
        requiresShiftForPayload && data.initial_shift_id
          ? normalizeOptional(data.shift_effective_from) || data.join_date
          : undefined,
    };

    if (isEdit) {
      updateStaff.mutate(
        { id: staffId, data: payload },
        {
          onSuccess: () => {
            navigate(`/mis/staff/${staffId}`);
          },
        }
      );
    } else {
      createStaff.mutate(payload, {
        onSuccess: (response) => {
          navigate(`/mis/staff/${response.id}`);
        },
      });
    }
  };

  // Step navigation
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as Parameters<typeof trigger>[0]);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof StaffFormValues)[] => {
    switch (step) {
      case 1:
        return [
          "first_name",
          "last_name",
          "father_name",
          "date_of_birth",
          "gender",
          "nationality",
        ];
      case 2:
        return ["phone", "address", "city", "province", "tazkira_number"];
      case 3:
        return [
          "position",
          "department",
          "employment_type",
          "join_date",
          ...(requiresShift ? ["initial_shift_id" as const] : []),
        ];
      case 4:
        return [];
      default:
        return [];
    }
  };

  if (isLoadingStaff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          isEdit
            ? t("mis.staff.form.editTitle")
            : t("mis.staff.form.createTitle")
        }
        subtitle={
          isEdit
            ? t("mis.staff.form.updateSubtitle")
            : t("mis.staff.form.createSubtitle")
        }
        actions={
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/mis/staff")}
          >
            {t("mis.staff.backToList")}
          </Button>
        }
      />

      {/* Step Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-white"
                        : "bg-surface-secondary text-text-tertiary"
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-text-tertiary"
                    }`}
                  >
                    {t(`mis.staff.form.${step.translationKey}`)}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("mis.staff.tabs.personalInfo")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t("mis.staff.fields.firstName")}
                    {...register("first_name")}
                    error={errors.first_name?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.lastName")}
                    {...register("last_name")}
                    error={errors.last_name?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.fatherName")}
                    {...register("father_name")}
                    error={errors.father_name?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.grandfatherName")}
                    {...register("grandfather_name")}
                    error={errors.grandfather_name?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.dateOfBirth")}
                    type="date"
                    {...register("date_of_birth")}
                    error={errors.date_of_birth?.message}
                    required
                  />

                  <Select
                    label={t("mis.staff.fields.gender")}
                    {...register("gender")}
                    error={errors.gender?.message}
                    required
                    options={[
                      {
                        label: t("mis.common.select"),
                        value: "",
                      },
                      {
                        label: t("mis.common.male"),
                        value: "male",
                      },
                      {
                        label: t("mis.common.female"),
                        value: "female",
                      },
                    ]}
                  />

                  <Input
                    label={t("mis.staff.fields.nationality")}
                    {...register("nationality")}
                    error={errors.nationality?.message}
                  />

                  <Select
                    label={t("mis.staff.fields.maritalStatus")}
                    {...register("marital_status")}
                    error={errors.marital_status?.message}
                    options={[
                      { label: t("mis.common.select"), value: "" },
                      { label: t("mis.staff.maritalStatuses.single"), value: "single" },
                      { label: t("mis.staff.maritalStatuses.married"), value: "married" },
                      { label: t("mis.staff.maritalStatuses.divorced"), value: "divorced" },
                      { label: t("mis.staff.maritalStatuses.widowed"), value: "widowed" },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact & Address */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("mis.staff.profile.contactInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t("mis.staff.fields.phone")}
                    {...register("phone")}
                    error={errors.phone?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.phoneSecondary")}
                    {...register("phone_secondary")}
                    error={errors.phone_secondary?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.email")}
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.tazkiraNumber")}
                    {...register("tazkira_number")}
                    error={errors.tazkira_number?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.tazkiraPage")}
                    {...register("tazkira_page_number")}
                    error={errors.tazkira_page_number?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.tazkiraVolume")}
                    {...register("tazkira_volume_number")}
                    error={errors.tazkira_volume_number?.message}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label={t("mis.staff.fields.address")}
                      {...register("address")}
                      error={errors.address?.message}
                      required
                    />
                  </div>

                  <Input
                    label={t("mis.staff.fields.city")}
                    {...register("city")}
                    error={errors.city?.message}
                    required
                  />

                  <Select
                    label={t("mis.staff.fields.province")}
                    {...register("province")}
                    error={errors.province?.message}
                    required
                    options={[
                      { label: t("mis.common.select"), value: "" },
                      ...PROVINCES.map((province) => ({
                        label: province.label,
                        value: province.value,
                      })),
                    ]}
                  />

                  <Input
                    label={t("mis.staff.fields.emergencyContactName")}
                    {...register("emergency_contact_name")}
                    error={errors.emergency_contact_name?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.emergencyContactPhone")}
                    {...register("emergency_contact_phone")}
                    error={errors.emergency_contact_phone?.message}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Employment */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("mis.staff.profile.employmentInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label={t("mis.staff.fields.position")}
                    {...register("position")}
                    error={errors.position?.message}
                    required
                    options={[
                      { label: t("mis.common.select"), value: "" },
                      { label: t("mis.staff.positions.teacher"), value: "teacher" },
                      { label: t("mis.staff.positions.principal"), value: "principal" },
                      { label: t("mis.staff.positions.vice_principal"), value: "vice_principal" },
                      { label: t("mis.staff.positions.admin_staff"), value: "admin_staff" },
                      { label: t("mis.staff.positions.librarian"), value: "librarian" },
                      { label: t("mis.staff.positions.accountant"), value: "accountant" },
                      { label: t("mis.staff.positions.counselor"), value: "counselor" },
                      { label: t("mis.staff.positions.security"), value: "security" },
                      { label: t("mis.staff.positions.support_staff"), value: "support_staff" },
                    ]}
                  />

                  <Select
                    label={t("mis.staff.fields.department")}
                    {...register("department")}
                    error={errors.department?.message}
                    required
                    options={[
                      { label: t("mis.common.select"), value: "" },
                      { label: t("mis.staff.departments.administration"), value: "administration" },
                      { label: t("mis.staff.departments.academic"), value: "academic" },
                      { label: t("mis.staff.departments.accounts"), value: "accounts" },
                      { label: t("mis.staff.departments.library"), value: "library" },
                      { label: t("mis.staff.departments.it"), value: "it" },
                      { label: t("mis.staff.departments.sports"), value: "sports" },
                      { label: t("mis.staff.departments.support"), value: "support" },
                      { label: t("mis.staff.departments.other"), value: "other" },
                    ]}
                  />

                  <Select
                    label={t("mis.staff.fields.employmentType")}
                    {...register("employment_type")}
                    error={errors.employment_type?.message}
                    options={[
                      { label: t("mis.staff.employmentTypes.full_time"), value: "full_time" },
                      { label: t("mis.staff.employmentTypes.part_time"), value: "part_time" },
                      { label: t("mis.staff.employmentTypes.contract"), value: "contract" },
                      { label: t("mis.staff.employmentTypes.temporary"), value: "temporary" },
                    ]}
                  />

                  <Input
                    label={t("mis.staff.fields.joinDate")}
                    type="date"
                    {...register("join_date")}
                    error={errors.join_date?.message}
                    required
                  />

                  <Input
                    label={t("mis.staff.fields.endDate")}
                    type="date"
                    {...register("end_date")}
                    error={errors.end_date?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.workHoursPerWeek")}
                    type="number"
                    {...register("work_hours_per_week", {
                      valueAsNumber: true,
                    })}
                    error={errors.work_hours_per_week?.message}
                  />

                  {requiresShift && (
                    <>
                      <Select
                        label={t("mis.staff.filters.shift")}
                        required
                        value={selectedShiftId ? String(selectedShiftId) : ""}
                        onChange={(event) => {
                          const value = event.target.value;
                          setValue(
                            "initial_shift_id",
                            value ? Number(value) : undefined,
                            { shouldValidate: true }
                          );
                          if (value) {
                            clearErrors("initial_shift_id");
                          }
                        }}
                        error={errors.initial_shift_id?.message}
                        options={[
                          { label: t("mis.common.select"), value: "" },
                          ...shiftOptions,
                        ]}
                      />

                      <Input
                        label={t("mis.staff.salary.effectiveFrom")}
                        type="date"
                        {...register("shift_effective_from")}
                        error={errors.shift_effective_from?.message}
                      />
                    </>
                  )}
                </div>

                {requiresShift && !isLoadingShifts && shiftOptions.length === 0 && (
                  <Alert variant="warning">
                    {t("mis.staff.shifts.noShifts")}
                  </Alert>
                )}
              </div>
            )}

            {/* Step 4: Qualifications */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("mis.staff.profile.qualifications")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={t("mis.staff.fields.highestQualification")}
                    {...register("highest_qualification")}
                    error={errors.highest_qualification?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.specialization")}
                    {...register("specialization")}
                    error={errors.specialization?.message}
                  />

                  <Input
                    label={t("mis.staff.fields.yearsOfExperience")}
                    type="number"
                    {...register("years_of_experience", {
                      valueAsNumber: true,
                    })}
                    error={errors.years_of_experience?.message}
                  />
                </div>

                <Textarea
                  label={t("mis.staff.fields.notes")}
                  {...register("notes")}
                  error={errors.notes?.message}
                  rows={4}
                />
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {t("mis.staff.form.stepReview")}
                </h3>

                <Alert variant="info">
                  {t("mis.student.form.reviewInformationNote")}
                </Alert>

                <div className="bg-surface-secondary p-4 rounded-lg space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {t("mis.staff.fields.fullName")}:
                    </span>{" "}
                    {watch("first_name")} {watch("last_name")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">
                      {t("mis.staff.fields.position")}:
                    </span>{" "}
                    {watch("position")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">
                      {t("mis.staff.fields.department")}:
                    </span>{" "}
                    {watch("department")}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">
                      {t("mis.staff.fields.phone")}:
                    </span>{" "}
                    {watch("phone")}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                {t("mis.common.previous")}
              </Button>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {t("mis.common.next")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={
                    isSubmitting ||
                    createStaff.isPending ||
                    updateStaff.isPending
                  }
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  {isEdit
                    ? t("mis.staff.form.updateStaff")
                    : t("mis.staff.form.saveStaff")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
