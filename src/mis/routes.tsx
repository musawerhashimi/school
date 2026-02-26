import type { RouteObject } from "react-router-dom";

// Layout
import { MISLayout } from "@mis-components/index";

// Dashboard
import { Dashboard } from "@mis-dashboard/index";

// Students
import {
  StudentForm,
  StudentList,
  StudentProfile,
} from "@students/index";

// Staff
import {
  ShiftList,
  StaffForm,
  StaffList,
  StaffProfile,
} from "@staff/index";

// Teachers
import {
  TeacherClassDetail,
  TeacherDashboard,
  TeacherList,
  TeacherProfile,
  TeacherWeeklySchedule,
} from "@teachers/index";

// Assignments
import {
  AssignmentDetail,
  AssignmentFormPage,
  AssignmentList,
  ClassAssignmentDetail,
  ClassAssignmentList,
} from "@/mis/modules/assignment";

// Academic
import {
  ClassInstanceDetail,
  ClassInstanceForm,
  ClassInstanceList,
  ClassLevelForm,
  ClassLevelList,
  ClassroomForm,
  ClassroomList,
  ScheduleForm,
  ScheduleList,
  ScheduleView,
  SubjectForm,
  SubjectList
} from "@/mis/modules/academic";

// Exam
import {
  ClassExamDetail,
  ClassExamList,
  ExamDetail,
  ExamForm,
  ExamList,
  ExamScheduleCalendarPage,
  ExamScheduleForm,
  ExamScheduleList,
  ReportCardDetail,
  ReportCardList,
} from "@/mis/modules/exam";

// Library
import {
  BookCatalog,
  BookDetail,
  BookForm,
  BorrowRecordList,
  IssueBookPage,
  LibrarianDashboard,
  ReturnBookPage,
} from "@/mis/modules/library/pages";

// Parents
import {
  ParentDashboard,
  ParentProfile,
  StudentDetail as ParentStudentDetail,
} from "@/mis/modules/parents";

// Settings
import {
  AcademicYear,
  GeneralSettings,
  SettingsOverview,
  UserManagement,
} from "@mis-settings/index";




// CMS
import {
  AboutDashboard,
  DepartmentList,
  HomeDashboard,
  SliderForm,
  SliderList,
  TeamMemberForm,
  TeamMemberList,
} from "@/mis/modules/cms";

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

    // Assignments
    { path: "assignments", element: <AssignmentList /> },
    { path: "assignments/classes", element: <ClassAssignmentList /> },
    { path: "assignments/classes/:id", element: <ClassAssignmentDetail /> },
    { path: "assignments/new", element: <AssignmentFormPage /> },
    { path: "assignments/:id", element: <AssignmentDetail /> },
    { path: "assignments/:id/edit", element: <AssignmentFormPage /> },

    // Report Cards
    { path: "exams/report-cards", element: <ReportCardList /> },
    { path: "exams/report-cards/:id", element: <ReportCardDetail /> },

    // Library
    { path: "library", element: <LibrarianDashboard /> },
    { path: "library/catalog", element: <BookCatalog /> },
    { path: "library/catalog/new", element: <BookForm /> },
    { path: "library/catalog/:id", element: <BookDetail /> },
    { path: "library/catalog/:id/edit", element: <BookForm /> },
    { path: "library/issue", element: <IssueBookPage /> },
    { path: "library/return", element: <ReturnBookPage /> },
    { path: "library/borrows", element: <BorrowRecordList /> },

    // Parents
    { path: "parents/dashboard", element: <ParentDashboard /> },
    { path: "parents/profile", element: <ParentProfile /> },
    { path: "parents/children/:studentId", element: <ParentStudentDetail /> },
    
    
    
    // CMS - Home Page
    { path: "cms/home", element: <HomeDashboard /> },
    { path: "cms/home/sliders", element: <SliderList /> },
    { path: "cms/home/sliders/new", element: <SliderForm /> },
    { path: "cms/home/sliders/:id/edit", element: <SliderForm /> },

    // CMS - About Page
    { path: "cms/about", element: <AboutDashboard /> },
    { path: "cms/about/team", element: <TeamMemberList /> },
    { path: "cms/about/team/new", element: <TeamMemberForm /> },
    { path: "cms/about/team/:id/edit", element: <TeamMemberForm /> },
    { path: "cms/about/departments", element: <DepartmentList /> },


    // Settings
    { path: "settings", element: <SettingsOverview /> },
    { path: "settings/general", element: <GeneralSettings /> },
    { path: "settings/academic-year", element: <AcademicYear /> },
    { path: "settings/users", element: <UserManagement /> },

    // Profile
    { path: "profile", element: <UserProfile /> },
  ],
};

export default misRoutes;
