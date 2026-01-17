export interface Book {
  id: string;
  title: string;
  author: string;
  category_id: number;
  description: string;
  coverImage: string;
  publicationYear: number;
  language: string;
}

// BookCategories Interface
export interface BookCategory {
  id: number;
  name: string;
}
