import apiClient from "../../../../lib/api";

// Types for API responses
export interface CulturalEventApi {
  id: number;
  title: { en: string; da: string; pa: string };
  date: string;
  image: string;
  location: string;
  is_active: boolean;
}

export interface PerformanceHighlightApi {
  id: number;
  title: { en: string; da: string; pa: string };
  videoThumbnail: string;
  video_url: string;
  date: string;
  order: number;
  is_active: boolean;
}

interface ApiResponse<T> {
  results?: T[];
  data?: T[];
}

// Arts Service
export const artsService = {
  // Get all cultural events
  getCulturalEvents: async () => {
    const response = await apiClient.get<ApiResponse<CulturalEventApi>>(
      "/cms/cultural-events/",
    );
    // Handle both direct array and wrapped response formats
    const data =
      response.data.results ||
      response.data.data ||
      (response.data as unknown as CulturalEventApi[]);
    return Array.isArray(data) ? data : [];
  },

  // Get all performance highlights
  getPerformanceHighlights: async () => {
    const response = await apiClient.get<ApiResponse<PerformanceHighlightApi>>(
      "/cms/performance-highlights/",
    );
    // Handle both direct array and wrapped response formats
    const data =
      response.data.results ||
      response.data.data ||
      (response.data as unknown as PerformanceHighlightApi[]);
    return Array.isArray(data) ? data : [];
  },
};

export default artsService;
