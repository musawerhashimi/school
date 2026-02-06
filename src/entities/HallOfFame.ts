export interface HallOfFameHonoree {
  id: string;
  name: string;
  type: "student" | "teacher";
  achievement: {
    en: string;
    da: string;
    pa: string;
  };
  year: number;
  description: {
    en: string;
    da: string;
    pa: string;
  };
  image: string;
}
