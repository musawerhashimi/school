export interface TripCategory {
  id: number;
  name: string;
}

export interface Trip {
  id: string;
  title: { en: string; da: string; pa: string };
  description: { en: string; da: string; pa: string };
  location: { en: string; da: string; pa: string };
  date: string;
  duration: number;
  gradeLevels: string;
  category_id: number;
  images: string;
  status: "upcoming" | "completed" | "ongoing";
  participants?: number;
}
