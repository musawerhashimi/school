// export type TeamMember = Teacher | Staff;

import type { Staff, Teacher } from "../entities/teachers";

// // ============================================
// // FILE: data/teachersData.ts
// // ============================================
// import type { Staff, Teacher } from "../entities/teachers";

// export const mockTeachers: Teacher[] = [
//   {
//     id: "1",
//     name: "Dr. Sarah Johnson",
//     role: "Head of Science Department",
//     department: "Science",
//     subjects: ["Physics", "Advanced Physics"],
//     image:
//       "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
//     email: "sarah.johnson@sultanzoy.edu",
//     phone: "+1 (555) 123-4567",
//     education: [
//       "Ph.D. in Physics - MIT",
//       "M.Sc. in Applied Physics - Stanford",
//     ],
//     experience: "15 years",
//     specializations: [
//       "Quantum Mechanics",
//       "Thermodynamics",
//       "Research Methodology",
//     ],
//     achievements: [
//       "Published 25+ research papers in peer-reviewed journals",
//       "National Science Teacher Award 2022",
//       "Developed innovative physics curriculum adopted by 50+ schools",
//     ],
//     bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
//     officeHours: "Mon-Fri, 2:00 PM - 4:00 PM",
//     officeLocation: "Science Block, Room 201",
//     joinedDate: "2015",
//     linkedin: "https://linkedin.com",
//     website: "https://example.com",
//     type: "teacher",
//   },
//   {
//     id: "2",
//     name: "Mr. Ahmed Hassan",
//     role: "Mathematics Teacher",
//     department: "Mathematics",
//     subjects: ["Algebra", "Calculus", "Statistics"],
//     image:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
//     email: "ahmed.hassan@sultanzoy.edu",
//     phone: "+1 (555) 234-5678",
//     education: [
//       "M.Sc. in Mathematics - Oxford University",
//       "B.Sc. in Mathematics - Cairo University",
//     ],
//     experience: "12 years",
//     specializations: [
//       "Advanced Calculus",
//       "Mathematical Modeling",
//       "Problem Solving",
//     ],
//     achievements: [
//       "Coach of winning Math Olympiad team 2023",
//       "98% student pass rate in advanced mathematics",
//       'Author of "Mathematics Made Easy" textbook',
//     ],
//     bio: "Mr. Hassan brings enthusiasm and clarity to mathematics education. His innovative teaching methods have helped countless students overcome their fear of math.",
//     officeHours: "Mon, Wed, Fri, 3:00 PM - 5:00 PM",
//     officeLocation: "Mathematics Wing, Room 105",
//     joinedDate: "2018",
//     type: "teacher",
//   },
//   {
//     id: "3",
//     name: "Ms. Emily Chen",
//     role: "English Literature Teacher",
//     department: "Languages",
//     subjects: ["English Literature", "Creative Writing"],
//     image:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
//     email: "emily.chen@sultanzoy.edu",
//     phone: "+1 (555) 345-6789",
//     education: [
//       "M.A. in English Literature - Harvard",
//       "B.A. in English - Yale",
//     ],
//     experience: "10 years",
//     specializations: [
//       "Contemporary Literature",
//       "Poetry Analysis",
//       "Academic Writing",
//     ],
//     achievements: [
//       "Students published in 15+ literary magazines",
//       "Organized annual school literary festival",
//       "Regional Poetry Competition judge",
//     ],
//     bio: "Ms. Chen inspires students to discover the power of words and storytelling. Her classes are known for fostering creativity and critical thinking.",
//     officeHours: "Tue, Thu, 1:00 PM - 3:00 PM",
//     officeLocation: "Language Arts Building, Room 304",
//     joinedDate: "2019",
//     type: "teacher",
//   },
//   {
//     id: "4",
//     name: "Dr. Michael Roberts",
//     role: "Chemistry Teacher",
//     department: "Science",
//     subjects: ["Chemistry", "Organic Chemistry"],
//     image:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
//     email: "michael.roberts@sultanzoy.edu",
//     phone: "+1 (555) 456-7890",
//     education: [
//       "Ph.D. in Chemistry - Cambridge",
//       "M.Sc. in Organic Chemistry - Oxford",
//     ],
//     experience: "18 years",
//     specializations: [
//       "Organic Synthesis",
//       "Laboratory Safety",
//       "Research Methods",
//     ],
//     achievements: [
//       "Established state-of-the-art chemistry lab",
//       "International Chemistry Educator Award 2021",
//       "30+ students pursued chemistry in university",
//     ],
//     bio: "Dr. Roberts combines theoretical knowledge with practical applications, making chemistry come alive in the laboratory.",
//     officeHours: "Mon-Thu, 2:30 PM - 4:30 PM",
//     officeLocation: "Science Block, Room 215",
//     joinedDate: "2012",
//     type: "teacher",
//   },
//   {
//     id: "5",
//     name: "Ms. Fatima Al-Rashid",
//     role: "Computer Science Teacher",
//     department: "Technology",
//     subjects: ["Programming", "Web Development", "Data Structures"],
//     image:
//       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
//     email: "fatima.alrashid@sultanzoy.edu",
//     phone: "+1 (555) 567-8901",
//     education: [
//       "M.Sc. in Computer Science - Stanford",
//       "B.Sc. in Software Engineering - MIT",
//     ],
//     experience: "8 years",
//     specializations: ["Python Programming", "AI/ML", "Full-Stack Development"],
//     achievements: [
//       "Students won 3 national coding competitions",
//       "Launched school coding club with 100+ members",
//       "Developed educational programming platform",
//     ],
//     bio: "Ms. Al-Rashid prepares students for the digital future with cutting-edge programming skills and computational thinking.",
//     officeHours: "Tue-Fri, 3:00 PM - 5:00 PM",
//     officeLocation: "Technology Center, Room 401",
//     joinedDate: "2020",
//     linkedin: "https://linkedin.com",
//     type: "teacher",
//   },
//   {
//     id: "6",
//     name: "Mr. David Martinez",
//     role: "History Teacher",
//     department: "Social Studies",
//     subjects: ["World History", "Modern History"],
//     image:
//       "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
//     email: "david.martinez@sultanzoy.edu",
//     phone: "+1 (555) 678-9012",
//     education: ["M.A. in History - Princeton", "B.A. in History - UCLA"],
//     experience: "14 years",
//     specializations: [
//       "Medieval History",
//       "Cultural Studies",
//       "Historical Research",
//     ],
//     achievements: [
//       "Organized 20+ educational historical field trips",
//       'Published "Understanding Modern History" book',
//       "History Department Excellence Award 2023",
//     ],
//     bio: "Mr. Martinez brings history to life through engaging storytelling and interactive learning experiences.",
//     officeHours: "Mon, Wed, Fri, 1:30 PM - 3:30 PM",
//     officeLocation: "Social Studies Wing, Room 202",
//     joinedDate: "2016",
//     type: "teacher",
//   },
// ];

// export const mockStaff: Staff[] = [
//   {
//     id: "s1",
//     name: "John Smith",
//     role: "IT Administrator",
//     department: "IT Support",
//     image:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
//     email: "john.smith@sultanzoy.edu",
//     phone: "+1 (555) 111-2222",
//     experience: "10 years",
//     officeHours: "Mon-Fri, 9:00 AM - 5:00 PM",
//     officeLocation: "IT Department, Room 101",
//     joinedDate: "2017",
//     type: "staff",
//   },
//   {
//     id: "s2",
//     name: "Maria Garcia",
//     role: "Administrative Officer",
//     department: "Administration",
//     image:
//       "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
//     email: "maria.garcia@sultanzoy.edu",
//     phone: "+1 (555) 222-3333",
//     experience: "8 years",
//     officeHours: "Mon-Fri, 8:00 AM - 4:00 PM",
//     officeLocation: "Admin Building, Room 205",
//     joinedDate: "2019",
//     type: "staff",
//   },
//   {
//     id: "s3",
//     name: "Robert Lee",
//     role: "Facilities Manager",
//     department: "Maintenance",
//     image:
//       "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
//     email: "robert.lee@sultanzoy.edu",
//     phone: "+1 (555) 333-4444",
//     experience: "12 years",
//     officeHours: "Mon-Fri, 7:00 AM - 3:00 PM",
//     officeLocation: "Facilities Office",
//     joinedDate: "2015",
//     type: "staff",
//   },
//   {
//     id: "s4",
//     name: "Lisa Brown",
//     role: "Library Coordinator",
//     department: "Library Services",
//     image:
//       "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
//     email: "lisa.brown@sultanzoy.edu",
//     phone: "+1 (555) 444-5555",
//     experience: "6 years",
//     officeHours: "Mon-Fri, 8:00 AM - 6:00 PM",
//     officeLocation: "Main Library",
//     joinedDate: "2021",
//     type: "staff",
//   },
//   {
//     id: "s5",
//     name: "James Wilson",
//     role: "Finance Officer",
//     department: "Administration",
//     image:
//       "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
//     email: "james.wilson@sultanzoy.edu",
//     phone: "+1 (555) 555-6666",
//     experience: "9 years",
//     officeHours: "Mon-Fri, 9:00 AM - 5:00 PM",
//     officeLocation: "Admin Building, Room 302",
//     joinedDate: "2018",
//     type: "staff",
//   },

// ];

// Mock data
export const mockTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Head of Science Department",
    department: "Science",
    subjects: ["Physics", "Advanced Physics"],
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    email: "sarah.johnson@sultanzoy.edu",
    experience: "15 years",
    type: "teacher",
  },
  {
    id: "2",
    name: "Mr. Ahmed Hassan",
    role: "Mathematics Teacher",
    department: "Mathematics",
    subjects: ["Algebra", "Calculus", "Statistics"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    email: "ahmed.hassan@sultanzoy.edu",
    experience: "12 years",
    type: "teacher",
  },
  {
    id: "3",
    name: "Ms. Emily Chen",
    role: "English Literature Teacher",
    department: "Languages",
    subjects: ["English Literature", "Creative Writing"],
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    email: "emily.chen@sultanzoy.edu",
    experience: "10 years",
    type: "teacher",
  },
];

export const mockStaff: Staff[] = [
  {
    id: "s1",
    name: "John Smith",
    role: "IT Administrator",
    department: "IT Support",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    email: "john.smith@sultanzoy.edu",
    experience: "10 years",
    type: "staff",
  },
  {
    id: "s2",
    name: "Maria Garcia",
    role: "Administrative Officer",
    department: "Administration",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    email: "maria.garcia@sultanzoy.edu",
    experience: "8 years",
    type: "staff",
  },
];
