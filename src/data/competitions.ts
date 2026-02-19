import type { Competition, CompetitionCategory } from "../entities/Competition";

export const competitionCategories: CompetitionCategory[] = [
  {
    id: "1",
    name: {
      en: "Mathematics",
      da: "ریاضیات",
      pa: "ریاضي",
    },
  },
  {
    id: "2",
    name: {
      en: "Science",
      da: "ساینس",
      pa: "ساینس",
    },
  },
  {
    id: "3",
    name: {
      en: "Programming",
      da: "برنامه نویسی",
      pa: "پروګرامنګ",
    },
  },
  {
    id: "4",
    name: {
      en: "Robotics",
      da: "رباتیک",
      pa: "روبوټیکس",
    },
  },
  {
    id: "5",
    name: {
      en: "Physics",
      da: "فزیک",
      pa: "فزیک",
    },
  },
];

export const competitions: Competition[] = [
  {
    id: "1",
    title: {
      en: "National Math Olympiad 2026",
      da: "المپیاد ملی ریاضیات ۲۰۲۶",
      pa: "د ریاضي ملي المپیاد ۲۰۲۶",
    },
    description: {
      en: "Test your mathematical skills in a national-level competition.",
      da: "مهارت‌های ریاضی خود را در یک رقابت سطح ملی آزمایش کنید.",
      pa: "خپل ریاضي مهارتونه په ملي سیالۍ کې وازمویئ.",
    },
    category_id: 1,

    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=500&fit=crop",
    startDate: "2026-03-15",
    endDate: "2026-03-15",
    registrationDeadline: "2026-03-01",
    rules: {
      en: "Individual participation only. Duration: 3 hours.",
      da: "اشتراک به صورت انفرادی است. مدت زمان: ۳ ساعت.",
      pa: "ګډون انفرادي دی. موده: ۳ ساعته.",
    },
    prizes: [
      {
        position: {
          en: "1st Place",
          da: "مقام اول",
          pa: "لومړی مقام",
        },
        description: {
          en: "Gold Medal and $500 Scholarship",
          da: "مدال طلا و بورس ۵۰۰ دالری",
          pa: "د سرو زرو مډال او ۵۰۰ ډالره سکالرشیپ",
        },
      },
    ],
    maxParticipants: 100,
    location: "Main Auditorium",
    isTeamEvent: false,
    teamSize: { min: 1, max: 1 },
  },

  {
    id: "2",
    title: {
      en: "National Science Fair 2026",
      da: "نمایشگاه ملی ساینس ۲۰۲۶",
      pa: "د ساینس ملي نندارتون ۲۰۲۶",
    },
    description: {
      en: "Present your innovative science projects.",
      da: "پروژه‌های خلاقانه علمی خود را ارائه کنید.",
      pa: "خپل نوښتګر ساینس پروژې وړاندې کړئ.",
    },
    category_id: 2,

    image:
      "https://images.unsplash.com/photo-1581091012184-7f3c6d4d0c5d?w=800&h=500&fit=crop",
    startDate: "2026-04-10",
    endDate: "2026-04-12",
    registrationDeadline: "2026-03-25",
    rules: {
      en: "Team participation allowed. Max 3 members.",
      da: "اشتراک تیمی مجاز است. حداکثر ۳ نفر.",
      pa: "ډله ییز ګډون اجازه لري. اعظمي ۳ کسان.",
    },
    prizes: [
      {
        position: {
          en: "1st Place",
          da: "مقام اول",
          pa: "لومړی مقام",
        },
        description: {
          en: "Gold Trophy and $700 Award",
          da: "جام طلا و ۷۰۰ دالر جایزه",
          pa: "د سرو زرو جام او ۷۰۰ ډالره جایزه",
        },
      },
    ],
    maxParticipants: 150,
    location: "Science Hall",
    isTeamEvent: true,
    teamSize: { min: 1, max: 3 },
  },

  {
    id: "3",
    title: {
      en: "Programming Contest 2026",
      da: "مسابقه برنامه نویسی ۲۰۲۶",
      pa: "د پروګرامنګ سیالي ۲۰۲۶",
    },
    description: {
      en: "Solve algorithmic challenges and win prizes.",
      da: "چالش‌های الگوریتمی را حل کنید و جایزه ببرید.",
      pa: "الګوریتمي ستونزې حل کړئ او جایزې وګټئ.",
    },
    category_id: 3,

    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=800&h=500&fit=crop",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    registrationDeadline: "2026-04-20",
    rules: {
      en: "Individual contest. Duration: 4 hours.",
      da: "مسابقه انفرادی. مدت زمان: ۴ ساعت.",
      pa: "انفرادي سیالي. موده: ۴ ساعته.",
    },
    prizes: [
      {
        position: {
          en: "1st Place",
          da: "مقام اول",
          pa: "لومړی مقام",
        },
        description: {
          en: "Laptop + Certificate",
          da: "لپتاپ و تصدیقنامه",
          pa: "لپټاپ او سند",
        },
      },
    ],
    maxParticipants: 120,
    location: "Computer Lab",
    isTeamEvent: false,
    teamSize: { min: 1, max: 1 },
  },

  {
    id: "4",
    title: {
      en: "Robotics Challenge 2026",
      da: "چالش رباتیک ۲۰۲۶",
      pa: "د روبوټیکس ننګونه ۲۰۲۶",
    },
    description: {
      en: "Build and compete with your robot.",
      da: "ربات خود را بسازید و رقابت کنید.",
      pa: "خپل روبوټ جوړ کړئ او سیالي وکړئ.",
    },
    category_id: 4,

    image:
      "https://images.unsplash.com/photo-1581091870627-3c0c7cbb3f1e?w=800&h=500&fit=crop",
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    registrationDeadline: "2026-05-25",
    rules: {
      en: "Team event. Robot must be self-built.",
      da: "رویداد تیمی. ربات باید ساخته خودتان باشد.",
      pa: "ډله ییزه سیالي. روبوټ باید ستاسو له خوا جوړ شوی وي.",
    },
    prizes: [
      {
        position: {
          en: "Champion",
          da: "قهرمان",
          pa: "اتل",
        },
        description: {
          en: "$1000 Cash Prize",
          da: "۱۰۰۰ دالر جایزه نقدی",
          pa: "۱۰۰۰ ډالره نغدي جایزه",
        },
      },
    ],
    maxParticipants: 50,
    location: "Innovation Center",
    isTeamEvent: true,
    teamSize: { min: 2, max: 5 },
  },

  {
    id: "5",
    title: {
      en: "Physics Olympiad 2026",
      da: "المپیاد فزیک ۲۰۲۶",
      pa: "د فزیک المپیاد ۲۰۲۶",
    },
    description: {
      en: "Compete in theoretical and practical physics.",
      da: "در فزیک نظری و عملی رقابت کنید.",
      pa: "په نظري او عملي فزیک کې سیالي وکړئ.",
    },
    category_id: 5,

    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop",
    startDate: "2026-07-20",
    endDate: "2026-07-20",
    registrationDeadline: "2026-07-05",
    rules: {
      en: "Individual competition. Written exam format.",
      da: "رقابت انفرادی. امتحان کتبی.",
      pa: "انفرادي سیالي. لیکلی امتحان.",
    },
    prizes: [
      {
        position: {
          en: "1st Place",
          da: "مقام اول",
          pa: "لومړی مقام",
        },
        description: {
          en: "Gold Medal + $600",
          da: "مدال طلا + ۶۰۰ دالر",
          pa: "د سرو زرو مډال + ۶۰۰ ډالره",
        },
      },
    ],
    maxParticipants: 80,
    location: "Physics Department Hall",
    isTeamEvent: false,
    teamSize: { min: 1, max: 1 },
  },
  {
    id: "6",
    title: {
      en: "Physics Olympiad 2026",
      da: "المپیاد فزیک ۲۰۲۶",
      pa: "د فزیک المپیاد ۲۰۲۶",
    },
    description: {
      en: "Compete in theoretical and practical physics.",
      da: "در فزیک نظری و عملی رقابت کنید.",
      pa: "په نظري او عملي فزیک کې سیالي وکړئ.",
    },
    category_id: 5,

    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop",
    startDate: "2024-05-20",
    endDate: "2024-07-20",
    registrationDeadline: "2024-07-05",
    rules: {
      en: "Individual competition. Written exam format.",
      da: "رقابت انفرادی. امتحان کتبی.",
      pa: "انفرادي سیالي. لیکلی امتحان.",
    },
    prizes: [
      {
        position: {
          en: "1st Place",
          da: "مقام اول",
          pa: "لومړی مقام",
        },
        description: {
          en: "Gold Medal + $600",
          da: "مدال طلا + ۶۰۰ دالر",
          pa: "د سرو زرو مډال + ۶۰۰ ډالره",
        },
      },
    ],
    maxParticipants: 80,
    location: "Physics Department Hall",
    isTeamEvent: false,
    teamSize: { min: 1, max: 1 },
  },
];
