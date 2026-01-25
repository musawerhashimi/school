// src/types/sportsTeams.types.ts

export interface SportCategory {
  id: string;
  name: {
    en: string;
    da: string;
    pa: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  position: {
    en: string;
    da: string;
    pa: string;
  };
  photo: string;
  jerseyNumber?: number;
}

export interface Coach {
  id: string;
  name: string;
  photo: string;
  experience: {
    en: string;
    da: string;
    pa: string;
  };
  certifications?: {
    en: string[];
    da: string[];
    pa: string[];
  };
}

export interface Achievement {
  id: string;
  title: {
    en: string;
    da: string;
    pa: string;
  };
  description: {
    en: string;
    da: string;
    pa: string;
  };
  year: number;
  trophy?: string;
}

export interface SportsTeam {
  id: string;
  name: {
    en: string;
    da: string;
    pa: string;
  };
  categoryId: string;
  description: {
    en: string;
    da: string;
    pa: string;
  };
  image: string;
  coach: Coach;
  members: TeamMember[];
  achievements: Achievement[];
  establishedYear: number;

  facilities?: {
    en: string[];
    da: string[];
    pa: string[];
  };
}

export type LanguageType = "en" | "da" | "pa";
