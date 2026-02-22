import { apiClient } from "../../../../lib/api";
import type {
  GalleryCategory,
  GalleryItem,
} from "../../../../entities/gallerytype";

// Type for wrapped API responses (like DRF paginated responses)
interface PaginatedResponse<T> {
  results: T[];
  count?: number;
  next?: string;
  previous?: string;
}

export class GalleryService {
  /**
   * Get all gallery categories
   */
  static async getCategories(): Promise<GalleryCategory[]> {
    const response = await apiClient.get<
      PaginatedResponse<GalleryCategory> | GalleryCategory[]
    >("/cms/gallery-categories/");
    const data = response.data;
    // Handle both direct array and wrapped response
    if (Array.isArray(data)) {
      return data;
    }
    return data?.results || [];
  }

  /**
   * Get all gallery items
   */
  static async getGalleryItems(): Promise<GalleryItem[]> {
    const response = await apiClient.get<
      PaginatedResponse<GalleryItem> | GalleryItem[]
    >("/cms/gallery-items/");
    const data = response.data;
    // Handle both direct array and wrapped response
    if (Array.isArray(data)) {
      return data;
    }
    return data?.results || [];
  }

  /**
   * Get gallery items by category
   */
  static async getGalleryItemsByCategory(
    categoryId: number,
  ): Promise<GalleryItem[]> {
    const response = await apiClient.get<GalleryItem[]>(
      `/cms/gallery-items/?category=${categoryId}`,
    );
    return response.data;
  }

  /**
   * Get single gallery item by ID
   */
  static async getGalleryItemById(id: number): Promise<GalleryItem> {
    const response = await apiClient.get<GalleryItem>(
      `/cms/gallery-items/${id}/`,
    );
    return response.data;
  }
}

export default GalleryService;
