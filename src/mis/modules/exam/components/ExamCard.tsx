import React from 'react';
import { Calendar, BookOpen, Edit2, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, Badge, Button } from '@mis-components/ui';
import { formatDate, truncateText } from '../utils/examHelpers';
import type { ExamApiResponse } from '../types';

interface ExamCardProps {
  exam: ExamApiResponse;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  compact?: boolean;
}

export const ExamCard: React.FC<ExamCardProps> = ({ 
  exam, 
  onView, 
  onEdit, 
  onDelete, 
  compact = false 
}) => {
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderStats = () => (
    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(exam.start_date)}</span>
      </div>
      <div className="flex items-center gap-1">
        <BookOpen className="w-4 h-4" />
        <span>Exam: {exam.name}</span>
      </div>
    </div>
  );

  const renderActions = () => (
    <div className="flex items-center gap-2">
      {onView && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onView(exam.id)}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          View
        </Button>
      )}
      {onEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(exam.id)}
          leftIcon={<Edit2 className="w-4 h-4" />}
        >
          Edit
        </Button>
      )}
      {onDelete && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(exam.id)}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete
        </Button>
      )}
    </div>
  );

  if (compact) {
    return (
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {truncateText(exam.name, 30)}
              </h3>
              <Badge variant={getStatusColor(exam.status)} className="text-xs">
                {exam.status}
              </Badge>
            </div>
          </div>
          {renderStats()}
          {onView || onEdit || onDelete ? (
            <div className="mt-4">
              {renderActions()}
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{exam.name}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={getStatusColor(exam.status)} className="text-sm">
                {exam.status}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {exam.exam_type}
              </Badge>
            </div>
          </div>
          {onView || onEdit || onDelete ? renderActions() : null}
        </div>
        {renderStats()}
      </CardContent>
    </Card>
  );
};

export default ExamCard;
