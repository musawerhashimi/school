import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/mis/modules/auth";
import {
  BookCopy,
  BookMarked,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Globe,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  School,
  Settings,
  Sparkles,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SidebarItem from "./SidebarItem";
import { useSidebarState, type SubNavItem } from "./useSidebarState";

/**
 * Enhanced Sidebar Component
 * Modern glassmorphism design with light/dark mode support
 */
export default function Sidebar() {
  const { t } = useTranslation();
  const { isCollapsed, isMobileOpen, closeMobile, toggleCollapse } =
    useSidebarState();
  const { logout } = useUserStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Sync theme changes

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
      badge: undefined,
      subItems: [
        {
          id: "students-all",
          path: "/mis/students",
          label: "All Students",
          icon: GraduationCap,
          children: [
            {
              id: "students-active",
              path: "/mis/students?status=active",
              label: "Active",
            },
            {
              id: "students-inactive",
              path: "/mis/students?status=inactive",
              label: "Inactive",
            },
            {
              id: "students-graduated",
              path: "/mis/students?status=graduated",
              label: "Graduated",
            },
          ],
        },
        {
          id: "students-new",
          path: "/mis/students/new",
          label: "Add Student",
          icon: ClipboardList,
          quickAction: true,
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
      ] as SubNavItem[],
    },
    {
      path: "/mis/academics",
      label: "Academics",
      icon: BookOpen,
      subItems: [
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
            {
              id: "schedules-list",
              path: "/mis/exams/schedules",
              label: "List View",
            },
            {
              id: "schedules-calendar",
              path: "/mis/exams/schedules/calendar",
              label: "Calendar View",
            },
            {
              id: "schedules-new",
              path: "/mis/exams/schedules/new",
              label: "Add Schedule",
            },
          ],
        },
        {
          id: "questions-bank",
          path: "/mis/exams/questions-bank",
          label: "Question Bank",
          icon: BookMarked,
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
          icon: CalendarCheck,
        },
        {
          id: "attendance-mark",
          path: "/mis/attendance/mark",
          label: "Mark Attendance",
          quickAction: true,
          icon: CalendarCheck,
        },
        {
          id: "attendance-reports",
          path: "/mis/attendance/reports",
          label: "Reports",
          icon: FileText,
        },
      ] as SubNavItem[],
    },

    {
      path: "/mis/parents",
      label: "Parents",
      icon: UserCheck,
      subItems: [
        {
          id: "parents-dashboard",
          path: "/mis/parents/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "parents-profile",
          path: "/mis/parents/profile",
          label: "Profile",
          icon: UserCheck,
          quickAction: true,
        },
      ] as SubNavItem[],
    },
    {
      path: "",
      label: "Finance",
      icon: Wallet,
      subItems: [
        {
          id: "fees-records",
          path: "/mis/fees",
          label: "Fee Records",
          icon: Wallet,
        },
        {
          id: "Salary",
          path: "/mis/salary",
          label: "Salary Management",
          icon: Wallet,
        },
        {
          id: "Cash Drawer",
          path: "/mis/cash-drawer",
          label: "Cash Drawer",
          icon: Wallet,
        },
        {
          id: "Transactions",
          path: "/mis/transactions",
          label: "Transactions",
          icon: Wallet,
        },
        {
          id: "Expanses",
          path: "/mis/expenses",
          label: "Expenses",
          icon: Wallet,
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
            {
              id: "borrows-all",
              path: "/mis/library/borrows",
              label: "All Records",
            },
            {
              id: "borrows-active",
              path: "/mis/library/borrows?status=active",
              label: "Active",
            },
            {
              id: "borrows-overdue",
              path: "/mis/library/borrows?status=overdue",
              label: "Overdue",
            },
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
      path: "/mis/cms",
      label: "CMS",
      icon: Globe,
      subItems: [
        {
          id: "cms-home",
          path: "/mis/cms/home",
          label: "Home Page",
          icon: Home,
          description: "Manage home page content",
          children: [
            {
              id: "cms-home-overview",
              path: "/mis/cms/home",
              label: "Overview",
            },
            {
              id: "cms-home-sliders",
              path: "/mis/cms/home/sliders",
              label: "Hero Sliders",
            },
          ],
        },
        {
          id: "cms-about",
          path: "/mis/cms/about",
          label: "About Page",
          icon: Users,
          description: "Manage team and departments",
          children: [
            {
              id: "cms-about-overview",
              path: "/mis/cms/about",
              label: "Overview",
            },
            {
              id: "cms-about-team",
              path: "/mis/cms/about/team",
              label: "Team Members",
            },
            {
              id: "cms-about-departments",
              path: "/mis/cms/about/departments",
              label: "Departments",
            },
          ],
        },
      ] as SubNavItem[],
    },
    {
      path: "/mis/settings",
      label: "Settings",
      icon: Settings,
      subItems: [
        {
          id: "settings-general",
          path: "/mis/settings/general",
          label: "General",
        },
        {
          id: "settings-academic-year",
          path: "/mis/settings/academic-year",
          label: "Academic Years",
          icon: Calendar,
        },
        {
          id: "settings-users",
          path: "/mis/settings/users",
          label: "User Management",
        },
      ] as SubNavItem[],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={closeMobile}
        />
      )}

      <aside
        data-sidebar="main"
        className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col shadow-xl transition-all duration-300 ease-out ${
          isCollapsed ? "w-[72px]" : "w-[280px]"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isDark
            ? "bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900"
            : "bg-gradient-to-b from-slate-50 via-white to-slate-50"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top gradient orb */}
          <div
            className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 ${
              isDark ? "bg-zinc-600" : "bg-slate-400"
            }`}
          />
          {/* Bottom gradient orb */}
          <div
            className={`absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${
              isDark ? "bg-zinc-700" : "bg-slate-300"
            }`}
          />
          {/* Grid pattern */}
          <div
            className={`absolute inset-0 opacity-[0.02] ${
              isDark
                ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyME00MCA0MFYyMEwwIDQwIiBkPSJNMiAyaDZWM2gtNnYtSDJ6IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L2c+PC9zdmc+')]"
                : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyME00MCA0MFYyMEwwIDQwIiBkPSJNMiAyaDZWM2gtNnYtSDJ6IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L2c+PC9zdmc+')]"
            }`}
          />
        </div>

        {/* Logo & Toggle */}
        <div
          className={`relative z-10 flex items-center justify-between border-b px-3 py-4 ${
            isDark
              ? "border-zinc-700/50 bg-zinc-800/50"
              : "border-slate-200 bg-slate-100/50"
          } ${isCollapsed ? "flex-col gap-3 px-2" : "px-4"}`}
        >
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <div
              className={`flex items-center justify-center rounded-xl shadow-lg ${
                isCollapsed ? "h-10 w-10" : "h-11 w-11"
              } bg-gradient-to-br from-slate-600 via-slate-700 to-zinc-800 shadow-slate-500/30`}
            >
              <School
                className={`text-white ${isCollapsed ? "h-5 w-5" : "h-5 w-5"}`}
              />
            </div>
            {!isCollapsed && (
              <div className="animate-slide-in">
                <h1
                  className={`font-bold leading-tight ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  School MIS
                </h1>
                <p
                  className={`text-[11px] leading-tight mt-0.5 ${
                    isDark ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  Management System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle & Collapse Button Row */}
        <div
          className={`relative z-10 flex items-center justify-${
            isCollapsed ? "center" : "between"
          } px-3 py-2 ${
            isDark ? "border-b border-zinc-700/30" : "border-b border-slate-200"
          }`}
        >
          {!isCollapsed && (
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
                isDark ? "bg-zinc-700/50" : "bg-slate-200"
              }`}
            >
              <Sparkles
                className={`h-3.5 w-3.5 ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-zinc-400" : "text-slate-600"
                }`}
              >
                Navigation
              </span>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={`hidden lg:flex items-center justify-center rounded-lg transition-all duration-200 ml-2 ${
              isDark
                ? "h-8 w-8 bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                : "h-8 w-8 bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex-1 overflow-y-auto py-3 scrollbar-thin">
          <ul className="space-y-1 px-2">
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
        <div
          className={`relative z-10 border-t p-3 ${
            isDark
              ? "border-zinc-700/50 bg-zinc-800/30"
              : "border-slate-200 bg-slate-100/50"
          }`}
        >
          <button
            onClick={logout}
            className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center" : ""
            } ${
              isDark
                ? "text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                : "text-rose-600 hover:bg-rose-100 hover:text-rose-700"
            } active:scale-[0.98]`}
          >
            <LogOut
              className={`h-5 w-5 transition-transform group-hover:translate-x-0.5 ${
                isDark ? "text-rose-400" : "text-rose-500"
              }`}
            />
            {!isCollapsed && (
              <span className={isDark ? "text-rose-400" : "text-rose-600"}>
                {t("mis.nav.logout", "Logout")}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button (visible only on mobile) */}
      <button
        onClick={() => useSidebarState.getState().toggleMobile()}
        className={`fixed bottom-4 right-4 z-50 lg:hidden flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isDark
            ? "bg-zinc-700 text-white hover:bg-zinc-600"
            : "bg-slate-800 text-white hover:bg-slate-700"
        } ${isMobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
        aria-label="Toggle menu"
      >
        <span className="sr-only">Toggle menu</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in {
          from { 
            opacity: 0;
            transform: translateX(-10px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </>
  );
}
