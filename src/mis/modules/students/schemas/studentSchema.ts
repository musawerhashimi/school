import { z } from "zod";

const PROVINCES = [
  "kabul",
  "balkh",
  "herat",
  "kandahar",
  "nangarhar",
  "kunduz",
  "baghlan",
  "takhar",
  "badakhshan",
  "ghazni",
  "paktia",
  "paktika",
  "khost",
  "logar",
  "wardak",
  "kapisa",
  "parwan",
  "panjshir",
  "bamyan",
  "daykundi",
  "ghor",
  "faryab",
  "jawzjan",
  "sar_e_pol",
  "samangan",
  "helmand",
  "farah",
  "nimroz",
  "uruzgan",
  "zabul",
  "kunar",
  "laghman",
  "nuristan",
  "badghis",
] as const;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const optionalString = (max: number) =>
  z
    .string()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

const optionalIntegerField = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === "number") {
    return value;
  }
  return Number(value);
}, z.number().int().positive().optional());

export const guardianSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(100),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(100),
  relation_type: z.enum([
    "father",
    "mother",
    "guardian",
    "uncle",
    "aunt",
    "grandfather",
    "grandmother",
    "brother",
    "sister",
    "other",
  ]),
  phone: z.string().min(7, "Phone number is required").max(20),
  phone_secondary: optionalString(20),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  occupation: optionalString(100),
  address: z.string().optional().or(z.literal("")).transform((value) => (value ? value : undefined)),
  national_id: optionalString(50),
});

const studentBaseSchema = z.object({
    // Personal Information
    first_name: z.string().min(2, "First name is required").max(100),
    last_name: z.string().min(2, "Last name is required").max(100),
    father_name: z.string().min(2, "Father name is required").max(200),
    grandfather_name: optionalString(200),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female"]),
    nationality: z.string().max(50).default("Afghan"),
    religion: optionalString(50),
    blood_group: z.enum(BLOOD_GROUPS).optional(),
    national_id: optionalString(50),

    // Contact Information
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required").max(100),
    province: z.enum(PROVINCES),
    phone: optionalString(20),
    email: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),

    // Academic Information
    current_class: optionalIntegerField,
    roll_number: optionalString(20),
    admission_date: z.string().min(1, "Admission date is required"),
    admission_number: optionalString(50),
    education_level: z.enum(["primary", "lower_secondary", "upper_secondary"]),
    status: z
      .enum([
        "active",
        "inactive",
        "graduated",
        "transferred",
        "suspended",
        "expelled",
        "withdrawn",
      ])
      .optional(),

    // Guardian Selection / Creation
    primary_guardian_id: optionalIntegerField,
    secondary_guardian_id: optionalIntegerField.nullable().optional(),
    primary_guardian: guardianSchema.optional(),
    secondary_guardian: guardianSchema.optional(),

    // Emergency Contact
    emergency_contact_name: optionalString(200),
    emergency_contact_phone: optionalString(20),
    emergency_contact_relation: optionalString(50),

    // Health Information
    medical_conditions: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),
    allergies: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),
    medications: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((value) => (value ? value : undefined)),

    // Previous Education
    previous_school: optionalString(200),
    previous_class: optionalString(50),
    transfer_certificate_number: optionalString(100),
});

export const studentSchema = studentBaseSchema.superRefine((data, ctx) => {
    if (!data.primary_guardian_id && !data.primary_guardian) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["primary_guardian_id"],
        message: "Select an existing guardian or provide new guardian information.",
      });
    }
  });

export const studentUpdateSchema = studentBaseSchema.partial();

export const documentUploadSchema = z.object({
  document_type: z.enum([
    "birth_certificate",
    "tazkira",
    "transfer_certificate",
    "previous_result",
    "photo",
    "medical_report",
    "guardian_tazkira",
    "vaccination_record",
    "other",
  ]),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
});

export const bulkPromotionSchema = z
  .object({
    student_ids: z.array(z.number()).min(1, "Select at least one student"),
    class_id: z.number().optional(),
    class_name: z.string().optional(),
    academic_year: z.string().min(1, "Academic year is required"),
    section: z.string().max(10).optional(),
  })
  .refine((data) => data.class_id !== undefined || data.class_name !== undefined, {
    message: "Either class ID or class name must be provided",
    path: ["class_id"],
  });

export const bulkStatusUpdateSchema = z.object({
  student_ids: z.array(z.number()).min(1, "Select at least one student"),
  status: z.enum([
    "active",
    "inactive",
    "graduated",
    "transferred",
    "suspended",
    "expelled",
    "withdrawn",
  ]),
});

export const studentFilterSchema = z.object({
  status: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  education_level: z.enum(["primary", "lower_secondary", "upper_secondary"]).optional(),
  province: z.string().optional(),
  class_id: z.number().optional(),
  section: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
  ordering: z.string().optional(),
  admission_date_from: z.string().optional(),
  admission_date_to: z.string().optional(),
  age_min: z.number().optional(),
  age_max: z.number().optional(),
});

export type StudentFormData = z.infer<typeof studentSchema>;
export type StudentUpdateFormData = z.infer<typeof studentUpdateSchema>;
export type GuardianFormData = z.infer<typeof guardianSchema>;
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
export type BulkPromotionFormData = z.infer<typeof bulkPromotionSchema>;
export type BulkStatusUpdateFormData = z.infer<typeof bulkStatusUpdateSchema>;
export type StudentFilterFormData = z.infer<typeof studentFilterSchema>;
