import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Heart,
  Users,
  ArrowRight,
  Share,
  Facebook,
  Link2,
  MessageCircle,
} from "lucide-react";
import {
  useCharityEvents,
  useCharityEventsData,
  type CharityEventFilter,
} from "./Api/useCommunity";
import PageHeader from "../../components/layout/PageHeader";
import Loader from "../../components/Loader";
import { formatLocalDateTime } from "@/utils/formatLocalDateTime";

export default function CharityEvents() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  const [filter, setFilter] = useState<CharityEventFilter>("all");

  // Fetch charity events data with filter
  const { data: events, isLoading, error } = useCharityEvents(filter);

  // Fetch all charity events data for counts
  const { data: allEventsData } = useCharityEventsData();

  const upcomingCount = allEventsData?.upcoming?.length || 0;
  const pastCount = allEventsData?.past?.length || 0;
  const allCount = allEventsData?.events?.length || 0;

  const handleFilterChange = (newFilter: CharityEventFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        image="images/chariyt.jpeg"
        title={t("charity.header.title")}
        subtitle={t("charity.header.subtitle")}
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("charity.header.title"), path: "/charity-events" },
        ]}
      />

      {/* Hero Section with Mission */}
      <section className="relative py-16 px-4 md:px-8 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black text-text-primary leading-tight">
                {t("charity.hero.title")}
              </h1>

              <p className="text-xl text-text-secondary leading-relaxed">
                {t("charity.hero.description")}
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-accent/20 to-primary/20 rounded-3xl transform -rotate-3"></div>
              <img
                src="images/charity.jpeg"
                alt="Charity Events"
                className="relative rounded-3xl shadow-2xl w-full h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4 md:px-8">
        <h1 className="text-5xl text-center font-bold text-text-primary mb-10 ">
          {t("charity.header.title")}
        </h1>

        {/* Filter Buttons */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                filter === "all"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-card text-text-secondary hover:bg-surface hover:text-text-primary border border-border"
              }`}
            >
              {t("charity.filter.all") || "All"} ({allCount})
            </button>
            <button
              onClick={() => handleFilterChange("upcoming")}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                filter === "upcoming"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-card text-text-secondary hover:bg-surface hover:text-text-primary border border-border"
              }`}
            >
              {t("charity.filter.upcoming") || "Upcoming"} ({upcomingCount})
            </button>
            <button
              onClick={() => handleFilterChange("past")}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                filter === "past"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-card text-text-secondary hover:bg-surface hover:text-text-primary border border-border"
              }`}
            >
              {t("charity.filter.past") || "Past"} ({pastCount})
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("charity.error.title") || "Error loading events"}
              </h3>
              <p className="text-text-secondary">
                {t("charity.error.description") || "Please try again later"}
              </p>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <Calendar className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t("charity.noEvents.title")}
              </h3>
              <p className="text-text-secondary">
                {t("charity.noEvents.description")}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                return (
                  <div
                    key={event.id}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                  >
                    {/* Event Image */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img
                        src={event.image}
                        alt={event.name[lang]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Event Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {event.name[lang]}
                      </h3>

                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {event.description[lang]}
                      </p>

                      <div className="space-y-3 pt-4 border-t border-border">
                        {/* Date */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-muted uppercase tracking-wide">
                              {t("charity.event.date")}
                            </div>
                            <div className="text-sm font-medium text-text-primary">
                              {formatLocalDateTime(event.date)}
                            </div>
                          </div>
                        </div>

                        {/* Purpose */}
                        <div className="flex items-start gap-3 pt-2">
                          <div className="w-10 h-10 rounded-lg bg-info-soft flex items-center justify-center flex-shrink-0">
                            <Heart className="w-5 h-5 text-info" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-muted uppercase tracking-wide">
                              {t("charity.event.purpose")}
                            </div>
                            <div className="text-sm font-medium text-text-primary line-clamp-2">
                              {event.purpose[lang]}
                            </div>
                          </div>
                        </div>
                        {/* Share */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Share className="w-5 h-5 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-muted uppercase tracking-wide">
                              {t("charity.event.share")}
                            </div>
                            <div className=" font-medium text-text-primary mt-2 flex flex-wrap gap-6">
                              {/* Facebook */}
                              <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
                              >
                                <Facebook size={24} />
                              </a>

                              {/* WhatsApp */}
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
                              >
                                <MessageCircle size={24} />
                              </a>

                              {/* Copy Link */}
                              <button
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    window.location.href,
                                  )
                                }
                                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
                              >
                                <Link2 size={24} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-text-primary">
            {t("charity.cta.title")}
          </h2>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("charity.cta.description")}
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <a
              href="/contact"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
            >
              <span>{t("charity.cta.getInvolved")}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/community-support"
              className="px-8 py-4 bg-card hover:bg-surface-hover text-text-primary font-bold rounded-xl border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {t("charity.cta.viewPrograms")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
