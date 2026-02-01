import { useState, useMemo } from "react";
import { Search, Briefcase } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { JobPosting } from "../../entities/carierr";
import { departments, jobPostings } from "../../data/carierr";
import JobDetailModal from "./JobModal";
import JobCard from "./JobCard";
import BenefitCard from "./BenefitCard";
import ApplicationFormModal from "./JobForm";
import PageHeader from "../../components/layout/PageHeader";

export default function Careers() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const currentLang = i18n.language as "en" | "pa" | "da";
  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobPostings.filter((job) => {
      const jobTitle =
        job.title[currentLang as keyof typeof job.title].toLowerCase();
      const dept = departments.find((d) => d.id === job.department_id);
      const deptName = dept
        ? dept.name[currentLang as keyof typeof dept.name].toLowerCase()
        : "";

      const matchesSearch =
        jobTitle.includes(searchTerm.toLowerCase()) ||
        deptName.includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" ||
        job.department_id.toString() === selectedDepartment;
      const matchesType = selectedType === "all" || job.type === selectedType;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [searchTerm, selectedDepartment, selectedType, currentLang]);

  const types = ["all", "Full-time", "Part-time", "Contract"];

  const handleApply = (job: JobPosting) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}

      <PageHeader
        breadcrumb={[
          {
            name: t("about.page.breadcrumb.home"),
            path: "/",
          },

          {
            name: t("nav.careers.opportunities"),
            path: "",
          },
        ]}
        image="images/job.jpeg"
        subtitle={t("career.hero.subtitle")}
        title={t("career.hero.title")}
      />
      {/* Filters Section */}
      <div className="bg-surface border-b border-border  z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder={t("career.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
            >
              <option value="all">{t("career.filters.allDepartments")}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id.toString()}>
                  {dept.name[currentLang as keyof typeof dept.name]}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-focus text-text-primary"
            >
              <option value="all">{t("career.filters.allTypes")}</option>
              {types.slice(1).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="mt-4 text-text-secondary text-sm">
            {t("career.filters.showing")} {filteredJobs.length}{" "}
            {filteredJobs.length !== 1
              ? t("career.filters.positions")
              : t("career.filters.position")}
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t("career.noPositions.title")}
            </h3>
            <p className="text-text-secondary">
              {t("career.noPositions.description")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                currentLang={currentLang}
                onViewDetails={setSelectedJob}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Why Work With Us Section */}
      <div className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            {t("career.benefits.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon="🎓"
              title={t("career.benefits.growth.title")}
              description={t("career.benefits.growth.description")}
            />
            <BenefitCard
              icon="🤝"
              title={t("career.benefits.community.title")}
              description={t("career.benefits.community.description")}
            />
            <BenefitCard
              icon="⚖️"
              title={t("career.benefits.balance.title")}
              description={t("career.benefits.balance.description")}
            />
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && !showApplicationForm && (
        <JobDetailModal
          job={selectedJob}
          currentLang={currentLang}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <ApplicationFormModal
          job={selectedJob}
          currentLang={currentLang}
          onClose={() => {
            setShowApplicationForm(false);
            setSelectedJob(null);
          }}
          onSubmit={() => {
            setApplicationSubmitted(true);
            setTimeout(() => {
              setShowApplicationForm(false);
              setSelectedJob(null);
              setApplicationSubmitted(false);
            }, 3000);
          }}
          submitted={applicationSubmitted}
        />
      )}
    </div>
  );
}
