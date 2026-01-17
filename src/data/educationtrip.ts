import type { Trip, TripCategory } from "../entities/EducationalTrips";
import type {} from "../pages/Academic/EducatinalTrip/EducationalTrip";

export const TRIP_CATEGORIES: TripCategory[] = [
  { id: 1, name: "cultural" },
  { id: 2, name: "scientific" },
  { id: 3, name: "historical" },
  { id: 4, name: "environmental" },
];

export const trips: Trip[] = [
  {
    id: "trip-1",
    title: {
      en: "National Museum of Afghanistan Visit",
      da: "بازدید از موزیم ملی افغانستان",
      pa: "د افغانستان ملي موزیم لیدنه",
    },
    description: {
      en: "Students will explore Afghanistan's rich cultural heritage through ancient artifacts and historical exhibits spanning thousands of years.",
      da: "شاگردان میراث فرهنگی غنی افغانستان را از طریق آثار باستانی و نمایشگاه‌های تاریخی که هزاران سال را در بر می‌گیرد، کشف خواهند کرد.",
      pa: "زده کوونکي به د افغانستان بډایه کلتوري میراث د لرغونو آثارو او تاریخي نندارتونونو له لارې وڅیړي چې زرګونه کاله پوري رسیږي.",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    date: "2026-03-15",
    duration: 15,
    gradeLevels: "9",
    category_id: 1,

    images:
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop",

    status: "upcoming",
    participants: 45,
  },
  {
    id: "trip-2",
    title: {
      en: "Paghman Botanical Gardens Expedition",
      da: "سفر به باغ‌های گیاه‌شناسی پغمان",
      pa: "د پغمان بوټ پیژندنې باغونو سفر",
    },
    description: {
      en: "An immersive environmental field trip where students will study local plant species, ecosystems, and environmental conservation practices.",
      da: "یک سفر میدانی محیطی فراگیر که در آن شاگردان گونه‌های گیاهی محلی، اکوسیستم‌ها و شیوه‌های حفاظت محیط زیست را مطالعه خواهند کرد.",
      pa: "یو ډوب شوی چاپیریالي ساحوي سفر چیرې چې زده کوونکي به د سیمه ایزو بوټو ډولونه، ایکو سیسټمونه او د چاپیریال ساتنې طریقې مطالعه کړي.",
    },
    location: {
      en: "Paghman, Kabul Province",
      da: "پغمان، ولایت کابل",
      pa: "پغمان، د کابل ولایت",
    },
    date: "2026-04-20",
    duration: 23,
    gradeLevels: "9",
    category_id: 4,

    images:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",

    status: "upcoming",
    participants: 38,
  },
  {
    id: "trip-3",
    title: {
      en: "Babur Gardens Historical Tour",
      da: "تور تاریخی باغ‌های بابر",
      pa: "د بابر باغونو تاریخي سفر",
    },
    description: {
      en: "Explore the magnificent Mughal-era gardens and learn about Babur's legacy, architectural achievements, and historical significance to Afghanistan.",
      da: "کشف باغ‌های باشکوه دوران مغولی و آشنایی با میراث بابر، دستاوردهای معماری و اهمیت تاریخی برای افغانستان.",
      pa: "د مغولو دورې په زړه پورې باغونه وګورئ او د بابر میراث، معمارۍ لاسته راوړنو او افغانستان ته تاریخي اهمیت په اړه زده کړه وکړئ.",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    date: "2025-11-10",
    duration: 12,
    gradeLevels: "7",
    category_id: 3,

    images:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop",

    status: "completed",
    participants: 52,
  },
  {
    id: "trip-4",
    title: {
      en: "Kabul University Science Laboratory Visit",
      da: "بازدید از آزمایشگاه علوم دانشگاه کابل",
      pa: "د کابل پوهنتون ساینس لابراتوار لیدنه",
    },
    description: {
      en: "Advanced science students will get hands-on experience with university-level laboratory equipment and participate in interactive experiments.",
      da: "شاگردان علوم پیشرفته تجربه عملی با تجهیزات آزمایشگاهی سطح دانشگاه خواهند داشت و در آزمایش‌های تعاملی شرکت خواهند کرد.",
      pa: "د پرمختللي علومو زده کوونکي به د پوهنتون کچې لابراتوار تجهیزاتو سره عملي تجربه ترلاسه کړي او په متقابل تجربو کې برخه واخلي.",
    },
    location: {
      en: "Kabul University, Kabul",
      da: "دانشگاه کابل، کابل",
      pa: "د کابل پوهنتون، کابل",
    },
    date: "2025-10-05",
    duration: 18,
    gradeLevels: "10",
    category_id: 2,

    images:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=600&fit=crop",

    status: "completed",
    participants: 28,
  },
  {
    id: "trip-5",
    title: {
      en: "Band-e-Amir National Park Expedition",
      da: "سفر به پارک ملی بند امیر",
      pa: "د بند امیر ملي پارک سفر",
    },
    description: {
      en: "A three-day camping and research expedition to Afghanistan's first national park, studying geological formations and aquatic ecosystems.",
      da: "یک سفر سه روزه کمپینگ و تحقیقاتی به اولین پارک ملی افغانستان، مطالعه شکل‌گیری‌های زمین‌شناسی و اکوسیستم‌های آبی.",
      pa: "د افغانستان لومړي ملي پارک ته درې ورځنی کمپینګ او څیړنیز سفر، د ځمکپوهنې جوړښتونو او اوبو ایکوسیستمونو مطالعه.",
    },
    location: {
      en: "Band-e-Amir, Bamyan Province",
      da: "بند امیر، ولایت بامیان",
      pa: "بند امیر، د بامیانو ولایت",
    },
    date: "2026-05-15",
    duration: 4,
    gradeLevels: "8",
    category_id: 4,

    images:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",

    status: "upcoming",
    participants: 35,
  },
  {
    id: "trip-6",
    title: {
      en: "Herat Citadel Cultural Heritage Tour",
      da: "تور میراث فرهنگی ارگ هرات",
      pa: "د هرات کلا کلتوري میراث سفر",
    },
    description: {
      en: "Explore the ancient Herat Citadel, learning about Timurid architecture, Islamic art, and the Silk Road's historical importance.",
      da: "کشف ارگ باستانی هرات، آشنایی با معماری تیموری، هنر اسلامی و اهمیت تاریخی جاده ابریشم.",
      pa: "د هرات لرغونې کلا وګورئ، د تیموري معمارۍ، اسلامي هنر او د ورېښمو لارې تاریخي اهمیت په اړه زده کړه.",
    },
    location: {
      en: "Herat, Afghanistan",
      da: "هرات، افغانستان",
      pa: "هرات، افغانستان",
    },
    date: "2025-09-22",
    duration: 2,
    gradeLevels: "12",
    category_id: 1,

    images:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop",

    status: "completed",
    participants: 42,
  },
];
