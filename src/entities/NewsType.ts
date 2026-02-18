export interface NewsCategory {
  id: number;
  name: { en: string; da: string; pa: string };
  created_at?: string;
  updated_at?: string;
}

export interface Article {
  id: number;
  title: { en: string; da: string; pa: string };
  excerpt: { en: string; da: string; pa: string };
  content?: { en: string; da: string; pa: string };
  category_id: number;
  author: string;
  date: string;
  image: string;
  featured: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: number;
  title: { en: string; da: string; pa: string };
  image: string;
  date: string;
  start_time: string;
  end_time: string;
  category_id: number;
  rsvp_required: boolean;
  location: string;
  organizer: string;
  featured: boolean;
  description?: { en: string; da: string; pa: string };
  status: "upcoming" | "ongoing" | "past";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EventStatus = "upcoming" | "ongoing" | "past";

// Paginated response types for API endpoints
export type PaginatedNewsCategoriesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NewsCategory[];
};

export type PaginatedArticlesResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Article[];
};

export type PaginatedEventsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
};
