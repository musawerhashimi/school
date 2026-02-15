import { useQuery } from "@tanstack/react-query";
import { HomeService } from "./HomeService";

export const useHome = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home"],
    queryFn: HomeService.getHomeData,
  });

  const {
    data: testimonials,
    isLoading: isTestimonialsLoading,
    error: testimonialsError,
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: HomeService.getTestimonials,
  });

  return {
    homeData: data,
    testimonials,
    isLoading: isLoading || isTestimonialsLoading,
    error: error || testimonialsError,
  };
};
