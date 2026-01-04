// export interface Teacher {
//   id: string;
//   name: string;
//   role: string;
//   department: string;
//   subjects: string[];
//   image: string;
//   email: string;
//   phone: string;
//   education: string[];
//   experience: string;
//   specializations: string[];
//   achievements: string[];
//   bio: string;
//   officeHours: string;
//   officeLocation: string;
//   joinedDate: string;
//   linkedin?: string;
//   website?: string;
//   type: "teacher";
// }

// // ============================================
// // FILE: entities/staff.ts
// // ============================================
// export interface Staff {
//   id: string;
//   name: string;
//   role: string;
//   department: string;
//   image: string;
//   email: string;
//   phone: string;
//   experience: string;
//   officeHours: string;
//   officeLocation: string;
//   joinedDate: string;
//   type: "staff";
// }

export type Teacher = {
  id: string;
  name: string;
  role: string;
  image: string;
  type: "teacher";
  department: string;
  email: string;
  experience: string;
  subjects: string[];
};

export type Staff = {
  id: string;
  name: string;
  role: string;
  image: string;
  type: "staff";
  department: string;
  email: string;
  experience: string;
};

export type TeamMember = Teacher | Staff;
