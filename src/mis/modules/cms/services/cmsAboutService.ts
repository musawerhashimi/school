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
  formData.append("member_type", input.type);
  formData.append("role.en", input.role.en);
  formData.append("role.da", input.role.da);
  formData.append("role.pa", input.role.pa);
  formData.append("department", String(input.department_id));
  formData.append("email", input.email);
  formData.append("phone", input.phone);
  formData.append("experience.en", input.experience.en);
  formData.append("experience.da", input.experience.da);
  formData.append("experience.pa", input.experience.pa);
  formData.append("bio.en", input.bio.en);
  formData.append("bio.da", input.bio.da);
  formData.append("bio.pa", input.bio.pa);
  formData.append("education", JSON.stringify(input.education));
  formData.append("joined_date", input.joinedDate);

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
      const url = `${TEAM_MEMBERS_URL}${id}/`;
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response =
        input.image instanceof File
          ? await api.put<TeamMember>(url, formData, config)
          : await api.patch<TeamMember>(url, formData, config);
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
