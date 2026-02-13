import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import integrationService, {
  attendanceIntegration,
  gradesIntegration,
  feesIntegration,
  libraryIntegration,
} from '../services/integrationService';
import { toast } from 'react-hot-toast';

// Query Keys
export const studentIntegrationKeys = {
  all: ['student-integration'] as const,
  attendance: (studentId: number) => [...studentIntegrationKeys.all, 'attendance', studentId] as const,
  attendanceSummary: (studentId: number, year?: string) =>
    [...studentIntegrationKeys.attendance(studentId), 'summary', year] as const,
  grades: (studentId: number) => [...studentIntegrationKeys.all, 'grades', studentId] as const,
  gradeSummary: (studentId: number, year?: string) =>
    [...studentIntegrationKeys.grades(studentId), 'summary', year] as const,
  fees: (studentId: number) => [...studentIntegrationKeys.all, 'fees', studentId] as const,
  feeSummary: (studentId: number, year?: string) =>
    [...studentIntegrationKeys.fees(studentId), 'summary', year] as const,
  library: (studentId: number) => [...studentIntegrationKeys.all, 'library', studentId] as const,
  librarySummary: (studentId: number, year?: string) =>
    [...studentIntegrationKeys.library(studentId), 'summary', year] as const,
  integratedProfile: (studentId: number, year?: string) =>
    [...studentIntegrationKeys.all, 'profile', studentId, year] as const,
  quickStats: (studentId: number) =>
    [...studentIntegrationKeys.all, 'quick-stats', studentId] as const,
  pendingActions: (studentId: number) =>
    [...studentIntegrationKeys.all, 'pending-actions', studentId] as const,
};

// ============================================================================
// ATTENDANCE HOOKS
// ============================================================================

export function useStudentAttendance(
  studentId: number,
  filters?: { start_date?: string; end_date?: string; status?: string }
) {
  return useQuery({
    queryKey: [...studentIntegrationKeys.attendance(studentId), filters],
    queryFn: () => attendanceIntegration.getStudentAttendance(studentId, filters),
    enabled: !!studentId && studentId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useStudentAttendanceSummary(studentId: number, academicYear?: string) {
  return useQuery({
    queryKey: studentIntegrationKeys.attendanceSummary(studentId, academicYear),
    queryFn: () => attendanceIntegration.getStudentAttendanceSummary(studentId, academicYear),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: number;
      data: {
        date: string;
        status: 'present' | 'absent' | 'late' | 'excused';
        remarks?: string;
      };
    }) => attendanceIntegration.markAttendance(studentId, data),
    onMutate: () => {
      toast.loading('Marking attendance...', { id: 'mark-attendance' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to mark attendance', {
        id: 'mark-attendance',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentIntegrationKeys.attendance(studentId),
      });
      toast.success('Attendance marked successfully!', { id: 'mark-attendance' });
    },
  });
}

// ============================================================================
// GRADES HOOKS
// ============================================================================

export function useStudentGrades(
  studentId: number,
  filters?: { academic_year?: string; subject_id?: number; assessment_type?: string }
) {
  return useQuery({
    queryKey: [...studentIntegrationKeys.grades(studentId), filters],
    queryFn: () => gradesIntegration.getStudentGrades(studentId, filters),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudentGradeSummary(studentId: number, academicYear?: string) {
  return useQuery({
    queryKey: studentIntegrationKeys.gradeSummary(studentId, academicYear),
    queryFn: () => gradesIntegration.getStudentGradeSummary(studentId, academicYear),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudentReportCard() {
  return useMutation({
    mutationFn: ({
      studentId,
      academicYear,
      term,
    }: {
      studentId: number;
      academicYear: string;
      term?: string;
    }) => gradesIntegration.getStudentReportCard(studentId, academicYear, term),
    onMutate: () => {
      toast.loading('Generating report card...', { id: 'report-card' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate report card', {
        id: 'report-card',
      });
    },
    onSuccess: (blob) => {
      // Download the PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-card-${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Report card downloaded!', { id: 'report-card' });
    },
  });
}

// ============================================================================
// FEES HOOKS
// ============================================================================

export function useStudentFees(
  studentId: number,
  filters?: { academic_year?: string; status?: string; fee_type?: string }
) {
  return useQuery({
    queryKey: [...studentIntegrationKeys.fees(studentId), filters],
    queryFn: () => feesIntegration.getStudentFees(studentId, filters),
    enabled: !!studentId && studentId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentFeeSummary(studentId: number, academicYear?: string) {
  return useQuery({
    queryKey: studentIntegrationKeys.feeSummary(studentId, academicYear),
    queryFn: () => feesIntegration.getStudentFeeSummary(studentId, academicYear),
    enabled: !!studentId && studentId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: number;
      data: {
        fee_record_id: number;
        amount: number;
        payment_method: string;
        payment_date?: string;
        remarks?: string;
      };
    }) => feesIntegration.recordPayment(studentId, data),
    onMutate: () => {
      toast.loading('Recording payment...', { id: 'record-payment' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to record payment', {
        id: 'record-payment',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentIntegrationKeys.fees(studentId),
      });
      toast.success('Payment recorded successfully!', { id: 'record-payment' });
    },
  });
}

export function useGenerateFeeReceipt() {
  return useMutation({
    mutationFn: ({ studentId, paymentId }: { studentId: number; paymentId: number }) =>
      feesIntegration.generateReceipt(studentId, paymentId),
    onMutate: () => {
      toast.loading('Generating receipt...', { id: 'fee-receipt' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to generate receipt', {
        id: 'fee-receipt',
      });
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fee-receipt-${Date.now()}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Receipt downloaded!', { id: 'fee-receipt' });
    },
  });
}

// ============================================================================
// LIBRARY HOOKS
// ============================================================================

export function useStudentBooks(
  studentId: number,
  filters?: { status?: string; academic_year?: string }
) {
  return useQuery({
    queryKey: [...studentIntegrationKeys.library(studentId), filters],
    queryFn: () => libraryIntegration.getStudentBooks(studentId, filters),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudentLibrarySummary(studentId: number, academicYear?: string) {
  return useQuery({
    queryKey: studentIntegrationKeys.librarySummary(studentId, academicYear),
    queryFn: () => libraryIntegration.getStudentLibrarySummary(studentId, academicYear),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIssueBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      data,
    }: {
      studentId: number;
      data: {
        book_id: number;
        due_date: string;
        remarks?: string;
      };
    }) => libraryIntegration.issueBook(studentId, data),
    onMutate: () => {
      toast.loading('Issuing book...', { id: 'issue-book' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to issue book', {
        id: 'issue-book',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentIntegrationKeys.library(studentId),
      });
      toast.success('Book issued successfully!', { id: 'issue-book' });
    },
  });
}

export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      issueId,
      data,
    }: {
      studentId: number;
      issueId: number;
      data?: {
        return_date?: string;
        condition?: string;
        remarks?: string;
      };
    }) => libraryIntegration.returnBook(studentId, issueId, data),
    onMutate: () => {
      toast.loading('Returning book...', { id: 'return-book' });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to return book', {
        id: 'return-book',
      });
    },
    onSuccess: (_, { studentId }) => {
      queryClient.invalidateQueries({
        queryKey: studentIntegrationKeys.library(studentId),
      });
      toast.success('Book returned successfully!', { id: 'return-book' });
    },
  });
}

// ============================================================================
// INTEGRATED PROFILE HOOKS
// ============================================================================

export function useStudentIntegratedProfile(studentId: number, academicYear?: string) {
  return useQuery({
    queryKey: studentIntegrationKeys.integratedProfile(studentId, academicYear),
    queryFn: () => integrationService.integration.getIntegratedProfile(studentId, academicYear),
    enabled: !!studentId && studentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useStudentQuickStats(studentId: number) {
  return useQuery({
    queryKey: studentIntegrationKeys.quickStats(studentId),
    queryFn: () => integrationService.integration.getStudentQuickStats(studentId),
    enabled: !!studentId && studentId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentPendingActions(studentId: number) {
  return useQuery({
    queryKey: studentIntegrationKeys.pendingActions(studentId),
    queryFn: () => integrationService.integration.getStudentPendingActions(studentId),
    enabled: !!studentId && studentId > 0,
    staleTime: 2 * 60 * 1000,
  });
}
