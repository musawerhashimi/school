// pages/CompetitionsContests/CompetitionsContests.tsx
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { competitions } from "../../../data/competitions";
import PageHeader from "../../../components/layout/PageHeader";
import type {
  CompetitionCategory,
  CompetitionStatus,
  Competition,
} from "../../../entities/Competition";
import CompetitionCard from "./CompetitionCard";
import CompetitionCardSkeleton from "./CompetitionCardSkeleton";
import CompetitionDetail from "./CompetitionDetail";
import CompetitionFilters from "./CompetitionFilters";
import { useTranslation } from "react-i18next";

const CompetitionsContests: React.FC = () => {
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    CompetitionCategory | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | "all">(
    "all",
  );
  const [selectedCompetition] = useState<Competition | null>(null);

  // Filter competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      const matchesSearch =
        comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Type-safe category comparison
      const matchesCategory =
        categoryFilter === "all" ||
        (comp.category_id as unknown as CompetitionCategory) === categoryFilter;

      const matchesStatus =
        statusFilter === "all" || comp.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  // If viewing a specific competition
  if (selectedCompetition) {
    return <CompetitionDetail />;
  }

  // Main competitions list view
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <PageHeader
        title={t("competitions.pageTitle")}
        subtitle={t("competitions.pageSubtitle")}
        breadcrumb={[
          t("competitions.breadcrumb.home"),
          t("competitions.breadcrumb.competitions"),
        ]}
        image={"images/slide3.jpg"}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <CompetitionFilters
            search={searchTerm}
            category={categoryFilter}
            status={statusFilter}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategoryFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Competitions Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CompetitionCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface rounded-full mb-4">
              <Search className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {t("competitions.search.noResults")}
            </h3>
            <p className="text-text-secondary">
              {t("competitions.search.noResultsDesc")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitionsContests;
