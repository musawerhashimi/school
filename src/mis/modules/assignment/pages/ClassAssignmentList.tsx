/**
 * ClassAssignmentList Page
 * Lists all classes with their assignment counts and stats
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  School,
  Search,
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Spinner,
  Alert,
} from '@mis-components/ui';
import { PageHeader } from '@mis-components/index';
import { useClassesWithAssignments } from '../hooks/useAssignments';
import type { ClassWithAssignments } from '../types';

export default function ClassAssignmentList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching
  const { data: classes, isLoading, error } = useClassesWithAssignments({
    search: searchQuery || undefined,
  });

  // Filter classes based on search
  const filteredClasses = classes?.filter((cls) =>
    cls.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    totalClasses: classes?.length || 0,
    totalAssignments: classes?.reduce((sum, c) => sum + c.total_assignments, 0) || 0,
    activeAssignments: classes?.reduce((sum, c) => sum + c.active_assignments, 0) || 0,
    avgScore: classes?.length
      ? (classes.reduce((sum, c) => sum + (c.average_score || 0), 0) / classes.length).toFixed(1)
      : 0,
  };

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">Failed to load classes</Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <PageHeader
        title="Classes"
        subtitle="View and manage assignments by class"
        icon={School}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <School className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Assignments</p>
                <p className="text-2xl font-bold">{stats.totalAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Score</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" label="Loading classes..." />
        </div>
      ) : filteredClasses && filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              classData={cls}
              onClick={() => navigate(`/mis/assignments/classes/${cls.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Classes Found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search' : 'No classes available'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Class Card Component
function ClassCard({
  classData,
  onClick,
}: {
  classData: ClassWithAssignments;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] overflow-hidden"
      onClick={onClick}
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{classData.display_name}</h3>
              <p className="text-white/80 text-sm">{classData.academic_year_display}</p>
            </div>
          </div>
          <Badge
            variant={classData.is_active ? 'success' : 'secondary'}
            className="bg-white/20 text-white border-0"
          >
            {classData.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-indigo-600">{classData.total_assignments}</p>
            <p className="text-xs text-gray-500">Assignments</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{classData.active_assignments}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Students
            </span>
            <span className="font-medium">{classData.enrolled_count}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </span>
            <span className="font-medium text-yellow-600">{classData.pending_submissions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Score
            </span>
            <span className="font-medium">
              {classData.average_score !== null ? `${classData.average_score.toFixed(1)}%` : '—'}
            </span>
          </div>
        </div>

        {/* Teacher */}
        {classData.class_teacher_name && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500">Class Teacher</p>
            <p className="text-sm font-medium">{classData.class_teacher_name}</p>
          </div>
        )}

        {/* View Button */}
        <Button
          variant="ghost"
          className="w-full mt-4 justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Assignments
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
