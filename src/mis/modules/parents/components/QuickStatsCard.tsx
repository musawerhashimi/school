/**
 * QuickStatsCard Component
 * Reusable stat card for displaying metrics
 */

import type { LucideIcon } from "lucide-react";
import { Card } from "@mis-components/ui";

type ColorVariant = "primary" | "success" | "warning" | "error" | "info";

interface QuickStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: ColorVariant;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  alert?: boolean;
}

const colorStyles: Record<
  ColorVariant,
  { bg: string; text: string; gradient: string; progressBg: string }
> = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    gradient: "from-primary/20 to-transparent",
    progressBg: "bg-primary",
  },
  success: {
    bg: "bg-success/10",
    text: "text-success",
    gradient: "from-success/20 to-transparent",
    progressBg: "bg-success",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    gradient: "from-warning/20 to-transparent",
    progressBg: "bg-warning",
  },
  error: {
    bg: "bg-error/10",
    text: "text-error",
    gradient: "from-error/20 to-transparent",
    progressBg: "bg-error",
  },
  info: {
    bg: "bg-info/10",
    text: "text-info",
    gradient: "from-info/20 to-transparent",
    progressBg: "bg-info",
  },
};

export default function QuickStatsCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle,
  trend,
  progress,
  alert,
}: QuickStatsCardProps) {
  const styles = colorStyles[color];

  return (
    <Card
      variant="elevated"
      padding="none"
      className={`relative overflow-hidden border-0 group hover:shadow-xl transition-all duration-300 ${
        alert ? "ring-2 ring-error/50" : ""
      }`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
      />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${styles.bg}`}>
            <Icon className={`h-6 w-6 ${styles.text}`} />
          </div>
          {alert && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-error opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-error" />
            </span>
          )}
        </div>

        <div>
          <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div className="mt-3 flex items-center gap-1">
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? "text-success" : "text-error"
              }`}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-text-tertiary">vs last month</span>
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-4">
            <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${styles.progressBg} transition-all duration-500`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-tertiary mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </Card>
  );
}
