/**
 * CMS Module Types
 * Type definitions for the Content Management System
 */

// ============================================================================
// Multi-language support
// ============================================================================

export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

// ============================================================================
// Hero Slider Types
// ============================================================================

export interface HeroSlider {
  id: number;
  title: MultiLangText;
  subtitle: MultiLangText;
  description: MultiLangText;
  image: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroSliderInput {
  title: MultiLangText;
  subtitle: MultiLangText;
  description: MultiLangText;
  image: File | string | null;
  is_active: boolean;
  order: number;
}

export interface HeroSliderFormData {
  title_en: string;
  title_da: string;
  title_pa: string;
  subtitle_en: string;
  subtitle_da: string;
  subtitle_pa: string;
  description_en: string;
  description_da: string;
  description_pa: string;
  image: File | null;
  is_active: boolean;
  order: number;
}

// ============================================================================
// Stats Section Types
// ============================================================================

export interface StatsSection {
  id: number;
  TotalEnrolledStudent: number;
  TotalAward: number;
  TotalAcadimicProgram: number;
  TotalSportTeam: number;
  updated_at: string;
}

// ============================================================================
// Department Types
// ============================================================================

export interface Department {
  id: number;
  name: MultiLangText;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentInput {
  name: MultiLangText;
}

// ============================================================================
// Team Member Types
// ============================================================================

export type TeamMemberType = 'teacher' | 'staff';

export interface TeamMember {
  id: number;
  name: string;
  type: TeamMemberType;
  role: MultiLangText;
  image: string;
  department_id: number;
  email: string;
  phone: string;
  experience: MultiLangText;
  bio: MultiLangText;
  education: MultiLangText[];
  joinedDate: string;
  subjects?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TeamMemberInput {
  name: string;
  type: TeamMemberType;
  role: MultiLangText;
  image: File | string | null;
  department_id: number;
  email: string;
  phone: string;
  experience: MultiLangText;
  bio: MultiLangText;
  education: MultiLangText[];
  joinedDate: string;
  subjects?: string[];
}

export interface TeamMemberDetails {
  id: number;
  name: string;
  type: TeamMemberType;
  member_type?: TeamMemberType;
  role: MultiLangText;
  department_id: number;
  email: string;
  phone: string;
  image: string | null;
  bio: MultiLangText;
  experience: MultiLangText;
  education: MultiLangText[];
  joinedDate: string;
  joined_date?: string;
  subjects?: Array<MultiLangText | string>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
