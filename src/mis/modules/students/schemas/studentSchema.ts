import { z } from 'zod';

// Guardian schema for nested validation
export const guardianSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(100),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  relation_type: z.enum(
    ['father', 'mother', 'guardian', 'uncle', 'aunt', 'grandfather', 'grandmother', 'brother', 'sister', 'other'],
    { required_error: 'Relation is required' }
  ),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  phone_secondary: z.string().max(20).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  occupation: z.string().max(100).optional(),
  address: z.string().optional(),
  national_id: z.string().max(50).optional(),
});

// Tazkira details schema (from commitment form)
export const tazkiraDetailsSchema = z.object({
  page_number: z.string().max(50).optional(),
  volume_number: z.string().max(50).optional(),
  registration_number: z.string().max(100).optional(),
  birth_date_on_tazkira: z.string().optional(),
  age_on_tazkira: z.number().min(0).max(100).optional(),
}).optional();

// Location schema (from commitment form)
export const locationSchema = z.object({
  province: z.string().min(1, 'Province is required'),
  district: z.string().optional(),
  area: z.string().optional(),
});

// Health examination schema (from commitment form)
export const healthExaminationSchema = z.object({
  hiv_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  hcv_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  hbs_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  test_date: z.string().optional(),
}).optional();

// Student creation/update schema
export const studentSchema = z.object({
  // Personal Information
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(100),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(100),
  father_name: z.string().min(2, "Father's name must be at least 2 characters").max(200),
  grandfather_name: z.string().max(200).optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  nationality: z.string().max(50).default('Afghan'),
  religion: z.string().max(50).optional(),
  blood_group: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  national_id: z.string().max(50).optional(),

  // Personal Information - Extended (from commitment form)
  nickname: z.string().max(100).optional(),
  current_age: z.number().min(0).max(100).optional(),

  // Tazkira Details (from commitment form)
  tazkira_page_number: z.string().max(50).optional(),
  tazkira_volume_number: z.string().max(50).optional(),
  tazkira_registration_number: z.string().max(100).optional(),
  birth_date_on_tazkira: z.string().optional(),
  age_on_tazkira: z.number().min(0).max(100).optional(),

  // Location Information (from commitment form)
  original_province: z.string().optional(),
  original_district: z.string().optional(),
  original_area: z.string().optional(),
  current_province: z.string().optional(),
  current_district: z.string().optional(),
  current_area: z.string().optional(),

  // Contact Information
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required').max(100),
  province: z.enum([
    'kabul', 'balkh', 'herat', 'kandahar', 'nangarhar', 'kunduz', 'baghlan',
    'takhar', 'badakhshan', 'ghazni', 'paktia', 'paktika', 'khost', 'logar',
    'wardak', 'kapisa', 'parwan', 'panjshir', 'bamyan', 'daykundi', 'ghor',
    'faryab', 'jawzjan', 'sar_e_pol', 'samangan', 'helmand', 'farah', 'nimroz',
    'uruzgan', 'zabul', 'kunar', 'laghman', 'nuristan', 'badghis'
  ], { required_error: 'Province is required' }),
  phone: z.string().max(20).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),

  // Academic Information
  current_class: z.number().optional(),
  section: z.string().max(10).optional(),
  roll_number: z.string().max(20).optional(),
  admission_date: z.string().min(1, 'Admission date is required'),
  education_level: z.enum(['primary', 'lower_secondary', 'upper_secondary'], {
    required_error: 'Education level is required'
  }),

  // Academic Information - Enhanced (with academic module integration)
  academic_year: z.number().optional(),
  class_instance: z.number().optional(),
  shift: z.enum(['morning', 'afternoon', 'evening']).optional(),
  enrollment_type: z.enum(['fresh', 'transfer', 'readmission']).optional(),

  // Guardian Information
  primary_guardian: guardianSchema,
  secondary_guardian: guardianSchema.optional(),

  // Parent/Guardian - Extended (from commitment form)
  parent_occupation: z.string().max(100).optional(),
  family_contact_number_1: z.string().max(20).optional(),
  family_contact_number_2: z.string().max(20).optional(),
  family_contact_number_3: z.string().max(20).optional(),
  telegram_contact: z.string().max(50).optional(),
  relationship_to_student: z.enum([
    'brother',
    'paternal_uncle',
    'maternal_uncle',
    'cousin',
    'other_relative'
  ]).optional(),

  // Emergency Contact
  emergency_contact_name: z.string().max(200).optional(),
  emergency_contact_phone: z.string().max(20).optional(),
  emergency_contact_relation: z.string().max(50).optional(),

  // Health Information
  medical_conditions: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),

  // Health Examination (from commitment form)
  hiv_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  hcv_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  hbs_test: z.enum(['positive', 'negative', 'not_tested']).optional(),
  health_test_date: z.string().optional(),

  // Previous Education
  previous_school: z.string().max(200).optional(),
  previous_class: z.string().max(50).optional(),
  transfer_certificate_number: z.string().max(100).optional(),

  // Commitment (from commitment form - required for new students)
  commitment_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the commitment to school policies'
  }),
});

// Update schema (all fields optional except what's required for update)
export const studentUpdateSchema = studentSchema.partial().omit({
  primary_guardian: true,
  secondary_guardian: true,
});

// Document upload schema
export const documentUploadSchema = z.object({
  document_type: z.enum([
    'birth_certificate',
    'tazkira',
    'transfer_certificate',
    'previous_result',
    'photo',
    'medical_report',
    'guardian_tazkira',
    'vaccination_record',
    'other',
  ], { required_error: 'Document type is required' }),
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
});

// Bulk promotion schema
export const bulkPromotionSchema = z.object({
  student_ids: z.array(z.number()).min(1, 'Select at least one student'),
  class_id: z.number().optional(),
  class_name: z.string().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  section: z.string().max(10).optional(),
}).refine(
  (data) => data.class_id !== undefined || data.class_name !== undefined,
  {
    message: 'Either class ID or class name must be provided',
    path: ['class_id'],
  }
);

// Bulk status update schema
export const bulkStatusUpdateSchema = z.object({
  student_ids: z.array(z.number()).min(1, 'Select at least one student'),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred', 'suspended', 'expelled', 'withdrawn'], {
    required_error: 'Status is required'
  }),
});

// Filter schema
export const studentFilterSchema = z.object({
  status: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  education_level: z.enum(['primary', 'lower_secondary', 'upper_secondary']).optional(),
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

// Type exports
export type StudentFormData = z.infer<typeof studentSchema>;
export type StudentUpdateFormData = z.infer<typeof studentUpdateSchema>;
export type GuardianFormData = z.infer<typeof guardianSchema>;
export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;
export type BulkPromotionFormData = z.infer<typeof bulkPromotionSchema>;
export type BulkStatusUpdateFormData = z.infer<typeof bulkStatusUpdateSchema>;
export type StudentFilterFormData = z.infer<typeof studentFilterSchema>;
