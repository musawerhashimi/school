import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TestimonialType } from "../../../entities/Testimonial";
import CommunityService from "./TestmonialService";

// Query keys for React Query
export const communityKeys = {
  testimonials: ["testimonials"] as const,
  testimonial: (id: number) => ["testimonial", id] as const,
};

// Hook for fetching testimonials (public - for frontend display)
export const useTestimonials = () => {
  return useQuery({
    queryKey: communityKeys.testimonials,
    queryFn: () => CommunityService.getTestimonials(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook for fetching all testimonials (admin - with auth)
export const useAllTestimonials = () => {
  return useQuery({
    queryKey: [...communityKeys.testimonials, "admin"],
    queryFn: () => CommunityService.getAllTestimonials(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

// Hook for fetching a single testimonial by ID
export const useTestimonial = (id: number) => {
  return useQuery({
    queryKey: communityKeys.testimonial(id),
    queryFn: () => CommunityService.getTestimonialById(id),
    enabled: !!id,
  });
};

// Hook for creating a testimonial (admin)
export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<TestimonialType, "id">) =>
      CommunityService.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.testimonials });
    },
  });
};

// Hook for updating a testimonial (admin)
export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<TestimonialType>;
    }) => CommunityService.updateTestimonial(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.testimonials });
      queryClient.invalidateQueries({
        queryKey: communityKeys.testimonial(id),
      });
    },
  });
};

// Hook for deleting a testimonial (admin)
export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => CommunityService.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.testimonials });
    },
  });
};

export default useTestimonials;
