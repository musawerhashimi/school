// types/competition.ts

export interface CompetitionCategory {
  id: string;
  name: string;
}

export type CompetitionStatus = "upcoming" | "ongoing" | "completed";

export interface Prize {
  position: string;
  award: string;
  description?: string;
}

export interface Winner {
  id: string;
  studentName: string;
  grade: string;
  position: string;
  image?: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  category_id: CompetitionCategory["id"];
  status: CompetitionStatus;
  image: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  eligibility: string[];
  rules: string[];
  prizes: Prize[];
  winners?: Winner[];
  organizer: string;
  maxParticipants?: number;
  currentParticipants?: number;
  location?: string;
  isTeamEvent?: boolean;
  teamSize?: {
    min: number;
    max: number;
  };
}

export interface CompetitionRegistration {
  competitionId: string;
  studentName: string;
  studentId: string;
  grade: string;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  teamMembers?: {
    name: string;
    studentId: string;
    grade: string;
  }[];
  additionalInfo?: string;
}

export interface CompetitionFilters {
  search: string;
  category: CompetitionCategory | "all";
  status: CompetitionStatus | "all";
}
