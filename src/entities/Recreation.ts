export interface RecreationCategory {
  id: number;
  name: {
    en: string;
    da: string;
    pa: string;
  };
}

export interface RecreationalActivity {
  id: number;
  title: {
    en: string;
    da: string;
    pa: string;
  };
  description?: {
    en: string;
    da: string;
    pa: string;
  };
  categoryId: number;
  location: string;
  image: string;
  is_active: boolean;
}
