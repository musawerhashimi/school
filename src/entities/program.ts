import type { JSX } from "react";

export interface Program {
  id: number;
  title: string;
  image: string;
  description: string;
  subjects: string[];
  grades: string;
  duration: string;
  students: number;
  teachers: number;
  highlights: string[];
}

export interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
}
