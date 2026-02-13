// ============================================================================
// EXAM MODULE HELPER FUNCTIONS
// ============================================================================

import type { ExamType, ExamStatus, ExamApiResponse, ExamScheduleApiResponse } from '../types';

// ============================================================================
// DATE AND TIME UTILITIES
// ============================================================================

/**
 * Format date string for display (YYYY-MM-DD)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time string (HH:MM)
 * @param timeString - Time string (HH:MM format)
 * @returns Formatted time string
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  try {
    return timeString.replace(/(\d{2}):(\d{2}).*/, '$1:$2');
  } catch {
    return timeString;
  }
}

/**
 * Calculate duration in minutes from time strings
 * @param startTime - Start time (HH:MM)
 * @param endTime - End time (HH:MM)
 * @returns Duration in minutes
 */
export function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotal = startHours * 60 + startMinutes;
  const endTotal = endHours * 60 + endMinutes;
  
  return endTotal - startTotal;
}

/**
 * Calculate exam end time from start time and duration
 * @param startTime - Start time (HH:MM)
 * @param durationMinutes - Duration in minutes
 * @returns End time (HH:MM)
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const totalMinutes = startHours * 60 + startMinutes + durationMinutes;
  
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

/**
 * Check if a date is in the past
 * @param dateString - ISO date string
 * @returns true if date is in the past
 */
export function isDatePast(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare only dates
  
  return date < now;
}

/**
 * Check if a date is in the future
 * @param dateString - ISO date string
 * @returns true if date is in the future
 */
export function isDateFuture(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare only dates
  
  return date > now;
}

// ============================================================================
// EXAM TYPE AND STATUS UTILITIES
// ============================================================================

/**
 * Get exam type display label
 * @param examType - Exam type
 * @returns Display label
 */
export function getExamTypeLabel(examType: ExamType): string {
  switch (examType) {
    case 'midterm':
      return 'Midterm Exam';
    case 'final':
      return 'Final Exam';
    default:
      return 'Unknown';
  }
}

/**
 * Get exam status display label
 * @param status - Exam status
 * @returns Display label
 */
export function getExamStatusLabel(status: ExamStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'scheduled':
      return 'Scheduled';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

/**
 * Check if exam is active (scheduled or in progress)
 * @param status - Exam status
 * @returns true if exam is active
 */
export function isExamActive(status: ExamStatus): boolean {
  return status === 'scheduled' || status === 'in_progress';
}

/**
 * Check if exam is completed
 * @param status - Exam status
 * @returns true if exam is completed
 */
export function isExamCompleted(status: ExamStatus): boolean {
  return status === 'completed';
}

/**
 * Check if exam is in draft state
 * @param status - Exam status
 * @returns true if exam is in draft
 */
export function isExamDraft(status: ExamStatus): boolean {
  return status === 'draft';
}

// ============================================================================
// EXAM SCHEDULE UTILITIES
// ============================================================================

/**
 * Get schedule status display
 * @param schedule - Exam schedule
 * @returns Status label
 */
export function getScheduleStatus(schedule: ExamScheduleApiResponse): string {
  if (schedule.is_completed) {
    return 'Completed';
  }
  
  if (isDatePast(schedule.exam_date)) {
    return 'Missed';
  }
  
  if (schedule.exam_date === new Date().toISOString().split('T')[0]) {
    return 'Today';
  }
  
  if (isDateFuture(schedule.exam_date)) {
    return 'Upcoming';
  }
  
  return 'Scheduled';
}

/**
 * Check if a schedule has conflicts
 * @param schedule - Exam schedule
 * @param allSchedules - All exam schedules to check against
 * @returns Array of conflicting schedules
 */
export function findScheduleConflicts(
  schedule: ExamScheduleApiResponse,
  allSchedules: ExamScheduleApiResponse[]
): ExamScheduleApiResponse[] {
  const conflicts: ExamScheduleApiResponse[] = [];
  
  for (const other of allSchedules) {
    if (schedule.id === other.id) continue;
    
    // Check if same date
    if (schedule.exam_date !== other.exam_date) continue;
    
    // Check time overlap
    const startTime1 = parseTime(schedule.start_time);
    const endTime1 = parseTime(schedule.end_time);
    const startTime2 = parseTime(other.start_time);
    const endTime2 = parseTime(other.end_time);
    
    if (startTime1 < endTime2 && startTime2 < endTime1) {
      // Check if same class or same room
      if (schedule.class_instance === other.class_instance || schedule.room === other.room) {
        conflicts.push(other);
      }
    }
  }
  
  return conflicts;
}

/**
 * Parse time string to minutes since midnight
 * @param timeString - Time string (HH:MM)
 * @returns Minutes since midnight
 */
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

// ============================================================================
// SEARCH AND FILTER UTILITIES
// ============================================================================

/**
 * Filter exams by search query
 * @param exams - Array of exams
 * @param query - Search query
 * @returns Filtered exams
 */
export function searchExams(exams: ExamApiResponse[], query: string): ExamApiResponse[] {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return exams;
  
  return exams.filter(exam => {
    return (
      exam.name.toLowerCase().includes(searchTerm) ||
      exam.display_name.toLowerCase().includes(searchTerm) ||
      exam.exam_type_display.toLowerCase().includes(searchTerm) ||
      exam.academic_year_display.toLowerCase().includes(searchTerm)
    );
  });
}

/**
 * Filter exams by type
 * @param exams - Array of exams
 * @param type - Exam type to filter by (or undefined for all)
 * @returns Filtered exams
 */
export function filterExamsByType(exams: ExamApiResponse[], type?: ExamType): ExamApiResponse[] {
  if (!type) return exams;
  return exams.filter(exam => exam.exam_type === type);
}

/**
 * Filter exams by status
 * @param exams - Array of exams
 * @param status - Exam status to filter by (or undefined for all)
 * @returns Filtered exams
 */
export function filterExamsByStatus(exams: ExamApiResponse[], status?: ExamStatus): ExamApiResponse[] {
  if (!status) return exams;
  return exams.filter(exam => exam.status === status);
}

// ============================================================================
// DISPLAY UTILITIES
// ============================================================================

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format marks for display with appropriate suffix
 * @param marks - Marks value
 * @param maxMarks - Maximum marks (optional)
 * @returns Formatted marks string
 */
export function formatMarks(marks: number, maxMarks?: number): string {
  if (typeof maxMarks === 'number') {
    return `${marks}/${maxMarks}`;
  }
  return String(marks);
}

/**
 * Format percentage for display
 * @param percentage - Percentage value
 * @param suffix - Whether to include % suffix (default: true)
 * @returns Formatted percentage string
 */
export function formatPercentage(percentage: number, suffix: boolean = true): string {
  const value = Number(percentage).toFixed(1);
  return suffix ? `${value}%` : value;
}

/**
 * Get status badge color class based on status
 * @param status - Exam status
 * @returns CSS class string
 */
export function getStatusBadgeClass(status: ExamStatus): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// ============================================================================
// DATA VALIDATION UTILITIES
// ============================================================================

/**
 * Validate exam name
 * @param name - Exam name
 * @returns Validation result
 */
export function validateExamName(name: string): { valid: boolean; error?: string } {
  if (!name.trim()) {
    return { valid: false, error: 'Exam name is required' };
  }
  
  if (name.length < 3) {
    return { valid: false, error: 'Exam name must be at least 3 characters' };
  }
  
  if (name.length > 200) {
    return { valid: false, error: 'Exam name cannot exceed 200 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate date range
 * @param startDate - Start date string
 * @param endDate - End date string
 * @returns Validation result
 */
export function validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start > end) {
    return { valid: false, error: 'End date must be after start date' };
  }
  
  return { valid: true };
}

/**
 * Validate percentage value
 * @param percentage - Percentage value
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: 100)
 * @returns Validation result
 */
export function validatePercentage(
  percentage: number,
  min: number = 0,
  max: number = 100
): { valid: boolean; error?: string } {
  if (!Number.isFinite(percentage)) {
    return { valid: false, error: 'Percentage must be a number' };
  }
  
  if (percentage < min || percentage > max) {
    return { valid: false, error: `Percentage must be between ${min} and ${max}` };
  }
  
  return { valid: true };
}

// ============================================================================
// SORTING UTILITIES
// ============================================================================

/**
 * Sort exams by start date
 * @param exams - Array of exams
 * @param ascending - Whether to sort ascending (default: true)
 * @returns Sorted exams
 */
export function sortExamsByDate(exams: ExamApiResponse[], ascending: boolean = true): ExamApiResponse[] {
  return [...exams].sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return ascending 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });
}

/**
 * Sort exams by name
 * @param exams - Array of exams
 * @param ascending - Whether to sort ascending (default: true)
 * @returns Sorted exams
 */
export function sortExamsByName(exams: ExamApiResponse[], ascending: boolean = true): ExamApiResponse[] {
  return [...exams].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
}

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Convert number to persian digits
 * @param num - Number or string
 * @returns String with persian digits
 */
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, digit => persianDigits[parseInt(digit)]);
}

/**
 * Convert number to arabic digits
 * @param num - Number or string
 * @returns String with arabic digits
 */
export function toArabicDigits(num: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num).replace(/[0-9]/g, digit => arabicDigits[parseInt(digit)]);
}

/**
 * Convert number to appropriate locale digits based on language
 * @param num - Number or string
 * @param language - Language code (fa, ps, en)
 * @returns String with appropriate locale digits
 */
export function toLocaleDigits(num: number | string, language: string = 'en'): string {
  switch (language) {
    case 'fa':
      return toPersianDigits(num);
    case 'ps':
      return toArabicDigits(num);
    default:
      return String(num);
  }
}

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

/**
 * Generate ARIA label for exam card
 * @param exam - Exam data
 * @returns ARIA label string
 */
export function getExamCardAriaLabel(exam: ExamApiResponse): string {
  return `${exam.name}, ${getExamTypeLabel(exam.exam_type)}, ${formatDate(exam.start_date)} to ${formatDate(exam.end_date)}, Status: ${getExamStatusLabel(exam.status)}`;
}

/**
 * Generate ARIA label for grade entry table
 * @param examName - Exam name
 * @param className - Class name
 * @param subjectName - Subject name
 * @returns ARIA label string
 */
export function getGradeEntryAriaLabel(examName: string, className: string, subjectName: string): string {
  return `Grade entry table for ${examName} - ${className} - ${subjectName}`;
}
