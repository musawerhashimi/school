import type {
  Achievement,
  AwardCategories,
  Stat,
} from "../entities/AwardAchivement";

export const awardCategories: AwardCategories[] = [
  {
    id: 1,
    name: {
      en: "Academic Excellence",
      da: "برتری علمی",
      pa: "علمي برتري",
    },
  },
  {
    id: 2,
    name: {
      en: "Science & Innovation",
      da: "ساینس و نوآوری",
      pa: "ساینس او نوښت",
    },
  },
  {
    id: 3,
    name: {
      en: "Community Service",
      da: "خدمات اجتماعی",
      pa: "ټولنیز خدمتونه",
    },
  },
  {
    id: 4,
    name: {
      en: "Sports Achievement",
      da: "دست‌آورد ورزشی",
      pa: "ورزشي لاسته راوړنه",
    },
  },
  {
    id: 5,
    name: {
      en: "Leadership",
      da: "رهبری",
      pa: "رهبري",
    },
  },
  {
    id: 6,
    name: {
      en: "Top Student",
      da: "شاگرد ممتاز",
      pa: "ممتاز زده‌کوونکی",
    },
  },
  {
    id: 7,
    name: {
      en: "Science Champion",
      da: "قهرمان علوم",
      pa: "د ساینس اتل",
    },
  },
  {
    id: 8,
    name: {
      en: "Language Excellence",
      da: "برتری زبانی",
      pa: "د ژبې برتري",
    },
  },
  {
    id: 9,
    name: {
      en: "Young Innovator",
      da: "نوآور جوان",
      pa: "ځوان نوښتګر",
    },
  },
  {
    id: 10,
    name: {
      en: "Volunteer Service",
      da: "خدمات داوطلبانه",
      pa: "رضاکارانه خدمتونه",
    },
  },
];

export const achievements: Achievement[] = [
  {
    id: 1,
    title: {
      en: "Best School of the Year",
      da: "بهترین مکتب سال",
      pa: "د کال غوره ښوونځی",
    },
    description: {
      en: "Awarded for outstanding academic excellence and leadership.",
      da: "به دلیل برتری آموزشی و رهبری مؤثر اعطا شد.",
      pa: "د غوره تعلیمي فعالیت او رهبرۍ له امله ورکړل شو.",
    },
    category_id: 1,
    date: "2024-05-10",
    image: "/images/awards/school1.jpg",
    recipient: "Kabul International School",
    typel: "School",
  },
  {
    id: 2,
    title: {
      en: "Top Science School",
      da: "برترین مکتب علوم",
      pa: "د ساینس غوره ښوونځی",
    },
    description: {
      en: "Recognized for excellence in science education and innovation.",
      da: "به خاطر برتری در آموزش علوم و نوآوری تقدیر شد.",
      pa: "د ساینس زده‌کړو او نوښت کې د غوره والي له امله وستایل شو.",
    },
    category_id: 2,
    date: "2024-06-15",
    image: "/images/awards/school2.jpg",
    recipient: "Herat Model School",
    typel: "School",
  },
  {
    id: 3,
    title: {
      en: "Best Community Service School",
      da: "بهترین مکتب خدمات اجتماعی",
      pa: "د ټولنیزو خدمتونو غوره ښوونځی",
    },
    description: {
      en: "Awarded for impactful community development programs.",
      da: "به دلیل برنامه‌های مؤثر رشد اجتماعی اعطا شد.",
      pa: "د اغېزمنو ټولنیزو پرمختیایي پروګرامونو له امله ورکړل شو.",
    },
    category_id: 3,
    date: "2024-03-20",
    image: "/images/awards/school3.jpg",
    recipient: "Balkh Future School",
    typel: "School",
  },
  {
    id: 4,
    title: {
      en: "Best Sports School",
      da: "بهترین مکتب ورزشی",
      pa: "د سپورت غوره ښوونځی",
    },
    description: {
      en: "Recognized for outstanding performance in national sports events.",
      da: "به خاطر عملکرد عالی در مسابقات ورزشی ملی تقدیر شد.",
      pa: "په ملي سپورتي سیالیو کې د غوره فعالیت له امله وستایل شو.",
    },
    category_id: 4,
    date: "2024-07-05",
    image: "/images/awards/school4.jpg",
    recipient: "Nangarhar Elite School",
    typel: "School",
  },
  {
    id: 5,
    title: {
      en: "Best Innovation School",
      da: "بهترین مکتب نوآوری",
      pa: "د نوښت غوره ښوونځی",
    },
    description: {
      en: "Awarded for innovative teaching methods and digital learning.",
      da: "به دلیل روش‌های نوآورانه تدریس و آموزش دیجیتال اعطا شد.",
      pa: "د نوښتګرو تدریسي لارو او ډیجیټلي زده‌کړو له امله ورکړل شو.",
    },
    category_id: 5,
    date: "2024-08-01",
    image: "/images/awards/school5.jpg",
    recipient: "Kandahar Bright Future School",
    typel: "School",
  },

  // ----------- STUDENT (5) -----------
  {
    id: 6,
    title: {
      en: "Top Mathematics Student",
      da: "شاگرد ممتاز ریاضی",
      pa: "د ریاضي ممتاز زده‌کوونکی",
    },
    description: {
      en: "Awarded for achieving the highest score in math competitions.",
      da: "به دلیل کسب بالاترین نمره در مسابقات ریاضی اعطا شد.",
      pa: "په سیالیو کې د لوړې نمرې اخیستلو له امله ورکړل شو.",
    },
    category_id: 6,
    date: "2024-04-12",
    image: "/images/awards/student1.jpg",
    recipient: "Ahmad Rahimi",
    typel: "Student",
  },
  {
    id: 7,
    title: {
      en: "Outstanding Science Student",
      da: "شاگرد ممتاز علوم",
      pa: "د ساینس ممتاز زده‌کوونکی",
    },
    description: {
      en: "Recognized for innovative science projects and experiments.",
      da: "به خاطر پروژه‌های نوآورانه علمی تقدیر شد.",
      pa: "د نوښتګرو ساینسي پروژو له امله وستایل شو.",
    },
    category_id: 7,
    date: "2024-05-25",
    image: "/images/awards/student2.jpg",
    recipient: "Fatima Noor",
    typel: "Student",
  },
  {
    id: 8,
    title: {
      en: "Best English Speaker",
      da: "بهترین سخنران انگلیسی",
      pa: "د انګلیسي ژبې غوره ویناوال",
    },
    description: {
      en: "Awarded for excellence in public speaking competitions.",
      da: "به دلیل برتری در مسابقات سخنرانی اعطا شد.",
      pa: "د عامه وینا سیالیو کې د غوره والي له امله ورکړل شو.",
    },
    category_id: 8,
    date: "2024-06-30",
    image: "/images/awards/student3.jpg",
    recipient: "Mohammad Ali",
    typel: "Student",
  },
  {
    id: 9,
    title: {
      en: "Young Innovator Award",
      da: "جایزه نوآور جوان",
      pa: "د ځوان نوښتګر جایزه",
    },
    description: {
      en: "Recognized for developing a school management application.",
      da: "به خاطر ساخت اپلیکیشن مدیریت مکتب تقدیر شد.",
      pa: "د ښوونځي د مدیریت اپ جوړولو له امله وستایل شو.",
    },
    category_id: 9,
    date: "2024-07-20",
    image: "/images/awards/student4.jpg",
    recipient: "Zahra Safi",
    typel: "Student",
  },
  {
    id: 10,
    title: {
      en: "Best Volunteer Student",
      da: "بهترین شاگرد داوطلب",
      pa: "د رضاکارۍ غوره زده‌کوونکی",
    },
    description: {
      en: "Awarded for outstanding volunteer service in the community.",
      da: "به دلیل خدمات برجسته داوطلبانه در جامعه اعطا شد.",
      pa: "په ټولنه کې د غوره رضاکارانه خدمتونو له امله ورکړل شو.",
    },
    category_id: 10,
    date: "2024-09-02",
    image: "/images/awards/student5.jpg",
    recipient: "Omidullah Haidari",
    typel: "Student",
  },
];

export const stats: Stat = {
  TotalAwards: 120,
  InternationalAwards: 35,
  StudentAchievers: 68,
  NationalAwards: 85,
};
