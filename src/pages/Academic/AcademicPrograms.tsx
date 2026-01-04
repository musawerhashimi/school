import { useState, type JSX } from "react";
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Download,
  ChevronRight,
  GraduationCap,
  Award,
  Users,
  FileText,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

// Mock Data
const academicPrograms = [
  {
    id: 1,
    title: "Science & Technology",
    icon: "🔬",
    description:
      "Comprehensive science education covering Physics, Chemistry, Biology, and Computer Science with hands-on laboratory experience.",
    subjects: ["Physics", "Chemistry", "Biology", "Computer Science"],
    grades: "9-12",
    duration: "4 Years",
    students: 245,
    teachers: 8,
    highlights: [
      "State-of-the-art science laboratories",
      "Annual science fair participation",
      "STEM competitions and robotics club",
      "Partnership with local universities",
    ],
  },
  {
    id: 2,
    title: "Mathematics & Logic",
    icon: "📐",
    description:
      "Advanced mathematics curriculum from algebra to calculus, fostering analytical thinking and problem-solving skills.",
    subjects: ["Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics"],
    grades: "9-12",
    duration: "4 Years",
    students: 280,
    teachers: 6,
    highlights: [
      "Math olympiad preparation",
      "Problem-solving workshops",
      "Interactive learning tools",
      "Peer tutoring programs",
    ],
  },
  {
    id: 3,
    title: "Languages & Literature",
    icon: "📚",
    description:
      "Multi-language education including English, Arabic, and Pashto with focus on literature, writing, and communication skills.",
    subjects: ["English", "Arabic", "Pashto", "Literature", "Creative Writing"],
    grades: "9-12",
    duration: "4 Years",
    students: 310,
    teachers: 10,
    highlights: [
      "Bilingual education programs",
      "Writing competitions",
      "Book club and reading circles",
      "Public speaking training",
    ],
  },
  {
    id: 4,
    title: "Social Sciences",
    icon: "🌍",
    description:
      "Understanding society, culture, and governance through History, Geography, Civics, and Economics.",
    subjects: ["History", "Geography", "Civics", "Economics", "Psychology"],
    grades: "9-12",
    duration: "4 Years",
    students: 195,
    teachers: 5,
    highlights: [
      "Field trips and cultural visits",
      "Model UN participation",
      "Historical research projects",
      "Community engagement programs",
    ],
  },
  {
    id: 5,
    title: "Arts & Creativity",
    icon: "🎨",
    description:
      "Nurturing creativity through visual arts, music, drama, and design with modern facilities and expert guidance.",
    subjects: ["Visual Arts", "Music", "Drama", "Design", "Photography"],
    grades: "9-12",
    duration: "4 Years",
    students: 150,
    teachers: 6,
    highlights: [
      "Annual art exhibitions",
      "Theater performances",
      "Digital art and design labs",
      "Collaboration with local artists",
    ],
  },
  {
    id: 6,
    title: "Physical Education",
    icon: "⚽",
    description:
      "Comprehensive physical development program with sports, fitness training, and health education.",
    subjects: [
      "Team Sports",
      "Athletics",
      "Health Education",
      "Yoga",
      "Swimming",
    ],
    grades: "9-12",
    duration: "4 Years",
    students: 320,
    teachers: 7,
    highlights: [
      "Professional sports coaching",
      "Inter-school competitions",
      "Modern sports facilities",
      "Health and wellness programs",
    ],
  },
];

const classSchedules = [
  {
    grade: "Grade 9",
    time: "08:00 AM - 02:00 PM",
    periods: 7,
    breakTime: "11:00 AM",
  },
  {
    grade: "Grade 10",
    time: "08:00 AM - 02:00 PM",
    periods: 7,
    breakTime: "11:00 AM",
  },
  {
    grade: "Grade 11",
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    breakTime: "11:30 AM",
  },
  {
    grade: "Grade 12",
    time: "08:00 AM - 02:30 PM",
    periods: 8,
    breakTime: "11:30 AM",
  },
];

const examSchedule = [
  {
    exam: "First Term Exam",
    date: "November 15-25, 2024",
    subjects: "All Subjects",
    duration: "10 Days",
  },
  {
    exam: "Mid-Year Exam",
    date: "February 10-20, 2025",
    subjects: "All Subjects",
    duration: "10 Days",
  },
  {
    exam: "Final Exam",
    date: "June 5-20, 2025",
    subjects: "All Subjects",
    duration: "15 Days",
  },
  {
    exam: "Practical Exams",
    date: "May 25-30, 2025",
    subjects: "Science & Arts",
    duration: "5 Days",
  },
];

const syllabusDownloads = [
  {
    title: "Grade 9 Syllabus 2024-25",
    size: "2.4 MB",
    subject: "All Subjects",
  },
  {
    title: "Grade 10 Syllabus 2024-25",
    size: "2.6 MB",
    subject: "All Subjects",
  },
  {
    title: "Grade 11 Syllabus 2024-25",
    size: "2.8 MB",
    subject: "All Subjects",
  },
  {
    title: "Grade 12 Syllabus 2024-25",
    size: "3.1 MB",
    subject: "All Subjects",
  },
  { title: "Science Program Guide", size: "1.8 MB", subject: "Science" },
  { title: "Arts Program Guide", size: "1.5 MB", subject: "Arts" },
];

// Reusable Components
// function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle: string; breadcrumb: string[] }) {
//   return (
//     <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
//           {breadcrumb.map((item, index) => (
//             <React.Fragment key={index}>
//               <span className={index === breadcrumb.length - 1 ? "font-semibold" : ""}>{item}</span>
//               {index < breadcrumb.length - 1 && <ChevronRight className="w-4 h-4" />}
//             </React.Fragment>
//           ))}
//         </div>
//         <h1 className="text-5xl font-bold mb-4">{title}</h1>
//         <p className="text-xl opacity-90 max-w-3xl">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-4xl font-bold text-text-primary mb-3">{title}</h2>
      {subtitle && (
        <p className="text-lg text-text-secondary max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}

interface Tab {
  id: string;
  label: string;
  icon: JSX.Element;
}

function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === tab.id
              ? "text-primary border-b-2 border-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <div className="flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
}

interface Program {
  id: number;
  title: string;
  icon: string;
  description: string;
  subjects: string[];
  grades: string;
  duration: string;
  students: number;
  teachers: number;
  highlights: string[];
}

function ProgramCard({
  program,
  onClick,
}: {
  program: Program;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-5xl">{program.icon}</div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
            {program.title}
          </h3>
          <p className="text-text-secondary">{program.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-sm text-text-secondary">Grades</div>
          <div className="font-semibold text-text-primary">
            {program.grades}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-secondary mb-1">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-sm text-text-secondary">Students</div>
          <div className="font-semibold text-text-primary">
            {program.students}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-accent mb-1">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-sm text-text-secondary">Teachers</div>
          <div className="font-semibold text-text-primary">
            {program.teachers}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-text-primary mb-2">Subjects:</h4>
        <div className="flex flex-wrap gap-2">
          {program.subjects.map((subject, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-surface text-text-secondary text-sm rounded-full border border-border"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-primary font-semibold group-hover:gap-2 transition-all">
        <span>Learn More</span>
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}

function ProgramDetailModal({
  program,
  onClose,
}: {
  program: Program | null;
  onClose: () => void;
}) {
  if (!program) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{program.icon}</div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
                <p className="opacity-90">{program.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Program Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Grade Levels:</span>
                  <span className="font-semibold text-text-primary">
                    {program.grades}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Duration:</span>
                  <span className="font-semibold text-text-primary">
                    {program.duration}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Students:</span>
                  <span className="font-semibold text-text-primary">
                    {program.students}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Teaching Staff:</span>
                  <span className="font-semibold text-text-primary">
                    {program.teachers} Teachers
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
                Program Subjects
              </h3>
              <div className="flex flex-wrap gap-2">
                {program.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary bg-opacity-10 text-text-primary font-semibold rounded-lg border border-primary border-opacity-20"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border">
            <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              Program Highlights
            </h3>
            <ul className="space-y-3">
              {program.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </div>
                  <span className="text-text-primary">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Enroll Now
            </button>
            <button className="flex-1 bg-surface text-text-primary border border-border py-3 rounded-lg font-semibold hover:bg-card transition-colors">
              Download Syllabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        image="images/bg-1.jpg"
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
              <div className="relative max-w-2xl">
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

            <div className="grid md:grid-cols-2 gap-8">
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
                    {schedule.grade}
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
                        <Calendar className="w-5 h-5" /> Break Time
                      </span>
                      <span className="font-semibold text-text-primary">
                        {schedule.breakTime}
                      </span>
                    </div>
                  </div>
                  <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                    View Detailed Schedule
                  </button>
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
