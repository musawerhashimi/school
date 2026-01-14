// src/types/studentProjects.types.ts

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface StudentProject {
  id: string;
  title: string;
  students: Student[];
  category: string;
  grade: string;
  description: string;
  images: string[];
  date: string;
  awards?: string[];
}

export interface ProjectFilters {
  category: string;
  grade: string;
  year: string;
  search: string;
  sortBy: "newest" | "oldest";
}
