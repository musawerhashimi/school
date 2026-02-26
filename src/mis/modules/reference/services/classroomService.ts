import { classroomService } from '../../academic/services/classroomService';

export const referenceClassroomService = {
  getAll: classroomService.getAll,
  getById: classroomService.getById,
  getAvailable: classroomService.getAvailable,
};

export default referenceClassroomService;
