import type {
  RecreationalActivity,
  RecreationCategory,
} from "../entities/Recreation";

export const recreationCategories: RecreationCategory[] = [
  {
    id: "all",
    name: {
      en: "All Activities",
      da: "همه فعالیت‌ها",
      pa: "ټولې فعالیتونه",
    },
  },
  {
    id: "1",
    name: {
      en: "Sports & Fitness",
      da: "ورزش و تندرستی",
      pa: "سپورت او فټنس",
    },
  },
  {
    id: "2",
    name: {
      en: "Arts & Crafts",
      da: "هنر و صنایع دستی",
      pa: "هنر او لاسي صنایع",
    },
  },
  {
    id: "3",
    name: {
      en: "Music & Dance",
      da: "موسیقی و رقص",
      pa: "موسیقي او نڅا",
    },
  },
  {
    id: "4",
    name: {
      en: "Outdoor Adventures",
      da: "ماجراجویی‌های فضای باز",
      pa: "بهرنۍ سفرونه",
    },
  },
  {
    id: "5",
    name: {
      en: "Science & Technology",
      da: "علم و تکنالوژی",
      pa: "ساینس او ټکنالوژي",
    },
  },
  {
    id: "6",
    name: {
      en: "Cultural Activities",
      da: "فعالیت‌های فرهنگی",
      pa: "کلتوري فعالیتونه",
    },
  },
];

// ============================================
// RECREATIONAL ACTIVITIES DATA
// ============================================

export const recreationalActivities: RecreationalActivity[] = [
  {
    id: "1",
    title: {
      en: "Weekly Football Club",
      da: "باشگاه فوتبال هفتگی",
      pa: "اونیز فوټبال کلب",
    },
    description: {
      en: "Friendly football matches that promote teamwork and physical fitness.",
      da: "مسابقات دوستانه فوتبال برای تقویت همکاری تیمی و سلامت جسمی.",
      pa: "د ټیمي کار او فزیکي روغتیا د پیاوړتیا لپاره دوستانه فوټبال لوبې.",
    },
    categoryId: "1",
    location: "School Playground",
    image:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&h=600&fit=crop",
  },
  {
    id: "2",
    title: {
      en: "Basketball Training",
      da: "آموزش بسکتبال",
      pa: "باسکیټبال روزنه",
    },
    description: {
      en: "Learn basketball fundamentals and compete in friendly tournaments.",
      da: "اصول بسکتبال را یاد بگیرید و در مسابقات دوستانه شرکت کنید.",
      pa: "د باسکیټبال بنسټونه زده کړئ او په دوستانه سیالیو کې برخه واخلئ.",
    },
    categoryId: "1",
    location: "Sports Hall",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
  },
  {
    id: "3",
    title: {
      en: "Painting & Drawing Workshop",
      da: "کارگاه نقاشی و طراحی",
      pa: "د نقاشۍ او انځورګرۍ ورکشاپ",
    },
    description: {
      en: "Express creativity through various painting and drawing techniques.",
      da: "خلاقیت خود را از طریق تکنیک‌های مختلف نقاشی و طراحی بیان کنید.",
      pa: "د مختلفو نقاشۍ او انځورګرۍ تخنیکونو له لارې خپل خلاقیت څرګند کړئ.",
    },
    categoryId: "2",
    location: "Art Studio - Room 305",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
  },
  {
    id: "4",
    title: {
      en: "Pottery & Clay Modeling",
      da: "سفالگری و مدل‌سازی با خاک رس",
      pa: "کلالۍ او د خټو ماډلینګ",
    },
    description: {
      en: "Create beautiful pottery and sculptures using traditional techniques.",
      da: "با استفاده از تکنیک‌های سنتی سفال و مجسمه‌های زیبا بسازید.",
      pa: "د دودیزو تخنیکونو په کارولو سره ښایسته کلال او مجسمې جوړې کړئ.",
    },
    categoryId: "2",
    location: "Craft Workshop",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
  },
  {
    id: "5",
    title: {
      en: "Traditional Music Ensemble",
      da: "گروه موسیقی سنتی",
      pa: "دودیز موسیقي ټولګه",
    },
    description: {
      en: "Learn and perform traditional Afghan music with authentic instruments.",
      da: "موسیقی سنتی افغانی را با سازهای اصیل یاد بگیرید و اجرا کنید.",
      pa: "د اصلي سازونو سره افغاني دودیز موسیقي زده کړئ او ترسره یې کړئ.",
    },
    categoryId: "3",
    location: "Music Room - Building B",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop",
  },
  {
    id: "6",
    title: {
      en: "Modern Dance Classes",
      da: "کلاس‌های رقص مدرن",
      pa: "د عصري نڅا ټولګي",
    },
    description: {
      en: "Express yourself through movement and rhythm in our dance program.",
      da: "در برنامه رقص ما خود را از طریق حرکت و ریتم بیان کنید.",
      pa: "زموږ د نڅا په برنامه کې د حرکت او تال له لارې خپل ځان څرګند کړئ.",
    },
    categoryId: "3",
    location: "Multipurpose Hall",
    image:
      "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop",
  },
  {
    id: "7",
    title: {
      en: "Nature Hiking Trips",
      da: "سفرهای پیاده‌روی در طبیعت",
      pa: "د طبیعت پیاده سفرونه",
    },
    description: {
      en: "Explore local nature trails and learn about environmental conservation.",
      da: "مسیرهای طبیعی محلی را کاوش کنید و در مورد حفاظت از محیط زیست بیاموزید.",
      pa: "د سیمه ایزو طبیعي لارو سپړنه وکړئ او د چاپیریال د ساتنې په اړه زده کړه وکړئ.",
    },
    categoryId: "4",
    location: "Various Natural Sites",
    image:
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
  },
  {
    id: "8",
    title: {
      en: "Camping Adventures",
      da: "ماجراجویی‌های کمپینگ",
      pa: "د کمپینګ سفرونه",
    },
    description: {
      en: "Overnight camping trips that build teamwork and survival skills.",
      da: "سفرهای کمپینگ شبانه که مهارت‌های کار تیمی و بقا را تقویت می‌کند.",
      pa: "د شپې کمپینګ سفرونه چې د ټیمي کار او ژوندي پاتې کیدو مهارتونه جوړوي.",
    },
    categoryId: "4",
    location: "Outdoor Camping Sites",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop",
  },
  {
    id: "9",
    title: {
      en: "Robotics Club",
      da: "باشگاه روباتیک",
      pa: "د روبوټیک کلب",
    },
    description: {
      en: "Design, build, and program robots in our state-of-the-art lab.",
      da: "روبات‌ها را در آزمایشگاه پیشرفته ما طراحی، بسازید و برنامه‌نویسی کنید.",
      pa: "زموږ په عصري لابراتوار کې روبوټونه ډیزاین، جوړ او پروګرام کړئ.",
    },
    categoryId: "5",
    location: "Computer Lab - Room 201",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
  },
  {
    id: "10",
    title: {
      en: "Coding & Programming",
      da: "کدنویسی و برنامه‌نویسی",
      pa: "کوډینګ او پروګرامینګ",
    },
    description: {
      en: "Learn programming languages and develop your own applications.",
      da: "زبان‌های برنامه‌نویسی را یاد بگیرید و برنامه‌های خود را توسعه دهید.",
      pa: "د پروګرامینګ ژبې زده کړئ او خپلې برنامې رامینځته کړئ.",
    },
    categoryId: "5",
    location: "Computer Lab - Room 202",
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
  },
  {
    id: "11",
    title: {
      en: "Poetry & Storytelling",
      da: "شعر و داستان‌سرایی",
      pa: "شعر او کیسه ویل",
    },
    description: {
      en: "Share and create poetry and stories in Dari and Pashto languages.",
      da: "شعر و داستان‌ها را به زبان‌های دری و پشتو به اشتراک بگذارید و خلق کنید.",
      pa: "په دري او پښتو ژبو کې شعرونه او کیسې شریکې او رامینځته کړئ.",
    },
    categoryId: "6",
    location: "Library Hall",
    image:
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&h=600&fit=crop",
  },
  {
    id: "12",
    title: {
      en: "Traditional Calligraphy",
      da: "خوشنویسی سنتی",
      pa: "دودیز خطاطي",
    },
    description: {
      en: "Master the art of Persian and Arabic calligraphy with expert guidance.",
      da: "با راهنمایی متخصص، هنر خوشنویسی فارسی و عربی را استاد شوید.",
      pa: "د ماهرینو په لارښوونه سره د فارسي او عربي خطاطۍ هنر زده کړئ.",
    },
    categoryId: "6",
    location: "Cultural Center",
    image:
      "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&h=600&fit=crop",
  },
];
