import type { Leadership, TotalAward, AwardType } from "../entities/Award";

// Leadership Team Data
export const leadershipData: Leadership[] = [
  {
    name: "Dr. Ahmed Hassan",
    role: "Principal",
    image: "images/team-1.jpg",
    bio: "With over 25 years of experience in education, Dr. Hassan leads our institution with vision and dedication to excellence.",
  },
  {
    name: "Sarah Williams",
    role: "Vice Principal - Academics",
    image: "images/team-2.jpg",
    bio: "Expert in curriculum development with a passion for innovative teaching methodologies and student success.",
  },
  {
    name: "Michael Johnson",
    role: "Vice Principal - Administration",
    image: "images/team-3.jpg",
    bio: "Specializes in educational management and creating efficient systems that support both staff and students.",
  },
  {
    name: "En. Musawer Hashimi",
    role: "Head of Student Affairs",
    image: "images/team4.jpg",
    bio: "Dedicated to student wellbeing and development, fostering a supportive and inclusive school environment.",
  },
  {
    name: "David Martinez",
    role: "Head of Technology",
    image: "images/team-2.jpg",
    bio: "Leading our digital transformation with cutting-edge educational technology and innovative learning solutions.",
  },
  {
    name: "Lisa Anderson",
    role: "Head of Counseling",
    image: "images/team-1.jpg",
    bio: "Provides comprehensive support services, guiding students through academic and personal challenges.",
  },
];

export const totalaward: TotalAward = {
  International_Awards: 12,
  National_Awards: 20,
  Total_Awards: 32,
  YearsOf_Excellence: 15,
};
export const awardsData: AwardType[] = [
  {
    image: "images/product-2.jpg",
    year: "2024",
    title: "National Excellence Award",
    description:
      "Recognized as one of the top 10 high schools in the nation for outstanding academic performance and student development",
    category: "Academic Excellence",
  },
  {
    image: "images/product-3.jpg",
    year: "2023",
    title: "Innovation in Education",
    description:
      "Awarded for implementing cutting-edge teaching methods and technology that transform student learning experiences",
    category: "Technology & Innovation",
  },
  {
    image: "images/product.jpg",
    year: "2023",
    title: "Best STEM Program",
    description:
      "Excellence in science, technology, engineering, and mathematics education with remarkable student achievements",
    category: "STEM Excellence",
  },
  {
    image: "images/bg-1.jpg",
    year: "2022",
    title: "Academic Achievement",
    description:
      "Highest graduation rate and college acceptance in the region, demonstrating exceptional student success",
    category: "Student Success",
  },
  {
    image: "images/bg-2.jpg",
    year: "2022",
    title: "International Recognition",
    description:
      "Certified for excellence in global education programs fostering international understanding and collaboration",
    category: "Global Education",
  },
  {
    image: "images/bg-4.jpg",
    year: "2021",
    title: "Sports Excellence",
    description:
      "Championship titles in multiple athletic competitions showcasing dedication and team spirit",
    category: "Athletics",
  },
];
