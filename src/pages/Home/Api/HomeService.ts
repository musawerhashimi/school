import { apiClient } from "../../../lib/api";
import type { HomeSlider, StatsSection } from "../../../entities/Home";
import type { TestimonialType } from "../../../entities/Testimonial";

export interface HomeResponse {
  sliders: HomeSlider[];
  stats: StatsSection;
  testimonials: TestimonialType[];
}

export class HomeService {
  static async getHomeData(): Promise<HomeResponse> {
    const response = await apiClient.get<HomeResponse>("/cms/home/");
    return response.data;
  }

  static async getTestimonials(): Promise<TestimonialType[]> {
    const response =
      await apiClient.get<TestimonialType[]>("/cms/testimonial/");
    return response.data;
  }
}
