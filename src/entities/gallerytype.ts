export interface TranslatableText {
  en: string;
  pa: string;
  da: string;
}

export interface GalleryItem {
  id: string;
  title: TranslatableText;
  description: TranslatableText;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string;
  category: number;
  date: string;
  photographer?: string;
}

export interface GalleryCategory {
  category_id: number;
  name: TranslatableText;
}
