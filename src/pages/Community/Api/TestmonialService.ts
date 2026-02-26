import type { TestimonialType } from "@/entities/Testimonial";
import apiClient from "@/lib/api";

const CMS_BASE_URL = "/cms";

// Testimonials API endpoints
const TESTIMONIALS_ENDPOINT = `${CMS_BASE_URL}/testimonials/`;
const PUBLIC_TESTIMONIALS_ENDPOINT = `${CMS_BASE_URL}/testimonial/`;

export const CommunityService = {
  // Get all testimonials (public endpoint - no auth required)
  getTestimonials: async (): Promise<TestimonialType[]> => {
    const response = await apiClient.get<TestimonialType[]>(
      PUBLIC_TESTIMONIALS_ENDPOINT,
    );
    return response.data;
  },

  // Submit testimonial (public endpoint - no auth required)
  submitTestimonial: async (
    data: Omit<TestimonialType, "id">,
  ): Promise<TestimonialType> => {
    const response = await apiClient.post<TestimonialType>(
      PUBLIC_TESTIMONIALS_ENDPOINT,
      data,
    );
    return response.data;
  },

  // Get all testimonials (admin endpoint - with auth)
  getAllTestimonials: async (): Promise<TestimonialType[]> => {
    const response = await apiClient.get<TestimonialType[]>(
      TESTIMONIALS_ENDPOINT,
    );
    return response.data;
  },

  // Get single testimonial by ID (public endpoint)
  getTestimonialById: async (id: number): Promise<TestimonialType> => {
    const response = await apiClient.get<TestimonialType>(
      `${PUBLIC_TESTIMONIALS_ENDPOINT}${id}/`,
    );
    return response.data;
  },

  // Create testimonial (admin endpoint - with auth)
  createTestimonial: async (
    data: Omit<TestimonialType, "id">,
  ): Promise<TestimonialType> => {
    const response = await apiClient.post<TestimonialType>(
      TESTIMONIALS_ENDPOINT,
      data,
    );
    return response.data;
  },

  // Update testimonial (admin endpoint - with auth)
  updateTestimonial: async (
    id: number,
    data: Partial<TestimonialType>,
  ): Promise<TestimonialType> => {
    const response = await apiClient.patch<TestimonialType>(
      `${TESTIMONIALS_ENDPOINT}${id}/`,
      data,
    );
    return response.data;
  },

  // Delete testimonial (admin endpoint - with auth)
  deleteTestimonial: async (id: number): Promise<void> => {
    await apiClient.delete(`${TESTIMONIALS_ENDPOINT}${id}/`);
  },
};

export default CommunityService;
