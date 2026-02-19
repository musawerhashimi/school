export type TripStatus = "upcoming" | "completed";

/**
 * Returns logical status (for filtering & logic)
 */
export const getStatus = (tripDate: string): TripStatus => {
  const today = new Date();
  const date = new Date(tripDate);

  // Remove time differences
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date >= today ? "upcoming" : "completed";
};

/**
 * Returns translated label for UI
 */
export const getStatusLabel = (
  status: TripStatus,
  lang: "en" | "da" | "pa",
): string => {
  const translations = {
    upcoming: {
      en: "Upcoming",
      da: "در حال برگزاری",
      pa: "راتلونکی",
    },
    completed: {
      en: "Completed",
      da: "تکمیل شده",
      pa: "بشپړ شوی",
    },
  };

  return translations[status][lang];
};
