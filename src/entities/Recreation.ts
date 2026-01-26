export interface RecreationCategory {
  id: string;
  name: {
    en: string;
    da: string;
    pa: string;
  };
}

export interface RecreationalActivity {
  id: string;
  title: {
    en: string;
    da: string;
    pa: string;
  };
  description: {
    en: string;
    da: string;
    pa: string;
  };
  categoryId: string;
  location: string;
  image: string;
}
