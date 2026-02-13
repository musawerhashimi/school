import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { scheduleService } from '../services/scheduleService';
import { teacherKeys } from '@teachers/hooks/useTeachers';
import type {
  ScheduleFilters,
  CreateScheduleData,
  UpdateScheduleData,
  DayOfWeek,
} from '../types';

// Query key factory for schedules
export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (filters: ScheduleFilters) => [...scheduleKeys.lists(), filters] as const,
  details: () => [...scheduleKeys.all, 'detail'] as const,
  detail: (id: number) => [...scheduleKeys.details(), id] as const,
  weekly: () => [...scheduleKeys.all, 'weekly'] as const,
  weeklyClass: (classId: number) => [...scheduleKeys.weekly(), 'class', classId] as const,
  weeklyTeacher: (teacherId: number, yearId?: number) =>
    [...scheduleKeys.weekly(), 'teacher', teacherId, yearId] as const,
  weeklyRoom: (roomId: number, yearId?: number) =>
    [...scheduleKeys.weekly(), 'room', roomId, yearId] as const,
  availablePeriods: (classId: number, day: DayOfWeek) =>
    [...scheduleKeys.all, 'available', classId, day] as const,
  byClass: (classId: number) => [...scheduleKeys.all, 'byClass', classId] as const,
  byDay: (classId: number, day: DayOfWeek) =>
    [...scheduleKeys.all, 'byDay', classId, day] as const,
};

/**
 * Hook to fetch paginated schedules with filters
 */
export function useSchedules(filters: ScheduleFilters = {}) {
  return useQuery({
    queryKey: scheduleKeys.list(filters),
    queryFn: () => scheduleService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single schedule by ID
 */
export function useSchedule(id: number) {
  return useQuery({
    queryKey: scheduleKeys.detail(id),
    queryFn: () => scheduleService.getById(id),
    enabled: id > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch weekly schedule for a class
 */
export function useWeeklySchedule(classInstanceId: number) {
  return useQuery({
    queryKey: scheduleKeys.weeklyClass(classInstanceId),
    queryFn: () => scheduleService.getWeeklySchedule(classInstanceId),
    enabled: classInstanceId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch weekly schedule for a teacher
 */
export function useTeacherSchedule(teacherId: number, academicYearId?: number) {
  return useQuery({
    queryKey: scheduleKeys.weeklyTeacher(teacherId, academicYearId),
    queryFn: () => scheduleService.getTeacherSchedule(teacherId, academicYearId),
    enabled: teacherId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch weekly schedule for a room
 */
export function useRoomSchedule(roomId: number, academicYearId?: number) {
  return useQuery({
    queryKey: scheduleKeys.weeklyRoom(roomId, academicYearId),
    queryFn: () => scheduleService.getRoomSchedule(roomId, academicYearId),
    enabled: roomId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch available periods for a class on a specific day
 */
export function useAvailablePeriods(classInstanceId: number, dayOfWeek: DayOfWeek) {
  return useQuery({
    queryKey: scheduleKeys.availablePeriods(classInstanceId, dayOfWeek),
    queryFn: () => scheduleService.getAvailablePeriods(classInstanceId, dayOfWeek),
    enabled: classInstanceId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates
  });
}

/**
 * Hook to fetch all schedules for a class
 */
export function useClassSchedules(classInstanceId: number) {
  return useQuery({
    queryKey: scheduleKeys.byClass(classInstanceId),
    queryFn: () => scheduleService.getByClass(classInstanceId),
    enabled: classInstanceId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch schedules for a specific day
 */
export function useDaySchedules(classInstanceId: number, dayOfWeek: DayOfWeek) {
  return useQuery({
    queryKey: scheduleKeys.byDay(classInstanceId, dayOfWeek),
    queryFn: () => scheduleService.getByDay(classInstanceId, dayOfWeek),
    enabled: classInstanceId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new schedule slot
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScheduleData) => scheduleService.create(data),
    onMutate: () => {
      toast.loading('Creating schedule slot...', { id: 'create-schedule' });
    },
    onSuccess: (result) => {
      toast.dismiss('create-schedule');
      if (result.warnings && result.warnings.length > 0) {
        toast.warning('Schedule created with warnings', {
          description: result.warnings.join(', '),
        });
      } else {
        toast.success('Schedule slot created successfully');
      }
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      // Invalidate available teachers (schedule affects teacher availability)
      queryClient.invalidateQueries({ queryKey: [...teacherKeys.all, 'available'] });
    },
    onError: (error: Error) => {
      toast.dismiss('create-schedule');
      toast.error('Failed to create schedule slot', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to update an existing schedule slot
 */
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScheduleData }) =>
      scheduleService.update(id, data),
    onMutate: () => {
      toast.loading('Updating schedule slot...', { id: 'update-schedule' });
    },
    onSuccess: (result) => {
      toast.dismiss('update-schedule');
      if (result.warnings && result.warnings.length > 0) {
        toast.warning('Schedule updated with warnings', {
          description: result.warnings.join(', '),
        });
      } else {
        toast.success('Schedule slot updated successfully');
      }
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      // Invalidate available teachers (schedule affects teacher availability)
      queryClient.invalidateQueries({ queryKey: [...teacherKeys.all, 'available'] });
    },
    onError: (error: Error) => {
      toast.dismiss('update-schedule');
      toast.error('Failed to update schedule slot', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to delete a schedule slot
 */
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => scheduleService.delete(id),
    onMutate: () => {
      toast.loading('Deleting schedule slot...', { id: 'delete-schedule' });
    },
    onSuccess: () => {
      toast.dismiss('delete-schedule');
      toast.success('Schedule slot deleted successfully');
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      // Invalidate available teachers (schedule affects teacher availability)
      queryClient.invalidateQueries({ queryKey: [...teacherKeys.all, 'available'] });
    },
    onError: (error: Error) => {
      toast.dismiss('delete-schedule');
      toast.error('Failed to delete schedule slot', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to check for conflicts
 */
export function useCheckConflicts() {
  return useMutation({
    mutationFn: (data: CreateScheduleData) => scheduleService.checkConflicts(data),
  });
}

/**
 * Hook to bulk create schedule slots
 */
export function useBulkCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedules: CreateScheduleData[]) => scheduleService.bulkCreate(schedules),
    onMutate: () => {
      toast.loading('Creating schedule slots...', { id: 'bulk-create-schedule' });
    },
    onSuccess: (result) => {
      toast.dismiss('bulk-create-schedule');
      if (result.warnings && result.warnings.length > 0) {
        toast.warning(`Created ${result.created_count} slots with warnings`, {
          description: result.warnings.slice(0, 3).join(', '),
        });
      } else {
        toast.success(`Created ${result.created_count} schedule slots`);
      }
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      // Invalidate available teachers (schedule affects teacher availability)
      queryClient.invalidateQueries({ queryKey: [...teacherKeys.all, 'available'] });
    },
    onError: (error: Error) => {
      toast.dismiss('bulk-create-schedule');
      toast.error('Failed to create schedule slots', {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to clear all schedule slots for a class
 */
export function useClearClassSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classInstanceId: number) =>
      scheduleService.clearClassSchedule(classInstanceId),
    onMutate: () => {
      toast.loading('Clearing schedule...', { id: 'clear-schedule' });
    },
    onSuccess: (result) => {
      toast.dismiss('clear-schedule');
      toast.success(`Cleared ${result.deleted_count} schedule slots`);
      queryClient.invalidateQueries({ queryKey: scheduleKeys.all });
      // Invalidate available teachers (schedule affects teacher availability)
      queryClient.invalidateQueries({ queryKey: [...teacherKeys.all, 'available'] });
    },
    onError: (error: Error) => {
      toast.dismiss('clear-schedule');
      toast.error('Failed to clear schedule', {
        description: error.message,
      });
    },
  });
}
