import type { PaginatedResponse } from "../../../../entities/PaginatedResponse";
import type {
  NewsCategory,
  Article,
  Event,
} from "../../../../entities/NewsType";
import apiClient from "../../../../lib/api";

// News Categories API
export const getNewsCategories = async (): Promise<
  PaginatedResponse<NewsCategory>
> => {
  const response = await apiClient.get("/cms/news-categories/");
  return response.data;
};

// Articles API
export const getNewsArticles = async (): Promise<
  PaginatedResponse<Article>
> => {
  const response = await apiClient.get("/cms/articles/");
  return response.data;
};

// Events API
export const getNewsEvents = async (): Promise<PaginatedResponse<Event>> => {
  const response = await apiClient.get("/cms/events/");
  return response.data;
};

// Single Article API
export const getNewsArticleById = async (id: number): Promise<Article> => {
  const response = await apiClient.get(`/cms/articles/${id}/`);
  return response.data;
};

// Single Event API
export const getNewsEventById = async (id: number): Promise<Event> => {
  const response = await apiClient.get(`/cms/events/${id}/`);
  return response.data;
};
