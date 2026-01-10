import type { AcademicPrograms } from "../entities/AcadimicProgram";
import type { ClassSchedules } from "../entities/classtimetable";
import type { SyllabusDownloads } from "../entities/ExamSchedule";

export const academicPrograms: AcademicPrograms = [
  {
    id: 1,
    title: "Science & Technology",
    image: "/images/slide2.jpg",
    description:
      "Comprehensive science education covering Physics, Chemistry, Biology, and Computer Science with hands-on laboratory experience.",
    subjects: ["Physics", "Chemistry", "Biology", "Computer Science"],
    grades: "9-12",
    duration: "4 Years",
    students: 245,
    teachers: 8,
    highlights: [
      "State-of-the-art science laboratories",
      "Annual science fair participation",
      "STEM competitions and robotics club",
      "Partnership with local universities",
    ],
  },
  {
    id: 2,
    title: "Mathematics & Logic",
    image: "/images/slide2.jpg",
    description:
      "Advanced mathematics curriculum from algebra to calculus, fostering analytical thinking and problem-solving skills.",
    subjects: ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"],
    grades: "9-12",
    duration: "4 Years",
    students: 280,
    teachers: 6,
    highlights: [
      "Math olympiad preparation",
      "Problem-solving workshops",
      "Interactive learning tools",
      "Peer tutoring programs",
    ],
  },
  {
    id: 3,
    title: "Languages & Literature",
    image: "/images/slide1.jpg",
    description:
      "Multi-language education including English, Arabic, and Pashto with focus on literature, writing, and communication skills.",
    subjects: ["English", "Arabic", "Pashto", "Literature", "Creative Writing"],
    grades: "9-12",
    duration: "4 Years",
    students: 310,
    teachers: 10,
    highlights: [
      "Bilingual education programs",
      "Writing competitions",
      "Book club and reading circles",
      "Public speaking training",
    ],
  },
  {
    id: 5,
    title: "Languages",
    image: "/images/slide1.jpg",
    description:
      "Multi-language education including English, Arabic, and Pashto with focus on literature, writing, and communication skills.",
    subjects: ["English", "Arabic", "Pashto", "Literature", "Creative Writing"],
    grades: "9-12",
    duration: "4 Years",
    students: 310,
    teachers: 10,
    highlights: [
      "Bilingual education programs",
      "Writing competitions",
      "Book club and reading circles",
      "Public speaking training",
    ],
  },
];

export const classSchedules: ClassSchedules = [
  {
    class: 9,
    time: "08:00 AM - 02:00 PM",
    periods: 6,
    number_of_class: 5,
  },
  {
    class: 10,
    time: "08:00 AM - 02:00 PM",
    periods: 6,
    number_of_class: 5,
  },
  {
    class: 11,
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    number_of_class: "11:30 AM",
  },
  {
    class: 12,
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    number_of_class: "11:30 AM",
  },
];
export const syllabusDownloads: SyllabusDownloads = [
  {
    title: "Grade 9 Syllabus 2024-25",
    description:
      "Comprehensive curriculum guide covering all core subjects for freshman year including Mathematics, Science, English, and Social Studies.",
    size: "2.4 MB",
  },
  {
    title: "Grade 10 Syllabus 2024-25",
    description:
      "Detailed syllabus for sophomore year with enhanced focus on analytical thinking and subject specialization preparation.",
    size: "2.6 MB",
  },
  {
    title: "Grade 11 Syllabus 2024-25",
    description:
      "Junior year academic framework with stream-specific subjects and college preparation modules.",
    size: "2.8 MB",
  },
  {
    title: "Grade 12 Syllabus 2024-25",
    description:
      "Senior year curriculum designed for board exam excellence and higher education readiness.",
    size: "3.1 MB",
  },
  {
    title: "Science Program Guide",
    description:
      "In-depth guide to our Science stream covering Physics, Chemistry, Biology, and Mathematics with lab requirements.",
    size: "1.8 MB",
  },
  {
    title: "Arts Program Guide",
    description:
      "Complete overview of Humanities stream including History, Political Science, Economics, and elective options.",
    size: "1.5 MB",
  },
];
