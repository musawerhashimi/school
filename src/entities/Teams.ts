export type TeamMember = Teacher | Staff;

export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface Department {
  id: number;
  name: MultiLangText;
}

type BaseMember = {
  id: number;
  name: string;
  role: MultiLangText;
  image: string;
  department_id: number;
  email: string;
  experience: MultiLangText;
  phone: string;
  joinedDate: string;
  bio: MultiLangText;
  education: MultiLangText[];
};

export type Teacher = BaseMember & {
  type: "teacher";
  subjects: string[];
};

export type Staff = BaseMember & {
  type: "staff";
};
