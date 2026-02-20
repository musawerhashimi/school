/**
 * HomeDashboard Page
 * Overview of all Home page CMS sections
 */

import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  BarChart3,
  ArrowRight,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { Button, Spinner } from "@mis-components/ui";
import { Card, CardContent, CardHeader } from "@mis-components/ui/Card";
import PageHeader from "@mis-components/PageHeader";
import { useHeroSliders, useHomeStats } from "../../hooks/useCmsHome";

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { data: sliders = [], isLoading: slidersLoading } = useHeroSliders();
  const { data: stats, isLoading: statsLoading } = useHomeStats();

  const isLoading = slidersLoading || statsLoading;

  const activeSliders = sliders.filter((s) => s.is_active);
  const inactiveSliders = sliders.filter((s) => !s.is_active);

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
        title="Home Page CMS"
        subtitle="Manage the content displayed on the home page"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hero Sliders Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Hero Sliders
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {sliders.length} total · {activeSliders.length} active ·{" "}
                    {inactiveSliders.length} inactive
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/home/sliders/new")}
                >
                  Add New
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/home/sliders")}
                >
                  Manage All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sliders.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 mx-auto text-muted mb-3" />
                <p className="text-text-secondary mb-4">
                  No sliders created yet
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => navigate("/mis/cms/home/sliders/new")}
                >
                  Create First Slider
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sliders
                  .sort((a, b) => a.order - b.order)
                  .slice(0, 6)
                  .map((slider) => (
                    <div
                      key={slider.id}
                      className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all hover:shadow-md ${
                        slider.is_active
                          ? "border-border"
                          : "border-border/50 opacity-60"
                      }`}
                      onClick={() =>
                        navigate(`/mis/cms/home/sliders/${slider.id}/edit`)
                      }
                    >
                      <div className="aspect-video bg-surface">
                        {slider.image ? (
                          <img
                            src={slider.image}
                            alt={slider.title.en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-text-primary text-sm truncate">
                            {slider.title.en || "Untitled"}
                          </h3>
                          {slider.is_active ? (
                            <Eye className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-muted flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate">
                          {slider.subtitle.en || "No subtitle"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Stats Section
                  </h2>
                  <p className="text-sm text-text-secondary">
                    Key statistics displayed on the home page
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stats.TotalEnrolledStudent}+
                  </div>
                  <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
                    Students
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                    {stats.TotalAward}+
                  </div>
                  <div className="text-sm text-yellow-600/80 dark:text-yellow-400/80">
                    Awards
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {stats.TotalAcadimicProgram}+
                  </div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80">
                    Programs
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {stats.TotalSportTeam}+
                  </div>
                  <div className="text-sm text-purple-600/80 dark:text-purple-400/80">
                    Sport Teams
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-muted mb-3" />
                <p className="text-text-secondary">No stats data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
