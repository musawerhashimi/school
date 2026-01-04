// ============================================================================
// API Service for Gallery
// File: src/services/galleryService.ts
// ============================================================================

import { z } from 'zod';
import apiClient from '../lib/api';

// Zod Schemas for validation
export const GalleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  category: z.enum([
    'all',
    'academic',
    'sports',
    'cultural',
    'projects',
    'ceremonies',
    'trips',
    'achievements'
  ]),
  date: z.string(),
  photographer: z.string().optional(),
  tags: z.array(z.string()),
  featured: z.boolean().optional()
});

export const GalleryApiResponseSchema = z.object({
  items: z.array(GalleryItemSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number()
});

export type GalleryItem = z.infer<typeof GalleryItemSchema>;
export type GalleryCategory = GalleryItem['category'];
export type GalleryApiResponse = z.infer<typeof GalleryApiResponseSchema>;


// ============================================================================
// API Functions
// ============================================================================

export interface GalleryQueryParams {
  page?: number;
  pageSize?: number;
  category?: GalleryCategory;
  search?: string;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
  sortBy?: 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Fetch gallery items with filtering and pagination
 */
export const fetchGalleryItems = async (
  params: GalleryQueryParams = {}
): Promise<GalleryApiResponse> => {
  const response = await apiClient.get('/items', { params });
  return GalleryApiResponseSchema.parse(response.data);
};

/**
 * Fetch a single gallery item by ID
 */
export const fetchGalleryItemById = async (id: string): Promise<GalleryItem> => {
  const response = await apiClient.get(`/items/${id}`);
  return GalleryItemSchema.parse(response.data);
};

/**
 * Upload a new gallery item (admin only)
 */
export interface UploadGalleryItemData {
  title: string;
  description: string;
  type: 'image' | 'video';
  category: GalleryCategory;
  file?: File;
  videoUrl?: string;
  photographer?: string;
  tags: string[];
  featured?: boolean;
}

export const uploadGalleryItem = async (
  data: UploadGalleryItemData
): Promise<GalleryItem> => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('category', data.category);
  formData.append('tags', JSON.stringify(data.tags));
  
  if (data.file) {
    formData.append('file', data.file);
  }
  
  if (data.videoUrl) {
    formData.append('videoUrl', data.videoUrl);
  }
  
  if (data.photographer) {
    formData.append('photographer', data.photographer);
  }
  
  if (data.featured !== undefined) {
    formData.append('featured', String(data.featured));
  }

  const response = await apiClient.post('/items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return GalleryItemSchema.parse(response.data);
};

/**
 * Update an existing gallery item (admin only)
 */
export const updateGalleryItem = async (
  id: string,
  data: Partial<UploadGalleryItemData>
): Promise<GalleryItem> => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'file' && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await apiClient.patch(`/items/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return GalleryItemSchema.parse(response.data);
};

/**
 * Delete a gallery item (admin only)
 */
export const deleteGalleryItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/items/${id}`);
};

/**
 * Get gallery statistics
 */
export interface GalleryStats {
  totalItems: number;
  totalImages: number;
  totalVideos: number;
  categoryCounts: Record<GalleryCategory, number>;
  recentUploads: number;
}

export const fetchGalleryStats = async (): Promise<GalleryStats> => {
  const response = await apiClient.get('/stats');
  return response.data;
};

// ============================================================================
// Example Usage in Component
// ============================================================================

/*
import { useGalleryItems, useUploadGalleryItem } from '@/hooks/useGallery';
import { useGalleryStore } from '@/stores/galleryStore';

function GalleryPage() {
  const { filters, setCategory, setSearchQuery } = useGalleryStore();
  
  const { data, isLoading, error } = useGalleryItems({
    category: filters.category !== 'all' ? filters.category : undefined,
    search: filters.searchQuery,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  });

  const uploadMutation = useUploadGalleryItem();

  const handleUpload = async (file: File) => {
    try {
      await uploadMutation.mutateAsync({
        title: 'New Image',
        description: 'Description',
        type: 'image',
        category: 'academic',
        file,
        tags: ['example'],
      });
      alert('Upload successful!');
    } catch (error) {
      alert('Upload failed!');
    }
  };

  // Component JSX...
}
*/