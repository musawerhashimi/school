// Types for Internships & Work Experience Section

export type Language = "en" | "da" | "pa";

export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface InternshipCategory {
  id: string;
  name: MultiLangText;
  icon: string;
}

export interface Internship {
  id: string;
  title: MultiLangText;
  organization: MultiLangText;
  categoryId: string;
  duration: MultiLangText;
  location: MultiLangText;
  description: MultiLangText;
  requirements: MultiLangText[];
  benefits: MultiLangText[];
  contactEmail: string;
  contactPhone: string;
  startDate: string; // ISO date format
  applicationDeadline: string; // ISO date format
  isActive: boolean;
  image?: string;
}
