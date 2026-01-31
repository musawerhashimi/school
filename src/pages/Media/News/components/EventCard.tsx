import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  getEventStatus,
  getDaysUntilEvent,
  formatDate,
  formatTime,
} from "../../../../utils/newsUtils";
import type { NewsCategory, Event } from "../../../../entities/NewsType";

interface EventCardProps {
  event: Event;
  categories: NewsCategory[];
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  categories,
  featured = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const category = categories.find((cat) => cat.id === event.category_id);
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
    <article
      className={`group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-500 ${
        featured ? "col-span-1" : ""
      }`}
    >
      <Link to={`/events/${event.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-video">
          <img
            src={event.image}
            alt={event.title[lang]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="badge badge-primary px-4 py-2 text-sm font-semibold backdrop-blur-sm bg-primary/90">
                {category.name[lang]}
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`badge px-4 py-2 text-sm font-bold backdrop-blur-sm ${statusConfig[status].color}`}
            >
              {statusConfig[status].text}
            </span>
          </div>

          {/* Days Until Event (for upcoming events) */}
          {status === "upcoming" && daysUntil > 0 && (
            <div className="absolute bottom-4 left-4">
              <div className="bg-accent text-text-primary px-4 py-2 rounded-xl font-bold text-lg backdrop-blur-sm">
                {daysUntil}{" "}
                {lang === "en" ? "days" : lang === "da" ? "روز" : "ورځې"}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3
            className={`font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {event.title[lang]}
          </h3>

          {/* Description */}
          <p className="text-text-secondary mb-4 line-clamp-2">
            {event.description[lang]}
          </p>

          {/* Event Details */}
          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                {formatDate(event.date, lang)} • {formatTime(event.start_time)}{" "}
                - {formatTime(event.end_time)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{event.location}</span>
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <svg
                className="w-5 h-5 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span>{event.organizer}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex flex-col items-end gap-1">
              <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                {t("events.viewDetails")}
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
