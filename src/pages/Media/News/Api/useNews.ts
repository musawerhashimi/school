import { useQuery } from "@tanstack/react-query";
import {
  getNewsCategories,
  getNewsArticles,
  getNewsEvents,
  getNewsArticleById,
  getNewsEventById,
} from "./NewsService";
import type {
  NewsCategory,
  Article,
  Event,
} from "../../../../entities/NewsType";
import type { PaginatedResponse } from "../../../../entities/PaginatedResponse";

// Query keys
const NEWS_CATEGORIES_QUERY_KEY = ["news-categories"];
const NEWS_ARTICLES_QUERY_KEY = ["news-articles"];
const NEWS_EVENTS_QUERY_KEY = ["news-events"];
const NEWS_ARTICLE_QUERY_KEY = (id: number) => ["news-article", id];
const NEWS_EVENT_QUERY_KEY = (id: number) => ["news-event", id];

// Hooks
export const useNewsCategories = () => {
  return useQuery<PaginatedResponse<NewsCategory>>({
    queryKey: NEWS_CATEGORIES_QUERY_KEY,
    queryFn: getNewsCategories,
  });
};

export const useNewsArticles = () => {
  return useQuery<PaginatedResponse<Article>>({
    queryKey: NEWS_ARTICLES_QUERY_KEY,
    queryFn: getNewsArticles,
  });
};

export const useNewsEvents = () => {
  return useQuery<PaginatedResponse<Event>>({
    queryKey: NEWS_EVENTS_QUERY_KEY,
    queryFn: getNewsEvents,
  });
};

export const useNewsArticleById = (id: number) => {
  return useQuery<Article>({
    queryKey: NEWS_ARTICLE_QUERY_KEY(id),
    queryFn: () => getNewsArticleById(id),
  });
};

export const useNewsEventById = (id: number) => {
  return useQuery<Event>({
    queryKey: NEWS_EVENT_QUERY_KEY(id),
    queryFn: () => getNewsEventById(id),
  });
};
