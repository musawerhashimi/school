
import { useState, useMemo } from "react";
import { competitions } from "../../../data/competitions";
import PageHeader from "../../../components/layout/PageHeader";
import type {
  CompetitionCategory,
  CompetitionStatus,
} from "../../../entities/Competition";
import CompetitionCard from "./CompetitionCard";
import CompetitionFilters from "./CompetitionFilters";
import { useTranslation } from "react-i18next";

const CompetitionsContests: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    CompetitionCategory | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<CompetitionStatus | "all">(
    "all",
  );

  const getStatus = (startDate: string): CompetitionStatus => {
    const today = new Date();
    const start = new Date(startDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    return today < start ? "upcoming" : "completed";
  };

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      const matchesSearch = comp.title[lang]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        (comp.category_id as unknown as CompetitionCategory) === categoryFilter;

      const compStatus = getStatus(comp.startDate); // ✅ dynamically calculate
      const matchesStatus =
        statusFilter === "all" || compStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("competitions.pageTitle")}
        subtitle={t("competitions.pageSubtitle")}
        breadcrumb={[]}
        image={"images/commp.jpeg"}
      />

      <div className="max-w-7xl mx-auto py-12">
        <CompetitionFilters
          search={searchTerm}
          category={categoryFilter}
          status={statusFilter}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {filteredCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitionsContests;
