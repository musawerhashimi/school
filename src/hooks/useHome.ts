import { useQuery } from "@tanstack/react-query";
import { HOME_DATA_QUERY_KEY } from "../queries/keys";
import apiClient from "../lib/api";
import type { IconType } from "react-icons";

export interface HomeSliderData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}
export interface HomeStatsData {
  icon: IconType;
  value: string;
  label: string;
}
export interface HomeFeatures {
  icon: IconType;
  title: string;
  description: string;
}

export interface HomeTestemonial {
  name: string;
  role: string;
  image: string;
  text: string;
}

export interface HomeResponseData {
  slides: HomeSliderData[];
  stats: HomeStatsData[];
  features: HomeFeatures[];
  testimonials: HomeTestemonial[];
}

export const useHomeData = () => {
  return useQuery({
    queryKey: HOME_DATA_QUERY_KEY,
    queryFn: () =>
      apiClient.get<HomeResponseData>("/public/home").then((d) => d.data),
  });
};
