import React from 'react';
import { BookOpen, PenTool, Award } from 'lucide-react';
import { Card, CardContent, Progress } from '@mis-components/ui';
import { calculatePercentageFromBreakdown, getMaxMarks } from '../utils/scoreCalculations';
import type { ScoreBreakdown as ScoreBreakdownType, ExamType } from '../types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownType;
  examType: ExamType;
  className?: string;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  breakdown,
  examType,
  className = '',
}) => {
  const maxMarks = getMaxMarks(examType);
  const percentage = calculatePercentageFromBreakdown(breakdown, examType);

  const totalPercentage = calculatePercentageFromBreakdown(
    {
      homework: maxMarks.homework,
      class_activity: maxMarks.class_activity,
      exam: maxMarks.exam,
      total: maxMarks.total,
    },
    examType
  );

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Score Breakdown</span>
            <span className="text-sm text-gray-600">{percentage}% of {totalPercentage}%</span>
          </div>

          {/* Homework Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Homework</span>
              </div>
              <span className="text-sm font-medium">
                {breakdown.homework}/{maxMarks.homework}
              </span>
            </div>
            <Progress
              value={(breakdown.homework / maxMarks.homework) * 100}
              className="h-2"
            />
          </div>

          {/* Class Activity Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-green-500" />
                <span className="text-sm">Class Activity</span>
              </div>
              <span className="text-sm font-medium">
                {breakdown.class_activity}/{maxMarks.class_activity}
              </span>
            </div>
            <Progress
              value={(breakdown.class_activity / maxMarks.class_activity) * 100}
              className="h-2"
            />
          </div>

          {/* Exam Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Exam</span>
              </div>
              <span className="text-sm font-medium">
                {breakdown.exam}/{maxMarks.exam}
              </span>
            </div>
            <Progress
              value={(breakdown.exam / maxMarks.exam) * 100}
              className="h-2"
            />
          </div>

          {/* Total Score */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold">
                {breakdown.total}/{maxMarks.total}
              </span>
            </div>
            <Progress
              value={(breakdown.total / maxMarks.total) * 100}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBreakdown;
