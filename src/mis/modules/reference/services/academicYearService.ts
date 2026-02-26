import { academicYearService } from '../../academic/services/academicYearService';

export const referenceAcademicYearService = {
  getAll: academicYearService.getAll,
  getById: academicYearService.getById,
  getCurrent: academicYearService.getCurrent,
};

export default referenceAcademicYearService;
