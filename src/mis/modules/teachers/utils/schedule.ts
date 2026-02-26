export const TEACHING_DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
] as const;

const JS_DAY_TO_TEACHING_DAY: Record<number, (typeof TEACHING_DAYS)[number] | null> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: null,
  6: "Saturday",
};

export const PERIOD_TIME_FALLBACK: Record<number, { start: string; end: string }> = {
  1: { start: "07:00", end: "07:45" },
  2: { start: "07:45", end: "08:30" },
  3: { start: "08:30", end: "09:15" },
  4: { start: "09:30", end: "10:15" },
  5: { start: "10:15", end: "11:00" },
  6: { start: "11:00", end: "11:45" },
  7: { start: "12:00", end: "12:45" },
  8: { start: "12:45", end: "13:30" },
};

export function getTodayTeachingDay(date: Date = new Date()) {
  return JS_DAY_TO_TEACHING_DAY[date.getDay()] ?? null;
}

export function getSlotTimeRange(slot: {
  period_number: number;
  start_time?: string | null;
  end_time?: string | null;
}) {
  if (slot.start_time && slot.end_time) {
    return { start: slot.start_time, end: slot.end_time };
  }

  const fallback = PERIOD_TIME_FALLBACK[slot.period_number];
  return {
    start: fallback?.start ?? "",
    end: fallback?.end ?? "",
  };
}
