import { z } from 'zod';

// Afghan provinces (same as in students module)
const afghanProvinces = [
  'kabul', 'balkh', 'herat', 'kandahar', 'nangarhar', 'kunduz', 'baghlan',
  'takhar', 'badakhshan', 'ghazni', 'paktia', 'paktika', 'khost', 'logar',
  'wardak', 'kapisa', 'parwan', 'panjshir', 'bamyan', 'daykundi', 'ghor',
  'faryab', 'jawzjan', 'sar_e_pol', 'samangan', 'helmand', 'farah', 'nimroz',
  'uruzgan', 'zabul', 'kunar', 'laghman', 'nuristan', 'badghis'
] as const;

// Base staff schema without refinement (for partial operations)
const staffBaseSchema = z.object({
  // Personal Information
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(100),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  father_name: z.string().min(2, "Father's name must be at least 2 characters").max(200),
  grandfather_name: z.string().max(200).optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  nationality: z.string().max(50).default('Afghan'),
  marital_status: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),

  // Contact Information
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  phone_secondary: z.string().max(20).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  emergency_contact_name: z.string().max(200).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  emergency_contact_relation: z.string().max(50).optional(),

  // Address
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required').max(100),
  province: z.enum(afghanProvinces, { required_error: 'Province is required' }),

  // National ID / Tazkira
  tazkira_number: z.string().min(5, 'Tazkira number is required').max(50),
  tazkira_page_number: z.string().max(50).optional(),
  tazkira_volume_number: z.string().max(50).optional(),

  // Employment Information
  position: z.enum([
    'teacher', 'principal', 'vice_principal', 'admin_staff',
    'librarian', 'accountant', 'counselor', 'security', 'support_staff'
  ], { required_error: 'Position is required' }),
  department: z.enum([
    'administration', 'academic', 'accounts', 'library',
    'it', 'sports', 'support', 'other'
  ], { required_error: 'Department is required' }),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'temporary']).default('full_time'),
  join_date: z.string().min(1, 'Join date is required'),
  end_date: z.string().optional(),
  initial_shift_id: z.number().int().positive().optional(),
  shift_effective_from: z.string().optional(),

  // Qualifications
  highest_qualification: z.string().max(200).optional(),
  specialization: z.string().max(200).optional(),
  years_of_experience: z.number().min(0).max(50).default(0),

  // Work Details
  work_hours_per_week: z.number().min(1).max(168).default(40),

  // Notes
  notes: z.string().optional(),
});

// Main staff creation/update schema with validation
export const staffSchema = staffBaseSchema.superRefine((data, ctx) => {
  if (data.employment_type !== 'full_time' && !data.initial_shift_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['initial_shift_id'],
      message: 'Shift is required for non-full-time employment.',
    });
  }
});

// Update schema (all fields optional except status can be added)
export const staffUpdateSchema = staffBaseSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'on_leave', 'suspended', 'terminated', 'resigned']).optional(),
});

// Shift schema
export const shiftSchema = z.object({
  name: z.string().min(2, 'Shift name is required').max(100),
  name_dari: z.string().max(100).optional(),
  name_pashto: z.string().max(100).optional(),
  shift_type: z.enum(['morning', 'afternoon', 'evening', 'custom'], {
    required_error: 'Shift type is required'
  }),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  working_days: z.string().optional(),
  is_active: z.boolean(),
  description: z.string().optional(),
}).strict();

export const shiftSchemaWithDefaults = shiftSchema.extend({
  is_active: z.boolean().default(true),
});

// Salary schema
export const salarySchema = z.object({
  basic_salary: z.number().min(0, 'Basic salary must be positive'),
  housing_allowance: z.number().min(0).default(0),
  transport_allowance: z.number().min(0).default(0),
  effective_from: z.string().min(1, 'Effective date is required'),
  effective_to: z.string().optional(),
  is_current: z.boolean().default(true),
  notes: z.string().optional(),
});

// Assign shift schema
export const assignShiftSchema = z.object({
  shift: z.number({ required_error: 'Shift is required' }),
  effective_from: z.string().min(1, 'Effective from date is required'),
  effective_to: z.string().optional(),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

// Document upload schema
export const documentUploadSchema = z.object({
  document_type: z.enum([
    'tazkira', 'resume', 'degree_certificate', 'teaching_license',
    'experience_letter', 'appointment_letter', 'contract',
    'medical_certificate', 'police_clearance', 'photo', 'other'
  ], { required_error: 'Document type is required' }),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
});

// Type exports
export type StaffFormData = z.infer<typeof staffSchema>;
export type StaffUpdateFormData = z.infer<typeof staffUpdateSchema>;
export type ShiftFormData = z.infer<typeof shiftSchema>;
export type SalaryFormData = z.infer<typeof salarySchema>;
export type AssignShiftFormData = z.infer<typeof assignShiftSchema>;
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
