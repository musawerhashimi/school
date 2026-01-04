import type { GalleryQueryParams } from "../services/galleryService";

export const GALLERY_QUERY_KEYS = {
  all: ["gallery"] as const,
  items: (params?: GalleryQueryParams) =>
    [...GALLERY_QUERY_KEYS.all, "items", params] as const,
  item: (id: string) => [...GALLERY_QUERY_KEYS.all, "item", id] as const,
  stats: () => [...GALLERY_QUERY_KEYS.all, "stats"] as const,
};

export const HOME_DATA_QUERY_KEY = ["Home"]