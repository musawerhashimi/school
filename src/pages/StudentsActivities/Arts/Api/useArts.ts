import { useQuery } from "@tanstack/react-query";
import {
  artsService,
  type CulturalEventApi,
  type PerformanceHighlightApi,
} from "./ArtsService";

// Hook to get all cultural events
export const useCulturalEvents = () => {
  return useQuery<CulturalEventApi[], Error>({
    queryKey: ["cultural-events"],
    queryFn: async () => {
      console.log("Fetching cultural events from API...");
      const data = await artsService.getCulturalEvents();
      console.log("Cultural events response:", data);
      // Filter only active events
      return Array.isArray(data) ? data.filter((event) => event.is_active) : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get all performance highlights
export const usePerformanceHighlights = () => {
  return useQuery<PerformanceHighlightApi[], Error>({
    queryKey: ["performance-highlights"],
    queryFn: async () => {
      console.log("Fetching performance highlights from API...");
      const data = await artsService.getPerformanceHighlights();
      console.log("Performance highlights response:", data);
      // Filter only active performances
      return Array.isArray(data)
        ? data.filter((performance) => performance.is_active)
        : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useCulturalEvents;
