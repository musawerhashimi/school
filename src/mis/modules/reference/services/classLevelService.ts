import { classLevelService } from '../../academic/services/classLevelService';

export const referenceClassLevelService = {
  getAll: classLevelService.getAll,
  getById: classLevelService.getById,
  getSubjects: classLevelService.getSubjects,
};

export default referenceClassLevelService;
