// src/types/alumni.ts

export interface Alumni {
  id: string;
  name: string; // No translation needed
  quote: {
    en: string;
    da: string;
    pa: string;
  };
  gradeLevel: string; // e.g., "A+", "A", "B+", etc.
  image: string;
  graduatedYear: number;
  email?: string;
  achievements: {
    en: string;
    da: string;
    pa: string;
  }[]; // Array of achievements
}

export type Language = "en" | "da" | "pa";
