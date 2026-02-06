// Types
export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface AwardCategories {
  id: number;
  name: MultiLangText;
}
export interface Achievement {
  id: number;
  title: MultiLangText;
  description: MultiLangText;
  category_id: number;
  date: string;
  image?: string;
  recipient: string; //(Team Name or Student name or Scoll name or Teacher name)
  typel: "School" | "Student"; //(School,Student)
}

export interface Stat {
  TotalAwards: number;
  InternationalAwards: number;
  StudentAchievers: number;
  NationalAwards: number;
}
