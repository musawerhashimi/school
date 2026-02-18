import type { AcademicProgram } from "@/entities/AcadimicProgram";
import type { Resourceies } from "../entities/ExamSchedule";

export const academicPrograms: AcademicProgram[] = [
  {
    id: 1,
    title: {
      en: "Computer Science Program",
      da: "برنامه علوم کمپیوتر",
      pa: "د کمپیوټر ساينس پروګرام",
    },
    image: "/images/programs/computer-science.jpg",
    description: {
      en: "A comprehensive program focused on programming, software development, and modern technologies.",
      da: "یک برنامه جامع متمرکز بر برنامه‌نویسی، توسعه نرم‌افزار و تکنالوژی‌های مدرن.",
      pa: "يو بشپړ پروګرام چې په پروګرامنګ، سافټویر جوړولو او عصري ټکنالوژیو تمرکز لري.",
    },
    subjects: [
      {
        en: "Programming Fundamentals",
        da: "مبانی برنامه‌نویسی",
        pa: "د پروګرامنګ اساسات",
      },
      {
        en: "Database Systems",
        da: "سیستم‌های دیتابیس",
        pa: "د ډیټابیس سیسټمونه",
      },
      {
        en: "Web Development",
        da: "توسعه وب",
        pa: "وېب پراختیا",
      },
    ],
    grades: "10 - 12",
    duration: "3 Years",
    students: 180,
    teachers: 12,
    highlights: [
      {
        en: "Modern Computer Labs",
        da: "لابراتوارهای مدرن کمپیوتر",
        pa: "عصري کمپیوټر لابراتوارونه",
      },
      {
        en: "Project-Based Learning",
        da: "یادگیری مبتنی بر پروژه",
        pa: "د پروژې پر بنسټ زده کړه",
      },
      {
        en: "Industry-Oriented Curriculum",
        da: "نصاب مطابق بازار کار",
        pa: "د بازار مطابق نصاب",
      },
    ],
  },

  {
    id: 2,
    title: {
      en: "Science Program",
      da: "برنامه علوم طبیعی",
      pa: "د طبيعي علومو پروګرام",
    },
    image: "/images/programs/science.jpg",
    description: {
      en: "Designed for students interested in physics, chemistry, and biology with strong laboratory practice.",
      da: "طراحی شده برای شاگردانی که علاقه‌مند به فیزیک، کیمیا و بیولوژی با تمرینات لابراتواری هستند.",
      pa: "د هغو زده کوونکو لپاره چې په فزیک، کیمیا او بیولوژي کې علاقه لري او عملي لابراتوارونه لري.",
    },
    subjects: [
      {
        en: "Physics",
        da: "فیزیک",
        pa: "فزیک",
      },
      {
        en: "Chemistry",
        da: "کیمیا",
        pa: "کیمیا",
      },
      {
        en: "Biology",
        da: "بیولوژی",
        pa: "بیولوژي",
      },
    ],
    grades: "7 - 12",
    duration: "6 Years",
    students: 240,
    teachers: 18,
    highlights: [
      {
        en: "Advanced Science Labs",
        da: "لابراتوارهای پیشرفته علوم",
        pa: "پرمختللي ساينسي لابراتوارونه",
      },
      {
        en: "Research Projects",
        da: "پروژه‌های تحقیقاتی",
        pa: "تحقیقي پروژې",
      },
      {
        en: "Experienced Faculty",
        da: "استادان با تجربه",
        pa: "تجربه لرونکي استادان",
      },
    ],
  },

  {
    id: 3,
    title: {
      en: "Business & Economics Program",
      da: "برنامه تجارت و اقتصاد",
      pa: "د سوداګرۍ او اقتصاد پروګرام",
    },
    image: "/images/programs/business.jpg",
    description: {
      en: "Prepares students for careers in business management, accounting, and entrepreneurship.",
      da: "شاگردان را برای حرفه در مدیریت تجارت، حسابداری و کارآفرینی آماده می‌سازد.",
      pa: "زده کوونکي د سوداګرۍ مدیریت، حسابدارۍ او متشبثتوب لپاره چمتو کوي.",
    },
    subjects: [
      {
        en: "Accounting",
        da: "حسابداری",
        pa: "حسابداري",
      },
      {
        en: "Economics",
        da: "اقتصاد",
        pa: "اقتصاد",
      },
      {
        en: "Business Management",
        da: "مدیریت تجارت",
        pa: "د سوداګرۍ مدیریت",
      },
    ],
    grades: "10 - 12",
    duration: "3 Years",
    students: 150,
    teachers: 10,
    highlights: [
      {
        en: "Entrepreneurship Training",
        da: "آموزش کارآفرینی",
        pa: "د متشبثتوب روزنه",
      },
      {
        en: "Practical Accounting Workshops",
        da: "کارگاه‌های عملی حسابداری",
        pa: "عملي حسابدارۍ ورکشاپونه",
      },
      {
        en: "Business Simulation Activities",
        da: "فعالیت‌های شبیه‌سازی تجارت",
        pa: "د سوداګرۍ عملي تمرینونه",
      },
    ],
  },
];

export const resouces: Resourceies[] = [
  {
    title: {
      en: "Grade 9 Syllabus 2024-25",
      da: "نصاب کلاس 9 سال 2024-25",
      pa: "د 9 ټولګي نصاب 2024-25",
    },
    description: {
      en: "Comprehensive curriculum guide covering all core subjects for freshman year including Mathematics, Science, English, and Social Studies.",
      da: "راهنمای جامع نصاب پوشش داده شده تمام موضوعات اصلی برای سال اول دانشجویی شامل ریاضی، علوم، انگلیسی و مطالعات اجتماعی.",
      pa: "د ټولو اصلي مضامین لپاره چمتو شوی نصاب چې د لومړي کال زده کوونکي لپاره شامل د ریاضي، علوم، انګلیسي او اجتماعي مطالعات دي.",
    },
    file: "/syllabus/grade-9-syllabus-2024-25.pdf",
  },
];
