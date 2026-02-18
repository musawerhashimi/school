export function formatDateDuration(startDate: string, endDate: string): string {
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate duration in days
  const timeDiff = end.getTime() - start.getTime();
  const durationDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Include both start and end dates

  // Return formatted string
  return `${durationDays}`;
}
