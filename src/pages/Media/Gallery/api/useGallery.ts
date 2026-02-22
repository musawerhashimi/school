import { useQuery } from "@tanstack/react-query";
import { GalleryService } from "./GalleryService";
import type {
  GalleryCategory,
  GalleryItem,
} from "../../../../entities/gallerytype";

// Query keys
const GALLERY_CATEGORIES_KEY = ["gallery-categories"];
const GALLERY_ITEMS_KEY = ["gallery-items"];
const GALLERY_ITEM_BY_ID_KEY = (id: number) => ["gallery-item", id];
const GALLERY_ITEMS_BY_CATEGORY_KEY = (categoryId: number) => [
  "gallery-items",
  categoryId,
];

/**
 * Hook to get all gallery categories
 */
export const useGalleryCategories = () => {
  return useQuery<GalleryCategory[]>({
    queryKey: GALLERY_CATEGORIES_KEY,
    queryFn: async () => {
      const data = await GalleryService.getCategories();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get all gallery items
 */
export const useGalleryItems = () => {
  return useQuery<GalleryItem[]>({
    queryKey: GALLERY_ITEMS_KEY,
    queryFn: async () => {
      const data = await GalleryService.getGalleryItems();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get gallery items filtered by category
 */
export const useGalleryItemsByCategory = (categoryId: number) => {
  return useQuery<GalleryItem[]>({
    queryKey: GALLERY_ITEMS_BY_CATEGORY_KEY(categoryId),
    queryFn: () => GalleryService.getGalleryItemsByCategory(categoryId),
  });
};

/**
 * Hook to get a single gallery item by ID
 */
export const useGalleryItemById = (id: number) => {
  return useQuery<GalleryItem>({
    queryKey: GALLERY_ITEM_BY_ID_KEY(id),
    queryFn: () => GalleryService.getGalleryItemById(id),
    enabled: !!id,
  });
};

export default useGalleryCategories;
