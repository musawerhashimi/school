import api from '@/lib/api';
import type {
  ClassExamInfo,
  ClassExamsResponse,
  ExamScheduleGridResponse,
  ExamScheduleDetailApiResponse,
  ClassSubjectScoresResponse,
  StudentExamReport,
  ClassStudent,
  BulkScoreSaveInput,
  BulkScoreSaveResponse,
  ExamType,
  CreateExamScheduleData,
  UpdateExamScheduleData,
  PaginatedResponse,
  GradeApiResponse,
  ExamMaxMarks,
} from '../types';
import type { SubjectApiResponse } from '../../academic/types';

const BASE_URL = '/exam/classes/';
const GRADES_URL = '/exam/grades/';

export interface ClassExamFilters {
  academic_year?: number;
  class_level?: number;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export type PaginatedClassExamsResponse = PaginatedResponse<ClassExamInfo>;

export const classExamService = {
  /**
   * Get all classes with exam information
   */
  async getClasses(filters?: ClassExamFilters): Promise<PaginatedClassExamsResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<PaginatedClassExamsResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single class with exam information
   */
  async getClassDetail(classId: number): Promise<ClassExamInfo> {
    const response = await api.get<ClassExamInfo>(`${BASE_URL}${classId}/`);
    return response.data;
  },

  /**
   * Get midterm and final exams for a class
   */
  async getClassExams(classId: number): Promise<ClassExamsResponse> {
    const response = await api.get<ClassExamsResponse>(`${BASE_URL}${classId}/exams/`);
    return response.data;
  },

  /**
   * Get exam schedule grid for a class
   */
  async getScheduleGrid(classId: number, examType: ExamType): Promise<ExamScheduleGridResponse> {
    const response = await api.get<ExamScheduleGridResponse>(
      `${BASE_URL}${classId}/schedule/?exam_type=${examType}`
    );
    return response.data;
  },

  /**
   * Create a new schedule slot
   * Backend endpoint: POST /exam/classes/{id}/schedule/create/
   */
  async createScheduleSlot(classId: number, data: CreateExamScheduleData): Promise<ExamScheduleDetailApiResponse> {
    const response = await api.post<ExamScheduleDetailApiResponse>(
      `${BASE_URL}${classId}/schedule/create/`,
      data
    );
    return response.data;
  },

  /**
   * Update a schedule slot
   * Backend endpoint: PUT /exam/classes/{id}/schedule/{schedule_id}/
   */
  async updateScheduleSlot(
    classId: number,
    slotId: number,
    data: UpdateExamScheduleData
  ): Promise<ExamScheduleDetailApiResponse> {
    const response = await api.put<ExamScheduleDetailApiResponse>(
      `${BASE_URL}${classId}/schedule/${slotId}/`,
      data
    );
    return response.data;
  },

  /**
   * Delete a schedule slot
   * Backend endpoint: DELETE /exam/classes/{id}/schedule/{schedule_id}/delete/
   */
  async deleteScheduleSlot(classId: number, slotId: number): Promise<void> {
    await api.delete(`${BASE_URL}${classId}/schedule/${slotId}/delete/`);
  },

  /**
   * Get all subjects for a class
   */
  async getClassSubjects(classId: number): Promise<SubjectApiResponse[]> {
    const response = await api.get<SubjectApiResponse[]>(`${BASE_URL}${classId}/subjects/`);
    return response.data;
  },

  /**
   * Get scores for a specific subject in a class
   * Uses /exam/grades/ endpoint with filters
   */
  async getSubjectScores(
    classId: number,
    subjectId: number,
    examType: ExamType
  ): Promise<ClassSubjectScoresResponse> {
    // First get the exam for this class's academic year
    const examsResponse = await api.get<ClassExamsResponse>(`${BASE_URL}${classId}/exams/`);
    const exam = examType === 'midterm' ? examsResponse.data.midterm : examsResponse.data.final;

    if (!exam) {
      throw new Error(`No ${examType} exam found for this class`);
    }

    // Get subject info
    const subjectsResponse = await api.get<SubjectApiResponse[]>(`${BASE_URL}${classId}/subjects/`);
    const subject = subjectsResponse.data.find(s => s.id === subjectId);

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Get students in the class
    const studentsResponse = await api.get<ClassStudent[]>(`${BASE_URL}${classId}/students/`);
    const students = studentsResponse.data;

    // Get existing grades for this exam, class, and subject
    const gradesResponse = await api.get<PaginatedResponse<GradeApiResponse>>(
      `${GRADES_URL}?exam=${exam.id}&class_instance=${classId}&subject=${subjectId}`
    );
    const grades = gradesResponse.data.results || [];

    // Build grades map by student_id
    const gradesMap = new Map<number, GradeApiResponse>();
    for (const grade of grades) {
      gradesMap.set(grade.student, grade);
    }

    // Determine max marks based on exam type
    const maxMarks: ExamMaxMarks = examType === 'midterm'
      ? { activity: 2, assignment: 2, exam: 36, total: 40 }
      : { activity: 3, assignment: 3, exam: 54, total: 60 };

    // Build scores array with all students
    const scores = students.map(student => {
      const grade = gradesMap.get(student.id);
      return {
        student_id: student.id,
        student_name: student.full_name,
        student_id_number: student.student_id,
        activity_marks: grade?.activity_marks ?? 2,
        assignment_marks: grade?.assignment_marks ?? 2,
        exam_marks: grade?.exam_marks ?? 0,
        total: grade?.marks_obtained ?? 0,
        percentage: grade?.percentage ?? null,
        grade_letter: grade?.grade_letter ?? null,
        is_pass: grade?.is_pass ?? null,
        is_absent: grade?.is_absent ?? false,
        grade_id: grade?.id ?? null,
        remarks: grade?.remarks ?? '',
      };
    });

    return {
      subject_id: subject.id,
      subject_name: subject.name,
      subject_code: subject.code,
      exam_id: exam.id,
      exam_type: examType,
      max_marks: maxMarks,
      scores,
    };
  },

  /**
   * Save scores for a subject (bulk create/update)
   * Uses /exam/grades/bulk_entry/ endpoint
   */
  async saveSubjectScores(
    classId: number,
    subjectId: number,
    examType: ExamType,
    scores: BulkScoreSaveInput[]
  ): Promise<BulkScoreSaveResponse> {
    // First get the exam for this class's academic year
    const examsResponse = await api.get<ClassExamsResponse>(`${BASE_URL}${classId}/exams/`);
    const exam = examType === 'midterm' ? examsResponse.data.midterm : examsResponse.data.final;

    if (!exam) {
      throw new Error(`No ${examType} exam found for this class`);
    }

    // Call bulk_entry endpoint
    const response = await api.post<BulkScoreSaveResponse>(
      `${GRADES_URL}bulk_entry/`,
      {
        exam: exam.id,
        subject: subjectId,
        class_instance: classId,
        grades: scores,
      }
    );
    return response.data;
  },

  /**
   * Get all students in a class
   */
  async getClassStudents(classId: number): Promise<ClassStudent[]> {
    const response = await api.get<ClassStudent[]>(`${BASE_URL}${classId}/students/`);
    return response.data;
  },

  /**
   * Get student exam report (GPA and subject performance)
   */
  async getStudentReport(classId: number, studentId: number): Promise<StudentExamReport> {
    const response = await api.get<StudentExamReport>(
      `${BASE_URL}${classId}/students/${studentId}/report/`
    );
    return response.data;
  },
};

export default classExamService;
