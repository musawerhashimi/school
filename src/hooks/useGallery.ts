// ============================================================================
// React Query Hooks (for use with @tanstack/react-query)
// File: src/hooks/useGallery.ts
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type GalleryQueryParams,
  fetchGalleryItems,
  fetchGalleryItemById,
  fetchGalleryStats,
  uploadGalleryItem,
  type UploadGalleryItemData,
  updateGalleryItem,
  deleteGalleryItem,
} from "../services/galleryService";
import { GALLERY_QUERY_KEYS } from "../queries/keys";


/**
 * Hook to fetch gallery items with caching and automatic refetching
 */
export const useGalleryItems = (params: GalleryQueryParams = {}) => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.items(params),
    queryFn: () => fetchGalleryItems(params),
  });
};

/**
 * Hook to fetch a single gallery item
 */
export const useGalleryItem = (id: string) => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.item(id),
    queryFn: () => fetchGalleryItemById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch gallery statistics
 */
export const useGalleryStats = () => {
  return useQuery({
    queryKey: GALLERY_QUERY_KEYS.stats(),
    queryFn: fetchGalleryStats,
  });
};

/**
 * Hook to upload a new gallery item
 */
export const useUploadGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadGalleryItem,
    onSuccess: () => {
      // Invalidate and refetch gallery items
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to update a gallery item
 */
export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UploadGalleryItemData>;
    }) => updateGalleryItem(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific item and all items list
      queryClient.invalidateQueries({
        queryKey: GALLERY_QUERY_KEYS.item(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
    },
  });
};

/**
 * Hook to delete a gallery item
 */
export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GALLERY_QUERY_KEYS.all });
    },
  });
};
