import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  School,
  UserCheck,
  Wallet,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  BookMarked,
  ClipboardList,
  Calendar,
  Building2,
  Layers,
  BookCopy,
  Clock,
  FileCheck,
  Briefcase,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarToggle from "./SidebarToggle";
import { useSidebarState, type SubNavItem } from "./useSidebarState";
import { useUserStore } from "@/mis/modules/auth";

/**
 * Enhanced Sidebar Component
 * Main navigation sidebar with multi-level support
 */
export default function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebarState();
  const { logout } = useUserStore();

  // Define navigation items with sub-items
  const navItems = [
    {
      path: "/mis",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: "/mis/students",
      label: "Students",
      icon: GraduationCap,
      badge: undefined, // Could be dynamic count
      subItems: [
        {
          id: "students-dashboard",
          path: "/mis/students/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          description: "Student analytics & overview",
        },
        {
          id: "students-all",
          path: "/mis/students",
          label: "All Students",
          icon: GraduationCap,
          children: [
            { id: "students-active", path: "/mis/students?status=active", label: "Active" },
            { id: "students-inactive", path: "/mis/students?status=inactive", label: "Inactive" },
            { id: "students-graduated", path: "/mis/students?status=graduated", label: "Graduated" },
          ],
        },
        {
          id: "students-new",
          path: "/mis/students/new",
          label: "Add Student",
          icon: ClipboardList,
          quickAction: true,
        },
        {
          id: "students-portal",
          path: "/mis/students/portal",
          label: "Student Portal",
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/staff",
      label: "Staff",
      icon: Briefcase,
      subItems: [
        {
          id: "staff-all",
          path: "/mis/staff",
          label: "All Staff",
          icon: Briefcase,
        },
        {
          id: "staff-new",
          path: "/mis/staff/new",
          label: "Add Staff",
          icon: ClipboardList,
          quickAction: true,
        },
        {
          id: "staff-shifts",
          path: "/mis/staff/shifts",
          label: "Shifts",
          icon: Clock,
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/teachers",
      label: "Teachers",
      icon: Users,
      subItems: [
        {
          id: "teachers-dashboard",
          path: "/mis/teachers/dashboard",
          label: "My Dashboard",
          icon: LayoutDashboard,
          description: "Teacher personal dashboard",
        },
        {
          id: "teachers-schedule",
          path: "/mis/teachers/schedule",
          label: "My Schedule",
          icon: Calendar,
          description: "View weekly teaching schedule",
        },
        {
          id: "teachers-all",
          path: "/mis/teachers",
          label: "All Teachers",
          icon: Users,
        },
        {
          id: "teachers-new",
          path: "/mis/staff/new?position=teacher",
          label: "Add Teacher",
          icon: ClipboardList,
          quickAction: true,
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/academics",
      label: "Academics",
      icon: BookOpen,
      subItems: [
        {
          id: "academics-years",
          path: "/mis/academics/years",
          label: "Academic Years",
          icon: Calendar,
        },
        {
          id: "academics-levels",
          path: "/mis/academics/levels",
          label: "Class Levels",
          icon: Layers,
        },
        {
          id: "academics-classrooms",
          path: "/mis/academics/classrooms",
          label: "Classrooms",
          icon: Building2,
        },
        {
          id: "academics-subjects",
          path: "/mis/academics/subjects",
          label: "Subjects",
          icon: BookCopy,
        },
        {
          id: "academics-classes",
          path: "/mis/academics/classes",
          label: "Classes",
          icon: School,
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/exams",
      label: "Exams",
      icon: FileText,
      subItems: [
        {
          id: "exams-list",
          path: "/mis/exams",
          label: "All Exams",
          icon: FileText,
        },
        {
          id: "exams-classes",
          path: "/mis/exams/classes",
          label: "Classes",
          icon: School,
          description: "View and manage exams by class",
        },
        {
          id: "exams-new",
          path: "/mis/exams/new",
          label: "Add Exam",
          icon: ClipboardList,
          quickAction: true,
        },
        {
          id: "exams-schedules",
          path: "/mis/exams/schedules",
          label: "Schedules",
          icon: Calendar,
          children: [
            { id: "schedules-list", path: "/mis/exams/schedules", label: "List View" },
            { id: "schedules-calendar", path: "/mis/exams/schedules/calendar", label: "Calendar View" },
            { id: "schedules-new", path: "/mis/exams/schedules/new", label: "Add Schedule" },
          ],
        },
        {
          id: "exams-grades",
          path: "/mis/exams/grades",
          label: "Grade Entry",
          icon: FileCheck,
          quickAction: true,
          children: [
            { id: "grades-entry", path: "/mis/exams/grades", label: "Enter Grades" },
            { id: "grades-list", path: "/mis/exams/grades/list", label: "View Grades" },
          ],
        },
        {
          id: "exams-scores",
          path: "/mis/exams/scores",
          label: "Score Entry",
          icon: BookOpen,
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/assignments",
      label: "Assignments",
      icon: ClipboardList,
      subItems: [
        {
          id: "assignments-all",
          path: "/mis/assignments",
          label: "All Assignments",
          icon: ClipboardList,
        },
        {
          id: "assignments-classes",
          path: "/mis/assignments/classes",
          label: "By Class",
          icon: School,
          description: "View assignments by class",
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/attendance",
      label: "Attendance",
      icon: CalendarCheck,
      subItems: [
        {
          id: "attendance-view",
          path: "/mis/attendance",
          label: "View Attendance",
        },
        {
          id: "attendance-mark",
          path: "/mis/attendance/mark",
          label: "Mark Attendance",
          quickAction: true,
        },
        {
          id: "attendance-reports",
          path: "/mis/attendance/reports",
          label: "Reports",
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/parents",
      label: "Parents",
      icon: UserCheck,
    },
    {
      path: "/mis/fees",
      label: "Fees",
      icon: Wallet,
      badge: undefined, // Could show pending count
      subItems: [
        {
          id: "fees-records",
          path: "/mis/fees",
          label: "Fee Records",
        },
        {
          id: "fees-collect",
          path: "/mis/fees/collect",
          label: "Collect Fee",
          quickAction: true,
        },
        {
          id: "fees-pending",
          path: "/mis/fees/pending",
          label: "Pending Fees",
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/library",
      label: "Library",
      icon: BookMarked,
      subItems: [
        {
          id: "library-dashboard",
          path: "/mis/library",
          label: "Dashboard",
          icon: LayoutDashboard,
          description: "Library overview & statistics",
        },
        {
          id: "library-catalog",
          path: "/mis/library/catalog",
          label: "Book Catalog",
          icon: BookCopy,
          description: "Browse and manage books",
        },
        {
          id: "library-issue",
          path: "/mis/library/issue",
          label: "Issue Book",
          icon: BookOpen,
          quickAction: true,
        },
        {
          id: "library-return",
          path: "/mis/library/return",
          label: "Return Book",
          icon: BookMarked,
          quickAction: true,
        },
        {
          id: "library-borrows",
          path: "/mis/library/borrows",
          label: "Borrow Records",
          icon: ClipboardList,
          children: [
            { id: "borrows-all", path: "/mis/library/borrows", label: "All Records" },
            { id: "borrows-active", path: "/mis/library/borrows?status=active", label: "Active" },
            { id: "borrows-overdue", path: "/mis/library/borrows?status=overdue", label: "Overdue" },
          ],
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/reports",
      label: "Reports",
      icon: FileText,
      subItems: [
        {
          id: "reports-all",
          path: "/mis/reports",
          label: "All Reports",
        },
        {
          id: "reports-students",
          path: "/mis/reports/students",
          label: "Student Reports",
        },
        {
          id: "reports-attendance",
          path: "/mis/reports/attendance",
          label: "Attendance Reports",
        },
        {
          id: "reports-financial",
          path: "/mis/reports/financial",
          label: "Financial Reports",
        },
      ] as SubNavItem[],
      divider: true,
    },
    {
      path: "/mis/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        data-sidebar="main"
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col border-r border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-sidebar-text shadow-2xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Decorative gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      {/* Logo & Toggle */}
      <div className={`relative z-10 flex items-center border-b border-white/10 bg-slate-900/50 backdrop-blur-xl px-4 ${isCollapsed ? 'h-auto py-4 flex-col gap-3' : 'h-16 justify-between'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30">
                <School className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none">School MIS</h1>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Management System</p>
              </div>
            </div>
            <SidebarToggle />
          </>
        ) : (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/30">
              <School className="h-5 w-5 text-white" />
            </div>
            <SidebarToggle />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              path={item.path}
              label={item.label}
              icon={item.icon}
              badge={item.badge}
              subItems={item.subItems}
              divider={item.divider}
            />
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="relative z-10 border-t border-white/10 bg-slate-900/30 backdrop-blur-xl p-3">
        <button
          onClick={logout}
          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-error/20 hover:text-error active:scale-95 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          {!isCollapsed && <span>{t("mis.nav.logout", "Logout")}</span>}
        </button>
      </div>
    </aside>
    </>
  );
}
