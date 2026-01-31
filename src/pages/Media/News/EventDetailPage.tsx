import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { events, newsCategories } from "../../../data/news";
import {
  getEventStatus,
  getDaysUntilEvent,
  formatDate,
  formatTime,
} from "../../../utils/newsUtils";
import { Facebook, Link2, MessageCircle, Send, Twitter } from "lucide-react";

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const event = events.find((e) => e.id === parseInt(id || "0"));

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {lang === "en"
              ? "Event Not Found"
              : lang === "da"
                ? "رویداد یافت نشد"
                : "پېښه و نه موندل شوه"}
          </h1>
          <Link to="/events" className="btn-primary inline-block">
            {t("events.backToEvents")}
          </Link>
        </div>
      </div>
    );
  }

  const category = newsCategories.find((cat) => cat.id === event.category_id);
  const status = getEventStatus(event.date, event.start_time, event.end_time);
  const daysUntil = getDaysUntilEvent(event.date);

  const statusConfig = {
    upcoming: {
      color: "bg-info text-white",
      text: t("events.eventStatus.upcoming"),
    },
    ongoing: {
      color: "bg-success text-white",
      text: t("events.eventStatus.ongoing"),
    },
    past: {
      color: "bg-muted text-text-primary",
      text: t("events.eventStatus.past"),
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img
          src={event.image}
          alt={event.title[lang]}
          className="w-full h-full object-cover"
        />
        <div className="absolute  inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-45 left-5 md:top-60 md:left-55 bg-card/90 backdrop-blur-sm text-text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("events.backToEvents")}
      </button>

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-6xl -mt-40 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-4">
            <article className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
              {/* Category Badge */}
              {category && (
                <div className="mb-6">
                  <span className="badge badge-primary px-5 py-2 text-base font-semibold">
                    {category.name[lang]}
                  </span>
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-8 end-8">
                <span
                  className={`badge px-4 py-2 text-base font-bold backdrop-blur-sm ${statusConfig[status].color} shadow-lg`}
                >
                  {statusConfig[status].text}
                </span>
              </div>
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-8 leading-tight">
                {event.title[lang]}
              </h1>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Date & Time */}
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">
                        {t("events.date")}
                      </p>
                      <p className="font-bold text-text-primary">
                        {formatDate(event.date, lang)}
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        {formatTime(event.start_time)} -{" "}
                        {formatTime(event.end_time)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-secondary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">
                        {t("events.location")}
                      </p>
                      <p className="font-bold text-text-primary">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organizer */}
                <div className="bg-surface p-5 rounded-xl border border-border">
                  <div className="flex items-start gap-3">
                    <div className="bg-accent/20 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">
                        {t("events.organizer")}
                      </p>
                      <p className="font-bold text-text-primary">
                        {event.organizer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-surface p-6 rounded-2xl mb-8 border-l-4 border-primary">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {lang === "en"
                    ? "About This Event"
                    : lang === "da"
                      ? "درباره این رویداد"
                      : "د دې پېښې په اړه"}
                </h2>
                <p className="text-lg text-text-primary leading-relaxed">
                  {event.description[lang]}
                </p>
              </div>

              {/* Countdown (for upcoming events) */}
              {status === "upcoming" && daysUntil > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-2xl text-center border border-primary/20">
                  <p className="text-text-secondary mb-2">
                    {lang === "en"
                      ? "Event starts in"
                      : lang === "da"
                        ? "رویداد شروع می‌شود در"
                        : "پېښه پیل کیږي په"}
                  </p>
                  <div className="text-5xl font-bold text-primary">
                    {daysUntil}{" "}
                    <span className="text-2xl text-text-secondary">
                      {lang === "en" ? "days" : lang === "da" ? "روز" : "ورځې"}
                    </span>
                  </div>
                </div>
              )}
              {/* Share Buttons */}
              <div className="flex items-center gap-6 mt-12 pt-8 border-t border-border">
                <span className="text-text-secondary font-medium">
                  {t("Sha")}
                </span>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  <Facebook size={20} />
                  Facebook
                </a>

                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  <Twitter size={20} />X
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  <Send size={20} />
                  Telegram
                </a>

                {/* Copy Link */}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
                >
                  <Link2 size={20} />
                  Copy
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};
