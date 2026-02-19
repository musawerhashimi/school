import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { TRIP_CATEGORIES, trips } from "../../../data/educationtrip";
import { useTranslation } from "react-i18next";
import TripCard from "./TripCard";
import { getStatus } from "@/utils/stutusFunction";

export default function EducationalTrips() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const getCategoryById = (categoryId: number) => {
    return TRIP_CATEGORIES.find((cat) => cat.id === categoryId);
  };

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.title[lang]
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null || trip.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ✅ Dynamic status filtering
  const upcomingTrips = filteredTrips.filter(
    (trip) => getStatus(trip.date) === "upcoming",
  );

  const pastTrips = filteredTrips.filter(
    (trip) => getStatus(trip.date) === "completed",
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-bl from-surface to-info-soft">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mt-8">
            <h1 className="text-5xl font-light text-text-primary mb-4">
              {t("educationalTrips.title")}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t("educationalTrips.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters */}
        <div className="bg-background z-10">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center gap-4 justify-center">
              {/* Search */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary w-5 h-5" />
                <input
                  type="text"
                  placeholder={t("educationalTrips.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* All Trips */}
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setSelectedCategory(null);
                }}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedFilter === "all" && selectedCategory === null
                    ? "bg-primary text-white shadow-md"
                    : "bg-surface text-text-secondary border border-border hover:border-primary"
                }`}
              >
                {t("educationalTrips.action.allTrips")}
              </button>

              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                    selectedCategory !== null
                      ? "bg-primary-dark text-white shadow-md"
                      : "bg-card text-text-secondary border border-border hover:border-primary"
                  }`}
                >
                  {selectedCategory !== null
                    ? getCategoryById(selectedCategory)?.name[lang]
                    : t("library.action.byCategory")}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 bg-card rounded-2xl shadow-xl border border-border py-2 min-w-[200px] z-20">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSelectedFilter("all");
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-surface-hover font-medium"
                    >
                      {t("library.action.allCategories")}
                    </button>

                    <div className="border-t border-border my-1" />

                    {TRIP_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedFilter("all");
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-surface-hover"
                      >
                        {category.name[lang]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        {upcomingTrips.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              {t("educationalTrips.upcoming")}
            </h2>
            {upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Past */}
        {pastTrips.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-8">
              {t("educationalTrips.past")}
            </h2>
            {pastTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
