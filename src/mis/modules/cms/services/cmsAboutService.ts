/**
 * CMS About Service
 * API service layer for About page / Team content management
 */

import api from "@/lib/api";
import type {
  Department,
  DepartmentInput,
  TeamMember,
  TeamMemberInput,
  TeamMemberDetails,
  PaginatedResponse,
} from "../types";

// Base URLs
const DEPARTMENTS_URL = "/cms/departments/";
const TEAM_MEMBERS_URL = "/cms/team-members/";

/**
 * Build FormData from team member input (for file upload support)
 */
function buildTeamMemberFormData(input: TeamMemberInput): FormData {
  const formData = new FormData();

  formData.append("name", input.name);
  formData.append("type", input.type);
  formData.append("role", JSON.stringify(input.role));
  formData.append("department_id", String(input.department_id));
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  formData.append("experience", JSON.stringify(input.experience));
  formData.append("bio", JSON.stringify(input.bio));
  formData.append("education", JSON.stringify(input.education));
  formData.append("joinedDate", input.joinedDate);

  if (input.subjects) {
    formData.append("subjects", JSON.stringify(input.subjects));
  }

  if (input.image instanceof File) {
    formData.append("image", input.image);
  }

  return formData;
}

export const cmsAboutService = {
  // ============================================================================
  // Departments
  // ============================================================================

  departments: {
    /**
     * Get all departments
     */
    async getAll(): Promise<Department[]> {
      const response = await api.get<
        PaginatedResponse<Department> | Department[]
      >(DEPARTMENTS_URL);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results;
    },

    /**
     * Get a single department by ID
     */
    async getById(id: number): Promise<Department> {
      const response = await api.get<Department>(`${DEPARTMENTS_URL}${id}/`);
      return response.data;
    },

    /**
     * Create a new department
     */
    async create(input: DepartmentInput): Promise<Department> {
      const response = await api.post<Department>(DEPARTMENTS_URL, input);
      return response.data;
    },

    /**
     * Update an existing department
     */
    async update(id: number, input: DepartmentInput): Promise<Department> {
      const response = await api.put<Department>(
        `${DEPARTMENTS_URL}${id}/`,
        input,
      );
      return response.data;
    },

    /**
     * Delete a department
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${DEPARTMENTS_URL}${id}/`);
    },
  },

  // ============================================================================
  // Team Members
  // ============================================================================

  teamMembers: {
    /**
     * Get all team members
     */
    async getAll(): Promise<TeamMember[]> {
      const response = await api.get<
        PaginatedResponse<TeamMember> | TeamMember[]
      >(TEAM_MEMBERS_URL);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results;
    },

    /**
     * Get a single team member by ID
     */
    async getById(id: number): Promise<TeamMemberDetails> {
      const response = await api.get<TeamMemberDetails>(
        `${TEAM_MEMBERS_URL}${id}/`,
      );
      return response.data;
    },

    /**
     * Create a new team member
     */
    async create(input: TeamMemberInput): Promise<TeamMember> {
      const formData = buildTeamMemberFormData(input);
      const response = await api.post<TeamMember>(TEAM_MEMBERS_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },

    /**
     * Update an existing team member
     */
    async update(id: number, input: TeamMemberInput): Promise<TeamMember> {
      const formData = buildTeamMemberFormData(input);
      const response = await api.put<TeamMember>(
        `${TEAM_MEMBERS_URL}${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },

    /**
     * Delete a team member
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${TEAM_MEMBERS_URL}${id}/`);
    },
  },
};
