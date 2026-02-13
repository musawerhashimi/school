import type { RouteObject } from "react-router-dom";

// Layout
import { MISLayout } from "@mis-components/index";

// Dashboard
import { Dashboard } from "@mis-dashboard/index";

// Students
import {
  StudentList,
  StudentProfile,
  StudentForm,
  StudentDashboard,
} from "@students/index";

// Staff
import {
  StaffList,
  StaffProfile,
  StaffForm,
  ShiftList,
} from "@staff/index";

// Teachers
import {
  TeacherList,
  TeacherProfile,
  TeacherDashboard,
  TeacherWeeklySchedule,
  TeacherClassDetail,
} from "@teachers/index";

// Assignments
import {
  AssignmentList,
  AssignmentDetail,
  AssignmentFormPage,
  ClassAssignmentList,
  ClassAssignmentDetail,
} from "@/mis/modules/assignment";

// Academic
import {
  AcademicYearList,
  AcademicYearForm,
  ClassLevelList,
  ClassLevelForm,
  ClassroomList,
  ClassroomForm,
  SubjectList,
  SubjectForm,
  ClassInstanceList,
  ClassInstanceForm,
  ClassInstanceDetail,
  ScheduleView,
  ScheduleForm,
  ScheduleList,
  ReportCardList,
  ReportCardDetail,
} from "@/mis/modules/academic";

// Exam
import {
  ExamList,
  ExamForm,
  ExamDetail,
  GradeEntry,
  GradeList,
  ScoreEntry,
  ExamScheduleList,
  ExamScheduleForm,
  ExamScheduleCalendarPage,
  ClassExamList,
  ClassExamDetail,
} from "@/mis/modules/exam";

// Library
import {
  LibrarianDashboard,
  BookCatalog,
  BookForm,
  BookDetail,
  IssueBookPage,
  ReturnBookPage,
  BorrowRecordList,
} from "@/mis/modules/library/pages";

// Settings
import {
  SettingsOverview,
  GeneralSettings,
  UserManagement,
  // AcademicYear,
} from "@mis-settings/index";

// Profile
import { UserProfile } from "@/mis/modules/profile";

export const misRoutes: RouteObject = {
  path: "/mis",
  element: <MISLayout />,
  children: [
    // Dashboard
    { index: true, element: <Dashboard /> },

    // Students
    { path: "students", element: <StudentList /> },
    { path: "students/dashboard", element: <StudentDashboard /> },
    { path: "students/new", element: <StudentForm /> },
    { path: "students/:id", element: <StudentProfile /> },
    { path: "students/:id/edit", element: <StudentForm /> },

    // Staff
    { path: "staff", element: <StaffList /> },
    { path: "staff/new", element: <StaffForm /> },
    { path: "staff/:id", element: <StaffProfile /> },
    { path: "staff/:id/edit", element: <StaffForm /> },
    { path: "staff/shifts", element: <ShiftList /> },

    // Teachers
    { path: "teachers", element: <TeacherList /> },
    { path: "teachers/dashboard", element: <TeacherDashboard /> },
    { path: "teachers/schedule", element: <TeacherWeeklySchedule /> },
    { path: "teachers/classes/:id", element: <TeacherClassDetail /> },
    { path: "teachers/:id", element: <TeacherProfile /> },

    // Academic Module
    // Academic Years
    { path: "academics/years", element: <AcademicYearList /> },
    { path: "academics/years/new", element: <AcademicYearForm /> },
    { path: "academics/years/:id/edit", element: <AcademicYearForm /> },

    // Class Levels
    { path: "academics/levels", element: <ClassLevelList /> },
    { path: "academics/levels/new", element: <ClassLevelForm /> },
    { path: "academics/levels/:id/edit", element: <ClassLevelForm /> },

    // Physical Classrooms
    { path: "academics/classrooms", element: <ClassroomList /> },
    { path: "academics/classrooms/new", element: <ClassroomForm /> },
    { path: "academics/classrooms/:id/edit", element: <ClassroomForm /> },

    // Subjects
    { path: "academics/subjects", element: <SubjectList /> },
    { path: "academics/subjects/new", element: <SubjectForm /> },
    { path: "academics/subjects/:id/edit", element: <SubjectForm /> },

    // Class Instances (Classes)
    { path: "academics/classes", element: <ClassInstanceList /> },
    { path: "academics/classes/new", element: <ClassInstanceForm /> },
    { path: "academics/classes/:id", element: <ClassInstanceDetail /> },
    { path: "academics/classes/:id/edit", element: <ClassInstanceForm /> },

    // Schedules (Timetables)
    { path: "academics/schedules", element: <ScheduleList /> },
    { path: "academics/schedules/:classId", element: <ScheduleView /> },
    { path: "academics/schedules/:classId/new", element: <ScheduleForm /> },
    { path: "academics/schedules/:classId/edit", element: <ScheduleForm /> },
    { path: "academics/schedules/:classId/edit/:slotId", element: <ScheduleForm /> },

     // Exams
     { path: "exams", element: <ExamList /> },
     { path: "exams/new", element: <ExamForm /> },
     { path: "exams/:id", element: <ExamDetail /> },
     { path: "exams/:id/edit", element: <ExamForm /> },

     // Class Exams
     { path: "exams/classes", element: <ClassExamList /> },
     { path: "exams/classes/:id", element: <ClassExamDetail /> },

     // Exam Schedules
     { path: "exams/schedules", element: <ExamScheduleList /> },
     { path: "exams/schedules/new", element: <ExamScheduleForm /> },
     { path: "exams/schedules/:id", element: <ExamScheduleForm /> },
     { path: "exams/schedules/:id/edit", element: <ExamScheduleForm /> },
     { path: "exams/schedules/calendar", element: <ExamScheduleCalendarPage /> },

     // Grades
     { path: "exams/grades", element: <GradeEntry /> },
     { path: "exams/grades/list", element: <GradeList /> },

     // Scores
     { path: "exams/scores", element: <ScoreEntry /> },

    // Assignments
    { path: "assignments", element: <AssignmentList /> },
    { path: "assignments/classes", element: <ClassAssignmentList /> },
    { path: "assignments/classes/:id", element: <ClassAssignmentDetail /> },
    { path: "assignments/new", element: <AssignmentFormPage /> },
    { path: "assignments/:id", element: <AssignmentDetail /> },
    { path: "assignments/:id/edit", element: <AssignmentFormPage /> },

    // Report Cards
    { path: "academics/report-cards", element: <ReportCardList /> },
    { path: "academics/report-cards/:id", element: <ReportCardDetail /> },

    // Library
    { path: "library", element: <LibrarianDashboard /> },
    { path: "library/catalog", element: <BookCatalog /> },
    { path: "library/catalog/new", element: <BookForm /> },
    { path: "library/catalog/:id", element: <BookDetail /> },
    { path: "library/catalog/:id/edit", element: <BookForm /> },
    { path: "library/issue", element: <IssueBookPage /> },
    { path: "library/return", element: <ReturnBookPage /> },
    { path: "library/borrows", element: <BorrowRecordList /> },

    // Settings
    { path: "settings", element: <SettingsOverview /> },
    { path: "settings/general", element: <GeneralSettings /> },
    { path: "settings/users", element: <UserManagement /> },
    // { path: "settings/academic-year", element: <AcademicYear /> },

    // Profile
    { path: "profile", element: <UserProfile /> },
  ],
};

export default misRoutes;