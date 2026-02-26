/**
 * Parents Module Barrel Export
 */

// Pages
export { ParentDashboard, StudentDetail, ParentProfile } from "./pages";

// Components
export { StudentCard, QuickStatsCard } from "./components";

// Hooks
export * from "./hooks/useParents";

// Services
export { parentService } from "./services/parentService";

// Types
export type {
  ParentApiResponse,
  UpdateParentData,
  ChildSummary,
  ParentDashboardStats,
  AttendanceRecord,
  AttendanceSummary,
  MonthlyAttendance,
  FeeRecord,
  FeeSummary,
  SubjectGrade,
  AcademicSummary,
  ChildDetailResponse,
  RelationType,
  StudentStatus,
  AttendanceStatus,
  FeeStatus,
} from "./types";

// Constants
export {
  PARENT_QUERY_KEYS,
  PARENT_STALE_TIMES,
  STUDENT_STATUS_CONFIG,
  ATTENDANCE_STATUS_CONFIG,
  FEE_STATUS_CONFIG,
  RELATION_TYPE_CONFIG,
  STAT_COLORS,
  PARENT_DEFAULTS,
  STUDENT_DETAIL_TABS,
} from "./constants";

export type { StudentDetailTab } from "./constants";
