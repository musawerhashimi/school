import type { GalleryCategory, GalleryItem } from "../entities/gallerytype";

export const categoryData: GalleryCategory[] = [
  {
    category_id: 1,
    name: {
      en: "Academic",
      pa: "علمي",
      da: "علمی",
    },
  },
  {
    category_id: 2,
    name: {
      en: "Sports",
      pa: "سپورت",
      da: "ورزشی",
    },
  },
  {
    category_id: 3,
    name: {
      en: "Cultural",
      pa: "کلتوري",
      da: "فرهنگی",
    },
  },
  {
    category_id: 4,
    name: {
      en: "Projects",
      pa: "پروژې",
      da: "پروژه‌ها",
    },
  },
  {
    category_id: 5,
    name: {
      en: "Ceremonies",
      pa: "مراسم",
      da: "مراسم",
    },
  },
  {
    category_id: 6,
    name: {
      en: "Trips",
      pa: "سفرونه",
      da: "سفرها",
    },
  },
  {
    category_id: 7,
    name: {
      en: "Achievements",
      pa: "لاسته راوړنې",
      da: "دستاوردها",
    },
  },
];

export const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: {
      en: "Science Fair 2024",
      pa: "د ساینس نندارتون ۲۰۲۴",
      da: "نمایشگاه علوم ۲۰۲۴",
    },
    description: {
      en: "Students presenting innovative science projects",
      pa: "زده کوونکي نوي ساینسي پروژې وړاندې کوي",
      da: "دانش‌آموزان پروژه‌های علمی نوآورانه ارائه می‌دهند",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    category: 1,
    date: "2024-11-15",
    photographer: "John Doe",
    featured: true,
  },
  {
    id: "2",
    title: {
      en: "Annual Sports Day",
      pa: "کلنۍ سپورت ورځ",
      da: "روز ورزشی سالانه",
    },
    description: {
      en: "Students competing in track and field events",
      pa: "زده کوونکي په ډګر او ټریک سیالیو کې برخه اخلي",
      da: "دانش‌آموزان در رویدادهای دو و میدانی رقابت می‌کنند",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    category: 2,
    date: "2024-10-20",
    featured: true,
  },
  {
    id: "3",
    title: {
      en: "Cultural Performance",
      pa: "کلتوري نندارتون",
      da: "اجرای فرهنگی",
    },
    description: {
      en: "Traditional dance performance by students",
      pa: "د زده کوونکو لخوا دودیز نڅا",
      da: "اجرای رقص سنتی توسط دانش‌آموزان",
    },
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    category: 3,
    date: "2024-09-10",
  },
  {
    id: "4",
    title: {
      en: "Robotics Workshop",
      pa: "د روبوټیک ورکشاپ",
      da: "کارگاه رباتیک",
    },
    description: {
      en: "Students learning robotics and programming",
      pa: "زده کوونکي روبوټیک او پروګرامینګ زده کوي",
      da: "دانش‌آموزان رباتیک و برنامه‌نویسی یاد می‌گیرند",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    category: 4,
    date: "2024-11-01",
  },
  {
    id: "5",
    title: {
      en: "Graduation Ceremony 2024",
      pa: "د فراغت مراسم ۲۰۲۴",
      da: "مراسم فارغ‌التحصیلی ۲۰۲۴",
    },
    description: {
      en: "Celebrating our graduating class",
      pa: "زموږ د فراغت ټولګي لمانځنه",
      da: "جشن گرفتن کلاس فارغ‌التحصیلی ما",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    category: 5,
    date: "2024-06-15",
    featured: true,
  },
  {
    id: "6",
    title: {
      en: "Art Exhibition",
      pa: "د هنر نندارتون",
      da: "نمایشگاه هنری",
    },
    description: {
      en: "Student artwork on display",
      pa: "د زده کوونکو هنري کارونه په نندارتون کې",
      da: "نمایش آثار هنری دانش‌آموزان",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
    category: 6,
    date: "2024-08-22",
  },
  {
    id: "7",
    title: {
      en: "Basketball Championship",
      pa: "د باسکټبال اتلولي",
      da: "قهرمانی بسکتبال",
    },
    description: {
      en: "Our team winning the regional championship",
      pa: "زموږ ټیم سیمه ییز اتلولي وګټله",
      da: "تیم ما برنده قهرمانی منطقه‌ای شد",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    category: 7,
    date: "2024-11-28",
  },
  {
    id: "8",
    title: {
      en: "Field Trip to Museum",
      pa: "میوزیم ته ساحوي سفر",
      da: "سفر میدانی به موزه",
    },
    description: {
      en: "Students exploring historical artifacts",
      pa: "زده کوونکي تاریخي آثار ګوري",
      da: "دانش‌آموزان آثار تاریخی را بررسی می‌کنند",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1565301660306-29e08751cc53?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1565301660306-29e08751cc53?w=400",
    category: 5,
    date: "2024-10-05",
  },
  {
    id: "9",
    title: {
      en: "Math Olympiad Winners",
      pa: "د ریاضي المپیاډ ګټونکي",
      da: "برندگان المپیاد ریاضی",
    },
    description: {
      en: "Students receiving awards for excellence in mathematics",
      pa: "زده کوونکي په ریاضي کې د غوره والي لپاره جایزې اخلي",
      da: "دانش‌آموزان جوایز برتری در ریاضیات دریافت می‌کنند",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    category: 4,
    date: "2024-11-10",
  },
  {
    id: "10",
    title: {
      en: "Chemistry Lab Session",
      pa: "د کیمیا لابراتوار ناسته",
      da: "جلسه آزمایشگاه شیمی",
    },
    description: {
      en: "Hands-on chemistry experiments",
      pa: "د کیمیا عملي تجربې",
      da: "آزمایش‌های عملی شیمی",
    },
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400",
    category: 3,
    date: "2024-09-20",
  },
  {
    id: "11",
    title: {
      en: "Music Concert",
      pa: "د موسیقۍ کنسرټ",
      da: "کنسرت موسیقی",
    },
    description: {
      en: "School orchestra performing classical pieces",
      pa: "د ښوونځي ارکسټرا کلاسیک موسیقي وړاندې کوي",
      da: "ارکستر مدرسه قطعات کلاسیک اجرا می‌کند",
    },
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400",
    category: 2,
    date: "2024-07-18",
  },
  {
    id: "12",
    title: {
      en: "Environmental Project",
      pa: "د چاپیریال پروژه",
      da: "پروژه محیط زیست",
    },
    description: {
      en: "Students planting trees for sustainability",
      pa: "زده کوونکي د پایښت لپاره ونې کري",
      da: "دانش‌آموزان درخت می‌کارند برای پایداری",
    },
    type: "image",
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
    category: 2,
    date: "2024-10-12",
  },
];
