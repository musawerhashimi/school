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
      en: "Our premier football team has been making waves in inter-school competitions with exceptional teamwork and dedication. The Sultan Eagles represent the spirit of determination and excellence.",
      da: "تیم فوتبال برتر ما با کار تیمی استثنایی و فداکاری در مسابقات بین مدرسه‌ای موج می‌زند. عقاب‌های سلطان نماینده روحیه عزم و تعالی هستند.",
      pa: "زموږ لومړی فوټبال ټیم د ښوونځیو ترمنځ سیالیو کې د غوره ټیمي کار او وقف سره څپې رامنځته کوي. د سلطان عقابان د عزم او غوره توب روحیه استازیتوب کوي.",
    },
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop",
    coach: {
      id: "coach-ahmad",
      name: {
        en: "Ahmad Fahim",
        da: "احمد فهیم",
        pa: "احمد فهیم",
      },
      photo:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop",
      experience: {
        en: "12 years of professional coaching experience",
        da: "12 سال تجربه مربیگری حرفه‌ای",
        pa: "12 کاله مسلکي روزنې تجربه",
      },
      certifications: {
        en: ["AFC Level 2 Certificate", "Sports Psychology Diploma"],
        da: ["گواهینامه سطح 2 AFC", "دیپلوم روانشناسی ورزشی"],
        pa: ["د AFC د دویم کچې سند", "د سپورت ارواپوهنې ډیپلوما"],
      },
    },
    members: [
      {
        id: "player-1",
        name: { en: "Hashim Azizi", da: "هاشم عزیزی", pa: "هاشم عزیزي" },
        position: { en: "Forward", da: "مهاجم", pa: "مخکښ" },
        photo:
          "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=300&h=300&fit=crop",
        jerseyNumber: 10,
      },
      {
        id: "player-2",
        name: { en: "Bilal Sharifi", da: "بلال شریفی", pa: "بلال شریفي" },
        position: { en: "Midfielder", da: "هافبک", pa: "منځنی" },
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
        jerseyNumber: 8,
      },
      {
        id: "player-3",
        name: { en: "Yousuf Ahmadi", da: "یوسف احمدی", pa: "یوسف احمدي" },
        position: { en: "Goalkeeper", da: "دروازه‌بان", pa: "ګولر" },
        photo:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
        jerseyNumber: 1,
      },
    ],
    achievements: [
      {
        id: "2",
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
    trainingSchedule: {
      en: "Monday, Wednesday, Friday - 4:00 PM to 6:00 PM",
      da: "دوشنبه، چهارشنبه، جمعه - 4:00 بعد از ظهر تا 6:00 بعد از ظهر",
      pa: "دوشنبه، چهارشنبه، جمعه - د ماسپښین 4:00 څخه تر 6:00 پورې",
    },
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
      en: "Cricket Warriors",
      da: "جنگجویان کریکت",
      pa: "د کرکټ جنګیالي",
    },
    categoryId: "cricket",
    description: {
      en: "The Cricket Warriors embody the strategic brilliance and passion for one of Afghanistan's most beloved sports. With dedication and skill, our team continues to excel.",
      da: "جنگجویان کریکت تجسم درخشندگی استراتژیک و اشتیاق برای یکی از محبوب‌ترین ورزش‌های افغانستان هستند. با فداکاری و مهارت، تیم ما به تعالی ادامه می‌دهد.",
      pa: "د کرکټ جنګیالي د افغانستان د خورا خوښ شوي سپورټونو یو لپاره ستراتیژیک روښانتیا او لیوالتیا ښیي. د وقف او مهارت سره، زموږ ټیم لا ښه کیږي.",
    },
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop",
    coach: {
      id: "coach-rashid",
      name: {
        en: "Rashid Karim",
        da: "رشید کریم",
        pa: "رشید کریم",
      },
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      experience: {
        en: "15 years of cricket coaching and former national player",
        da: "15 سال مربیگری کریکت و بازیکن سابق تیم ملی",
        pa: "15 کاله د کرکټ روزنه او پخوانی ملي لوبغاړی",
      },
    },
    members: [
      {
        id: "player-4",
        name: { en: "Naveed Wahidi", da: "نوید وحیدی", pa: "نوید وحیدي" },
        position: { en: "Batsman", da: "بتسمن", pa: "بیټسمین" },
        photo:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop",
        jerseyNumber: 7,
      },
      {
        id: "player-5",
        name: { en: "Hamid Noori", da: "حمید نوری", pa: "حمید نوري" },
        position: { en: "Bowler", da: "بولر", pa: "بولر" },
        photo:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop",
        jerseyNumber: 12,
      },
    ],
    achievements: [
      {
        id: "4",
        title: {
          en: "Provincial Tournament Runners-up 2024",
          da: "نایب قهرمانی تورنمنت ولایتی 2024",
          pa: "د 2024 ولایتي ټورنمنټ دویم ځای",
        },
        description: {
          en: "Excellent performance securing second place in provincial cricket championship",
          da: "عملکرد عالی با کسب مقام دوم در قهرمانی کریکت ولایتی",
          pa: "په ولایتي کرکټ اتلولۍ کې د دویم ځای په ترلاسه کولو سره عالي فعالیت",
        },
        year: 2024,
        trophy: "🥈",
      },
    ],
    establishedYear: 2019,
    trainingSchedule: {
      en: "Tuesday, Thursday, Saturday - 3:30 PM to 5:30 PM",
      da: "سه‌شنبه، پنجشنبه، شنبه - 3:30 بعد از ظهر تا 5:30 بعد از ظهر",
      pa: "سه شنبه، پنجشنبه، شنبه - د ماسپښین 3:30 څخه تر 5:30 پورې",
    },
  },
  {
    id: "3",
    name: {
      en: "Basketball Panthers",
      da: "پلنگ‌های بسکتبال",
      pa: "د باسکېټبال پړانګان",
    },
    categoryId: "basketball",
    description: {
      en: "Speed, agility, and teamwork define the Basketball Panthers. Our team brings energy and excitement to every game, constantly pushing the boundaries of excellence.",
      da: "سرعت، چابکی و کار تیمی پلنگ‌های بسکتبال را تعریف می‌کند. تیم ما انرژی و هیجان را به هر بازی می‌آورد و دائماً مرزهای تعالی را جابجا می‌کند.",
      pa: "چټکتیا، چالاکي او ټیمي کار د باسکېټبال پړانګان تعریفوي. زموږ ټیم هرې لوبې ته انرژي او جوش راوړي او دوامداره د غوره توب حدونه فشاروي.",
    },
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
    coach: {
      id: "coach-jamil",
      name: {
        en: "Jamil Haidari",
        da: "جمیل حیدری",
        pa: "جمیل حیدري",
      },
      photo:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop",
      experience: {
        en: "10 years of basketball coaching experience",
        da: "10 سال تجربه مربیگری بسکتبال",
        pa: "10 کاله د باسکېټبال روزنې تجربه",
      },
    },
    members: [
      {
        id: "player-6",
        name: { en: "Omid Fahimi", da: "امید فهیمی", pa: "امید فهیمي" },
        position: { en: "Point Guard", da: "گارد", pa: "ګارډ" },
        photo:
          "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop",
        jerseyNumber: 5,
      },
      {
        id: "player-7",
        name: { en: "Farhan Safi", da: "فرهان صافی", pa: "فرهان صافي" },
        position: { en: "Center", da: "مرکز", pa: "مرکز" },
        photo:
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop",
        jerseyNumber: 23,
      },
    ],
    achievements: [
      {
        id: "5",
        title: {
          en: "City League Third Place 2023",
          da: "مقام سوم لیگ شهر 2023",
          pa: "د ښار لیګ دریم ځای 2023",
        },
        description: {
          en: "Strong showing in the city-wide basketball league",
          da: "نمایش قوی در لیگ بسکتبال سراسر شهر",
          pa: "د ښار په کچه د باسکېټبال لیګ کې قوي نندارتون",
        },
        year: 2023,
        trophy: "🥉",
      },
    ],
    establishedYear: 2020,
    trainingSchedule: {
      en: "Monday, Wednesday, Friday - 5:00 PM to 7:00 PM",
      da: "دوشنبه، چهارشنبه، جمعه - 5:00 بعد از ظهر تا 7:00 بعد از ظهر",
      pa: "دوشنبه، چهارشنبه، جمعه - د ماسپښین 5:00 څخه تر 7:00 پورې",
    },
  },
  {
    id: "4",
    name: {
      en: "Volleyball Titans",
      da: "غول‌های والیبال",
      pa: "د والیبال ټیټانان",
    },
    categoryId: "volleyball",
    description: {
      en: "Power, precision, and coordination are the hallmarks of the Volleyball Titans. Our team demonstrates exceptional athletic ability and sportsmanship.",
      da: "قدرت، دقت و هماهنگی نشانه‌های غول‌های والیبال است. تیم ما توانایی ورزشی استثنایی و ورزشکاری را نشان می‌دهد.",
      pa: "ځواک، دقت او همغږي د والیبال ټیټانانو نښې دي. زموږ ټیم غوره ورزشي وړتیا او سپورټمنشپ ښیي.",
    },
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop",
    coach: {
      id: "coach-najib",
      name: {
        en: "Najibullah Rahimi",
        da: "نجیب‌الله رحیمی",
        pa: "نجیب الله رحیمي",
      },
      photo:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&h=300&fit=crop",
      experience: {
        en: "8 years of volleyball coaching",
        da: "8 سال مربیگری والیبال",
        pa: "8 کاله د والیبال روزنه",
      },
    },
    members: [
      {
        id: "player-8",
        name: { en: "Rahim Habibi", da: "رحیم حبیبی", pa: "رحیم حبیبي" },
        position: { en: "Spiker", da: "اسپایکر", pa: "سپایکر" },
        photo:
          "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&h=300&fit=crop",
        jerseyNumber: 9,
      },
    ],
    achievements: [],
    establishedYear: 2021,
    trainingSchedule: {
      en: "Tuesday, Thursday - 4:30 PM to 6:30 PM",
      da: "سه‌شنبه، پنجشنبه - 4:30 بعد از ظهر تا 6:30 بعد از ظهر",
      pa: "سه شنبه، پنجشنبه - د ماسپښین 4:30 څخه تر 6:30 پورې",
    },
  },
];
