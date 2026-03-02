import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Award, Calendar } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import HonoreeCard from "./HallCard";
import { awardService, type HallOfFameHonoree } from "./Api/awardService";

export default function HallOfFame() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [honorees, setHonorees] = useState<HallOfFameHonoree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await awardService.getHallOfFame();
        setHonorees(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching hall of fame:", err);
        setError("Failed to load hall of fame data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get unique years from data
  const availableYears = useMemo(() => {
    const years = honorees.map((honoree) => honoree.year);
    return ["all", ...Array.from(new Set(years)).sort((a, b) => b - a)];
  }, [honorees]);

  // Filter and search logic
  const filteredHonorees = useMemo(() => {
    return honorees.filter((honoree) => {
      const matchesSearch = honoree.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesYear =
        selectedYear === "all" || honoree.year.toString() === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [searchQuery, selectedYear, honorees]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={t("hallOfFame.pageTitle")}
        subtitle={t("hallOfFame.pageSubtitle")}
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("hallOfFame.pageTitle"), path: "" },
        ]}
        image="images/hall.jpeg"
      />

      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Intro Text */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t("hallOfFame.description")}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-text-secondary">{t("common.loading")}</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-surface rounded-full mb-6">
                <Search className="w-10 h-10 text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {error}
              </h3>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Filters Section */}
              <div className="mb-12 bg-surface rounded-2xl p-6 shadow-sm border border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      {t("hallOfFame.searchLabel")}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        id="search"
                        type="text"
                        placeholder={t("hallOfFame.searchPlaceholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-12 pr-4"
                      />
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="relative">
                    <label
                      htmlFor="year-filter"
                      className="block text-sm font-medium text-text-secondary mb-2"
                    >
                      {t("hallOfFame.filterByYear")}
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <select
                        id="year-filter"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="input-field pl-12 pr-4 appearance-none cursor-pointer"
                      >
                        <option value="all">{t("hallOfFame.allYears")}</option>
                        {availableYears.slice(1).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-muted"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-text-secondary">
                  {t("hallOfFame.showingResults", {
                    count: filteredHonorees.length,
                    total: honorees.length,
                  })}
                </div>
              </div>

              {/* Honorees Grid */}
              {filteredHonorees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredHonorees.map((honoree) => (
                    <HonoreeCard
                      key={honoree.id}
                      honoree={honoree}
                      lang={lang}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-surface rounded-full mb-6">
                    <Search className="w-10 h-10 text-muted" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t("hallOfFame.noResults")}
                  </h3>
                  <p className="text-text-secondary">
                    {t("hallOfFame.noResultsDesc")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
