// Types for Internships & Work Experience Section

export type Language = "en" | "da" | "pa";

export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

// Base paginated response structure
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface InternshipCategory {
  id: number;
  name: MultiLangText;
  created_at?: string;
  updated_at?: string;
}

export interface Internship {
  id: number;
  title: MultiLangText;
  organization: MultiLangText;
  categoryId: number;
  duration: number;
  location: MultiLangText;
  image?: string;
  startDate: string; // ISO date format
  applicationDeadline: string; // ISO date format
  isActive: boolean;
  isOpen: boolean;
  order: number;
  // Additional fields that might be available in some responses
  description?: MultiLangText;
  requirements?: MultiLangText;
  benefits?: MultiLangText;
  contactEmail?: string;
  contactPhone?: string;
}

// Paginated response types
export type InternshipCategoriesResponse =
  PaginatedResponse<InternshipCategory>;

export interface InternshipsResponse extends PaginatedResponse<Internship> {}

// Query params
export interface InternshipQueryParams {
  page?: number;
  page_size?: number;
  categoryId?: number;
}

export interface InternshipCategoryQueryParams {
  page?: number;
  page_size?: number;
}
