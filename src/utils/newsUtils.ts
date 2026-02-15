import type { EventStatus } from "../entities/NewsType";

/**
 * Format time to readable string
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

/**
 * Get event status based on date and time
 */
export const getEventStatus = (
  eventDate: string,
  startTime: string,
  endTime: string,
): EventStatus => {
  const now = new Date();
  const eventStart = new Date(`${eventDate}T${startTime}`);
  const eventEnd = new Date(`${eventDate}T${endTime}`);

  if (now < eventStart) {
    return "upcoming";
  } else if (now >= eventStart && now <= eventEnd) {
    return "ongoing";
  } else {
    return "past";
  }
};

/**
 * Calculate days until event
 */
export const getDaysUntilEvent = (eventDate: string): number => {
  const now = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get relative time string
 */
export const getRelativeTime = (
  dateString: string,
  lang: "en" | "da" | "pa",
): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (lang === "en") {
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } else if (lang === "da") {
    if (diffDays === 0) return "امروز";
    if (diffDays === 1) return "دیروز";
    if (diffDays < 7) return `${diffDays} روز پیش`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} هفته پیش`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ماه پیش`;
    return `${Math.floor(diffDays / 365)} سال پیش`;
  } else {
    if (diffDays === 0) return "نن";
    if (diffDays === 1) return "پرون";
    if (diffDays < 7) return `${diffDays} ورځې مخکې`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} اونۍ مخکې`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} میاشتې مخکې`;
    return `${Math.floor(diffDays / 365)} کاله مخکې`;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};
