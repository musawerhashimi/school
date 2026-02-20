import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { getEventStatus } from "../../../utils/newsUtils";
import { CategoryFilter } from "./components/CategoryFilter";
import { EventCard } from "./components/EventCard";
import { SearchBar } from "./components/SearchBar";
import { useNewsCategories, useNewsEvents } from "./Api/useNews";

type EventFilterType = "all" | "upcoming" | "past";

export const EventsListPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState<EventFilterType>("all");

  // Fetch data from API
  const { data: eventsData } = useNewsEvents();
  const { data: newsCategoriesData } = useNewsCategories();

  const events = eventsData?.results || [];
  const newsCategories = newsCategoriesData?.results || [];

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by event status
    if (eventFilter !== "all") {
      filtered = filtered.filter((event) => {
        const status = getEventStatus(
          event.date,
          event.start_time,
          event.end_time,
        );
        if (eventFilter === "upcoming") {
          return status === "upcoming" || status === "ongoing";
        } else if (eventFilter === "past") {
          return status === "past";
        }
        return true;
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category_id === selectedCategory,
      );
    }

    // Search by title and description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title[lang].toLowerCase().includes(query) ||
          (event.description &&
            event.description[lang].toLowerCase().includes(query)) ||
          event.location.toLowerCase().includes(query) ||
          event.organizer.toLowerCase().includes(query),
      );
    }

    // Sort by date
    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.start_time}`);
      const dateB = new Date(`${b.date}T${b.start_time}`);
      return eventFilter === "past"
        ? dateB.getTime() - dateA.getTime() // Descending for past events
        : dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    });
  }, [events, searchQuery, selectedCategory, eventFilter, lang]);

  // Separate featured and regular events
  const featuredEvents = filteredEvents.filter((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent to-secondary my-12 text-center p-4 rounded-md animate-fade-in">
          <h1 className="text-5xl font-bold text-text-primary mb-4">
            {t("events.title")}
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {t("events.subtitle")}
          </p>
        </div>

        {/* Event Type Tabs */}
        <div className="flex justify-center gap-4 mb-8 animate-slide-up">
          <button
            onClick={() => setEventFilter("upcoming")}
            className={`px-2 py-2 md:px-4 md:py-3 text-sm text-nowrap md:font-semibold rounded-xl  transition-all duration-300 ${
              eventFilter === "upcoming"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-surface text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {t("events.upcomingEvents")}
          </button>
          <button
            onClick={() => setEventFilter("past")}
            className={`px-2 py-2 md:px-4 md:py-3 text-sm text-nowrap rounded-xl md:font-semibold transition-all duration-300 ${
              eventFilter === "past"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-surface text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {t("events.pastEvents")}
          </button>
          <button
            onClick={() => setEventFilter("all")}
            className={`px-2 py-2 md:px-4 md:py-3 text-sm text-nowrap md:font-semibold rounded-xl transition-all duration-300 ${
              eventFilter === "all"
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-surface text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {t("events.allEvents")}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-slide-up">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("events.search")}
            />
          </div>
          <div className="md:w-64">
            <CategoryFilter
              categories={newsCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Featured Events Section */}
        {featuredEvents.length > 0 && (
          <div className="mb-4 ">
            <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              {t("events.featuredEvents")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  categories={newsCategories}
                  featured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Events Section */}
        {regularEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-secondary rounded-full"></span>
              {eventFilter === "upcoming"
                ? t("events.upcomingEvents")
                : eventFilter === "past"
                  ? t("events.pastEvents")
                  : t("events.allEvents")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  categories={newsCategories}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-surface rounded-2xl border border-border">
              <svg
                className="w-24 h-24 text-muted mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("events.noResults")}
              </h3>
              <p className="text-text-secondary">{t("events.noResultsDesc")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
