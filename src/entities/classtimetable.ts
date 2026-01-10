export type ClassSchedule = {
  class: number;
  time: string;
  periods: number;
  number_of_class: number | string; // Can be a number or time string
};

// Type definition for the class schedules array
export type ClassSchedules = ClassSchedule[];

export type Day =
  | "Saturday"
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday";

export interface Period {
  id: number;
  start: string;
  end: string;
}

export interface TimetableCell {
  day: Day;
  period: number;
  subject: string;
  teacher: string;
}

export interface ClassTimetable {
  id: number;
  sub_id: string;
  periods: Period[];
  subjects: Record<string, string>; // e.g., { "math": "ریاضی", "english": "انگلیسی" }
  timetable: TimetableCell[];
}
