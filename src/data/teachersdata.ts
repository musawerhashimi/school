import type { Staff, Teacher } from "../entities/teachers";

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
    phone: "+1 (555) 444-5555",
    joinedDate: "2018",
    education: [
      "M.Sc. in Computer Science - Stanford",
      "B.Sc. in Software Engineering - MIT",
    ],
    bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
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
    phone: "+1 (555) 444-5555",
    joinedDate: "2018",
    education: [
      "M.Sc. in Computer Science - Stanford",
      "B.Sc. in Software Engineering - MIT",
    ],
    bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
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
    phone: "+1 (555) 444-5555",
    joinedDate: "2018",
    education: [
      "M.Sc. in Computer Science - Stanford",
      "B.Sc. in Software Engineering - MIT",
    ],
    bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
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
    phone: "+1 (555) 444-5555",
    joinedDate: "2018",
    bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
    education: [
      "M.Sc. in Computer Science - Stanford",
      "B.Sc. in Software Engineering - MIT",
    ],
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
    phone: "+1 (555) 444-5555",
    joinedDate: "2018",
    education: [
      "M.Sc. in Computer Science - Stanford",
      "B.Sc. in Software Engineering - MIT",
    ],
    bio: "Dr. Johnson is a passionate educator with over 15 years of experience in teaching physics. She believes in making complex concepts accessible through hands-on experiments and real-world applications.",
  },
];
