export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface HomeSlider {
  title: MultiLangText;
  subtitle: MultiLangText;
  description: MultiLangText;
  image: string;
}

export interface StatsSection {
  TotalEnrolledStudent: number;
  TotalAward: number;
  TotalAcadimicProgram: number;
  TotalSportTeam: number;
}
