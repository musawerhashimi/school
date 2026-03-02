import apiClient from "../../../../lib/api";
import type {
  RecreationCategory,
  RecreationalActivity,
} from "../../../../entities/Recreation";

// Recreation Service
interface ApiResponse<T> {
  results?: T[];
  data?: T[];
}

export const recreationService = {
  // Get all recreation categories
  getCategories: async () => {
    const response = await apiClient.get<ApiResponse<RecreationCategory>>(
      "/cms/recreation-categories/",
    );
    // Handle both direct array and wrapped response formats
    return (
      response.data.results ||
      response.data.data ||
      (response.data as unknown as RecreationCategory[])
    );
  },

  // Get all recreational activities
  getActivities: async () => {
    const response = await apiClient.get<ApiResponse<RecreationalActivity>>(
      "/cms/recreational-activities/",
    );
    // Handle both direct array and wrapped response formats
    const data =
      response.data.results ||
      response.data.data ||
      (response.data as unknown as RecreationalActivity[]);
    return Array.isArray(data) ? data : [];
  },

  // Get recreational activity by ID
  getActivityById: (id: number) =>
    apiClient.get<RecreationalActivity>(`/cms/recreational-activities/${id}/`),
};

export default recreationService;
