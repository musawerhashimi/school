import type { CulturalEvent, PerformanceHighlight } from "../entities/Art";

export const culturalEventsData: CulturalEvent[] = [
  {
    id: "evt-1",
    title: {
      en: "Annual Cultural Festival 2026",
      da: "جشنواره فرهنگی سالانه ۲۰۲۶",
      pa: "کلنی کلتوری جشن ۲۰۲۶",
    },
    description: {
      en: "A vibrant celebration of Afghan culture featuring traditional music, dance, and art exhibitions from our talented students.",
      da: "جشن پر رنگ فرهنگ افغانستان با موسیقی سنتی، رقص و نمایشگاه هنری از دانش‌آموزان با استعداد ما.",
      pa: "د افغان کلتور یو ژوندی جشن چې زموږ با استعداده زده کوونکو لخوا دودیزه موسیقي، نڅا او هنري نندارتونونه وړاندې کوي.",
    },
    date: "2026-03-15",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    location: "School Auditorium",
  },
  {
    id: "evt-2",
    title: {
      en: "Traditional Music Workshop",
      da: "کارگاه موسیقی سنتی",
      pa: "دودیزې موسیقۍ ورکشاپ",
    },
    description: {
      en: "Learn to play traditional Afghan instruments including rubab, tabla, and harmonium from master musicians.",
      da: "یادگیری نواختن سازهای سنتی افغانی از جمله رباب، طبله و هارمونیوم از نوازندگان استاد.",
      pa: "د ماهر موسیقارانو څخه د افغاني دودیزو سازونو لکه رباب، طبله او هارمونیوم غږول زده کړئ.",
    },
    date: "2026-02-20",

    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
    location: "Music Room",
  },
  {
    id: "evt-3",
    title: {
      en: "Student Art Exhibition",
      da: "نمایشگاه هنری دانش‌آموزان",
      pa: "د زده کوونکو هنري نندارتون",
    },
    description: {
      en: "Showcase of paintings, calligraphy, and sculpture created by students throughout the academic year.",
      da: "نمایش نقاشی‌ها، خوشنویسی و مجسمه‌های ساخته شده توسط دانش‌آموزان در طول سال تحصیلی.",
      pa: "د زده کړې کال په جریان کې د زده کوونکو لخوا جوړ شوي نقاشۍ، خطاطي او مجسمې نندارې ته وړاندې کول.",
    },
    date: "2026-04-10",

    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
    location: "Art Gallery",
  },
  {
    id: "evt-4",
    title: {
      en: "Poetry Recitation Competition",
      da: "مسابقه خوانش شعر",
      pa: "د شعر لوستلو سیالي",
    },
    description: {
      en: "Students compete in reciting classical and contemporary Afghan poetry in Dari and Pashto languages.",
      da: "دانش‌آموزان در خواندن شعر کلاسیک و معاصر افغانی به زبان‌های دری و پشتو رقابت می‌کنند.",
      pa: "زده کوونکي په دري او پښتو ژبو کې د افغاني کلاسیک او معاصر شعر په لوستلو کې سیالي کوي.",
    },
    date: "2026-03-05",

    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    location: "لستش غلس",
  },
];

export const performanceHighlightsData: PerformanceHighlight[] = [
  {
    id: "perf-1",
    title: {
      en: "Attan Dance Performance",
      da: "اجرای رقص اتن",
      pa: "د اتڼ نڅا اجرا",
    },
    description: {
      en: "Traditional Afghan Attan dance performed by our students at the Independence Day celebration.",
      da: "رقص سنتی افغانی اتن که توسط دانش‌آموزان ما در جشن روز استقلال اجرا شد.",
      pa: "د افغانستان د خپلواکۍ په ورځ کې زموږ د زده کوونکو لخوا اجرا شوې دودیزه افغانه اتڼ نڅا.",
    },
    videoThumbnail:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    date: "2025-08-19",
  },
  {
    id: "perf-2",
    title: {
      en: "School Orchestra Concert",
      da: "کنسرت ارکستر مکتب",
      pa: "د ښوونځي آرکسټرا کنسرټ",
    },
    description: {
      en: "Our talented orchestra performing a blend of traditional and modern musical pieces.",
      da: "ارکستر با استعداد ما که ترکیبی از قطعات موسیقی سنتی و مدرن را اجرا می‌کند.",
      pa: "زموږ با استعداده آرکسټرا چې د دودیزو او عصري موسیقۍ ټوټو یوه مجموعه وړاندې کوي.",
    },
    videoThumbnail:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    date: "2025-12-20",
  },
  {
    id: "perf-3",
    title: {
      en: "Theater Production: Afghan Legends",
      da: "تولید تئاتر: افسانه‌های افغانی",
      pa: "تیاتر تولید: افغاني افسانې",
    },
    description: {
      en: "Student theater group presenting stories from Afghan folklore and history.",
      da: "گروه تئاتر دانش‌آموزان که داستان‌هایی از فرهنگ عامه و تاریخ افغانستان را ارائه می‌دهند.",
      pa: "د زده کوونکو تیاتر ګروپ چې د افغانستان د فولکلور او تاریخ څخه کیسې وړاندې کوي.",
    },
    videoThumbnail:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    date: "2025-11-15",
  },
];
