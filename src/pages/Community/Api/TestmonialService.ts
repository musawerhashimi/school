import type { TestimonialType } from "@/entities/Testimonial";
import apiClient from "@/lib/api";

const CMS_BASE_URL = "/cms";

// ✅ Both point to /cms/testimonials/ (plural — matches backend)
const TESTIMONIALS_ENDPOINT = `${CMS_BASE_URL}/testimonials/`;

export const CommunityService = {
  // Get all testimonials (public endpoint)
  getTestimonials: async (): Promise<TestimonialType[]> => {
    const response = await apiClient.get<TestimonialType[]>(
      TESTIMONIALS_ENDPOINT,
    );
    return response.data;
  },

  // ✅ Submit testimonial via FormData (supports image file upload)
  submitTestimonial: async (
    data: FormData | Omit<TestimonialType, "id">,
  ): Promise<TestimonialType> => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post<TestimonialType>(
      TESTIMONIALS_ENDPOINT,
      data,
      isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined,
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

  // Get single testimonial by ID
  getTestimonialById: async (id: number): Promise<TestimonialType> => {
    const response = await apiClient.get<TestimonialType>(
      `${TESTIMONIALS_ENDPOINT}${id}/`,
    );
    return response.data;
  },

  // Create testimonial (admin - with auth)
  createTestimonial: async (
    data: Omit<TestimonialType, "id">,
  ): Promise<TestimonialType> => {
    const response = await apiClient.post<TestimonialType>(
      TESTIMONIALS_ENDPOINT,
      data,
    );
    return response.data;
  },

  // Update testimonial (admin - with auth)
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

  // Delete testimonial (admin - with auth)
  deleteTestimonial: async (id: number): Promise<void> => {
    await apiClient.delete(`${TESTIMONIALS_ENDPOINT}${id}/`);
  },
};

export default CommunityService;
