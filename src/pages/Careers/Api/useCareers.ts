// ============================================================================
// React Query Hooks for Careers/Internships
// File: src/hooks/useCareers.ts
// ============================================================================

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  fetchInternshipCategories,
  fetchInternships,
  fetchInternshipById,
  fetchInternshipsByCategory,
  type InternshipQueryParams,
  type InternshipCategoryQueryParams,
} from "./CareersServices";

import type {
  Internship,
  InternshipCategory,
} from "../../../entities/intership";
// Careers/Internship Query Keys
const CAREERS_QUERY_KEYS = {
  all: ["careers"] as const,
  categories: (params?: InternshipCategoryQueryParams) =>
    [...CAREERS_QUERY_KEYS.all, "categories", params] as const,
  category: (id: number) =>
    [...CAREERS_QUERY_KEYS.all, "category", id] as const,
  internships: (params?: InternshipQueryParams) =>
    [...CAREERS_QUERY_KEYS.all, "internships", params] as const,
  internship: (id: number) =>
    [...CAREERS_QUERY_KEYS.all, "internship", id] as const,
  internshipsByCategory: (categoryId: number, params?: InternshipQueryParams) =>
    [
      ...CAREERS_QUERY_KEYS.all,
      "internships",
      "category",
      categoryId,
      params,
    ] as const,
};

/**
 * Hook to fetch paginated internship categories
 */
export const useInternshipCategories = (
  params: InternshipCategoryQueryParams = {},
) => {
  return useQuery({
    queryKey: CAREERS_QUERY_KEYS.categories(params),
    queryFn: () => fetchInternshipCategories(params),
  });
};

/**
 * Hook to fetch paginated internships with infinite scroll support
 */
export const useInternships = (params: InternshipQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: CAREERS_QUERY_KEYS.internships(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchInternships({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      // If there's a next page, return the next page number
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get("page");
        return page ? parseInt(page, 10) : undefined;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

/**
 * Hook to fetch a single internship by ID
 */
export const useInternship = (id: number) => {
  return useQuery({
    queryKey: CAREERS_QUERY_KEYS.internship(id),
    queryFn: () => fetchInternshipById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch internships by category with infinite scroll support
 */
export const useInternshipsByCategory = (
  categoryId: number,
  params: Omit<InternshipQueryParams, "categoryId"> = {},
) => {
  return useInfiniteQuery({
    queryKey: CAREERS_QUERY_KEYS.internshipsByCategory(categoryId, params),
    queryFn: ({ pageParam = 1 }) =>
      fetchInternshipsByCategory(categoryId, {
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const page = url.searchParams.get("page");
        return page ? parseInt(page, 10) : undefined;
      }
      return undefined;
    },
    enabled: !!categoryId,
    initialPageParam: 1,
  });
};

/**
 * Helper function to get all internships from infinite query pages
 */
export const getAllInternships = (
  data: ReturnType<typeof useInternships>["data"],
): Internship[] => {
  if (!data) return [];
  return data.pages.flatMap((page) => page.results);
};

/**
 * Helper function to check if there are more pages to load
 */
export const hasMorePages = (
  data: ReturnType<typeof useInternships>["data"],
): boolean => {
  if (!data) return false;
  const lastPage = data.pages[data.pages.length - 1];
  return lastPage?.next !== null;
};

/**
 * Helper to get total count of internships
 */
export const getTotalInternshipCount = (
  data: ReturnType<typeof useInternships>["data"],
): number => {
  if (!data || data.pages.length === 0) return 0;
  return data.pages[0].count;
};
