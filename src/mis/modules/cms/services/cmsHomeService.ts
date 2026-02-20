/**
 * CMS Home Service
 * API service layer for Home page content management
 */

import api from "@/lib/api";
import type {
  HeroSlider,
  HeroSliderInput,
  StatsSection,
  PaginatedResponse,
} from "../types";

// Base URLs
const SLIDERS_URL = "/cms/home/sliders/";
const STATS_URL = "/cms/home/stats/";

/**
 * Build FormData from slider input (for file upload support)
 */
function buildSliderFormData(input: HeroSliderInput): FormData {
  const formData = new FormData();

  // Multi-lang fields as JSON
  formData.append("title", JSON.stringify(input.title));
  formData.append("subtitle", JSON.stringify(input.subtitle));
  formData.append("description", JSON.stringify(input.description));

  // Image file
  if (input.image instanceof File) {
    formData.append("image", input.image);
  }

  formData.append("is_active", String(input.is_active));
  formData.append("order", String(input.order));

  return formData;
}

export const cmsHomeService = {
  // ============================================================================
  // Hero Sliders
  // ============================================================================

  sliders: {
    /**
     * Get all sliders
     */
    async getAll(): Promise<HeroSlider[]> {
      const response = await api.get<
        PaginatedResponse<HeroSlider> | HeroSlider[]
      >(SLIDERS_URL);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return response.data.results;
    },

    /**
     * Get a single slider by ID
     */
    async getById(id: number): Promise<HeroSlider> {
      const response = await api.get<HeroSlider>(`${SLIDERS_URL}${id}/`);
      return response.data;
    },

    /**
     * Create a new slider
     */
    async create(input: HeroSliderInput): Promise<HeroSlider> {
      const formData = buildSliderFormData(input);
      const response = await api.post<HeroSlider>(SLIDERS_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },

    /**
     * Update an existing slider
     */
    async update(id: number, input: HeroSliderInput): Promise<HeroSlider> {
      const formData = buildSliderFormData(input);
      const response = await api.put<HeroSlider>(
        `${SLIDERS_URL}${id}/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    },

    /**
     * Partially update a slider
     */
    async patch(
      id: number,
      input: Partial<HeroSliderInput>,
    ): Promise<HeroSlider> {
      const response = await api.patch<HeroSlider>(
        `${SLIDERS_URL}${id}/`,
        input,
      );
      return response.data;
    },

    /**
     * Delete a slider
     */
    async delete(id: number): Promise<void> {
      await api.delete(`${SLIDERS_URL}${id}/`);
    },

    /**
     * Toggle slider active status
     */
    async toggleActive(id: number, isActive: boolean): Promise<HeroSlider> {
      const response = await api.patch<HeroSlider>(`${SLIDERS_URL}${id}/`, {
        is_active: isActive,
      });
      return response.data;
    },
  },

  // ============================================================================
  // Stats Section
  // ============================================================================

  stats: {
    /**
     * Get current stats
     */
    async get(): Promise<StatsSection> {
      const response = await api.get<StatsSection>(STATS_URL);
      return response.data;
    },
  },
};
