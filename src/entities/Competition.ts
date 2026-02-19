export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export type CompetitionStatus = "upcoming" | "ongoing" | "completed";

export interface CompetitionCategory {
  id: string;
  name: MultiLangText;
}

export interface Prize {
  position: MultiLangText;
  description: MultiLangText;
}

export interface Competition {
  id: string;
  title: MultiLangText;
  description: MultiLangText;
  category_id: number;
  image: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  rules: MultiLangText;
  prizes: Prize[];
  maxParticipants?: number;
  location?: string;
  isTeamEvent?: boolean;
  teamSize?: {
    min: number;
    max: number;
  };
}
