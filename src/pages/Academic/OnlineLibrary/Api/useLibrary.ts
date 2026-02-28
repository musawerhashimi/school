import { useQuery } from "@tanstack/react-query";
import { LibraryService, type LibraryFilters } from "./LibraryService";
import type { BookCategory } from "@/entities/OnlineLibrary";

// Query keys for library
export const LIBRARY_QUERY_KEYS = {
  books: (filters?: LibraryFilters) => ["library", "books", filters] as const,
  book: (id: number) => ["library", "book", id] as const,
  categories: ["library", "categories"] as const,
  category: (id: number) => ["library", "category", id] as const,
};

/**
 * Hook to get all books with optional filters
 */
export const useBooks = (filters?: LibraryFilters) => {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.books(filters),
    queryFn: () => LibraryService.getBooks(filters),
  });
};

/**
 * Hook to get a single book by ID
 */
export const useBook = (id: number) => {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.book(id),
    queryFn: () => LibraryService.getBookById(id),
    enabled: !!id,
  });
};

/**
 * Hook to get all library categories
 */
export const useCategories = () => {
  return useQuery<BookCategory[]>({
    queryKey: LIBRARY_QUERY_KEYS.categories,
    queryFn: () => LibraryService.getCategories(),
  });
};

/**
 * Hook to get a single category by ID
 */
export const useCategory = (id: number) => {
  return useQuery({
    queryKey: LIBRARY_QUERY_KEYS.category(id),
    queryFn: () => LibraryService.getCategoryById(id),
    enabled: !!id,
  });
};
