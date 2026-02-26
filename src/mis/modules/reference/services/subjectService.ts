import { subjectService } from '../../academic/services/subjectService';

export const referenceSubjectService = {
  getAll: subjectService.getAll,
  getById: subjectService.getById,
};

export default referenceSubjectService;
