// Types for Charity Events Section

export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface CharityEvent {
  name: MultiLangText;
  date: string; // ISO format: YYYY-MM-DD
  time: string; // Format: HH:MM AM/PM
  location: MultiLangText;
  description: MultiLangText;
  purpose: MultiLangText;
  image: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: BreadcrumbItem[];
}

// Props for potential sub-components

export interface EventCardProps {
  event: CharityEvent;
  lang: "en" | "da" | "pa";
  isPast: boolean;
  t: (key: string) => string;
}

export interface EventFilterProps {
  filter: "all" | "upcoming" | "past";
  setFilter: (filter: "all" | "upcoming" | "past") => void;
  upcomingCount: number;
  pastCount: number;
  t: (key: string) => string;
}

export interface HeroSectionProps {
  t: (key: string) => string;
  upcomingCount: number;
  completedCount: number;
}
