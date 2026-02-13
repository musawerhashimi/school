// ============================================================================
// SCORE CALCULATION UTILITIES
// ============================================================================

import { SCORE_MAX_MARKS } from '../constants';
import type { ExamType, ScoreBreakdown } from '../types';

// ============================================================================
// SCORE BREAKDOWN CALCULATIONS
// ============================================================================

/**
 * Get maximum marks for each component based on exam type
 * @param examType - Exam type (midterm or final)
 * @returns Score breakdown with maximum marks
 */
export function getMaxMarks(examType: ExamType) {
  return SCORE_MAX_MARKS[examType];
}

/**
 * Calculate total marks from a score breakdown
 * @param breakdown - Score breakdown
 * @returns Total marks
 */
export function calculateTotalFromBreakdown(breakdown: ScoreBreakdown): number {
  return breakdown.homework + breakdown.class_activity + breakdown.exam;
}

/**
 * Validate score breakdown against exam type limits
 * @param breakdown - Score breakdown
 * @param examType - Exam type
 * @returns Object with validation results
 */
export function validateScoreBreakdown(
  breakdown: ScoreBreakdown,
  examType: ExamType
): { valid: boolean; errors: string[] } {
  const maxMarks = getMaxMarks(examType);
  const errors: string[] = [];
  
  if (breakdown.homework < 0 || breakdown.homework > maxMarks.homework) {
    errors.push(`Homework marks must be between 0 and ${maxMarks.homework}`);
  }
  
  if (breakdown.class_activity < 0 || breakdown.class_activity > maxMarks.class_activity) {
    errors.push(`Activity marks must be between 0 and ${maxMarks.class_activity}`);
  }
  
  if (breakdown.exam < 0 || breakdown.exam > maxMarks.exam) {
    errors.push(`Exam marks must be between 0 and ${maxMarks.exam}`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Calculate percentage from score breakdown
 * @param breakdown - Score breakdown
 * @param examType - Exam type
 * @returns Percentage score (0-100)
 */
export function calculatePercentageFromBreakdown(
  breakdown: ScoreBreakdown,
  examType: ExamType
): number {
  const totalMarks = calculateTotalFromBreakdown(breakdown);
  const maxMarks = getMaxMarks(examType);
  return Number(((totalMarks / maxMarks.total) * 100).toFixed(2));
}

/**
 * Convert marks to percentage
 * @param marks - Marks obtained
 * @param examType - Exam type
 * @returns Percentage score
 */
export function marksToPercentage(marks: number, examType: ExamType): number {
  const maxMarks = getMaxMarks(examType);
  return Number(((marks / maxMarks.total) * 100).toFixed(2));
}

/**
 * Convert percentage to marks
 * @param percentage - Percentage score
 * @param examType - Exam type
 * @returns Marks based on exam type
 */
export function percentageToMarks(percentage: number, examType: ExamType): number {
  const maxMarks = getMaxMarks(examType);
  return Number((percentage / 100 * maxMarks.total).toFixed(2));
}

/**
 * Calculate required marks to achieve a specific percentage
 * @param targetPercentage - Target percentage
 * @param examType - Exam type
 * @returns Marks needed to achieve target percentage
 */
export function calculateTargetMarksForPercentage(
  targetPercentage: number,
  examType: ExamType
): number {
  return percentageToMarks(targetPercentage, examType);
}

/**
 * Calculate score breakdown from total marks (even distribution)
 * @param totalMarks - Total marks obtained
 * @param examType - Exam type
 * @returns Score breakdown with even distribution
 */
export function distributeMarksEvenly(totalMarks: number, examType: ExamType): ScoreBreakdown {
  const maxMarks = getMaxMarks(examType);
  const totalMax = maxMarks.total;
  
  // Calculate proportional distribution
  const homework = Math.round((maxMarks.homework / totalMax) * totalMarks);
  const classActivity = Math.round((maxMarks.class_activity / totalMax) * totalMarks);
  const exam = Math.round((maxMarks.exam / totalMax) * totalMarks);
  
  // Adjust for rounding errors
  const sum = homework + classActivity + exam;
  let adjustment = totalMarks - sum;
  
  const breakdown: ScoreBreakdown = {
    homework,
    class_activity: classActivity,
    exam,
    total: totalMarks,
  };
  
  // Apply adjustment to the largest component
  if (adjustment > 0) {
    if (breakdown.exam < maxMarks.exam) {
      breakdown.exam += adjustment;
    } else if (breakdown.class_activity < maxMarks.class_activity) {
      breakdown.class_activity += adjustment;
    } else if (breakdown.homework < maxMarks.homework) {
      breakdown.homework += adjustment;
    }
  } else if (adjustment < 0) {
    adjustment = Math.abs(adjustment);
    if (breakdown.exam > 0) {
      breakdown.exam = Math.max(0, breakdown.exam - adjustment);
    } else if (breakdown.class_activity > 0) {
      breakdown.class_activity = Math.max(0, breakdown.class_activity - adjustment);
    } else if (breakdown.homework > 0) {
      breakdown.homework = Math.max(0, breakdown.homework - adjustment);
    }
  }
  
  return breakdown;
}

/**
 * Calculate percentage of each component
 * @param breakdown - Score breakdown
 * @param examType - Exam type
 * @returns Object with percentage of each component
 */
export function calculateComponentPercentages(
  breakdown: ScoreBreakdown,
  examType: ExamType
): Record<keyof Omit<ScoreBreakdown, 'total'>, number> {
  const maxMarks = getMaxMarks(examType);
  
  return {
    homework: Number(((breakdown.homework / maxMarks.homework) * 100).toFixed(1)),
    class_activity: Number(((breakdown.class_activity / maxMarks.class_activity) * 100).toFixed(1)),
    exam: Number(((breakdown.exam / maxMarks.exam) * 100).toFixed(1)),
  };
}

/**
 * Determine if a score breakdown meets minimum requirements for each component
 * @param breakdown - Score breakdown
 * @param requirements - Minimum requirements for each component (0-100% of max marks)
 * @param examType - Exam type
 * @returns Object with boolean for each component and overall result
 */
export function meetsComponentRequirements(
  breakdown: ScoreBreakdown,
  requirements: Partial<Record<keyof Omit<ScoreBreakdown, 'total'>, number>>,
  examType: ExamType
): {
  homework?: boolean;
  class_activity?: boolean;
  exam?: boolean;
  all: boolean;
} {
  const results: {
    homework?: boolean;
    class_activity?: boolean;
    exam?: boolean;
    all: boolean;
  } = { all: true };
  
  const maxMarks = getMaxMarks(examType);
  
  Object.entries(requirements).forEach(([key, minPercentage]) => {
    if (minPercentage) {
      const componentKey = key as keyof Omit<ScoreBreakdown, 'total'>;
      const componentMax = maxMarks[componentKey];
      const componentPercentage = (breakdown[componentKey] / componentMax) * 100;
      const meetsRequirement = componentPercentage >= minPercentage;
      results[componentKey] = meetsRequirement;
      
      if (!meetsRequirement) {
        results.all = false;
      }
    }
  });
  
  return results;
}

/**
 * Calculate score breakdown from percentage
 * @param percentage - Percentage score
 * @param examType - Exam type
 * @returns Score breakdown
 */
export function percentageToBreakdown(percentage: number, examType: ExamType): ScoreBreakdown {
  const marks = percentageToMarks(percentage, examType);
  return distributeMarksEvenly(marks, examType);
}

/**
 * Check if score breakdown is complete (all fields filled)
 * @param breakdown - Score breakdown
 * @returns true if all fields are present and valid
 */
export function isBreakdownComplete(breakdown: Partial<ScoreBreakdown>): boolean {
  return typeof breakdown.homework === 'number' && 
         typeof breakdown.class_activity === 'number' && 
         typeof breakdown.exam === 'number';
}

/**
 * Validate if a single score component is within valid range
 * @param value - Component value
 * @param maxValue - Maximum allowed value
 * @returns true if valid
 */
export function validateScoreComponent(value: number, maxValue: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= maxValue;
}

/**
 * Calculate the weight of each component in percentage
 * @param examType - Exam type
 * @returns Object with weight of each component in percentage
 */
export function getComponentWeights(examType: ExamType): Record<keyof Omit<ScoreBreakdown, 'total'>, number> {
  const maxMarks = getMaxMarks(examType);
  
  return {
    homework: Number(((maxMarks.homework / maxMarks.total) * 100).toFixed(1)),
    class_activity: Number(((maxMarks.class_activity / maxMarks.total) * 100).toFixed(1)),
    exam: Number(((maxMarks.exam / maxMarks.total) * 100).toFixed(1)),
  };
}
