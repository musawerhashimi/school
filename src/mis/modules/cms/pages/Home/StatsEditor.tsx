/**
 * StatsEditor Page
 * Admin panel for managing the stats section on the home page
 */

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  Users,
  Award,
  BookOpen,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { Button, Spinner } from "@mis-components/ui";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import Input from "@mis-components/ui/Input";
import PageHeader from "@mis-components/PageHeader";
import type { StatsSectionInput } from "../../types";
import { useHomeStats, useUpdateHomeStats } from "../../hooks/useCmsHome";

interface StatField {
  key: keyof StatsSectionInput;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const STAT_FIELDS: StatField[] = [
  {
    key: "TotalEnrolledStudent",
    label: "Total Enrolled Students",
    icon: Users,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    description: "Number of currently enrolled students",
  },
  {
    key: "TotalAward",
    label: "Total Awards",
    icon: Award,
    color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    description: "Number of awards and recognitions received",
  },
  {
    key: "TotalAcadimicProgram",
    label: "Total Academic Programs",
    icon: BookOpen,
    color: "text-green-500 bg-green-50 dark:bg-green-900/20",
    description: "Number of academic programs offered",
  },
  {
    key: "TotalSportTeam",
    label: "Total Sport Teams",
    icon: Trophy,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    description: "Number of active sports teams",
  },
];

export default function StatsEditor() {
  const { data: stats, isLoading, refetch } = useHomeStats();
  const updateMutation = useUpdateHomeStats();

  const [formData, setFormData] = useState<StatsSectionInput>({
    TotalEnrolledStudent: 0,
    TotalAward: 0,
    TotalAcadimicProgram: 0,
    TotalSportTeam: 0,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load stats data
  useEffect(() => {
    if (stats) {
      setFormData({
        TotalEnrolledStudent: stats.TotalEnrolledStudent,
        TotalAward: stats.TotalAward,
        TotalAcadimicProgram: stats.TotalAcadimicProgram,
        TotalSportTeam: stats.TotalSportTeam,
      });
      setHasChanges(false);
    }
  }, [stats]);

  const handleChange = (key: keyof StatsSectionInput, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [key]: numValue }));
    setHasChanges(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => setHasChanges(false),
    });
  };

  const handleReset = () => {
    if (stats) {
      setFormData({
        TotalEnrolledStudent: stats.TotalEnrolledStudent,
        TotalAward: stats.TotalAward,
        TotalAcadimicProgram: stats.TotalAcadimicProgram,
        TotalSportTeam: stats.TotalSportTeam,
      });
      setHasChanges(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Stats Section"
        subtitle="Manage the statistics displayed on the home page"
        actions={[
          {
            label: "Refresh",
            icon: <RefreshCw className="h-4 w-4" />,
            onClick: () => refetch(),
            variant: "ghost" as const,
          },
        ]}
      />

      <form onSubmit={handleSubmit}>
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {STAT_FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <Card key={field.key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${field.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {field.label}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {field.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={String(formData[field.key])}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      min="0"
                      className="text-2xl font-bold"
                    />
                    {stats && (
                      <div className="text-sm text-muted whitespace-nowrap">
                        Current:{" "}
                        <span className="font-semibold text-text-secondary">
                          {stats[field.key]}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Preview */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-text-primary">Preview</h2>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STAT_FIELDS.map((field) => {
                  const Icon = field.icon;
                  return (
                    <div key={field.key} className="text-center">
                      <Icon className="w-10 h-10 mx-auto mb-2 text-white/90" />
                      <div className="text-3xl font-bold text-white mb-1">
                        {formData[field.key]}+
                      </div>
                      <div className="text-white/80 text-sm font-medium">
                        {field.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {hasChanges && (
              <span className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                You have unsaved changes
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={!hasChanges || updateMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={updateMutation.isPending}
              disabled={!hasChanges}
              leftIcon={
                updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )
              }
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
