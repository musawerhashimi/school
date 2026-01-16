import type { Book, BookCategory } from "../entities/OnlineLibrary";

// Categories Data
export const bookCategories: BookCategory[] = [
  { id: 1, name: "Science", color: "bg-blue-100 text-blue-700" },
  { id: 2, name: "History", color: "bg-amber-100 text-amber-700" },
  { id: 3, name: "Literature", color: "bg-purple-100 text-purple-700" },
  { id: 4, name: "Technology", color: "bg-green-100 text-green-700" },
  { id: 5, name: "Mathematics", color: "bg-red-100 text-red-700" },
  { id: 6, name: "Philosophy", color: "bg-indigo-100 text-indigo-700" },
];
// Sample Books Data
export const booksData: Book[] = [
  {
    id: "1",
    title: "Advanced Physics for High School",
    author: "Dr. Ahmad Fahim",
    category_id: 1,
    description:
      "Comprehensive physics textbook covering mechanics, thermodynamics, and modern physics for advanced students.",
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    publicationYear: 2023,
    language: "English",
  },
  {
    id: "2",
    title: "World History: A Modern Perspective",
    author: "Sarah Johnson",
    category_id: 2,
    description:
      "Explore the major events and civilizations that shaped our world from ancient times to the present day.",
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
    publicationYear: 2022,
    language: "English",
  },
  {
    id: "3",
    title: "Classic Literature Anthology",
    author: "Various Authors",
    category_id: 3,
    description:
      "A collection of timeless works from the greatest writers in literary history.",
    coverImage:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    publicationYear: 2020,
    language: "English",
  },
  {
    id: "4",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    category_id: 4,
    description:
      "The comprehensive guide to understanding and implementing algorithms in computer science.",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop",
    publicationYear: 2024,
    language: "English",
  },
  {
    id: "5",
    title: "Calculus Made Easy",
    author: "Dr. Michael Chen",
    category_id: 5,
    description:
      "A simplified approach to understanding calculus concepts and applications.",
    coverImage:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=600&fit=crop",
    publicationYear: 2023,
    language: "English",
  },
  {
    id: "6",
    title: "Philosophy: The Basics",
    author: "Dr. Emma Williams",
    category_id: 6,
    description:
      "An introduction to fundamental philosophical questions and the great thinkers who explored them.",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop",
    publicationYear: 2021,
    language: "English",
  },
  {
    id: "7",
    title: "Modern Web Development",
    author: "Jake Morrison",
    category_id: 4,
    description:
      "Learn the latest technologies and best practices for building modern web applications.",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop",
    publicationYear: 2024,
    language: "English",
  },
  {
    id: "8",
    title: "The Physics of Time",
    author: "Dr. Rachel Adams",
    category_id: 1,
    description:
      "Exploring the nature of time through the lens of modern physics and quantum mechanics.",
    coverImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    publicationYear: 2019,
    language: "English",
  },
];
