import type {
  ProjectCategory,
  StudentProject,
} from "../entities/StudentProject";

export const projectCategories: ProjectCategory[] = [
  {
    id: "science",
    name: "Science & Technology",
  },
  {
    id: "arts",
    name: "Arts & Literature",
  },
  {
    id: "mathematics",
    name: "Mathematics",
  },
  {
    id: "engineering",
    name: "Engineering",
  },
  {
    id: "social",
    name: "Social Studies",
  },
  {
    id: "environment",
    name: "Environmental Studies",
  },
];

export const studentProjects: StudentProject[] = [
  {
    id: "1",
    title: "Solar Powered Water Purification System",
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
    category: "science",
    grade: "Grade 12",
    description:
      "This innovative project demonstrates a sustainable solution for water purification using solar energy. The system uses photovoltaic panels to power a multi-stage filtration process, making clean water accessible in remote areas.",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    ],
    date: "2024-12-15",

    awards: ["First Place - National Science Fair", "Innovation Award"],
  },
  {
    id: "2",
    title: "Traditional Afghan Calligraphy Collection",
    students: [
      {
        id: "s3",
        name: "Zahra Ahmadi",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
      },
    ],
    category: "arts",
    grade: "Grade 11",
    description:
      "A beautiful collection of traditional Afghan calligraphy pieces showcasing the rich cultural heritage of Afghanistan. Each piece tells a story through intricate designs and meaningful verses.",
    images: [
      "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=800",
      "https://images.unsplash.com/photo-1516641051054-9df6a1aad654?w=800",
    ],
    date: "2024-11-20",
  },
  {
    id: "3",
    title: "Mathematical Modeling of Population Growth",
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
    category: "mathematics",
    grade: "Grade 11",
    description:
      "An advanced mathematical model analyzing population growth patterns in Kabul over the past decade. The project uses differential equations and statistical analysis to predict future trends.",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    ],
    date: "2024-10-05",
  },
  {
    id: "4",
    title: "Automated Greenhouse System",
    students: [
      {
        id: "s7",
        name: "Bilal Nazari",
        grade: "Grade 12",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bilal",
      },
    ],
    category: "engineering",
    grade: "Grade 12",
    description:
      "An Arduino-based automated greenhouse system that monitors and controls temperature, humidity, and soil moisture. The system optimizes plant growth while conserving water and energy.",
    images: [
      "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800",
      "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800",
    ],
    date: "2024-09-18",
    awards: ["Best Engineering Project"],
  },
  {
    id: "5",
    title: "The Impact of Social Media on Youth Culture",
    students: [
      {
        id: "s8",
        name: "Mariam Barakzai",
        grade: "Grade 10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariam",
      },
      {
        id: "s9",
        name: "Sana Hashimi",
        grade: "Grade 10",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sana",
      },
    ],
    category: "social",
    grade: "Grade 10",
    description:
      "A comprehensive research study examining the effects of social media on youth culture in Afghanistan, including surveys, interviews, and data analysis from over 200 participants.",
    images: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
      "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800",
    ],
    date: "2024-08-22",
  },
  {
    id: "6",
    title: "Urban Tree Planting Initiative",
    students: [
      {
        id: "s10",
        name: "Hamid Azizi",
        grade: "Grade 9",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hamid",
      },
    ],
    category: "environment",
    grade: "Grade 9",
    description:
      "A community-based environmental project documenting the planning and execution of planting 500 trees across Kabul. Includes environmental impact assessment and long-term monitoring plan.",
    images: [
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800",
    ],
    date: "2024-07-10",
  },
  {
    id: "7",
    title: "Robotics Competition Winner - Line Following Robot",
    students: [
      {
        id: "s11",
        name: "Jawid Rahimi",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jawid",
      },
      {
        id: "s12",
        name: "Tamim Safi",
        grade: "Grade 11",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tamim",
      },
    ],
    category: "engineering",
    grade: "Grade 11",
    description:
      "An advanced line-following robot built for the National Robotics Competition. Features PID control algorithm, obstacle detection, and autonomous navigation capabilities.",
    images: [
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      "https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800",
    ],
    date: "2023-12-03",

    awards: ["National Robotics Competition - 1st Place"],
  },
  {
    id: "8",
    title: "Historical Documentary - Ancient Silk Road",
    students: [
      {
        id: "s13",
        name: "Lailuma Wali",
        grade: "Grade 12",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lailuma",
      },
    ],
    category: "social",
    grade: "Grade 12",
    description:
      "A 30-minute documentary exploring Afghanistan's role in the ancient Silk Road trade route. Features interviews with historians, archaeological evidence, and historical recreations.",
    images: [
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800",
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    ],
    date: "2023-11-15",
  },
];

export const availableYears = [2024, 2023, 2022, 2021];

export const availableGrades = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
