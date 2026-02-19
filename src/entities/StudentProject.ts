export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

export interface ProjectCategory {
  id: number;
  name: MultiLangText;
}

export interface StudentProject {
  id: string;
  title: MultiLangText;
  students: Student[];
  category_id: number;
  description: MultiLangText;
  images: string[];
  completion_date: string;
  awards?: MultiLangText[];
}

export interface ProjectFilters {
  category: string;
  search: string;
}
