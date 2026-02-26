import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Eye,
  CheckCircle,
  Send,
  RefreshCw,
  Users,
  Filter,
} from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Select,
  Spinner,
  Alert,
  Modal,
  Checkbox,
} from '@mis-components/ui';
import {
  useReportCards,
  useGenerateReportCards,
  useBulkApproveReportCards,
  usePublishReportCards,
} from '../hooks/useReportCards';
import { useClassInstances } from '../../reference/hooks/useClassInstances';
import { useAcademicYears } from '../../reference/hooks/useAcademicYears';
import type { ReportCardFilters, ReportCardApiResponse, ReportCardStatus } from '../types';

const STATUS_COLORS: Record<ReportCardStatus, string> = {
  draft: 'secondary',
  generated: 'info',
  approved: 'warning',
  published: 'success',
};

const PROMOTION_COLORS: Record<string, string> = {
  pending: 'secondary',
  promoted: 'success',
  repeated: 'error',
  conditionally_promoted: 'warning',
};

export default function ReportCardList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportCardFilters>({ page: 1, page_size: 50 });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [generateModal, setGenerateModal] = useState<{
    open: boolean;
    classId?: number;
    yearId?: number;
  }>({ open: false });
  const [publishModal, setPublishModal] = useState(false);

  // Fetch data
  const { data: yearsData } = useAcademicYears({ page_size: 50 });
  const { data: classesData, isLoading: isLoadingClasses } = useClassInstances({
    academic_year: filters.academic_year,
    is_active: true,
    page_size: 100,
  });
  const { data: reportCardsData, isLoading, isError, error } = useReportCards(filters);

  // Mutations
  const generateReportCards = useGenerateReportCards();
  const bulkApprove = useBulkApproveReportCards();
  const publish = usePublishReportCards();

  // Selection handlers
  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (reportCardsData?.results) {
      const allIds = reportCardsData.results.map((rc) => rc.id);
      setSelectedIds(allIds);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  // Action handlers
  const handleGenerate = () => {
    if (generateModal.classId && generateModal.yearId) {
      generateReportCards.mutate(
        {
          academic_year: generateModal.yearId,
          class_instance: generateModal.classId,
        },
        {
          onSuccess: () => {
            setGenerateModal({ open: false });
          },
        }
      );
    }
  };

  const handleBulkApprove = () => {
    if (selectedIds.length > 0) {
      bulkApprove.mutate(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
        },
      });
    }
  };

  const handlePublish = () => {
    if (selectedIds.length > 0) {
      publish.mutate(
        { ids: selectedIds },
        {
          onSuccess: () => {
            setSelectedIds([]);
            setPublishModal(false);
          },
        }
      );
    }
  };

  // Get selected report cards for actions
  const selectedReportCards = reportCardsData?.results.filter((rc) =>
    selectedIds.includes(rc.id)
  );
  const canApprove = selectedReportCards?.some((rc) => rc.status === 'generated');
  const canPublish = selectedReportCards?.some((rc) => rc.status === 'approved');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading report cards..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Cards"
        subtitle="Generate, approve, and publish student report cards"
        actions={[
          {
            label: 'Generate Report Cards',
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: () => setGenerateModal({ open: true }),
            variant: 'primary',
          },
        ]}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select
              label="Academic Year"
              value={filters.academic_year?.toString() || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  academic_year: e.target.value ? Number(e.target.value) : undefined,
                  class_instance: undefined,
                  page: 1,
                }))
              }
              options={[
                { label: 'All Years', value: '' },
                ...(yearsData?.results || []).map((y) => ({
                  label: y.display_name,
                  value: String(y.id),
                })),
              ]}
            />

            <Select
              label="Class"
              value={filters.class_instance?.toString() || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  class_instance: e.target.value ? Number(e.target.value) : undefined,
                  page: 1,
                }))
              }
              disabled={!filters.academic_year || isLoadingClasses}
              options={[
                { label: 'All Classes', value: '' },
                ...(classesData?.results || []).map((c) => ({
                  label: c.display_name,
                  value: String(c.id),
                })),
              ]}
            />

            <Select
              label="Status"
              value={filters.status || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  status: (e.target.value as ReportCardStatus) || undefined,
                  page: 1,
                }))
              }
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Generated', value: 'generated' },
                { label: 'Approved', value: 'approved' },
                { label: 'Published', value: 'published' },
              ]}
            />

            <Select
              label="Pass/Fail"
              value={filters.is_overall_pass?.toString() || ''}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  is_overall_pass:
                    e.target.value === '' ? undefined : e.target.value === 'true',
                  page: 1,
                }))
              }
              options={[
                { label: 'All Results', value: '' },
                { label: 'Passed Only', value: 'true' },
                { label: 'Failed Only', value: 'false' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedIds.length} selected
                </span>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {canApprove && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<CheckCircle className="h-4 w-4" />}
                    onClick={handleBulkApprove}
                    loading={bulkApprove.isPending}
                  >
                    Approve Selected
                  </Button>
                )}
                {canPublish && (
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Send className="h-4 w-4" />}
                    onClick={() => setPublishModal(true)}
                  >
                    Publish Selected
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Alert variant="error" title="Error">
          {error instanceof Error ? error.message : 'Failed to load report cards'}
        </Alert>
      )}

      {/* Report Cards Table */}
      <Card>
        <CardContent className="p-0">
          {reportCardsData?.results.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No report cards found</p>
              <p className="text-sm mt-1">
                Generate report cards for a class to get started.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => setGenerateModal({ open: true })}
              >
                Generate Report Cards
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 w-10">
                      <Checkbox
                        checked={
                          reportCardsData?.results.length === selectedIds.length &&
                          selectedIds.length > 0
                        }
                        onCheckedChange={(checked) => {
                          if (checked) selectAll();
                          else clearSelection();
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                      Class
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Overall %
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Subjects
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Promotion
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportCardsData?.results.map((rc: ReportCardApiResponse) => (
                    <tr key={rc.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.includes(rc.id)}
                          onCheckedChange={() => toggleSelection(rc.id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-text-primary">{rc.student_name}</p>
                          <p className="text-sm text-text-secondary">{rc.student_id_number}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {rc.class_instance_name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`font-semibold ${
                            rc.is_overall_pass ? 'text-success' : 'text-error'
                          }`}
                        >
                          {rc.overall_percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={rc.is_overall_pass ? 'success' : 'error'}
                        >
                          {rc.overall_grade}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className="text-success">{rc.subjects_passed} P</span>
                        {' / '}
                        <span className="text-error">{rc.subjects_failed} F</span>
                        {' / '}
                        <span className="text-text-secondary">{rc.total_subjects}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {rc.rank_in_class ? (
                          <span className="font-medium">
                            {rc.rank_in_class}/{rc.total_students_in_class}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={PROMOTION_COLORS[rc.promotion_status] as any}>
                          {rc.promotion_status_display}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant={STATUS_COLORS[rc.status] as any}>
                          {rc.status_display}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/mis/exams/report-cards/${rc.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {reportCardsData && reportCardsData.count > filters.page_size! && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!reportCardsData.previous}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {filters.page} of {Math.ceil(reportCardsData.count / filters.page_size!)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!reportCardsData.next}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Generate Modal */}
      <Modal
        isOpen={generateModal.open}
        onClose={() => setGenerateModal({ open: false })}
        title="Generate Report Cards"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Generate report cards for all students in a class based on their exam grades.
          </p>

          <Select
            label="Academic Year"
            value={generateModal.yearId?.toString() || ''}
            onChange={(e) =>
              setGenerateModal((m) => ({
                ...m,
                yearId: e.target.value ? Number(e.target.value) : undefined,
                classId: undefined,
              }))
            }
            options={[
              { label: 'Select Year', value: '' },
              ...(yearsData?.results || []).map((y) => ({
                label: y.display_name,
                value: String(y.id),
              })),
            ]}
          />

          <Select
            label="Class"
            value={generateModal.classId?.toString() || ''}
            onChange={(e) =>
              setGenerateModal((m) => ({
                ...m,
                classId: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            disabled={!generateModal.yearId}
            options={[
              { label: 'Select Class', value: '' },
              ...(classesData?.results || []).map((c) => ({
                label: c.display_name,
                value: String(c.id),
              })),
            ]}
          />

          <Alert variant="info" title="Note">
            This will calculate final results based on all completed exams and their weights.
            Existing report cards will be updated.
          </Alert>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setGenerateModal({ open: false })}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<RefreshCw className="h-4 w-4" />}
              onClick={handleGenerate}
              disabled={!generateModal.classId || !generateModal.yearId}
              loading={generateReportCards.isPending}
            >
              Generate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={publishModal}
        onClose={() => setPublishModal(false)}
        title="Publish Report Cards"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to publish {selectedIds.length} report card(s)?
          </p>
          <p className="text-sm text-text-secondary">
            Published report cards will be visible to students and parents.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setPublishModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={handlePublish}
              loading={publish.isPending}
            >
              Publish
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
