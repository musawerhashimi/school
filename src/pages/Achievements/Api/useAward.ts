// React Query hooks for Awards API
import { useQuery } from "@tanstack/react-query";
import { awardService } from "./awardService";
import type {
  AwardCategory,
  Achievement,
  AwardStats,
  HallOfFameHonoree,
} from "./awardService";

// Query keys
export const awardKeys = {
  all: ["awards"] as const,
  categories: () => [...awardKeys.all, "categories"] as const,
  awards: () => [...awardKeys.all, "list"] as const,
  awardsByType: (type: "Student" | "School") =>
    [...awardKeys.awards(), type] as const,
  stats: () => [...awardKeys.all, "stats"] as const,
  hallOfFame: () => [...awardKeys.all, "hallOfFame"] as const,
};

// Hook for getting all award categories
export const useAwardCategories = () => {
  return useQuery<AwardCategory[]>({
    queryKey: awardKeys.categories(),
    queryFn: () => awardService.getCategories(),
  });
};

// Hook for getting all awards
export const useAwards = () => {
  return useQuery<Achievement[]>({
    queryKey: awardKeys.awards(),
    queryFn: () => awardService.getAwards(),
  });
};

// Hook for getting awards by type (Student or School)
export const useAwardsByType = (type: "Student" | "School") => {
  return useQuery<Achievement[]>({
    queryKey: awardKeys.awardsByType(type),
    queryFn: () => awardService.getAwardsByType(type),
    enabled: !!type,
  });
};

// Hook for getting award statistics
export const useAwardStats = () => {
  return useQuery<AwardStats>({
    queryKey: awardKeys.stats(),
    queryFn: () => awardService.getStats(),
  });
};

// Hook for getting Hall of Fame honorees
export const useHallOfFame = () => {
  return useQuery<HallOfFameHonoree[]>({
    queryKey: awardKeys.hallOfFame(),
    queryFn: () => awardService.getHallOfFame(),
  });
};
