import type {
  ProjectCategory,
  StudentProject,
} from "../entities/StudentProject";

export const projectCategories: ProjectCategory[] = [
  {
    id: 1,
    name: {
      en: "Science & Technology",
      da: "ساینس و تکنالوژی",
      pa: "ساینس او ټکنالوژي",
    },
  },
  {
    id: 2,
    name: {
      en: "Arts & Literature",
      da: "هنر و ادبیات",
      pa: "هنر او ادبیات",
    },
  },
  {
    id: 3,
    name: {
      en: "Mathematics",
      da: "ریاضیات",
      pa: "ریاضیات",
    },
  },
  {
    id: 4,
    name: {
      en: "Engineering",
      da: "انجینری",
      pa: "انجنیري",
    },
  },
  {
    id: 5,
    name: {
      en: "Social Studies",
      da: "مطالعات اجتماعی",
      pa: "ټولنیزې مطالعې",
    },
  },
  {
    id: 6,
    name: {
      en: "Environmental Studies",
      da: "مطالعات محیط زیست",
      pa: "د چاپېریال مطالعې",
    },
  },
];

export const studentProjects: StudentProject[] = [
  {
    id: "1",
    title: {
      en: "Solar Powered Water Purification System",
      da: "سیستم تصفیه آب با انرژی خورشیدی",
      pa: "د لمریزې انرژۍ په وسیله د اوبو د تصفیې سیستم",
    },
    students: [
      {
        id: "s1",
        name: "Ahmad Fahim",
        grade: "Grade 12",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
      },
      {
        id: "s2",
        name: "Fatima Rezaee",
        grade: "Grade 12",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      },
    ],
    category_id: 1,
    description: {
      en: "This innovative project demonstrates a sustainable solution for water purification using solar energy. The system uses photovoltaic panels to power a multi-stage filtration process, making clean water accessible in remote areas.",
      da: "این پروژه نوآورانه یک راه‌حل پایدار برای تصفیه آب با استفاده از انرژی خورشیدی را نشان می‌دهد. این سیستم با استفاده از پنل‌های فوتوولتائیک یک فرآیند چندمرحله‌ای تصفیه را به کار می‌اندازد و آب پاک را در مناطق دورافتاده در دسترس قرار می‌دهد.",
      pa: "دا نوښتګر پروژه د لمریزې انرژۍ په کارولو سره د اوبو د تصفیې لپاره یو دوامدار حل وړاندې کوي. سیستم د فوتوولټایک پینلونو په وسیله څو پړاویزه فلټر کولو پروسه پرمخ وړي او په لیرې پرتو سیمو کې پاکې اوبه برابروي.",
    },
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    ],
    completion_date: "2024-12-15",
    awards: [
      {
        en: "First Place - National Science Fair",
        da: "مقام اول – نمایشگاه ملی علوم",
        pa: "لومړی مقام – ملي ساینس نندارتون",
      },
      {
        en: "Innovation Award",
        da: "جایزه نوآوری",
        pa: "د نوښت جایزه",
      },
    ],
  },

  {
    id: "2",
    title: {
      en: "Traditional Afghan Calligraphy Collection",
      da: "مجموعه خوشنویسی سنتی افغانستان",
      pa: "د افغانستان دودیزه خوشنویسي ټولګه",
    },
    students: [
      {
        id: "s3",
        name: "Zahra Ahmadi",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
      },
    ],
    category_id: 2,
    description: {
      en: "A beautiful collection of traditional Afghan calligraphy pieces showcasing the rich cultural heritage of Afghanistan. Each piece tells a story through intricate designs and meaningful verses.",
      da: "مجموعه‌ای زیبا از آثار خوشنویسی سنتی افغانستان که میراث فرهنگی غنی کشور را به نمایش می‌گذارد. هر اثر از طریق طرح‌های ظریف و اشعار معنادار داستانی را بیان می‌کند.",
      pa: "د افغانستان د دودیزې خوشنویسۍ یوه ښکلې ټولګه چې د هېواد بډایه کلتوري میراث څرګندوي. هر اثر د ښکلو طرحو او مانا لرونکو شعرونو له لارې یوه کیسه بیانوي.",
    },
    images: [
      "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=800",
      "https://images.unsplash.com/photo-1516641051054-9df6a1aad654?w=800",
    ],
    completion_date: "2024-11-20",
  },

  {
    id: "3",
    title: {
      en: "Mathematical Modeling of Population Growth",
      da: "مدل‌سازی ریاضی رشد جمعیت",
      pa: "د نفوس د ودې ریاضي ماډل کول",
    },
    students: [
      {
        id: "s4",
        name: "Hassan Karimi",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
      },
      {
        id: "s5",
        name: "Noor Mohammad",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noor",
      },
      {
        id: "s6",
        name: "Roya Sadiq",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roya",
      },
    ],
    category_id: 4,
    description: {
      en: "An advanced mathematical model analyzing population growth patterns in Kabul over the past decade. The project uses differential equations and statistical analysis to predict future trends.",
      da: "یک مدل پیشرفته ریاضی که الگوهای رشد جمعیت کابل را در دهه گذشته تحلیل می‌کند. این پروژه از معادلات دیفرانسیل و تحلیل آماری برای پیش‌بینی روندهای آینده استفاده می‌کند.",
      pa: "یو پرمختللی ریاضي ماډل چې په تېرو لسو کلونو کې د کابل د نفوس د ودې بڼې تحلیلوي. پروژه د تفاضلي معادلو او احصایوي تحلیل له لارې راتلونکي تمایلات اټکل کوي.",
    },
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    ],
    completion_date: "2024-10-05",
  },
];
