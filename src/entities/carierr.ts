// Types
export interface JobPosting {
  id: string;
  title: { en: string; da: string; pa: string };
  department_id: number;
  type: "Full-time" | "Part-time" | "Contract";
  location: string;
  salary: string;
  postedDate: string;
  deadline: string;
  description: { en: string; da: string; pa: string };
  requirements: { en: string; da: string; pa: string };
  gender: "Male" | "Female";
  number_of_job: number;
}

export interface DepartmentJob {
  id: number;
  name: { en: string; da: string; pa: string };
}
