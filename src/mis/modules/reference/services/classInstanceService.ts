import { classInstanceService } from '../../academic/services/classInstanceService';

export const referenceClassInstanceService = {
  getAll: classInstanceService.getAll,
  getById: classInstanceService.getById,
  getCurrentYear: classInstanceService.getCurrentYear,
  getStudents: classInstanceService.getStudents,
};

export default referenceClassInstanceService;
