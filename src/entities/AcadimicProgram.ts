// types.ts
export interface AcademicProgram {
  id: number;
  title: string;
  image: string;
  description: string;
  subjects: string[];
  grades: string;
  duration: string;
  students: number;
  teachers: number;
  highlights: string[];
}
export type AcademicPrograms = AcademicProgram[];
