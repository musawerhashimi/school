export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}
export interface Teacher {
  id: number;
  name: MultiLangText;
}
export interface Subject {
  id: number;
  name: MultiLangText;
}

export interface ClassSchedule {
  class: number;
  time: string;
  periods: number;
  number_of_class: number;
}

export interface Day {
  id: number;
  name: MultiLangText;
}

export interface Period {
  id: number;
  start: string;
  end: string;
}

export interface TimetableCell {
  day: Day;
  period: number;
  subject: Subject;
  teacher: Teacher;
  location: string;
}

export interface ClassTimetable {
  class_id: number;
  sub_id: string;
  periods: Period[];
  subjects: Subject[];
  timetable: TimetableCell[];
}
