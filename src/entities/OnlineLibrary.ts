export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface Book {
  id: number;
  title: MultiLangText;
  author: string;
  category_id: number;
  description: MultiLangText;
  coverImage: string;
  publicationYear: number;
  language: string;
}

// BookCategories Interface
export interface BookCategory {
  id: number;
  name: MultiLangText;
}
