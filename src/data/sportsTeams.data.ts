// src/data/sportsTeams.data.ts

import type { SportCategory, SportsTeam } from "../entities/sportsTeams";

export const sportCategories: SportCategory[] = [
  {
    id: "football",
    name: {
      en: "Football",
      da: "فوتبال",
      pa: "فوټبال",
    },
  },
  {
    id: "cricket",
    name: {
      en: "Cricket",
      da: "کریکت",
      pa: "کرکټ",
    },
  },
  {
    id: "basketball",
    name: {
      en: "Basketball",
      da: "بسکتبال",
      pa: "باسکېټبال",
    },
  },
  {
    id: "volleyball",
    name: {
      en: "Volleyball",
      da: "والیبال",
      pa: "والیبال",
    },
  },
  {
    id: "athletics",
    name: {
      en: "Athletics",
      da: "دو و میدانی",
      pa: "دوړ او میدان",
    },
  },
  {
    id: "martial-arts",
    name: {
      en: "Martial Arts",
      da: "هنرهای رزمی",
      pa: "مارشل آرټس",
    },
  },
];

export const sportsTeams: SportsTeam[] = [
  {
    id: "1",
    name: {
      en: "Sultan Eagles",
      da: "عقاب‌های سلطان",
      pa: "د سلطان عقابان",
    },
    categoryId: "football",
    description: {
      en: "Our premier football team has been making waves in inter-school competitions with exceptional teamwork and dedication.",
      da: "تیم فوتبال برتر ما با کار تیمی استثنایی و فداکاری در مسابقات بین مدرسه‌ای می‌درخشد.",
      pa: "زموږ لومړی فوټبال ټیم د ښوونځیو ترمنځ سیالیو کې د غوره ټیمي کار او وقف سره ځلیدلی دی.",
    },
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
    coach: {
      id: "coach-ahmad",
      name: "Ahmad Fahim",
      photo:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop",
      experience: {
        en: "12 years of professional coaching experience",
        da: "12 سال تجربه مربیگری حرفه‌ای",
        pa: "12 کاله مسلکي روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-1",
        name: "Hashim Azizi",
        position: { en: "Forward", da: "مهاجم", pa: "مخکښ" },
        photo:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=300&fit=crop",
        jerseyNumber: 10,
      },
      {
        id: "player-2",
        name: "Bilal Sharifi",
        position: { en: "Midfielder", da: "هافبک", pa: "منځنی" },
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        jerseyNumber: 8,
      },
      {
        id: "player-3",
        name: "Yousuf Ahmadi",
        position: { en: "Goalkeeper", da: "دروازه‌بان", pa: "ګولر" },
        photo:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
        jerseyNumber: 1,
      },
    ],
    achievements: [
      {
        id: "ach-1",
        title: {
          en: "Regional Champions 2024",
          da: "قهرمانان منطقه‌ای 2024",
          pa: "د 2024 سیمه ایز اتلان",
        },
        description: {
          en: "First place in the Regional Inter-School Football Tournament",
          da: "مقام اول در تورنمنت فوتبال بین مدرسه‌ای منطقه‌ای",
          pa: "د سیمه ایزو ښوونځیو ترمنځ د فوټبال ټورنمنټ لومړی ځای",
        },
        year: 2024,
        trophy: "🏆",
      },
      {
        id: "ach-2",
        title: {
          en: "Fair Play Award 2023",
          da: "جایزه بازی منصفانه 2023",
          pa: "د منصفانه لوبې جایزه 2023",
        },
        description: {
          en: "Recognized for outstanding sportsmanship and fair play",
          da: "به خاطر ورزشکاری برجسته و بازی منصفانه شناخته شد",
          pa: "د غوره سپورټمنشپ او منصفانه لوبې لپاره پیژندل شوی",
        },
        year: 2023,
        trophy: "🏅",
      },
    ],
    establishedYear: 2018,
    facilities: {
      en: [
        "Professional Football Field",
        "Modern Changing Rooms",
        "Training Equipment",
      ],
      da: ["زمین فوتبال حرفه‌ای", "رختکن‌های مدرن", "تجهیزات تمرینی"],
      pa: ["مسلکي فوټبال میدان", "مډرن بدلون خونې", "د روزنې تجهیزات"],
    },
  },

  {
    id: "2",
    name: {
      en: "Golden Lions",
      da: "شیرهای طلایی",
      pa: "زرین زمریان",
    },
    categoryId: "basketball",
    description: {
      en: "A fast-paced basketball team known for sharp shooting and strong defense.",
      da: "تیم بسکتبال پرانرژی با شوت‌های دقیق و دفاع قوی.",
      pa: "یو چټک بسکتبال ټیم چې د دقیقو شوتونو او قوي دفاع لپاره مشهور دی.",
    },
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
    coach: {
      id: "coach-karim",
      name: "Karim Wafa",
      photo:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop",
      experience: {
        en: "9 years coaching youth basketball",
        da: "9 سال تجربه مربیگری بسکتبال نوجوانان",
        pa: "9 کاله د ځوانانو بسکتبال روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-4",
        name: "Omid Rahimi",
        position: { en: "Point Guard", da: "پلی‌میکر", pa: "پواینټ ګارډ" },
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        jerseyNumber: 3,
      },
      {
        id: "player-5",
        name: "Samiullah Noori",
        position: { en: "Shooting Guard", da: "شوتینگ گارد", pa: "شوٹنګ ګارډ" },
        photo:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop",
        jerseyNumber: 7,
      },
      {
        id: "player-6",
        name: "Farid Jalali",
        position: { en: "Center", da: "سنتر", pa: "سنټر" },
        photo:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
        jerseyNumber: 15,
      },
    ],
    achievements: [
      {
        id: "ach-3",
        title: {
          en: "City League Champions 2023",
          da: "قهرمان لیگ شهری 2023",
          pa: "د 2023 ښار لیګ اتلان",
        },
        description: {
          en: "Won the city basketball league with an unbeaten record",
          da: "با رکورد بدون شکست قهرمان لیگ شهری شد",
          pa: "د ښار بسکتبال لیګ یې پرته له ماتې وګاټه",
        },
        year: 2023,
        trophy: "🏆",
      },
    ],
    establishedYear: 2017,
    facilities: {
      en: ["Indoor Basketball Court", "Strength Training Gym"],
      da: ["سالن بسکتبال سرپوشیده", "باشگاه بدنسازی"],
      pa: ["د دننه بسکتبال میدان", "د ځواک روزنې جم"],
    },
  },

  {
    id: "3",
    name: {
      en: "Sky Runners",
      da: "دوندگان آسمان",
      pa: "د اسمان منډه وهونکي",
    },
    categoryId: "athletics",
    description: {
      en: "An athletics team focused on speed, endurance, and discipline.",
      da: "تیم دو و میدانی با تمرکز بر سرعت، استقامت و نظم.",
      pa: "د اتلتیک ټیم چې پر سرعت، زغم او نظم تمرکز لري.",
    },
    image:
      "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&h=600&fit=crop",
    coach: {
      id: "coach-sara",
      name: "Sara Hamidi",
      photo:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
      experience: {
        en: "10 years in professional athletics training",
        da: "10 سال تجربه در آموزش دو و میدانی حرفه‌ای",
        pa: "10 کاله د مسلکي اتلتیک روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-7",
        name: "Ariana Safi",
        position: { en: "Sprinter", da: "دونده سرعت", pa: "چټک منډه وهونکی" },
        photo:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop",
        jerseyNumber: 21,
      },
      {
        id: "player-8",
        name: "Zubair Khalid",
        position: {
          en: "Long Distance Runner",
          da: "دونده استقامت",
          pa: "اوږد واټن منډه وهونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop",
        jerseyNumber: 34,
      },
      {
        id: "player-9",
        name: "Nabila Sadat",
        position: { en: "Hurdler", da: "پرش از مانع", pa: "د خنډ منډه وهونکی" },
        photo:
          "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=300&h=300&fit=crop",
        jerseyNumber: 18,
      },
    ],
    achievements: [
      {
        id: "ach-4",
        title: {
          en: "National Athletics Meet Winners",
          da: "برندگان مسابقات ملی دو و میدانی",
          pa: "د ملي اتلتیک سیالیو ګټونکي",
        },
        description: {
          en: "Top performers in multiple sprint and endurance events",
          da: "برترین عملکرد در چندین رشته سرعت و استقامت",
          pa: "په څو سرعت او زغم سیالیو کې غوره پایلې",
        },
        year: 2022,
        trophy: "🥇",
      },
    ],
    establishedYear: 2016,
    facilities: {
      en: ["400m Track", "Endurance Training Zone"],
      da: ["پیست ۴۰۰ متری", "منطقه تمرین استقامت"],
      pa: ["۴۰۰ متره ټریک", "د زغم روزنې سیمه"],
    },
  },

  {
    id: "4",
    name: {
      en: "Thunder Strikers",
      da: "ضربه‌زنان رعد",
      pa: "د تندر برید کوونکي",
    },
    categoryId: "cricket",
    description: {
      en: "A competitive cricket team famous for powerful batting and tactical bowling.",
      da: "تیم کریکت رقابتی با ضربات قوی و بولینگ تاکتیکی.",
      pa: "یو سیالتي کرکټ ټیم چې د قوي بیټنګ او تاکتیکي بولینګ لپاره مشهور دی.",
    },
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop",
    coach: {
      id: "coach-rashid",
      name: "Rashid Khan",
      photo:
        "https://images.unsplash.com/photo-1502767089025-6572583495b4?w=300&h=300&fit=crop",
      experience: {
        en: "11 years of national-level cricket coaching",
        da: "11 سال تجربه مربیگری کریکت در سطح ملی",
        pa: "11 کاله د ملي کچې کرکټ روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-10",
        name: "Shafiq Noor",
        position: { en: "Batsman", da: "بتسمَن", pa: "بیټسمین" },
        photo:
          "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=300&fit=crop",
        jerseyNumber: 9,
      },
      {
        id: "player-11",
        name: "Latif Akbar",
        position: { en: "Bowler", da: "بولر", pa: "بالر" },
        photo:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop",
        jerseyNumber: 22,
      },
      {
        id: "player-12",
        name: "Najeeb Tariq",
        position: { en: "All-Rounder", da: "همه‌فن‌حریف", pa: "آل راونډر" },
        photo:
          "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=300&h=300&fit=crop",
        jerseyNumber: 14,
      },
    ],
    achievements: [
      {
        id: "ach-5",
        title: {
          en: "Inter-College Cricket Cup 2023",
          da: "جام کریکت بین کالج‌ها 2023",
          pa: "د 2023 بین کالج کرکټ جام",
        },
        description: {
          en: "Champions of the annual inter-college cricket tournament",
          da: "قهرمان تورنمنت سالانه کریکت بین کالج‌ها",
          pa: "د کالني بین کالج کرکټ ټورنمنټ اتلان",
        },
        year: 2023,
        trophy: "🏆",
      },
    ],
    establishedYear: 2015,
    facilities: {
      en: ["Cricket Ground", "Bowling Practice Nets"],
      da: ["زمین کریکت", "تورهای تمرینی بولینگ"],
      pa: ["د کرکټ میدان", "د بولینګ تمرین جالونه"],
    },
  },

  {
    id: "5",
    name: {
      en: "Ocean Swimmers",
      da: "شناگران اقیانوس",
      pa: "د سمندر لامبو وهونکي",
    },
    categoryId: "swimming",
    description: {
      en: "A swimming team focused on speed, technique, and endurance in water sports.",
      da: "تیم شنا با تمرکز بر سرعت، تکنیک و استقامت در ورزش‌های آبی.",
      pa: "د لامبو ټیم چې په اوبو کې پر سرعت، تخنیک او زغم تمرکز لري.",
    },
    image:
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?w=800&h=600&fit=crop",
    coach: {
      id: "coach-lina",
      name: "Lina Qaderi",
      photo:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop",
      experience: {
        en: "8 years of competitive swimming coaching",
        da: "8 سال تجربه مربیگری شنای رقابتی",
        pa: "8 کاله د سیالتي لامبو روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-13",
        name: "Maryam Zaki",
        position: {
          en: "Freestyle Swimmer",
          da: "شنای آزاد",
          pa: "فری سټایل لامبو وهونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=300&h=300&fit=crop",
        jerseyNumber: 5,
      },
      {
        id: "player-14",
        name: "Hamidullah Saeed",
        position: {
          en: "Backstroke Swimmer",
          da: "شنای کرال پشت",
          pa: "بیک سټروک لامبو وهونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop",
        jerseyNumber: 11,
      },
      {
        id: "player-15",
        name: "Zahra Omari",
        position: {
          en: "Butterfly Swimmer",
          da: "شنای پروانه",
          pa: "بټر فلای لامبو وهونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
        jerseyNumber: 19,
      },
    ],
    achievements: [
      {
        id: "ach-6",
        title: {
          en: "National Swimming Meet Gold",
          da: "طلای مسابقات ملی شنا",
          pa: "د ملي لامبو سیالیو طلا",
        },
        description: {
          en: "Won gold medals in freestyle and relay events",
          da: "کسب مدال طلا در شنای آزاد و امدادی",
          pa: "په فری سټایل او ریلې سیالیو کې د سرو زرو مډالونه وګټل",
        },
        year: 2022,
        trophy: "🥇",
      },
    ],
    establishedYear: 2019,
    facilities: {
      en: ["Olympic Size Pool", "Underwater Training Cameras"],
      da: ["استخر المپیکی", "دوربین‌های تمرینی زیر آب"],
      pa: ["د المپیک اندازه حوض", "د اوبو لاندې روزنیزې کمرې"],
    },
  },

  {
    id: "6",
    name: {
      en: "Mountain Climbers",
      da: "کوهنوردان کوهستان",
      pa: "د غرونو ختونکې",
    },
    categoryId: "climbing",
    description: {
      en: "An adventure sports team specializing in indoor and outdoor climbing challenges.",
      da: "تیم ورزش‌های ماجراجویانه متخصص در صعودهای داخل سالن و فضای باز.",
      pa: "یو د ماجراجویي سپورټ ټیم چې د دننه او بهر ختلو کې تخصص لري.",
    },
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
    coach: {
      id: "coach-navid",
      name: "Navid Rahman",
      photo:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop",
      experience: {
        en: "7 years of professional climbing instruction",
        da: "7 سال تجربه آموزش حرفه‌ای کوهنوردی",
        pa: "7 کاله د مسلکي غره ختلو روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-16",
        name: "Sahar Latifi",
        position: { en: "Lead Climber", da: "سرپرست صعود", pa: "مخکښ ختونکی" },
        photo:
          "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300&h=300&fit=crop",
        jerseyNumber: 6,
      },
      {
        id: "player-17",
        name: "Kamal Yasin",
        position: { en: "Speed Climber", da: "سرعت‌نورد", pa: "چټک ختونکی" },
        photo:
          "https://images.unsplash.com/photo-1506795660198-e95c77602129?w=300&h=300&fit=crop",
        jerseyNumber: 12,
      },
      {
        id: "player-18",
        name: "Huda Karim",
        position: { en: "Boulderer", da: "بولدرینگ", pa: "بولډرر" },
        photo:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop",
        jerseyNumber: 20,
      },
    ],
    achievements: [
      {
        id: "ach-7",
        title: {
          en: "Regional Climbing Cup Winners",
          da: "برندگان جام منطقه‌ای کوهنوردی",
          pa: "د سیمه ایز غره ختلو جام ګټونکي",
        },
        description: {
          en: "Top team in speed and lead climbing categories",
          da: "تیم برتر در رشته‌های سرعت و سرپرست صعود",
          pa: "په سرعت او مخکښ ختلو برخو کې غوره ټیم",
        },
        year: 2021,
        trophy: "🏅",
      },
    ],
    establishedYear: 2014,
    facilities: {
      en: ["Indoor Climbing Wall", "Outdoor Rock Training Area"],
      da: ["دیوار صعود سرپوشیده", "منطقه تمرین سنگ‌نوردی"],
      pa: ["د دننه ختلو دیوال", "د بهر ډبره ختلو سیمه"],
    },
  },

  {
    id: "7",
    name: {
      en: "Falcon Archers",
      da: "کمانداران شاهین",
      pa: "د باز غشی ویشونکي",
    },
    categoryId: "archery",
    description: {
      en: "A precision-based archery team focused on accuracy and calm performance.",
      da: "تیم تیراندازی با کمان با تمرکز بر دقت و آرامش.",
      pa: "یو د غشي ویشتلو ټیم چې پر دقت او ارامۍ تمرکز لري.",
    },
    image:
      "https://images.unsplash.com/photo-1508612761958-e9314e3c4c37?w=800&h=600&fit=crop",
    coach: {
      id: "coach-zahid",
      name: "Zahid Noor",
      photo:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=300&h=300&fit=crop",
      experience: {
        en: "6 years coaching competitive archery",
        da: "6 سال تجربه مربیگری تیراندازی رقابتی",
        pa: "6 کاله د سیالتي غشي ویشتلو روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-19",
        name: "Roya Mahdavi",
        position: {
          en: "Recurve Archer",
          da: "کمان ریکرو",
          pa: "ریکرو غشی ویشونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
        jerseyNumber: 2,
      },
      {
        id: "player-20",
        name: "Azim Wardak",
        position: {
          en: "Compound Archer",
          da: "کمان کامپوند",
          pa: "کمپاوند غشی ویشونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        jerseyNumber: 9,
      },
      {
        id: "player-21",
        name: "Narges Safi",
        position: {
          en: "Barebow Archer",
          da: "کمان ساده",
          pa: "ساده غشی ویشونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop",
        jerseyNumber: 17,
      },
    ],
    achievements: [
      {
        id: "ach-8",
        title: {
          en: "National Archery Bronze Medal",
          da: "مدال برنز مسابقات ملی تیراندازی",
          pa: "د ملي غشي ویشتلو سیالیو برونز مډال",
        },
        description: {
          en: "Secured bronze medal in national championships",
          da: "کسب مدال برنز در مسابقات ملی",
          pa: "په ملي سیالیو کې د برونز مډال ترلاسه کړ",
        },
        year: 2023,
        trophy: "🥉",
      },
    ],
    establishedYear: 2020,
    facilities: {
      en: ["Outdoor Archery Range", "Indoor Target Hall"],
      da: ["میدان تیراندازی روباز", "سالن هدف‌گیری سرپوشیده"],
      pa: ["د بهر غشي ویشتلو میدان", "د دننه هدف ویشتلو تالار"],
    },
  },

  {
    id: "8",
    name: {
      en: "Storm Volleyball Club",
      da: "باشگاه والیبال طوفان",
      pa: "د توپ وهلو طوفان کلب",
    },
    categoryId: "volleyball",
    description: {
      en: "A dynamic volleyball team known for powerful serves and teamwork.",
      da: "تیم والیبال پویا با سرویس‌های قدرتمند و همکاری عالی.",
      pa: "یو متحرک والیبال ټیم چې د قوي سرویسونو او ټیمي کار لپاره مشهور دی.",
    },
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop",
    coach: {
      id: "coach-sami",
      name: "Sami Rahimi",
      photo:
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=300&h=300&fit=crop",
      experience: {
        en: "10 years volleyball coaching experience",
        da: "10 سال تجربه مربیگری والیبال",
        pa: "10 کاله د والیبال روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-22",
        name: "Laila Sadat",
        position: { en: "Setter", da: "پاسور", pa: "سیټر" },
        photo:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
        jerseyNumber: 4,
      },
      {
        id: "player-23",
        name: "Jawad Khalil",
        position: {
          en: "Outside Hitter",
          da: "ضربه‌زن کناری",
          pa: "اوتسایډ هیټر",
        },
        photo:
          "https://images.unsplash.com/photo-1506795660198-e95c77602129?w=300&h=300&fit=crop",
        jerseyNumber: 13,
      },
      {
        id: "player-24",
        name: "Nasrin Habibi",
        position: { en: "Libero", da: "لیبرو", pa: "لیبرو" },
        photo:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop",
        jerseyNumber: 16,
      },
    ],
    achievements: [
      {
        id: "ach-9",
        title: {
          en: "School Volleyball Cup Winners",
          da: "برندگان جام والیبال مدرسه",
          pa: "د ښوونځي والیبال جام ګټونکي",
        },
        description: {
          en: "Won the annual school volleyball championship",
          da: "قهرمان مسابقات سالانه والیبال مدرسه",
          pa: "د ښوونځي کلني والیبال سیالیو اتلان",
        },
        year: 2024,
        trophy: "🏆",
      },
    ],
    establishedYear: 2018,
    facilities: {
      en: ["Indoor Volleyball Court", "Jump Training Equipment"],
      da: ["سالن والیبال سرپوشیده", "تجهیزات تمرین پرش"],
      pa: ["د دننه والیبال میدان", "د ټوپ روزنې تجهیزات"],
    },
  },

  {
    id: "9",
    name: {
      en: "Iron Lifters",
      da: "وزنه‌برداران آهنین",
      pa: "د اوسپنې پورته کوونکي",
    },
    categoryId: "weightlifting",
    description: {
      en: "A strength-focused team competing in national weightlifting events.",
      da: "تیم قدرتی که در مسابقات ملی وزنه‌برداری رقابت می‌کند.",
      pa: "یو د ځواک ټیم چې په ملي وزنه پورته کولو سیالیو کې سیالي کوي.",
    },
    image:
      "https://images.unsplash.com/photo-1517964102532-1f6c8c0b6b25?w=800&h=600&fit=crop",
    coach: {
      id: "coach-habib",
      name: "Habibullah Khan",
      photo:
        "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=300&h=300&fit=crop",
      experience: {
        en: "13 years strength and conditioning coaching",
        da: "13 سال تجربه مربیگری قدرت و آمادگی جسمانی",
        pa: "13 کاله د ځواک او فټنس روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-25",
        name: "Sadiq Rahman",
        position: {
          en: "Heavyweight Lifter",
          da: "وزنه‌بردار سنگین‌وزن",
          pa: "دروند وزن پورته کوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1502767089025-6572583495b4?w=300&h=300&fit=crop",
        jerseyNumber: 1,
      },
      {
        id: "player-26",
        name: "Nazia Karim",
        position: {
          en: "Lightweight Lifter",
          da: "وزنه‌بردار سبک‌وزن",
          pa: "سپک وزن پورته کوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=300&fit=crop",
        jerseyNumber: 7,
      },
      {
        id: "player-27",
        name: "Faisal Omari",
        position: {
          en: "Middleweight Lifter",
          da: "وزنه‌بردار میان‌وزن",
          pa: "منځنی وزن پورته کوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&h=300&fit=crop",
        jerseyNumber: 11,
      },
    ],
    achievements: [
      {
        id: "ach-10",
        title: {
          en: "National Weightlifting Silver Medal",
          da: "مدال نقره مسابقات ملی وزنه‌برداری",
          pa: "د ملي وزنه پورته کولو سیالیو سپین زر مډال",
        },
        description: {
          en: "Secured silver medal in the national championships",
          da: "کسب مدال نقره در مسابقات ملی",
          pa: "په ملي سیالیو کې د سپینو زرو مډال ترلاسه کړ",
        },
        year: 2022,
        trophy: "🥈",
      },
    ],
    establishedYear: 2013,
    facilities: {
      en: ["Olympic Weightlifting Platform", "Strength Training Gym"],
      da: ["سکوی وزنه‌برداری المپیکی", "باشگاه بدنسازی"],
      pa: ["د المپیک وزنه پورته کولو سټېج", "د ځواک روزنې جم"],
    },
  },

  {
    id: "10",
    name: {
      en: "Desert Cyclists",
      da: "دوچرخه‌سواران صحرا",
      pa: "دښتې بایسکل چلوونکي",
    },
    categoryId: "cycling",
    description: {
      en: "An endurance cycling team competing in long-distance road races.",
      da: "تیم دوچرخه‌سواری استقامتی در مسابقات جاده‌ای طولانی.",
      pa: "یو د بایسکل چلولو ټیم چې په اوږده واټن سیالیو کې سیالي کوي.",
    },
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&h=600&fit=crop",
    coach: {
      id: "coach-farzan",
      name: "Farzan Malik",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
      experience: {
        en: "9 years professional cycling coaching",
        da: "9 سال تجربه مربیگری حرفه‌ای دوچرخه‌سواری",
        pa: "9 کاله د مسلکي بایسکل روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-28",
        name: "Rahmatullah Safi",
        position: {
          en: "Road Cyclist",
          da: "دوچرخه‌سوار جاده",
          pa: "د سړک بایسکل چلوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop",
        jerseyNumber: 23,
      },
      {
        id: "player-29",
        name: "Mina Rahimi",
        position: {
          en: "Sprint Cyclist",
          da: "دوچرخه‌سوار سرعتی",
          pa: "چټک بایسکل چلوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=300&h=300&fit=crop",
        jerseyNumber: 6,
      },
      {
        id: "player-30",
        name: "Tariq Nawid",
        position: {
          en: "Mountain Cyclist",
          da: "دوچرخه‌سوار کوهستان",
          pa: "غرنی بایسکل چلوونکی",
        },
        photo:
          "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=300&h=300&fit=crop",
        jerseyNumber: 12,
      },
    ],
    achievements: [
      {
        id: "ach-11",
        title: {
          en: "Regional Cycling Tour Champions",
          da: "قهرمانان تور دوچرخه‌سواری منطقه‌ای",
          pa: "د سیمه ایز بایسکل سفر اتلان",
        },
        description: {
          en: "Won the regional multi-stage cycling tour",
          da: "قهرمان تور چندمرحله‌ای منطقه‌ای شد",
          pa: "د سیمه ایز څو مرحلې بایسکل سفر یې وګاټه",
        },
        year: 2024,
        trophy: "🏆",
      },
    ],
    establishedYear: 2019,
    facilities: {
      en: ["Road Training Tracks", "Bike Repair Workshop"],
      da: ["مسیرهای تمرین جاده‌ای", "کارگاه تعمیر دوچرخه"],
      pa: ["د سړک روزنې لارې", "د بایسکل ترمیم ورکشاپ"],
    },
  },
];
