import { TrendingUp, Award, BookOpen, Target } from 'lucide-react';
import { Card, CardContent } from '@mis-components/ui';

interface GPASummaryProps {
  gpa: number;
  averageScore: number;
  totalSubjects: number;
}

export default function GPASummary({ gpa, averageScore, totalSubjects }: GPASummaryProps) {
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGPABgColor = (gpa: number) => {
    if (gpa >= 3.7) return 'from-green-500 to-emerald-600';
    if (gpa >= 3.0) return 'from-blue-500 to-indigo-600';
    if (gpa >= 2.0) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.7) return 'Excellent';
    if (gpa >= 3.0) return 'Good';
    if (gpa >= 2.0) return 'Satisfactory';
    if (gpa >= 1.0) return 'Needs Improvement';
    return 'Poor';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Award className="h-5 w-5 text-indigo-600" />
          Academic Performance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GPA Card */}
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGPABgColor(gpa)} p-6 text-white`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 opacity-80" />
                <span className="text-white/80 text-sm font-medium">GPA</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{gpa.toFixed(2)}</span>
                <span className="text-white/60 text-lg">/ 4.00</span>
              </div>
              <p className="mt-2 text-white/80">{getGPALabel(gpa)}</p>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <span className="text-gray-500 text-sm font-medium">Average Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(1)}
              </span>
              <span className="text-gray-400 text-lg">%</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    averageScore >= 80
                      ? 'bg-green-500'
                      : averageScore >= 60
                      ? 'bg-blue-500'
                      : averageScore >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(averageScore, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Subjects Card */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-5 w-5 text-gray-400" />
              <span className="text-gray-500 text-sm font-medium">Subjects</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{totalSubjects}</span>
              <span className="text-gray-400 text-lg">total</span>
            </div>
            <p className="mt-2 text-gray-500 text-sm">
              All subjects graded
            </p>
          </div>
        </div>

        {/* GPA Scale Reference */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">GPA Scale Reference</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">3.7 - 4.0 (A)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">3.0 - 3.69 (B)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">2.0 - 2.99 (C)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Below 2.0 (D/F)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
