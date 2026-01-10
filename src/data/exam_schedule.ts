import type { ExamSchedule } from "../entities/ExamSchedule";

// Usage example:
export const examSchedule: ExamSchedule = [
  {
    exam_title: "First Term Exam",
    start_date: "November 15, 2024",
    end_date: "November 25, 2024",
    duration: "10 Days",
    exam_description:
      "Comprehensive assessment covering all subjects from the first term curriculum. This exam evaluates students' understanding of core concepts taught during September to November.",
  },
  {
    exam_title: "Mid-Year Exam",
    start_date: "February 10, 2025",
    end_date: "February 20, 2025",
    duration: "10 Days",
    exam_description:
      "Mid-year evaluation testing knowledge acquired in the first half of the academic year. Includes both theoretical and analytical questions across all subjects.",
  },
  {
    exam_title: "Final Exam",
    start_date: "June 5, 2025",
    end_date: "June 20, 2025",
    duration: "15 Days",
    exam_description:
      "Comprehensive final examination covering the entire academic year syllabus. This is the most important exam determining annual performance and grade promotion.",
  },
  {
    exam_title: "Practical Exams",
    start_date: "May 25, 2025",
    end_date: "May 30, 2025",
    duration: "5 Days",
    exam_description:
      "Hands-on practical assessments for Science and Arts subjects. Students will demonstrate their practical skills and laboratory techniques learned throughout the year.",
  },
];
