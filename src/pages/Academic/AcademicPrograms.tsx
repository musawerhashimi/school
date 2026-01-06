import { useState } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Download,
  ChevronRight,
  FileText,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import type { Program } from "../../entities/program";
import {
  academicPrograms,
  classSchedules,
  examSchedule,
  syllabusDownloads,
} from "../../data/acadimicdata";
import TabNavigation from "../../components/layout/TabNavigation";
import ProgramCard from "./ProgramCard";
import SectionHeading from "./SectionHeading";
import ProgramDetailModal from "./ProgramDetailModal";
import { Link } from "react-router-dom";

// Main Component
const AcademicPrograms = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

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

  const filteredPrograms = academicPrograms.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Academic Programs"
        subtitle="Comprehensive education programs designed to nurture excellence and foster holistic development"
        image="images/slide4.jpg"
        breadcrumb={["Home", "Academics Programs"]}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "programs" && (
          <>
            <div className="mb-12">
              <div className="relative max-w-7xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search programs, subjects, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-1 gap-8">
              {filteredPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onClick={() => setSelectedProgram(program)}
                />
              ))}
            </div>

            {filteredPrograms.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-secondary text-lg">
                  No programs found matching your search.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "schedules" && (
          <div>
            <SectionHeading
              title="Class Schedules"
              subtitle="Regular class timings for all grade levels"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {classSchedules.map((schedule, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    Class {schedule.class}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-text-secondary flex items-center gap-2">
                        <Clock className="w-5 h-5" /> School Hours
                      </span>
                      <span className="font-semibold text-text-primary">
                        {schedule.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-text-secondary flex items-center gap-2">
                        <BookOpen className="w-5 h-5" /> Total Periods
                      </span>
                      <span className="font-semibold text-text-primary">
                        {schedule.periods} Periods
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-text-secondary flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Number of Class
                      </span>
                      <span className="font-semibold text-text-primary">
                        {schedule.number_of_class}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex text-center">
                    <Link
                      to={`/class/${schedule.class}`}
                      className="w-full mt-6 bg-primary text-white px-3 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                      View Detailed Schedule
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "exams" && (
          <div>
            <SectionHeading
              title="Examination Schedule"
              subtitle="Important dates for all examinations in the academic year 2024-25"
            />
            <div className="space-y-6">
              {examSchedule.map((exam, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {exam.exam}
                      </h3>
                      <p className="text-text-secondary mb-4">
                        {exam.subjects}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-primary">
                          <Calendar className="w-5 h-5" />
                          <span className="font-semibold">{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary">
                          <Clock className="w-5 h-5" />
                          <span className="font-semibold">{exam.duration}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-accent to-secondary bg-opacity-10 border border-accent border-opacity-20 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Exam Guidelines
              </h3>
              <ul className="space-y-3 text-text-primary">
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Students must arrive 15 minutes before the exam start time
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Bring valid student ID card and admit card to the
                    examination hall
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Electronic devices are strictly prohibited in the exam hall
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    Results will be published within 2 weeks after exam
                    completion
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div>
            <SectionHeading
              title="Educational Resources"
              subtitle="Download curriculum guides, syllabi, and important documents"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {syllabusDownloads.map((resource, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-white/90" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {resource.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-text-secondary">
                      {resource.size}
                    </span>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-surface border border-border rounded-xl p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Need More Information?
              </h3>
              <p className="text-text-secondary mb-6">
                Can't find what you're looking for? Our academic coordinators
                are here to help you with any questions about our programs,
                curriculum, or admissions.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                  Contact Academic Office
                </button>
                <button className="bg-surface text-text-primary border border-border px-6 py-3 rounded-lg font-semibold hover:bg-card transition-colors">
                  Request Brochure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default AcademicPrograms;
