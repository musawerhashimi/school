export interface NewsCategory {
  id: number;
  name: { en: string; da: string; pa: string };
}

export interface Article {
  id: number;
  title: { en: string; da: string; pa: string };
  excerpt: { en: string; da: string; pa: string };
  content: { en: string; da: string; pa: string };
  category_id: number;
  author: string;
  date: string;
  image: string;
  featured: boolean;
}

export interface Event {
  id: number;
  title: { en: string; da: string; pa: string };
  image: string;
  date: string;
  start_time: string;
  end_time: string;
  category_id: number;
  rsvpRequired: boolean;
  location: string;
  organizer: string;
  featured: boolean;
  description: { en: string; da: string; pa: string };
}

export type EventStatus = "upcoming" | "ongoing" | "past";
