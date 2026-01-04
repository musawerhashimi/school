// ============================================================================
// Zustand Store for Gallery State Management (if needed)
// File: src/stores/galleryStore.ts
// ============================================================================

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { GalleryCategory, GalleryItem } from "../services/galleryService";

interface GalleryFilters {
  category: GalleryCategory;
  searchQuery: string;
  dateRange: { start: string | null; end: string | null };
  sortBy: "date" | "title";
  sortOrder: "asc" | "desc";
}

interface GalleryStore {
  filters: GalleryFilters;
  selectedItem: GalleryItem | null;
  viewMode: "grid" | "masonry" | "list";
  itemsPerPage: number;

  // Actions
  setCategory: (category: GalleryCategory) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  setSortBy: (sortBy: "date" | "title") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSelectedItem: (item: GalleryItem | null) => void;
  setViewMode: (mode: "grid" | "masonry" | "list") => void;
  setItemsPerPage: (count: number) => void;
  resetFilters: () => void;
}

const initialFilters: GalleryFilters = {
  category: "all",
  searchQuery: "",
  dateRange: { start: null, end: null },
  sortBy: "date",
  sortOrder: "desc",
};

export const useGalleryStore = create<GalleryStore>()(
  devtools(
    persist(
      (set) => ({
        filters: initialFilters,
        selectedItem: null,
        viewMode: "masonry",
        itemsPerPage: 12,

        setCategory: (category) =>
          set((state) => ({
            filters: { ...state.filters, category },
          })),

        setSearchQuery: (searchQuery) =>
          set((state) => ({
            filters: { ...state.filters, searchQuery },
          })),

        setDateRange: (start, end) =>
          set((state) => ({
            filters: { ...state.filters, dateRange: { start, end } },
          })),

        setSortBy: (sortBy) =>
          set((state) => ({
            filters: { ...state.filters, sortBy },
          })),

        setSortOrder: (sortOrder) =>
          set((state) => ({
            filters: { ...state.filters, sortOrder },
          })),

        setSelectedItem: (selectedItem) => set({ selectedItem }),

        setViewMode: (viewMode) => set({ viewMode }),

        setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),

        resetFilters: () => set({ filters: initialFilters }),
      }),
      {
        name: "gallery-store",
        partialize: (state) => ({
          viewMode: state.viewMode,
          itemsPerPage: state.itemsPerPage,
        }),
      }
    )
  )
);
