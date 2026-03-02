import { useQuery } from "@tanstack/react-query";
import { recreationService } from "./RecreationService";
import type {
  RecreationCategory,
  RecreationalActivity,
} from "../../../../entities/Recreation";

// Hook to get all recreation categories
export const useRecreationCategories = () => {
  return useQuery<RecreationCategory[], Error>({
    queryKey: ["recreation-categories"],
    queryFn: async () => {
      console.log("Fetching categories from API...");
      const data = await recreationService.getCategories();
      console.log("Categories response:", data);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get all recreational activities
export const useRecreationalActivities = () => {
  return useQuery<RecreationalActivity[], Error>({
    queryKey: ["recreational-activities"],
    queryFn: async () => {
      console.log("Fetching activities from API...");
      const data = await recreationService.getActivities();
      console.log("Activities response:", data);
      // Filter only active activities
      return Array.isArray(data)
        ? data.filter((activity) => activity.is_active)
        : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get recreational activity by ID
export const useRecreationalActivityById = (id: number) => {
  return useQuery<RecreationalActivity, Error>({
    queryKey: ["recreational-activity", id],
    queryFn: async () => {
      console.log("Fetching activity by ID:", id);
      const response = await recreationService.getActivityById(id);
      console.log("Activity response:", response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: id > 0, // Only run query if id is provided and valid
  });
};

// Hook to get activities filtered by category
export const useActivitiesByCategory = (categoryId: number | null) => {
  return useQuery<RecreationalActivity[], Error>({
    queryKey: ["recreational-activities", categoryId],
    queryFn: async () => {
      const data = await recreationService.getActivities();
      let activities = Array.isArray(data)
        ? data.filter((activity) => activity.is_active)
        : [];

      // Filter by category if categoryId is provided and not "all"
      if (categoryId !== null && categoryId !== undefined) {
        activities = activities.filter(
          (activity) => activity.categoryId === categoryId,
        );
      }

      return activities;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export default useRecreationCategories;
