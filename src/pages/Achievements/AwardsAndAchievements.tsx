import React, { useState } from "react";
import {
  Trophy,
  Award,
  Medal,
  Star,
  Users,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

// Types
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "academic" | "sports" | "arts" | "community" | "international";
  year: string;
  image?: string;
  recipient?: string;
  level?: "school" | "student";
}

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

// Mock Data
const achievements: Achievement[] = [
  {
    id: "1",
    title: "National Science Excellence Award",
    description:
      "Awarded for outstanding contribution to STEM education and innovative teaching methods.",
    category: "academic",
    year: "2024",
    level: "school",
  },
  {
    id: "2",
    title: "Regional Mathematics Olympiad - 1st Place",
    description:
      "Our students secured first place in the regional mathematics competition.",
    category: "academic",
    year: "2024",
    recipient: "Mathematics Team",
    level: "student",
  },
  {
    id: "3",
    title: "Best Sports Facility Award",
    description:
      "Recognized for maintaining world-class sports infrastructure and training programs.",
    category: "sports",
    year: "2023",
    level: "school",
  },
  {
    id: "4",
    title: "International Art Competition Winner",
    description:
      "Gold medal winner in the International Youth Art Competition held in Paris.",
    category: "arts",
    year: "2024",
    recipient: "Sarah Ahmed - Grade 11",
    level: "student",
  },
  {
    id: "5",
    title: "Community Service Excellence",
    description:
      "Honored for exceptional community outreach and social responsibility programs.",
    category: "community",
    year: "2024",
    level: "school",
  },
  {
    id: "6",
    title: "National Debate Championship",
    description: "Champions of the National High School Debate Championship.",
    category: "academic",
    year: "2023",
    recipient: "Debate Team",
    level: "student",
  },
  {
    id: "7",
    title: "UNESCO Green School Certification",
    description:
      "Certified for sustainable practices and environmental education initiatives.",
    category: "international",
    year: "2024",
    level: "school",
  },
  {
    id: "8",
    title: "State Basketball Championship",
    description:
      "Winners of the State Level Basketball Championship for consecutive 3 years.",
    category: "sports",
    year: "2024",
    recipient: "Basketball Team",
    level: "student",
  },
];

const stats: Stat[] = [
  {
    icon: <Trophy className="w-8 h-8" />,
    value: "150+",
    label: "Total Awards",
  },
  {
    icon: <Medal className="w-8 h-8" />,
    value: "45",
    label: "National Recognitions",
  },
  {
    icon: <Star className="w-8 h-8" />,
    value: "12",
    label: "International Awards",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "500+",
    label: "Student Achievers",
  },
];

// Reusable Components
// const PageHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
//   <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//       <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
//       <p className="text-xl text-text-primary opacity-90 max-w-3xl mx-auto">{subtitle}</p>
//     </div>
//   </div>
// );

const StatCard: React.FC<Stat> = ({ icon, value, label }) => (
  <div className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
    <div className="text-primary mb-3 flex justify-center">{icon}</div>
    <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
    <div className="text-text-secondary">{label}</div>
  </div>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({
  achievement,
}) => {
  const categoryConfig = {
    academic: {
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-primary",
      textColor: "text-primary",
    },
    sports: {
      icon: <Trophy className="w-5 h-5" />,
      color: "bg-success",
      textColor: "text-success",
    },
    arts: {
      icon: <Star className="w-5 h-5" />,
      color: "bg-accent",
      textColor: "text-accent",
    },
    community: {
      icon: <Users className="w-5 h-5" />,
      color: "bg-secondary",
      textColor: "text-secondary",
    },
    international: {
      icon: <Target className="w-5 h-5" />,
      color: "bg-info",
      textColor: "text-info",
    },
  };

  const config = categoryConfig[achievement.category];

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-start gap-4">
        <div
          className={`${config.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors">
              {achievement.title}
            </h3>
            <span className="text-sm font-medium text-text-secondary bg-surface px-3 py-1 rounded-full">
              {achievement.year}
            </span>
          </div>
          <p className="text-text-secondary mb-3">{achievement.description}</p>
          {achievement.recipient && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-text-primary font-medium">
                {achievement.recipient}
              </span>
            </div>
          )}
          <div className="mt-3">
            <span
              className={`text-xs font-medium ${config.textColor} bg-surface px-2 py-1 rounded`}
            >
              {achievement.category.charAt(0).toUpperCase() +
                achievement.category.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AwardsAndAchievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Categories", icon: <Star className="w-4 h-4" /> },
    {
      id: "academic",
      label: "Academic",
      icon: <BookOpen className="w-4 h-4" />,
    },
    { id: "sports", label: "Sports", icon: <Trophy className="w-4 h-4" /> },
    { id: "arts", label: "Arts & Culture", icon: <Star className="w-4 h-4" /> },
    {
      id: "community",
      label: "Community",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "international",
      label: "International",
      icon: <Target className="w-4 h-4" />,
    },
  ];

  const levels = [
    { id: "all", label: "All Achievements" },
    { id: "school", label: "School Awards" },
    { id: "student", label: "Student Achievements" },
  ];

  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch =
      selectedCategory === "all" || achievement.category === selectedCategory;
    const levelMatch =
      selectedLevel === "all" || achievement.level === selectedLevel;
    return categoryMatch && levelMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title="Awards & Achievements"
        subtitle="Celebrating excellence and recognizing the outstanding accomplishments of our school and students"
        image="images/bg-5.jpg"
        breadcrumb={["Home", "Awards & Achievements"]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro Text */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Excellence in Education
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Our Journey of Success
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Sultan Zoy High School takes pride in the achievements of our
              institution and students. Each award represents dedication, hard
              work, and the pursuit of excellence.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-3">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface text-text-secondary hover:bg-card border border-border"
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Filter by Level
              </label>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedLevel === level.id
                        ? "bg-secondary text-white shadow-md"
                        : "bg-surface text-text-secondary hover:bg-card border border-border"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-text-secondary">
              Showing{" "}
              <span className="font-semibold text-text-primary">
                {filteredAchievements.length}
              </span>{" "}
              achievement{filteredAchievements.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-16">
              <Trophy className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No achievements found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Be Part of Our Success Story
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join Sultan Zoy High School and unlock your potential. Together, we
            can achieve greatness.
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-surface transition-colors">
            Apply for Admission
          </button>
        </div>
      </section>
    </div>
  );
};

export default AwardsAndAchievements;
