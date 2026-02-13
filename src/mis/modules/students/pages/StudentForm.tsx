import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  User,
  School,
  Users,
  Heart,
  FileText,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  MapPin,
  FileCheck,
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
  Badge,
} from "@mis-components/ui";
import {
  useStudent,
  useCreateStudent,
  useUpdateStudent,
} from "../hooks/useStudents";
import { studentSchema, type StudentFormData } from "../schemas/studentSchema";
import { useAcademicYears, useCurrentAcademicYear } from "@academic/hooks/useAcademicYears";
import { useClassLevels } from "@academic/hooks/useClassLevels";
import { useClassInstances } from "@academic/hooks/useClassInstances";

type StudentFormValues = StudentFormData;

const STEPS = [
  { id: 1, title: "Personal Info", translationKey: "personalInformation", icon: User },
  { id: 2, title: "Tazkira & Location", translationKey: "tazkiraAndLocation", icon: MapPin },
  { id: 3, title: "Contact & Address", translationKey: "contactInformation", icon: FileText },
  { id: 4, title: "Academic Info", translationKey: "academicInformation", icon: School },
  { id: 5, title: "Parent/Guardian", translationKey: "parentGuardian", icon: Users },
  { id: 6, title: "Health Examination", translationKey: "healthExamination", icon: Heart },
  { id: 7, title: "Commitment & Review", translationKey: "commitmentAndReview", icon: FileCheck },
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

export default function StudentForm() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  const studentId = isEdit ? parseInt(id, 10) : 0;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<number | null>(null);
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

  // React Query hooks
  const { data: student, isLoading: isLoadingStudent } = useStudent(studentId);
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  // Academic module hooks
  const { data: currentAcademicYear } = useCurrentAcademicYear();
  const { data: academicYears } = useAcademicYears({ is_active: true });
  const { data: classLevels } = useClassLevels(
    selectedEducationLevel ? { category: selectedEducationLevel } : {}
  );
  const { data: classInstances } = useClassInstances(
    selectedAcademicYear && selectedClassLevel
      ? {
          academic_year: selectedAcademicYear,
          class_level: selectedClassLevel,
          is_active: true,
        }
      : {}
  );

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      nationality: "Afghan",
      education_level: "upper_secondary",
      primary_guardian: {
        relation_type: "father",
      },
      commitment_accepted: false,
    },
  });

  // Watch form values for dynamic behavior
  const educationLevel = watch("education_level");
  const classInstanceId = watch("class_instance");

  // Update education level state when form value changes
  useEffect(() => {
    if (educationLevel) {
      setSelectedEducationLevel(educationLevel);
    }
  }, [educationLevel]);

  // Set default academic year to current year
  useEffect(() => {
    if (currentAcademicYear && !selectedAcademicYear) {
      setSelectedAcademicYear(currentAcademicYear.id);
      setValue("academic_year", currentAcademicYear.id);
    }
  }, [currentAcademicYear, selectedAcademicYear, setValue]);

  // Auto-populate section and shift when class instance is selected
  useEffect(() => {
    if (classInstanceId && classInstances) {
      const selectedInstance = classInstances.results?.find(
        (ci) => ci.id === classInstanceId
      );
      if (selectedInstance) {
        setValue("section", selectedInstance.section || "");
        if (selectedInstance.shift) {
          setValue("shift", selectedInstance.shift);
        }
      }
    }
  }, [classInstanceId, classInstances, setValue]);

  // Load student data for edit mode
  useEffect(() => {
    if (isEdit && student) {
      // Personal Information
      setValue("first_name", student.first_name);
      setValue("last_name", student.last_name);
      setValue("nickname", student.nickname);
      setValue("father_name", student.father_name);
      setValue("grandfather_name", student.grandfather_name);
      setValue("date_of_birth", student.date_of_birth);
      setValue("current_age", student.current_age);
      setValue("gender", student.gender);
      setValue("nationality", student.nationality);
      setValue("religion", student.religion);
      setValue("blood_group", student.blood_group);
      setValue("national_id", student.national_id);

      // Tazkira Details
      setValue("tazkira_page_number", student.tazkira_page_number);
      setValue("tazkira_volume_number", student.tazkira_volume_number);
      setValue("tazkira_registration_number", student.tazkira_registration_number);
      setValue("birth_date_on_tazkira", student.birth_date_on_tazkira);
      setValue("age_on_tazkira", student.age_on_tazkira);

      // Location
      setValue("original_province", student.original_province);
      setValue("original_district", student.original_district);
      setValue("original_area", student.original_area);
      setValue("current_province", student.current_province);
      setValue("current_district", student.current_district);
      setValue("current_area", student.current_area);

      // Contact Information
      setValue("address", student.address);
      setValue("city", student.city);
      setValue("province", student.province);
      setValue("phone", student.phone);
      setValue("email", student.email);

      // Academic Information
      setValue("academic_year", student.academic_year);
      setValue("education_level", student.education_level);
      setValue("class_instance", student.class_instance);
      setValue("section", student.section);
      setValue("shift", student.shift);
      setValue("roll_number", student.roll_number);
      setValue("admission_date", student.admission_date);
      setValue("enrollment_type", student.enrollment_type);

      // Parent/Guardian
      setValue("parent_occupation", student.parent_occupation);
      setValue("family_contact_number_1", student.family_contact_number_1);
      setValue("family_contact_number_2", student.family_contact_number_2);
      setValue("family_contact_number_3", student.family_contact_number_3);
      setValue("telegram_contact", student.telegram_contact);
      setValue("relationship_to_student", student.relationship_to_student);

      // Emergency Contact
      setValue("emergency_contact_name", student.emergency_contact_name);
      setValue("emergency_contact_phone", student.emergency_contact_phone);
      setValue("emergency_contact_relation", student.emergency_contact_relation);

      // Health Information
      setValue("hiv_test", student.hiv_test);
      setValue("hcv_test", student.hcv_test);
      setValue("hbs_test", student.hbs_test);
      setValue("health_test_date", student.health_test_date);
      setValue("medical_conditions", student.medical_conditions);
      setValue("allergies", student.allergies);
      setValue("medications", student.medications);

      // Previous Education
      setValue("previous_school", student.previous_school);
      setValue("previous_class", student.previous_class);
      setValue("transfer_certificate_number", student.transfer_certificate_number);

      // Load guardian data if available
      if (student.primary_guardian) {
        setValue("primary_guardian.first_name", student.primary_guardian.first_name);
        setValue("primary_guardian.last_name", student.primary_guardian.last_name);
        setValue("primary_guardian.relation_type", student.primary_guardian.relation_type);
        setValue("primary_guardian.phone", student.primary_guardian.phone);
        setValue("primary_guardian.phone_secondary", student.primary_guardian.phone_secondary);
        setValue("primary_guardian.email", student.primary_guardian.email);
        setValue("primary_guardian.occupation", student.primary_guardian.occupation);
        setValue("primary_guardian.address", student.primary_guardian.address);
        setValue("primary_guardian.national_id", student.primary_guardian.national_id);
      }

      // Set selected states for dynamic dropdowns
      if (student.education_level) {
        setSelectedEducationLevel(student.education_level);
      }
      if (student.academic_year) {
        setSelectedAcademicYear(student.academic_year);
      }
    }
  }, [isEdit, student, setValue]);

  // Step navigation with validation
  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof StudentFormValues)[] => {
    switch (step) {
      case 1: // Personal Information
        return [
          "first_name",
          "last_name",
          "father_name",
          "date_of_birth",
          "gender",
          "nationality",
        ];
      case 2: // Tazkira & Location
        return [
          "original_province",
          "current_province",
        ];
      case 3: // Contact & Address
        return ["address", "city", "province"];
      case 4: // Academic Information
        return ["admission_date", "education_level"];
      case 5: // Parent/Guardian
        return ["primary_guardian" as any];
      case 6: // Health Examination
        return [];
      case 7: // Commitment & Review
        return ["commitment_accepted"];
      default:
        return [];
    }
  };

  // Form submission
  const onSubmit = (data: StudentFormValues) => {
    if (isEdit) {
      // For update, omit guardian data
      const {
        primary_guardian,
        secondary_guardian,
        ...updateData
      } = data;
      updateStudent.mutate(
        { id: studentId, data: updateData },
        {
          onSuccess: () => {
            navigate("/mis/students");
          },
        }
      );
    } else {
      // For create, send full data including guardians
      createStudent.mutate(data, {
        onSuccess: () => {
          navigate("/mis/students");
        },
      });
    }
  };

  if (isLoadingStudent) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label={t("mis.common.loading")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? t("mis.student.form.editStudent") : t("mis.nav.addStudent")}
        subtitle={
          isEdit
            ? t("mis.student.form.updateSubtitle")
            : t("mis.student.form.createSubtitle")
        }
        actions={[
          {
            label: t("mis.student.form.backToList"),
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate("/mis/students"),
            variant: "outline",
          },
        ]}
      />

      {/* Step Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        ${
                          isCompleted
                            ? "bg-success text-white"
                            : isActive
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-text-secondary"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <p
                      className={`
                        mt-2 text-sm font-medium
                        ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                            ? "text-success"
                            : "text-text-secondary"
                        }
                      `}
                    >
                      {t(`mis.student.${step.translationKey}`)}
                    </p>
                  </div>

                  {index < STEPS.length - 1 && (
                    <div
                      className={`
                        h-1 flex-1 mx-4
                        ${isCompleted ? "bg-success" : "bg-gray-200"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t("mis.student.personalInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t("mis.student.firstName")}
                    required
                    {...register("first_name")}
                    error={errors.first_name?.message}
                    placeholder={t("mis.student.form.firstNamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.lastName")}
                    required
                    {...register("last_name")}
                    error={errors.last_name?.message}
                    placeholder={t("mis.student.form.lastNamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.nickname")}
                    {...register("nickname")}
                    error={errors.nickname?.message}
                    placeholder={t("mis.student.nicknamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.fatherName")}
                    required
                    {...register("father_name")}
                    error={errors.father_name?.message}
                    placeholder={t("mis.student.form.fatherNamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.grandfatherName")}
                    {...register("grandfather_name")}
                    error={errors.grandfather_name?.message}
                    placeholder={t("mis.student.form.grandfatherNamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.dateOfBirth")}
                    type="date"
                    required
                    {...register("date_of_birth")}
                    error={errors.date_of_birth?.message}
                  />

                  <Input
                    label={t("mis.student.currentAge")}
                    type="number"
                    {...register("current_age", { valueAsNumber: true })}
                    error={errors.current_age?.message}
                    placeholder={t("mis.student.form.agePlaceholder")}
                  />

                  <Select
                    label={t("mis.student.gender")}
                    required
                    {...register("gender")}
                    error={errors.gender?.message}
                    options={[
                      { label: t("mis.student.form.selectGender"), value: "" },
                      { label: t("mis.student.male"), value: "male" },
                      { label: t("mis.student.female"), value: "female" },
                    ]}
                  />

                  <Input
                    label={t("mis.student.nationality")}
                    {...register("nationality")}
                    error={errors.nationality?.message}
                    placeholder={t("mis.student.form.nationalityPlaceholder")}
                  />

                  <Input
                    label={t("mis.student.religion")}
                    {...register("religion")}
                    error={errors.religion?.message}
                    placeholder={t("mis.student.form.religionPlaceholder")}
                  />

                  <Select
                    label={t("mis.student.bloodGroup")}
                    {...register("blood_group")}
                    error={errors.blood_group?.message}
                    options={[
                      { label: t("mis.student.form.selectBloodGroup"), value: "" },
                      ...BLOOD_GROUPS.map((bg) => ({ label: bg, value: bg })),
                    ]}
                  />

                  <Input
                    label={t("mis.student.nationalId")}
                    {...register("national_id")}
                    error={errors.national_id?.message}
                    placeholder={t("mis.student.form.phoneOptional")}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Tazkira & Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {t("mis.student.tazkiraAndLocation")}
                </h3>

                {/* Tazkira Details */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.tazkiraDetails")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t("mis.student.tazkiraPage")}
                      {...register("tazkira_page_number")}
                      error={errors.tazkira_page_number?.message}
                      placeholder={t("mis.student.form.tazkiraPagePlaceholder")}
                    />

                    <Input
                      label={t("mis.student.tazkiraVolume")}
                      {...register("tazkira_volume_number")}
                      error={errors.tazkira_volume_number?.message}
                      placeholder={t("mis.student.form.tazkiraVolumePlaceholder")}
                    />

                    <Input
                      label={t("mis.student.tazkiraRegistrationNumber")}
                      {...register("tazkira_registration_number")}
                      error={errors.tazkira_registration_number?.message}
                      placeholder={t("mis.student.form.tazkiraRegPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.birthDateOnTazkira")}
                      type="date"
                      {...register("birth_date_on_tazkira")}
                      error={errors.birth_date_on_tazkira?.message}
                    />

                    <Input
                      label={t("mis.student.ageOnTazkira")}
                      type="number"
                      {...register("age_on_tazkira", { valueAsNumber: true })}
                      error={errors.age_on_tazkira?.message}
                      placeholder={t("mis.student.form.agePlaceholder")}
                    />
                  </div>
                </div>

                {/* Original Residence */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.originalResidence")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label={t("mis.student.province")}
                      required
                      {...register("original_province")}
                      error={errors.original_province?.message}
                      options={[
                        { label: t("mis.student.selectProvince"), value: "" },
                        ...PROVINCES,
                      ]}
                    />

                    <Input
                      label={t("mis.student.district")}
                      {...register("original_district")}
                      error={errors.original_district?.message}
                      placeholder={t("mis.student.form.districtPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.area")}
                      {...register("original_area")}
                      error={errors.original_area?.message}
                      placeholder={t("mis.student.form.areaPlaceholder")}
                    />
                  </div>
                </div>

                {/* Current Residence */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.currentResidence")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Select
                      label={t("mis.student.province")}
                      {...register("current_province")}
                      error={errors.current_province?.message}
                      options={[
                        { label: t("mis.student.selectProvince"), value: "" },
                        ...PROVINCES,
                      ]}
                    />

                    <Input
                      label={t("mis.student.district")}
                      {...register("current_district")}
                      error={errors.current_district?.message}
                      placeholder={t("mis.student.form.districtPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.area")}
                      {...register("current_area")}
                      error={errors.current_area?.message}
                      placeholder={t("mis.student.form.areaPlaceholder")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact & Address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t("mis.student.contactInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Textarea
                      label={t("mis.student.address")}
                      required
                      {...register("address")}
                      error={errors.address?.message}
                      placeholder={t("mis.student.form.addressPlaceholder")}
                      rows={3}
                    />
                  </div>

                  <Input
                    label={t("mis.student.city")}
                    required
                    {...register("city")}
                    error={errors.city?.message}
                    placeholder={t("mis.student.form.cityPlaceholder")}
                  />

                  <Select
                    label={t("mis.student.province")}
                    required
                    {...register("province")}
                    error={errors.province?.message}
                    options={[
                      { label: t("mis.student.selectProvince"), value: "" },
                      ...PROVINCES,
                    ]}
                  />

                  <Input
                    label={t("mis.student.phone")}
                    {...register("phone")}
                    error={errors.phone?.message}
                    placeholder={t("mis.student.form.phoneOptional")}
                  />

                  <Input
                    label={t("mis.student.email")}
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    placeholder={t("mis.student.form.emailOptional")}
                  />

                  <div className="md:col-span-2">
                    <Alert variant="info" title={t("mis.student.recentPhoto")}>
                      {t("mis.student.uploadPhoto")}
                    </Alert>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Academic Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  {t("mis.student.academicInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Academic Year */}
                  <Select
                    label={t("mis.student.academicYear")}
                    {...register("academic_year", { valueAsNumber: true })}
                    error={errors.academic_year?.message}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      setSelectedAcademicYear(value);
                      setValue("academic_year", value || undefined);
                    }}
                    options={[
                      { label: t("mis.student.selectAcademicYear"), value: "" },
                      ...(academicYears?.results || []).map((year) => ({
                        label: year.year,
                        value: year.id.toString(),
                      })),
                    ]}
                  />

                  {/* Education Level */}
                  <Select
                    label={t("mis.student.educationLevel")}
                    required
                    {...register("education_level")}
                    error={errors.education_level?.message}
                    onChange={(e) => {
                      const value = e.target.value as "primary" | "lower_secondary" | "upper_secondary";
                      setSelectedEducationLevel(value);
                      setValue("education_level", value);
                      setSelectedClassLevel(null);
                      setValue("class_instance", undefined);
                    }}
                    options={[
                      { label: t("mis.student.selectEducationLevel"), value: "" },
                      { label: t("mis.student.primary"), value: "primary" },
                      { label: t("mis.student.lowerSecondary"), value: "lower_secondary" },
                      { label: t("mis.student.upperSecondary"), value: "upper_secondary" },
                    ]}
                  />

                  {/* Class Level */}
                  {selectedEducationLevel && (
                    <Select
                      label={t("mis.student.classLevel")}
                      {...register("current_class", { valueAsNumber: true })}
                      error={errors.current_class?.message}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : null;
                        setSelectedClassLevel(value);
                        setValue("current_class", value || undefined);
                        setValue("class_instance", undefined);
                      }}
                      options={[
                        { label: t("mis.student.selectClassLevel"), value: "" },
                        ...(classLevels?.results || []).map((level) => ({
                          label: `${level.name} (${level.name_local})`,
                          value: level.id.toString(),
                        })),
                      ]}
                    />
                  )}

                  {/* Class Instance */}
                  {selectedClassLevel && selectedAcademicYear && (
                    <Select
                      label={t("mis.student.classInstance")}
                      {...register("class_instance", { valueAsNumber: true })}
                      error={errors.class_instance?.message}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        setValue("class_instance", value);
                      }}
                      options={[
                        { label: t("mis.student.selectClass"), value: "" },
                        ...(classInstances?.results || []).map((instance) => ({
                          label: `${instance.class_level_name} - ${instance.section} (${instance.shift}) - ${instance.current_enrollment}/${instance.max_capacity}`,
                          value: instance.id.toString(),
                        })),
                      ]}
                    />
                  )}

                  {/* Section */}
                  <Input
                    label={t("mis.student.section")}
                    {...register("section")}
                    error={errors.section?.message}
                    placeholder={t("mis.student.section")}
                    disabled={!!classInstanceId}
                  />

                  {/* Shift */}
                  <Select
                    label={t("mis.student.shift")}
                    {...register("shift")}
                    error={errors.shift?.message}
                    disabled={!!classInstanceId}
                    options={[
                      { label: t("mis.student.selectShift"), value: "" },
                      { label: t("mis.student.morning"), value: "morning" },
                      { label: t("mis.student.afternoon"), value: "afternoon" },
                      { label: t("mis.student.evening"), value: "evening" },
                    ]}
                  />

                  {/* Admission Date */}
                  <Input
                    label={t("mis.student.admissionDate")}
                    type="date"
                    required
                    {...register("admission_date")}
                    error={errors.admission_date?.message}
                  />

                  {/* Roll Number */}
                  <Input
                    label={t("mis.student.rollNumber")}
                    {...register("roll_number")}
                    error={errors.roll_number?.message}
                    placeholder={t("mis.student.rollNumberPlaceholder")}
                  />

                  {/* Enrollment Type */}
                  <Select
                    label={t("mis.student.enrollmentType")}
                    {...register("enrollment_type")}
                    error={errors.enrollment_type?.message}
                    options={[
                      { label: t("mis.student.selectEnrollmentType"), value: "" },
                      { label: t("mis.student.fresh"), value: "fresh" },
                      { label: t("mis.student.transfer"), value: "transfer" },
                      { label: t("mis.student.readmission"), value: "readmission" },
                    ]}
                  />
                </div>

                {classInstanceId && classInstances && (
                  <Alert variant="success" title={t("mis.student.form.classInstanceSelected")}>
                    {t("mis.student.form.classInstanceNote")}
                  </Alert>
                )}
              </div>
            )}

            {/* Step 5: Parent/Guardian Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t("mis.student.parentGuardian")}
                </h3>

                {/* Primary Guardian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label={t("mis.student.guardianFirstName")}
                    required
                    {...register("primary_guardian.first_name")}
                    error={errors.primary_guardian?.first_name?.message}
                    placeholder={t("mis.student.form.fatherNamePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.guardianLastName")}
                    required
                    {...register("primary_guardian.last_name")}
                    error={errors.primary_guardian?.last_name?.message}
                    placeholder={t("mis.student.form.lastNamePlaceholder")}
                  />

                  <Select
                    label={t("mis.student.relation")}
                    required
                    {...register("primary_guardian.relation_type")}
                    error={errors.primary_guardian?.relation_type?.message}
                    options={[
                      { label: t("mis.student.form.selectRelation"), value: "" },
                      { label: t("mis.student.form.father"), value: "father" },
                      { label: t("mis.student.form.mother"), value: "mother" },
                      { label: t("mis.student.form.guardian"), value: "guardian" },
                      { label: t("mis.student.form.uncle"), value: "uncle" },
                      { label: t("mis.student.form.aunt"), value: "aunt" },
                      { label: t("mis.student.form.grandfather"), value: "grandfather" },
                      { label: t("mis.student.form.grandmother"), value: "grandmother" },
                      { label: t("mis.student.brother"), value: "brother" },
                      { label: t("mis.student.form.sister"), value: "sister" },
                      { label: t("mis.student.form.other"), value: "other" },
                    ]}
                  />

                  <Input
                    label={t("mis.student.guardianPhone")}
                    required
                    {...register("primary_guardian.phone")}
                    error={errors.primary_guardian?.phone?.message}
                    placeholder={t("mis.student.form.emergencyPhonePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.guardianSecondaryPhone")}
                    {...register("primary_guardian.phone_secondary")}
                    error={errors.primary_guardian?.phone_secondary?.message}
                    placeholder={t("mis.student.form.guardianSecondaryPhonePlaceholder")}
                  />

                  <Input
                    label={t("mis.student.guardianEmail")}
                    type="email"
                    {...register("primary_guardian.email")}
                    error={errors.primary_guardian?.email?.message}
                    placeholder={t("mis.student.form.guardianEmailPlaceholder")}
                  />

                  <Input
                    label={t("mis.student.guardianOccupation")}
                    {...register("primary_guardian.occupation")}
                    error={errors.primary_guardian?.occupation?.message}
                    placeholder={t("mis.student.form.occupationPlaceholder")}
                  />

                  <Input
                    label={t("mis.student.guardianNationalId")}
                    {...register("primary_guardian.national_id")}
                    error={errors.primary_guardian?.national_id?.message}
                    placeholder={t("mis.student.form.phoneOptional")}
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label={t("mis.student.guardianAddress")}
                      {...register("primary_guardian.address")}
                      error={errors.primary_guardian?.address?.message}
                      placeholder={t("mis.student.form.sameAsStudentAddress")}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Extended Parent/Guardian Information */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.form.additionalInformation")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t("mis.student.parentOccupation")}
                      {...register("parent_occupation")}
                      error={errors.parent_occupation?.message}
                      placeholder={t("mis.student.form.occupationPlaceholder")}
                    />

                    <Select
                      label={t("mis.student.relationshipToStudent")}
                      {...register("relationship_to_student")}
                      error={errors.relationship_to_student?.message}
                      options={[
                        { label: t("mis.student.form.selectRelationship"), value: "" },
                        { label: t("mis.student.brother"), value: "brother" },
                        { label: t("mis.student.paternalUncle"), value: "paternal_uncle" },
                        { label: t("mis.student.maternalUncle"), value: "maternal_uncle" },
                        { label: t("mis.student.cousin"), value: "cousin" },
                        { label: t("mis.student.otherRelative"), value: "other_relative" },
                      ]}
                    />
                  </div>
                </div>

                {/* Family Contact Numbers */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.familyContactNumbers")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label={t("mis.student.familyContactNumber1")}
                      {...register("family_contact_number_1")}
                      error={errors.family_contact_number_1?.message}
                      placeholder={t("mis.student.form.emergencyPhonePlaceholder")}
                    />

                    <Input
                      label={t("mis.student.familyContactNumber2")}
                      {...register("family_contact_number_2")}
                      error={errors.family_contact_number_2?.message}
                      placeholder={t("mis.student.form.familyPhonePlaceholder2")}
                    />

                    <Input
                      label={t("mis.student.familyContactNumber3")}
                      {...register("family_contact_number_3")}
                      error={errors.family_contact_number_3?.message}
                      placeholder={t("mis.student.form.familyPhonePlaceholder3")}
                    />

                    <Input
                      label={t("mis.student.telegramContact")}
                      {...register("telegram_contact")}
                      error={errors.telegram_contact?.message}
                      placeholder={t("mis.student.form.telegramPlaceholder")}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="border-t pt-6">
                  <Alert variant="info" title={t("mis.student.form.emergencyContact")}>
                    {t("mis.student.form.emergencyContactNote")}
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <Input
                      label={t("mis.student.form.emergencyContactName")}
                      {...register("emergency_contact_name")}
                      error={errors.emergency_contact_name?.message}
                      placeholder={t("mis.student.form.emergencyNamePlaceholder")}
                    />

                    <Input
                      label={t("mis.student.form.emergencyContactRelation")}
                      {...register("emergency_contact_relation")}
                      error={errors.emergency_contact_relation?.message}
                      placeholder={t("mis.student.form.emergencyRelationPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.form.emergencyContactPhone")}
                      {...register("emergency_contact_phone")}
                      error={errors.emergency_contact_phone?.message}
                      placeholder={t("mis.student.form.emergencyPhonePlaceholder")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Health Examination */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {t("mis.student.healthExamination")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* HIV Test */}
                  <Select
                    label={t("mis.student.hivTest")}
                    {...register("hiv_test")}
                    error={errors.hiv_test?.message}
                    options={[
                      { label: t("mis.student.form.selectRelation"), value: "" },
                      { label: t("mis.student.positive"), value: "positive" },
                      { label: t("mis.student.negative"), value: "negative" },
                      { label: t("mis.student.notTested"), value: "not_tested" },
                    ]}
                  />

                  {/* HCV Test */}
                  <Select
                    label={t("mis.student.hcvTest")}
                    {...register("hcv_test")}
                    error={errors.hcv_test?.message}
                    options={[
                      { label: t("mis.student.form.selectRelation"), value: "" },
                      { label: t("mis.student.positive"), value: "positive" },
                      { label: t("mis.student.negative"), value: "negative" },
                      { label: t("mis.student.notTested"), value: "not_tested" },
                    ]}
                  />

                  {/* HBS Test */}
                  <Select
                    label={t("mis.student.hbsTest")}
                    {...register("hbs_test")}
                    error={errors.hbs_test?.message}
                    options={[
                      { label: t("mis.student.form.selectRelation"), value: "" },
                      { label: t("mis.student.positive"), value: "positive" },
                      { label: t("mis.student.negative"), value: "negative" },
                      { label: t("mis.student.notTested"), value: "not_tested" },
                    ]}
                  />

                  {/* Test Date */}
                  <Input
                    label={t("mis.student.testDate")}
                    type="date"
                    {...register("health_test_date")}
                    error={errors.health_test_date?.message}
                  />
                </div>

                {/* Other Health Information */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.form.otherHealthInformation")}
                  </h4>
                  <div className="grid grid-cols-1 gap-6">
                    <Textarea
                      label={t("mis.student.form.medicalConditions")}
                      {...register("medical_conditions")}
                      error={errors.medical_conditions?.message}
                      placeholder={t("mis.student.form.medicalConditionsPlaceholder")}
                      rows={3}
                    />

                    <Textarea
                      label={t("mis.student.form.allergies")}
                      {...register("allergies")}
                      error={errors.allergies?.message}
                      placeholder={t("mis.student.form.allergiesPlaceholder")}
                      rows={2}
                    />

                    <Textarea
                      label={t("mis.student.form.regularMedications")}
                      {...register("medications")}
                      error={errors.medications?.message}
                      placeholder={t("mis.student.form.medicationsPlaceholder")}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Commitment & Review */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  {t("mis.student.commitmentAndReview")}
                </h3>

                {/* Review Information Alert */}
                <Alert variant="info" title={t("mis.student.reviewInformation")}>
                  {t("mis.student.form.reviewInformationNote")}
                </Alert>

                {/* Previous Education */}
                <div>
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.form.previousEducation")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label={t("mis.student.previousSchool")}
                      {...register("previous_school")}
                      error={errors.previous_school?.message}
                      placeholder={t("mis.student.previousSchoolPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.previousClass")}
                      {...register("previous_class")}
                      error={errors.previous_class?.message}
                      placeholder={t("mis.student.previousClassPlaceholder")}
                    />

                    <Input
                      label={t("mis.student.transferCertificateNumber")}
                      {...register("transfer_certificate_number")}
                      error={errors.transfer_certificate_number?.message}
                      placeholder={t("mis.student.transferCertificatePlaceholder")}
                    />
                  </div>
                </div>

                {/* School Policies & Commitment */}
                <div className="border-t pt-6">
                  <h4 className="text-md font-medium text-text-primary mb-4">
                    {t("mis.student.schoolPolicies")}
                  </h4>

                  <Alert variant="warning" title={t("mis.student.commitmentAndReview")}>
                    <p className="text-sm mb-4">
                      {t("mis.student.commitmentText")}
                    </p>
                  </Alert>

                  <div className="mt-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("commitment_accepted")}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-text-primary">
                        {t("mis.student.iAgreeToSchoolPolicies")}
                      </span>
                    </label>
                    {errors.commitment_accepted && (
                      <p className="mt-1 text-sm text-error">
                        {errors.commitment_accepted.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                {t("mis.student.form.previous")}
              </Button>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {t("mis.student.form.stepOfTotal", { current: currentStep, total: STEPS.length })}
                </Badge>
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={handleNext}
                >
                  {t("mis.student.form.next")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" />}
                  loading={createStudent.isPending || updateStudent.isPending}
                >
                  {isEdit ? t("mis.student.form.updateStudent") : t("mis.student.form.createStudent")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
