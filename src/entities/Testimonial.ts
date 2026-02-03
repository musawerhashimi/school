export interface TestimonialType {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface FormDataType {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export interface FormErrors {
  name?: string;
  role?: string;
  image?: string;
  content?: string;
  rating?: string;
}
