// Types for Awards API
export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface AwardCategory {
  id: number;
  name: MultiLangText;
  is_active: boolean;
}

export interface Achievement {
  id: number;
  title: MultiLangText;
  description: MultiLangText;
  category: AwardCategory;
  date: string;
  image: string;
  recipient: string;
  achievement_type: "School" | "Student";
}

export interface AwardStats {
  TotalAwards: number;
  InternationalAwards: number;
  StudentAchievers: number;
  NationalAwards: number;
}

export interface HallOfFameHonoree {
  id: number;
  name: string;
  honoree_type: "student" | "teacher";
  achievement: MultiLangText;
  year: number;
  description: MultiLangText;
  image: string;
}

// API functions
import apiClient from "../../../lib/api";

const AWARDS_BASE_URL = "/cms";

export const awardService = {
  // Get all award categories
  getCategories: async (): Promise<AwardCategory[]> => {
    const response = await apiClient.get(
      `${AWARDS_BASE_URL}/award-categories/`,
    );
    return response.data;
  },

  // Get all awards
  getAwards: async (): Promise<Achievement[]> => {
    const response = await apiClient.get(`${AWARDS_BASE_URL}/awards/`);
    return response.data;
  },

  // Get awards by type (Student or School)
  getAwardsByType: async (
    type: "Student" | "School",
  ): Promise<Achievement[]> => {
    const response = await apiClient.get(`${AWARDS_BASE_URL}/awards/`, {
      params: { achievement_type: type },
    });
    return response.data;
  },

  // Get award stats
  getStats: async (): Promise<AwardStats> => {
    const response = await apiClient.get(`${AWARDS_BASE_URL}/awards/stats/`);
    return response.data;
  },

  // Get Hall of Fame honorees
  getHallOfFame: async (): Promise<HallOfFameHonoree[]> => {
    const response = await apiClient.get(`${AWARDS_BASE_URL}/hall-of-fame/`);
    return response.data;
  },
};
