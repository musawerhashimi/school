/**
 * ParentDashboard Page
 * Main dashboard for parents to view their children's information
 */

import { Link } from "react-router-dom";
import {
  Users,
  CalendarCheck,
  TrendingUp,
  ClipboardList,
  User,
  Sparkles,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { Button, Alert } from "@mis-components/ui";
import { useParentDashboard, useParentProfile, usePrefetchChild } from "../hooks/useParents";
import StudentCard from "../components/StudentCard";
import QuickStatsCard from "../components/QuickStatsCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ParentDashboard() {
  const { data: profile, isLoading: profileLoading } = useParentProfile();
  const { data: dashboard, isLoading: dashboardLoading, isError } = useParentDashboard();
  const prefetchChild = usePrefetchChild();

  const currentDate = new Date();
  const greeting = getGreeting();

  const isLoading = profileLoading || dashboardLoading;

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="error" title="Error Loading Dashboard">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-[#1e1b4b] p-8 mb-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

        {/* Floating Icons */}
        <div className="absolute top-6 right-12 opacity-10">
          <GraduationCap className="w-24 h-24 text-white" />
        </div>
        <div className="absolute bottom-8 right-1/4 opacity-10">
          <Users className="w-16 h-16 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                {greeting}
                {profile && `, ${profile.first_name}`}!
              </h1>
              <p className="text-lg text-white/80 max-w-xl">
                Stay connected with your children's education. Track their progress, view
                assignments, and stay informed about their academic journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/mis/parents/profile">
                <Button
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 font-semibold"
                >
                  <User className="w-5 h-5 mr-2" />
                  My Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Overview</h2>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickStatsCard
              title="My Children"
              value={dashboard?.total_children || 0}
              icon={Users}
              color="primary"
              subtitle="Enrolled students"
            />
            <QuickStatsCard
              title="Avg Attendance"
              value={`${(dashboard?.overall_attendance || 0).toFixed(0)}%`}
              icon={CalendarCheck}
              color="success"
              subtitle="Across all children"
              progress={dashboard?.overall_attendance}
            />
            <QuickStatsCard
              title="Avg Score"
              value={`${(dashboard?.overall_average_score || 0).toFixed(0)}%`}
              icon={TrendingUp}
              color="info"
              subtitle="Academic performance"
            />
            <QuickStatsCard
              title="Pending Tasks"
              value={dashboard?.total_pending_assignments || 0}
              icon={ClipboardList}
              color="warning"
              subtitle="Assignments to submit"
              alert={
                dashboard?.total_pending_assignments
                  ? dashboard.total_pending_assignments > 0
                  : false
              }
            />
          </div>
        )}
      </div>

      {/* My Children Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10">
              <GraduationCap className="w-5 h-5 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">My Children</h2>
          </div>
          {dashboard?.total_children && dashboard.total_children > 0 && (
            <span className="text-sm text-text-secondary">
              {dashboard.total_children} student{dashboard.total_children !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : dashboard?.children && dashboard.children.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.children.map((child) => (
              <StudentCard
                key={child.id}
                student={child}
                onHover={() => prefetchChild(child.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-10 w-10 text-text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Children Found</h3>
            <p className="text-text-secondary max-w-md mx-auto">
              It looks like no students are linked to your account yet. Please contact the
              school administration to link your children to your parent account.
            </p>
          </div>
        )}
      </div>

      {/* Unpaid Fees Alert */}
      {dashboard?.total_unpaid_fees && dashboard.total_unpaid_fees > 0 && (
        <div className="mt-8">
          <Alert variant="warning" title="Pending Fees">
            You have a total of <strong>${dashboard.total_unpaid_fees.toFixed(2)}</strong> in
            unpaid fees across your children. Please review the fees section for each child.
          </Alert>
        </div>
      )}
    </div>
  );
}
