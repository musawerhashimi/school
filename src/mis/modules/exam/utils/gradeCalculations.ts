// ============================================================================
// GRADE CALCULATION UTILITIES
// ============================================================================

import { GRADE_LETTERS, GRADE_LETTER_OPTIONS } from '../constants';
import type { GradeLetter } from '../types';

// ============================================================================
// GRADE CALCULATIONS
// ============================================================================

/**
 * Calculate letter grade from percentage
 * @param percentage - Percentage score (0-100)
 * @returns Grade letter (A+ to F)
 */
export function calculateLetterGrade(percentage: number): GradeLetter {
  for (const [grade, config] of Object.entries(GRADE_LETTERS)) {
    if (percentage >= config.minPercentage && percentage <= config.maxPercentage) {
      return grade as GradeLetter;
    }
  }
  
  // Default to F if percentage is outside valid range
  return 'F';
}

/**
 * Calculate GPA from letter grade
 * @param grade - Grade letter
 * @returns GPA value (0.0 - 4.0)
 */
export function calculateGPA(grade: GradeLetter): number {
  return GRADE_LETTERS[grade]?.gpa || 0.0;
}

/**
 * Calculate average GPA from multiple grades
 * @param grades - Array of grade letters
 * @returns Average GPA
 */
export function calculateAverageGPA(grades: GradeLetter[]): number {
  if (grades.length === 0) return 0.0;
  
  const totalGPA = grades.reduce((sum, grade) => sum + calculateGPA(grade), 0);
  return Number((totalGPA / grades.length).toFixed(2));
}

/**
 * Check if a percentage is a passing grade
 * @param percentage - Percentage score
 * @param passPercentage - Minimum passing percentage (default: 40%)
 * @returns true if passing, false otherwise
 */
export function isPassingGrade(percentage: number, passPercentage: number = 40): boolean {
  return percentage >= passPercentage;
}

/**
 * Calculate total marks from percentage and total possible marks
 * @param percentage - Percentage score (0-100)
 * @param totalMarks - Total possible marks
 * @returns Calculated marks
 */
export function calculateMarksFromPercentage(percentage: number, totalMarks: number): number {
  return Number((percentage / 100 * totalMarks).toFixed(2));
}

/**
 * Calculate percentage from marks
 * @param marksObtained - Marks obtained
 * @param totalMarks - Total possible marks
 * @returns Percentage score (0-100)
 */
export function calculatePercentage(marksObtained: number, totalMarks: number): number {
  if (totalMarks === 0) return 0;
  return Number(((marksObtained / totalMarks) * 100).toFixed(2));
}

/**
 * Calculate grade distribution from percentages
 * @param percentages - Array of percentages
 * @returns Object showing count of each grade letter
 */
export function calculateGradeDistribution(percentages: number[]): Record<GradeLetter, number> {
  const distribution: Record<GradeLetter, number> = Object.fromEntries(
    GRADE_LETTER_OPTIONS.map(grade => [grade, 0])
  ) as Record<GradeLetter, number>;

  percentages.forEach(percentage => {
    const grade = calculateLetterGrade(percentage);
    distribution[grade] = (distribution[grade] || 0) + 1;
  });

  return distribution;
}

/**
 * Calculate statistics from grades
 * @param percentages - Array of percentages
 * @param passPercentage - Minimum passing percentage (default: 40%)
 * @returns Statistics object
 */
export function calculateGradeStatistics(
  percentages: number[],
  passPercentage: number = 40
): {
  count: number;
  average: number;
  highest: number;
  lowest: number;
  passCount: number;
  failCount: number;
  passRate: number;
} {
  const count = percentages.length;
  
  if (count === 0) {
    return {
      count: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      passCount: 0,
      failCount: 0,
      passRate: 0,
    };
  }

  const sum = percentages.reduce((acc, percentage) => acc + percentage, 0);
  const average = Number((sum / count).toFixed(2));
  const highest = Math.max(...percentages);
  const lowest = Math.min(...percentages);
  const passCount = percentages.filter(p => isPassingGrade(p, passPercentage)).length;
  const failCount = count - passCount;
  const passRate = Number(((passCount / count) * 100).toFixed(2));

  return {
    count,
    average,
    highest,
    lowest,
    passCount,
    failCount,
    passRate,
  };
}

/**
 * Get grade description and color for display
 * @param grade - Grade letter
 * @returns Object with label and color information
 */
export function getGradeInfo(grade: GradeLetter) {
  const config = GRADE_LETTERS[grade];
  return {
    label: grade,
    description: config.description,
    minPercentage: config.minPercentage,
    maxPercentage: config.maxPercentage,
    gpa: config.gpa,
  };
}

/**
 * Check if a grade falls within a specific range
 * @param percentage - Percentage score
 * @param minPercentage - Minimum percentage (inclusive)
 * @param maxPercentage - Maximum percentage (inclusive)
 * @returns true if percentage is within range
 */
export function isPercentageInRange(
  percentage: number,
  minPercentage: number,
  maxPercentage: number
): boolean {
  return percentage >= minPercentage && percentage <= maxPercentage;
}

/**
 * Calculate total marks needed to achieve a specific percentage
 * @param percentage - Target percentage
 * @param totalMarks - Total possible marks
 * @returns Marks needed to achieve target percentage
 */
export function calculateTargetMarks(percentage: number, totalMarks: number): number {
  return Number((percentage / 100 * totalMarks).toFixed(2));
}

/**
 * Calculate required marks for next grade
 * @param currentPercentage - Current percentage
 * @param nextGrade - Target next grade letter
 * @param totalMarks - Total possible marks
 * @returns Marks needed to reach next grade
 */
export function calculateRequiredMarksForNextGrade(
  currentPercentage: number,
  nextGrade: GradeLetter,
  totalMarks: number
): number {
  const currentMarks = calculateMarksFromPercentage(currentPercentage, totalMarks);
  const targetPercentage = GRADE_LETTERS[nextGrade].minPercentage;
  const targetMarks = calculateMarksFromPercentage(targetPercentage, totalMarks);
  
  return Math.max(0, targetMarks - currentMarks);
}

/**
 * Calculate cumulative percentage from multiple exam scores
 * @param examScores - Array of scores with marks and total
 * @returns Cumulative percentage
 */
export function calculateCumulativePercentage(
  examScores: { marksObtained: number; totalMarks: number }[]
): number {
  const totalMarksObtained = examScores.reduce((sum, score) => sum + score.marksObtained, 0);
  const totalPossibleMarks = examScores.reduce((sum, score) => sum + score.totalMarks, 0);
  
  if (totalPossibleMarks === 0) return 0;
  
  return Number(((totalMarksObtained / totalPossibleMarks) * 100).toFixed(2));
}

/**
 * Calculate weighted average
 * @param scores - Array of scores with value and weight
 * @returns Weighted average
 */
export function calculateWeightedAverage(
  scores: { value: number; weight: number }[]
): number {
  const totalWeight = scores.reduce((sum, score) => sum + score.weight, 0);
  
  if (totalWeight === 0) return 0;
  
  const weightedSum = scores.reduce((sum, score) => sum + score.value * score.weight, 0);
  return Number((weightedSum / totalWeight).toFixed(2));
}
