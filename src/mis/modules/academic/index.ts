// Types
export * from './types';

// Services
export { academicYearService } from './services/academicYearService';
export { classLevelService } from './services/classLevelService';
export { classroomService } from './services/classroomService';
export { subjectService } from './services/subjectService';
export { classInstanceService } from './services/classInstanceService';
export { scheduleService } from './services/scheduleService';

// Hooks
export * from './hooks/useAcademicYears';
export * from './hooks/useClassLevels';
export * from './hooks/useClassrooms';
export * from './hooks/useSubjects';
export * from './hooks/useClassInstances';
export * from './hooks/useSchedules';

// Schemas
export * from './schemas';

// Pages
export { default as AcademicYearList } from './pages/AcademicYearList';
export { default as AcademicYearForm } from './pages/AcademicYearForm';
export { default as ClassLevelList } from './pages/ClassLevelList';
export { default as ClassLevelForm } from './pages/ClassLevelForm';
export { default as ClassroomList } from './pages/ClassroomList';
export { default as ClassroomForm } from './pages/ClassroomForm';
export { default as SubjectList } from './pages/SubjectList';
export { default as SubjectForm } from './pages/SubjectForm';
export { default as ClassInstanceList } from './pages/ClassInstanceList';
export { default as ClassInstanceForm } from './pages/ClassInstanceForm';
export { default as ClassInstanceDetail } from './pages/ClassInstanceDetail';
export { default as ScheduleView } from './pages/ScheduleView';
export { default as ScheduleForm } from './pages/ScheduleForm';
export { default as ScheduleList } from './pages/ScheduleList';

// Components
export { default as WeeklyScheduleTable } from './components/WeeklyScheduleTable';
export { CompactScheduleTable } from './components/WeeklyScheduleTable';
