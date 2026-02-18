import type {
  ClassSchedule,
  ClassTimetable,
  Day,
  Period,
  Subject,
  Teacher,
} from "../entities/classtimetable";

export const classSchedules: ClassSchedule[] = [
  {
    class: 9,
    time: "08:00 AM - 02:00 PM",
    periods: 6,
    number_of_class: 5,
  },
  {
    class: 10,
    time: "08:00 AM - 02:00 PM",
    periods: 6,
    number_of_class: 5,
  },
  {
    class: 11,
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    number_of_class: 6,
  },
  {
    class: 12,
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    number_of_class: 6,
  },
];

export const days: Day[] = [
  {
    id: 1,
    name: { en: "Saturday", da: "شنبه", pa: "شنبه" },
  },
  {
    id: 2,
    name: { en: "Sunday", da: "یکشنبه", pa: "يکشنبه" },
  },
  {
    id: 3,
    name: { en: "Monday", da: "دوشنبه", pa: "دوشنبه" },
  },
  {
    id: 4,
    name: { en: "Tuesday", da: "سه‌شنبه", pa: "سه شنبه" },
  },
  {
    id: 5,
    name: { en: "Wednesday", da: "چهارشنبه", pa: "چهارشنبه" },
  },
   {
    id: 5,
    name: { en: "Thursday", da: "پنجشنبه", pa: "پنجشنبه" },
  },
];

export const teachers: Teacher[] = [
  {
    id: 1,
    name: { en: "Ahmad Rahimi", da: "احمد رحیمی", pa: "احمد رحيمي" },
  },
  {
    id: 2,
    name: { en: "Fatima Noori", da: "فاطمه نوری", pa: "فاطمه نوري" },
  },
  {
    id: 3,
    name: { en: "Zahir Khan", da: "ظاهر خان", pa: "ظاهر خان" },
  },
];

export const subjects: Subject[] = [
  {
    id: 1,
    name: { en: "Mathematics", da: "ریاضی", pa: "رياضيات" },
  },
  {
    id: 2,
    name: { en: "Physics", da: "فیزیک", pa: "فزيک" },
  },
  {
    id: 3,
    name: { en: "Computer Science", da: "علوم کمپیوتر", pa: "د کمپيوټر ساينس" },
  },
];

export const periods: Period[] = [
  { id: 1, start: "08:00", end: "08:45" },
  { id: 2, start: "08:50", end: "09:35" },
  { id: 3, start: "09:40", end: "10:25" },
  { id: 4, start: "10:30", end: "11:15" },
  { id: 5, start: "10:40", end: "11:30" },
  { id: 6, start: "11:35", end: "12:20" },
];

export const classTimetable: ClassTimetable[] = [
  {
    class_id: 9,
    sub_id: "2",
    periods: periods,
    subjects: subjects,
    timetable: [
      {
        day: days[0],
        period: 1,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
      {
        day: days[0],
        period: 2,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[0],
        period: 3,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[0],
        period: 4,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[0],
        period: 5,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[0],
        period: 6,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[1],
        period: 1,
        subject: subjects[2],
        teacher: teachers[1],
        location: "Computer Lab",
      },
      {
        day: days[2],
        period: 3,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
    ],
  },
  {
    class_id: 10,
    sub_id: "1",
    periods: periods,
    subjects: subjects,
    timetable: [
      {
        day: days[0],
        period: 1,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
      {
        day: days[0],
        period: 2,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[1],
        period: 1,
        subject: subjects[2],
        teacher: teachers[1],
        location: "Computer Lab",
      },
      {
        day: days[2],
        period: 3,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
    ],
  },
  {
    class_id: 9,
    sub_id: "1",
    periods: periods,
    subjects: subjects,
    timetable: [
      {
        day: days[0],
        period: 1,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
      {
        day: days[0],
        period: 2,
        subject: subjects[1],
        teacher: teachers[2],
        location: "Physics Lab",
      },
      {
        day: days[1],
        period: 1,
        subject: subjects[2],
        teacher: teachers[1],
        location: "Computer Lab",
      },
      {
        day: days[2],
        period: 3,
        subject: subjects[0],
        teacher: teachers[0],
        location: "Room 101",
      },
    ],
  },
];
