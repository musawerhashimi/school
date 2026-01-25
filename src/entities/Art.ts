export interface CulturalEvent {
  id: string;
  title: { en: string; da: string; pa: string };
  description: { en: string; da: string; pa: string };
  date: string;
  image: string;
}

export interface PerformanceHighlight {
  id: string;
  title: { en: string; da: string; pa: string };
  description: { en: string; da: string; pa: string };
  videoThumbnail: string;
  videoUrl: string;
  date: string;
}
