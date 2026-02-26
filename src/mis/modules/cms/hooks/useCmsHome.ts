/**
 * CMS Home Hooks
 * React Query hooks for Home page content management
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cmsHomeService } from "../services/cmsHomeService";
import type { HeroSlider, HeroSliderInput, StatsSection } from "../types";

// ============================================================================
// Query Keys
// ============================================================================

export const CMS_HOME_QUERY_KEYS = {
  sliders: ["cms", "home", "sliders"] as const,
  slider: (id: number) => ["cms", "home", "sliders", id] as const,
  stats: ["cms", "home", "stats"] as const,
};

// ============================================================================
// Hero Slider Hooks
// ============================================================================

/**
 * Fetch all hero sliders
 */
export function useHeroSliders() {
  return useQuery<HeroSlider[]>({
    queryKey: CMS_HOME_QUERY_KEYS.sliders,
    queryFn: () => cmsHomeService.sliders.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch a single hero slider by ID
 */
export function useHeroSlider(id: number) {
  return useQuery<HeroSlider>({
    queryKey: CMS_HOME_QUERY_KEYS.slider(id),
    queryFn: () => cmsHomeService.sliders.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create a new hero slider
 */
export function useCreateHeroSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: HeroSliderInput) =>
      cmsHomeService.sliders.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_HOME_QUERY_KEYS.sliders });
      queryClient.invalidateQueries({ queryKey: ["home"] }); // Invalidate public home data
      toast.success("Slider created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create slider: ${error.message}`);
    },
  });
}

/**
 * Update an existing hero slider
 */
export function useUpdateHeroSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: HeroSliderInput }) =>
      cmsHomeService.sliders.update(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CMS_HOME_QUERY_KEYS.sliders });
      queryClient.invalidateQueries({
        queryKey: CMS_HOME_QUERY_KEYS.slider(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      toast.success("Slider updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update slider: ${error.message}`);
    },
  });
}

/**
 * Delete a hero slider
 */
export function useDeleteHeroSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cmsHomeService.sliders.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_HOME_QUERY_KEYS.sliders });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      toast.success("Slider deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete slider: ${error.message}`);
    },
  });
}

/**
 * Toggle slider active status
 */
export function useToggleHeroSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      cmsHomeService.sliders.toggleActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CMS_HOME_QUERY_KEYS.sliders });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      toast.success("Slider status updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update slider status: ${error.message}`);
    },
  });
}

// ============================================================================
// Stats Section Hooks
// ============================================================================

/**
 * Fetch current stats
 */
export function useHomeStats() {
  return useQuery<StatsSection>({
    queryKey: CMS_HOME_QUERY_KEYS.stats,
    queryFn: () => cmsHomeService.stats.get(),
    staleTime: 5 * 60 * 1000,
  });
}
