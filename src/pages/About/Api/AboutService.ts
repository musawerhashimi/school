import { apiClient } from "../../../lib/api";
import type { Department, TeamMember } from "../../../entities/Teams";

export interface TeamResponse {
  departments: Department[];
  members: TeamMember[];
}

export interface TeamMemberDetails {
  id: number;
  name: string;
  member_type: "teacher" | "staff";
  role: {
    en: string;
    da: string;
    pa: string;
  };
  department_id: number;
  email: string;
  phone: string;
  image: string | null;
  bio: {
    en: string;
    da: string;
    pa: string;
  };
  experience: {
    en: string;
    da: string;
    pa: string;
  };
  education: Array<{
    en: string;
    da: string;
    pa: string;
  }>;
  joined_date: string;
  subjects?: Array<{
    en: string;
    da: string;
    pa: string;
  }>;
}

export class AboutService {
  static async getDepartments(): Promise<Department[]> {
    try {
      const response = await apiClient.get<Department[]>("/cms/departments/");
      console.log("Departments API response:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error);
      return [];
    }
  }

  static async getTeam(): Promise<TeamResponse> {
    const response = await apiClient.get<TeamResponse>("/cms/team/");
    return response.data;
  }

  static async getTeamMembers(): Promise<TeamMember[]> {
    const response = await apiClient.get<TeamMember[]>("/cms/team-members/");
    return response.data;
  }

  static async getTeamMemberDetails(id: number): Promise<TeamMemberDetails> {
    const response = await apiClient.get<TeamMemberDetails>(
      `/cms/team-members/${id}/`,
    );
    return response.data;
  }
}
