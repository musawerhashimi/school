import type { Book, BookCategory } from "@/entities/OnlineLibrary";
import apiClient from "@/lib/api";

export interface LibraryFilters {
  search?: string;
  category_id?: number;
  year_from?: number;
  year_to?: number;
  language?: string;
}

export class LibraryService {
  /**
   * Get all books from the library with optional filters
   */
  static async getBooks(filters?: LibraryFilters): Promise<Book[]> {
    const response = await apiClient.get<Book[]>("/cms/library/", {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single book by ID
   */
  static async getBookById(id: number): Promise<Book> {
    const response = await apiClient.get<Book>(`/cms/library/${id}/`);
    return response.data;
  }

  /**
   * Get all library categories
   */
  static async getCategories(): Promise<BookCategory[]> {
    const response = await apiClient.get<BookCategory[]>(
      "/cms/library/categories/",
    );
    return response.data;
  }

  /**
   * Get a single category by ID
   */
  static async getCategoryById(id: number): Promise<BookCategory> {
    const response = await apiClient.get<BookCategory>(
      `/cms/library/categories/${id}/`,
    );
    return response.data;
  }
}
