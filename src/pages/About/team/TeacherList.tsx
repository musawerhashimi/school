import {
  Search,
  Users,
  GraduationCap,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import TeamCardSkeleton from "./CardSkiltone";
import { mockStaff, mockTeachers } from "../../../data/teachersdata";
import TeamCard from "./TeacherCard";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import { useTranslation } from "react-i18next";

export default function TeacherList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilteringLoading, setIsFilteringLoading] = useState(false);

  const allMembers = [...mockTeachers, ...mockStaff];
  type MainFilter = "all" | "teachers" | "staff";
  type SubCategory = "all" | string;

  const [mainFilter, setMainFilter] = useState<MainFilter>("all");
  const [subCategory, setSubCategory] = useState<SubCategory>("all");

  // Teacher departments
  const teacherDepartments = [
    "All",
    ...Array.from(new Set(mockTeachers.map((t) => t.department))),
  ];

  // Staff departments
  const staffDepartments = [
    "All",
    ...Array.from(new Set(mockStaff.map((s) => s.department))),
  ];

  // Get current subcategories based on main filter
  const getSubCategories = () => {
    if (mainFilter === "teachers") return teacherDepartments;
    if (mainFilter === "staff") return staffDepartments;
    return ["All"];
  };

  // Filter members
  const filteredMembers = allMembers.filter((member) => {
    // Check if member has subjects (teachers) or not (staff)
    const isTeacher = member.type === "teacher";

    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isTeacher &&
        member.subjects.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesMainFilter =
      mainFilter === "all" ||
      (mainFilter === "teachers" && member.type === "teacher") ||
      (mainFilter === "staff" && member.type === "staff");

    const matchesSubCategory =
      subCategory === "all" ||
      subCategory === "All" ||
      member.department === subCategory;

    return matchesSearch && matchesMainFilter && matchesSubCategory;
  });
  const navigate = useNavigate();
  // Initial load
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);
  const { t } = useTranslation();
  const handleFilterChange = (filter: MainFilter) => {
    setIsFilteringLoading(true);
    setMainFilter(filter);
    setSubCategory("all");
    setTimeout(() => setIsFilteringLoading(false), 500);
  };

  const handleSubCategoryChange = (category: SubCategory) => {
    setIsFilteringLoading(true);
    setSubCategory(category);
    setTimeout(() => setIsFilteringLoading(false), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PageHeader
        title={t("teacher.page.title")}
        subtitle={t("teacher.page.subtitle")}
        image="images/slide2.jpg"
        breadcrumb={[
          t("about.page.breadcrumb.home"),
          t("about.page.breadcrumb.about"),
          t("about.page.breadcrumb.teacher"),
        ]}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Advanced Filters */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by name, role, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-card border-2 border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Main Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleFilterChange("all")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                mainFilter === "all"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "bg-card text-text-secondary border-2 border-border hover:border-primary hover:text-primary"
              }`}
            >
              <Users className="w-5 h-5" />
              All Members
            </button>
            <button
              onClick={() => handleFilterChange("teachers")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                mainFilter === "teachers"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "bg-card text-text-secondary border-2 border-border hover:border-primary hover:text-primary"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              Teachers
            </button>
            <button
              onClick={() => handleFilterChange("staff")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                mainFilter === "staff"
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                  : "bg-card text-text-secondary border-2 border-border hover:border-primary hover:text-primary"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Staff
            </button>
            {/* Subcategory Dropdown */}
            {mainFilter !== "all" && (
              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="w-full md:w-64 pl-4 pr-10 py-3.5 bg-card border-2 border-border rounded-xl text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {getSubCategories().map((cat) => (
                    <option key={cat} value={cat === "All" ? "all" : cat}>
                      {cat === "All"
                        ? `All ${
                            mainFilter === "teachers" ? "Teachers" : "Stuff"
                          }`
                        : cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-text-secondary text-lg">
            Showing{" "}
            <span className="font-bold text-primary text-xl">
              {filteredMembers.length}
            </span>{" "}
            {mainFilter === "teachers"
              ? "teachers"
              : mainFilter === "staff"
              ? "staff members"
              : "team members"}
          </p>
        </div>

        {/* Team Grid */}
        {isLoading || isFilteringLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <TeamCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <TeamCard
                key={member.id}
                member={member}
                onClick={() => navigate(`/team/${member.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-text-secondary" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              No members found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
