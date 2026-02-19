import type { Book, BookCategory } from "../entities/OnlineLibrary";

// =============================
// Categories Data
// =============================
export const bookCategories: BookCategory[] = [
  {
    id: 1,
    name: {
      en: "Science",
      da: "ساینس",
      pa: "ساینس",
    },
  },
  {
    id: 2,
    name: {
      en: "History",
      da: "تاریخ",
      pa: "تاریخ",
    },
  },
  {
    id: 3,
    name: {
      en: "Literature",
      da: "ادبیات",
      pa: "ادبیات",
    },
  },
  {
    id: 4,
    name: {
      en: "Technology",
      da: "تکنالوژی",
      pa: "ټکنالوژي",
    },
  },
  {
    id: 5,
    name: {
      en: "Mathematics",
      da: "ریاضیات",
      pa: "ریاضي",
    },
  },
  {
    id: 6,
    name: {
      en: "Philosophy",
      da: "فلسفه",
      pa: "فلسفه",
    },
  },
];

// =============================
// Books Data
// =============================
export const booksData: Book[] = [
  {
    id: "1",
    title: {
      en: "Advanced Physics for High School",
      da: "فزیک پیشرفته برای لیسه",
      pa: "د لیسې لپاره پرمختللی فزیک",
    },
    author: "Dr. Ahmad Fahim",
    category_id: 1,
    description: {
      en: "A comprehensive guide covering mechanics, electricity, and modern physics concepts.",
      da: "راهنمای جامع شامل میخانیک، برق و مفاهیم فزیک مدرن.",
      pa: "یو بشپړ لارښود چې میخانیک، برېښنا او عصري فزیک پکې شامل دي.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    publicationYear: 2023,
    language: "English",
  },
  {
    id: "2",
    title: {
      en: "World History Simplified",
      da: "تاریخ جهان به زبان ساده",
      pa: "نړیوال تاریخ په ساده ژبه",
    },
    author: "Prof. Laila Rahimi",
    category_id: 2,
    description: {
      en: "An easy-to-understand overview of major world civilizations and events.",
      da: "مروری ساده بر تمدن‌ها و رویدادهای مهم جهان.",
      pa: "د نړۍ د مهمو تمدنونو او پېښو ساده تشریح.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=600&fit=crop",
    publicationYear: 2021,
    language: "English",
  },
  {
    id: "3",
    title: {
      en: "Introduction to Modern Poetry",
      da: "مقدمه‌ای بر شعر مدرن",
      pa: "د معاصر شعر پېژندنه",
    },
    author: "Sara Hamidi",
    category_id: 3,
    description: {
      en: "Explore modern literary movements and poetic techniques.",
      da: "بررسی جنبش‌های ادبی مدرن و تکنیک‌های شعری.",
      pa: "د معاصر ادبي خوځښتونو او شعري تخنیکونو څېړنه.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    publicationYear: 2020,
    language: "English",
  },
  {
    id: "4",
    title: {
      en: "Web Development with JavaScript",
      da: "توسعه ویب با جاوااسکریپت",
      pa: "د جاواسکرېپټ سره ویب پراختیا",
    },
    author: "Eng. Farid Azizi",
    category_id: 4,
    description: {
      en: "Learn frontend and backend web development using modern JavaScript.",
      da: "یادگیری توسعه فرانت‌اند و بک‌اند با جاوااسکریپت مدرن.",
      pa: "د عصري جاواسکرېپټ په وسیله فرنټ اینډ او بیک اینډ پراختیا زده کړئ.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=600&fit=crop",
    publicationYear: 2024,
    language: "English",
  },
  {
    id: "5",
    title: {
      en: "Mastering Algebra and Calculus",
      da: "تسلط بر جبر و حسابان",
      pa: "په الجبرا او کلکولس کې مهارت",
    },
    author: "Dr. Zahir Noori",
    category_id: 5,
    description: {
      en: "Step-by-step lessons covering algebra, functions, and calculus fundamentals.",
      da: "درس‌های گام‌به‌گام در جبر، توابع و مفاهیم اساسی حسابان.",
      pa: "په الجبرا، دندو او کلکولس کې ګام په ګام درسونه.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=600&fit=crop",
    publicationYear: 2022,
    language: "English",
  },
  {
    id: "6",
    title: {
      en: "Foundations of Philosophy",
      da: "مبانی فلسفه",
      pa: "د فلسفې بنسټونه",
    },
    author: "Dr. Hamid Qasemi",
    category_id: 6,
    description: {
      en: "An introduction to classical and modern philosophical thought.",
      da: "مقدمه‌ای بر اندیشه‌های فلسفی کلاسیک و مدرن.",
      pa: "د کلاسیک او معاصر فلسفي افکارو پېژندنه.",
    },
    coverImage:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=600&fit=crop",
    publicationYear: 2019,
    language: "English",
  },
];
