// types.ts
export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}
export interface AcademicProgram {
  id: number;
  title: MultiLangText;
  image: string;
  description: MultiLangText;
  subjects: MultiLangText[];
  grades: string;
  duration: string;
  students: number;
  teachers: number;
  highlights: MultiLangText[];
}
