// ============================================================================
// Careers/Internship API Services
// File: src/services/api/CareersServices.ts
// ============================================================================

import { apiClient } from "../../../lib/api";
import type {
  Internship,
  InternshipCategory,
  InternshipQueryParams,
  InternshipCategoryQueryParams,
  InternshipsResponse,
  InternshipCategoriesResponse,
} from "../../../entities/intership";

// API endpoints
const INTERNSHIP_CATEGORIES_ENDPOINT = "/cms/internship-categories/";
const INTERNSHIPS_ENDPOINT = "/cms/internships/";

/**
 * Fetch paginated internship categories
 */
export const fetchInternshipCategories = async (
  params: InternshipCategoryQueryParams = {},
): Promise<InternshipCategoriesResponse> => {
  const response = await apiClient.get<InternshipCategoriesResponse>(
    INTERNSHIP_CATEGORIES_ENDPOINT,
    { params },
  );
  return response.data;
};

/**
 * Fetch paginated internships with optional filters
 */
export const fetchInternships = async (
  params: InternshipQueryParams = {},
): Promise<InternshipsResponse> => {
  const response = await apiClient.get<InternshipsResponse>(
    INTERNSHIPS_ENDPOINT,
    { params },
  );
  return response.data;
};

/**
 * Fetch a single internship by ID
 */
export const fetchInternshipById = async (id: number): Promise<Internship> => {
  const response = await apiClient.get<Internship>(
    `${INTERNSHIPS_ENDPOINT}${id}/`,
  );
  return response.data;
};

/**
 * Fetch internships by category
 */
export const fetchInternshipsByCategory = async (
  categoryId: number,
  params: Omit<InternshipQueryParams, "categoryId"> = {},
): Promise<InternshipsResponse> => {
  const response = await apiClient.get<InternshipsResponse>(
    INTERNSHIPS_ENDPOINT,
    {
      params: {
        ...params,
        categoryId,
      },
    },
  );
  return response.data;
};

// Export types for external use
export type {
  Internship,
  InternshipCategory,
  InternshipQueryParams,
  InternshipCategoryQueryParams,
  InternshipsResponse,
  InternshipCategoriesResponse,
};
