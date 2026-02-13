import { apiClient } from '../../../lib/api';

const BASE_URL = '/api/v1/mis';

/**
 * Integration service for connecting Student module with other modules
 * (Attendance, Grades, Fees, Library)
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface StudentAttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_by: string;
  remarks?: string;
  created_at: string;
}

export interface StudentAttendanceSummary {
  student_id: number;
  total_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  excused_days: number;
  attendance_percentage: number;
}

export interface StudentGrade {
  id: number;
  student_id: number;
  subject_id: number;
  subject_name: string;
  assessment_type: 'quiz' | 'assignment' | 'midterm' | 'final' | 'project';
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
  date: string;
  remarks?: string;
}

export interface StudentGradeSummary {
  student_id: number;
  academic_year: string;
  subjects: Array<{
    subject_id: number;
    subject_name: string;
    total_marks: number;
    obtained_marks: number;
    percentage: number;
    grade: string;
  }>;
  overall_percentage: number;
  overall_grade: string;
  class_rank?: number;
  total_students?: number;
}

export interface StudentFeeRecord {
  id: number;
  student_id: number;
  fee_type: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
  payment_date?: string;
  payment_method?: string;
  receipt_number?: string;
  created_at: string;
}

export interface StudentFeeSummary {
  student_id: number;
  total_fees: number;
  total_paid: number;
  total_remaining: number;
  overdue_amount: number;
  records: StudentFeeRecord[];
}

export interface StudentLibraryBook {
  id: number;
  student_id: number;
  book_id: number;
  book_title: string;
  book_isbn?: string;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
  fine_amount?: number;
  created_at: string;
}

export interface StudentLibrarySummary {
  student_id: number;
  total_books_issued: number;
  currently_issued: number;
  total_returned: number;
  overdue_books: number;
  total_fines: number;
  books: StudentLibraryBook[];
}

export interface StudentIntegratedProfile {
  student_id: number;
  attendance_summary: StudentAttendanceSummary;
  grade_summary: StudentGradeSummary;
  fee_summary: StudentFeeSummary;
  library_summary: StudentLibrarySummary;
}

// ============================================================================
// ATTENDANCE INTEGRATION
// ============================================================================

export const attendanceIntegration = {
  /**
   * Get attendance records for a student
   */
  getStudentAttendance: async (
    studentId: number,
    filters?: {
      start_date?: string;
      end_date?: string;
      status?: string;
    }
  ): Promise<StudentAttendanceRecord[]> => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiClient.get<StudentAttendanceRecord[]>(
      `${BASE_URL}/attendance/student/${studentId}/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get attendance summary for a student
   */
  getStudentAttendanceSummary: async (
    studentId: number,
    academicYear?: string
  ): Promise<StudentAttendanceSummary> => {
    const params = academicYear ? `?academic_year=${academicYear}` : '';
    const response = await apiClient.get<StudentAttendanceSummary>(
      `${BASE_URL}/attendance/student/${studentId}/summary/${params}`
    );
    return response.data;
  },

  /**
   * Mark attendance for a student (for quick actions)
   */
  markAttendance: async (
    studentId: number,
    data: {
      date: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      remarks?: string;
    }
  ): Promise<StudentAttendanceRecord> => {
    const response = await apiClient.post<StudentAttendanceRecord>(
      `${BASE_URL}/attendance/student/${studentId}/mark/`,
      data
    );
    return response.data;
  },
};

// ============================================================================
// GRADES INTEGRATION
// ============================================================================

export const gradesIntegration = {
  /**
   * Get all grades for a student
   */
  getStudentGrades: async (
    studentId: number,
    filters?: {
      academic_year?: string;
      subject_id?: number;
      assessment_type?: string;
    }
  ): Promise<StudentGrade[]> => {
    const params = new URLSearchParams();
    if (filters?.academic_year) params.append('academic_year', filters.academic_year);
    if (filters?.subject_id) params.append('subject_id', String(filters.subject_id));
    if (filters?.assessment_type) params.append('assessment_type', filters.assessment_type);

    const response = await apiClient.get<StudentGrade[]>(
      `${BASE_URL}/grades/student/${studentId}/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get grade summary for a student
   */
  getStudentGradeSummary: async (
    studentId: number,
    academicYear?: string
  ): Promise<StudentGradeSummary> => {
    const params = academicYear ? `?academic_year=${academicYear}` : '';
    const response = await apiClient.get<StudentGradeSummary>(
      `${BASE_URL}/grades/student/${studentId}/summary/${params}`
    );
    return response.data;
  },

  /**
   * Get student report card
   */
  getStudentReportCard: async (
    studentId: number,
    academicYear: string,
    term?: string
  ): Promise<Blob> => {
    const params = term ? `?term=${term}` : '';
    const response = await apiClient.get(
      `${BASE_URL}/grades/student/${studentId}/report-card/${academicYear}/${params}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// ============================================================================
// FEES INTEGRATION
// ============================================================================

export const feesIntegration = {
  /**
   * Get all fee records for a student
   */
  getStudentFees: async (
    studentId: number,
    filters?: {
      academic_year?: string;
      status?: string;
      fee_type?: string;
    }
  ): Promise<StudentFeeRecord[]> => {
    const params = new URLSearchParams();
    if (filters?.academic_year) params.append('academic_year', filters.academic_year);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.fee_type) params.append('fee_type', filters.fee_type);

    const response = await apiClient.get<StudentFeeRecord[]>(
      `${BASE_URL}/fees/student/${studentId}/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get fee summary for a student
   */
  getStudentFeeSummary: async (
    studentId: number,
    academicYear?: string
  ): Promise<StudentFeeSummary> => {
    const params = academicYear ? `?academic_year=${academicYear}` : '';
    const response = await apiClient.get<StudentFeeSummary>(
      `${BASE_URL}/fees/student/${studentId}/summary/${params}`
    );
    return response.data;
  },

  /**
   * Record a payment for a student
   */
  recordPayment: async (
    studentId: number,
    data: {
      fee_record_id: number;
      amount: number;
      payment_method: string;
      payment_date?: string;
      remarks?: string;
    }
  ): Promise<StudentFeeRecord> => {
    const response = await apiClient.post<StudentFeeRecord>(
      `${BASE_URL}/fees/student/${studentId}/payment/`,
      data
    );
    return response.data;
  },

  /**
   * Generate fee receipt
   */
  generateReceipt: async (studentId: number, paymentId: number): Promise<Blob> => {
    const response = await apiClient.get(
      `${BASE_URL}/fees/student/${studentId}/receipt/${paymentId}/`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// ============================================================================
// LIBRARY INTEGRATION
// ============================================================================

export const libraryIntegration = {
  /**
   * Get all library books issued to a student
   */
  getStudentBooks: async (
    studentId: number,
    filters?: {
      status?: string;
      academic_year?: string;
    }
  ): Promise<StudentLibraryBook[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.academic_year) params.append('academic_year', filters.academic_year);

    const response = await apiClient.get<StudentLibraryBook[]>(
      `${BASE_URL}/library/student/${studentId}/books/?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get library summary for a student
   */
  getStudentLibrarySummary: async (
    studentId: number,
    academicYear?: string
  ): Promise<StudentLibrarySummary> => {
    const params = academicYear ? `?academic_year=${academicYear}` : '';
    const response = await apiClient.get<StudentLibrarySummary>(
      `${BASE_URL}/library/student/${studentId}/summary/${params}`
    );
    return response.data;
  },

  /**
   * Issue a book to a student
   */
  issueBook: async (
    studentId: number,
    data: {
      book_id: number;
      due_date: string;
      remarks?: string;
    }
  ): Promise<StudentLibraryBook> => {
    const response = await apiClient.post<StudentLibraryBook>(
      `${BASE_URL}/library/student/${studentId}/issue/`,
      data
    );
    return response.data;
  },

  /**
   * Return a book from a student
   */
  returnBook: async (
    studentId: number,
    issueId: number,
    data?: {
      return_date?: string;
      condition?: string;
      remarks?: string;
    }
  ): Promise<StudentLibraryBook> => {
    const response = await apiClient.post<StudentLibraryBook>(
      `${BASE_URL}/library/student/${studentId}/return/${issueId}/`,
      data || {}
    );
    return response.data;
  },
};

// ============================================================================
// INTEGRATED PROFILE
// ============================================================================

export const integrationService = {
  /**
   * Get complete integrated profile for a student
   * (Attendance, Grades, Fees, Library data in one call)
   */
  getIntegratedProfile: async (
    studentId: number,
    academicYear?: string
  ): Promise<StudentIntegratedProfile> => {
    const params = academicYear ? `?academic_year=${academicYear}` : '';
    const response = await apiClient.get<StudentIntegratedProfile>(
      `${BASE_URL}/students/${studentId}/integrated-profile/${params}`
    );
    return response.data;
  },

  /**
   * Get quick stats for a student (for dashboard widgets)
   */
  getStudentQuickStats: async (studentId: number) => {
    try {
      const [attendance, grades, fees, library] = await Promise.allSettled([
        attendanceIntegration.getStudentAttendanceSummary(studentId),
        gradesIntegration.getStudentGradeSummary(studentId),
        feesIntegration.getStudentFeeSummary(studentId),
        libraryIntegration.getStudentLibrarySummary(studentId),
      ]);

      return {
        attendance: attendance.status === 'fulfilled' ? attendance.value : null,
        grades: grades.status === 'fulfilled' ? grades.value : null,
        fees: fees.status === 'fulfilled' ? fees.value : null,
        library: library.status === 'fulfilled' ? library.value : null,
      };
    } catch (error) {
      console.error('Error fetching student quick stats:', error);
      throw error;
    }
  },

  /**
   * Check if student has any pending actions across modules
   */
  getStudentPendingActions: async (studentId: number) => {
    const stats = await integrationService.getStudentQuickStats(studentId);

    return {
      overdue_fees: stats.fees?.overdue_amount || 0,
      overdue_books: stats.library?.overdue_books || 0,
      low_attendance: stats.attendance && stats.attendance.attendance_percentage < 75,
      pending_assignments: 0, // To be implemented when assignments module is ready
    };
  },
};

// Export all integration modules
export default {
  attendance: attendanceIntegration,
  grades: gradesIntegration,
  fees: feesIntegration,
  library: libraryIntegration,
  integration: integrationService,
};
