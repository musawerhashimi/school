export type TotalAward = {
  International_Awards: number;
  National_Awards: number;
  Total_Awards: number;
  YearsOf_Excellence: number;
};

export interface Leadership {
  name: string;
  role: string;
  image: string;
  bio: string;
}
// Awards and Recognition Data
export interface AwardType {
  title: string;
  image: string;
  year: string;
  description: string;
  category: string;
}
