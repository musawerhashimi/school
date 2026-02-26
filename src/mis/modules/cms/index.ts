// CMS Module Exports

// Pages - Home
export { HomeDashboard, SliderList, SliderForm } from "./pages/Home";

// Pages - About
export {
  AboutDashboard,
  TeamMemberList,
  TeamMemberForm,
  DepartmentList,
} from "./pages/About";

// Hooks - Home
export {
  useHeroSliders,
  useHeroSlider,
  useCreateHeroSlider,
  useUpdateHeroSlider,
  useDeleteHeroSlider,
  useToggleHeroSlider,
  useHomeStats,
} from "./hooks/useCmsHome";

// Hooks - About
export {
  useDepartments,
  useDepartment,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useTeamMembers,
  useTeamMemberDetail,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from "./hooks/useCmsAbout";

// Services
export { cmsHomeService } from "./services/cmsHomeService";
export { cmsAboutService } from "./services/cmsAboutService";

// Types
export type {
  HeroSlider,
  HeroSliderInput,
  HeroSliderFormData,
  StatsSection,
  Department,
  DepartmentInput,
  TeamMember,
  TeamMemberInput,
  TeamMemberDetails,
  TeamMemberType,
  MultiLangText,
} from "./types";
