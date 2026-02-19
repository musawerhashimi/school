export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface TripCategory {
  id: number;
  name: MultiLangText;
}

export interface Trip {
  id: string;
  title: MultiLangText;
  description: MultiLangText;
  location: MultiLangText;
  date: string;
  duration: number;
  gradeLevels: string;
  category_id: number;
  images: string;
  participants?: number;
}
