import { useState } from "react";
import { BookOpen, Calendar, Clock, Download, Sparkles } from "lucide-react";
import PageHeader from "../../../components/layout/PageHeader";
import TabNavigation from "../../../components/layout/TabNavigation";

import ExamScheduleComponent from "./ExamePart";
import Programs from "./Programs";
import Schedules from "./Schedules";
import Resources from "./Resources";

export default function AcademicPrograms() {
  const [activeTab, setActiveTab] = useState("programs");

  const tabs = [
    {
      id: "programs",
      label: "Programs",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "schedules",
      label: "Class Schedules",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: "exams",
      label: "Exam Timetable",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <Download className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Floating Particles */}
        <div
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-2 h-2 bg-secondary/30 rounded-full animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
      </div>

      <PageHeader
        title="Academic Programs"
        subtitle="Comprehensive education programs designed to nurture excellence and foster holistic development"
        image="images/slide4.jpg"
        breadcrumb={["Home", "Academics Programs"]}
      />

      <div className="relative   px-4 md:mx-6 py-8">
        {/* Enhanced Tab Navigation Container */}
        <div className="relative mb-8">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 opacity-20">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <div className="absolute -top-4 -right-4 opacity-20">
            <Sparkles
              className="w-6 h-6 text-secondary animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Tab Navigation with Enhanced Styling */}
          <div className="relative bg-card/50 backdrop-blur-sm border-2 border-border/50 rounded-2xl p-2 shadow-lg">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Content Area with Fade Animation */}
        <div className="relative">
          {/* Content Wrapper */}
          <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            {/* Animated Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-secondary/30 rounded-br-2xl" />

            {/* Content */}
            <div className="relative z-10 animate-fade-in">
              {activeTab === "programs" && (
                <div className="animate-fade-in">
                  <Programs />
                </div>
              )}

              {activeTab === "schedules" && (
                <div className="animate-fade-in">
                  <Schedules />
                </div>
              )}

              {activeTab === "exams" && (
                <div className="animate-fade-in">
                  <ExamScheduleComponent />
                </div>
              )}

              {activeTab === "resources" && (
                <div className="animate-fade-in">
                  <Resources />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
