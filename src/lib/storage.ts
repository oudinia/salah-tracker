import type { DayRecord, PrayerName, PrayerStatus } from "./types";
import { PRAYERS } from "./types";

const STORAGE_KEY = "salah-tracker-data";
const TRACKING_START_KEY = "salah-tracker-start";

function emptyDay(date: string): DayRecord {
  return {
    date,
    prayers: {
      fajr: "missed",
      dhuhr: "missed",
      asr: "missed",
      maghrib: "missed",
      isha: "missed",
    },
  };
}

function loadAll(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, DayRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTrackingStartDate(): string {
  const stored = localStorage.getItem(TRACKING_START_KEY);
  if (stored) return stored;
  const today = formatDate(new Date());
  localStorage.setItem(TRACKING_START_KEY, today);
  return today;
}

export function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Get or create a day record. Untracked past days auto-fill as "missed". */
export function getDay(date: string): DayRecord {
  const data = loadAll();
  if (data[date]) return data[date];
  return emptyDay(date);
}

/** Get all days from tracking start to today, filling gaps as "missed". */
export function getAllDays(): DayRecord[] {
  const data = loadAll();
  const start = parseDate(getTrackingStartDate());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: DayRecord[] = [];
  const current = new Date(start);

  while (current <= today) {
    const key = formatDate(current);
    days.push(data[key] || emptyDay(key));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

/** Update a single prayer status for a given day. */
export function setPrayerStatus(date: string, prayer: PrayerName, status: PrayerStatus) {
  const data = loadAll();
  if (!data[date]) {
    data[date] = emptyDay(date);
  }
  data[date].prayers[prayer] = status;
  saveAll(data);
}

/** Toggle prayer through: missed → done → made_up → missed */
export function cyclePrayerStatus(date: string, prayer: PrayerName): PrayerStatus {
  const day = getDay(date);
  const current = day.prayers[prayer];
  const next: PrayerStatus =
    current === "missed" ? "done"
    : current === "done" ? "missed"
    : /* made_up */ "missed";

  setPrayerStatus(date, prayer, next);
  return next;
}

/** Mark a missed prayer as made up. */
export function markMadeUp(date: string, prayer: PrayerName) {
  setPrayerStatus(date, prayer, "made_up");
}

/** Get stats for a date range. */
export function getStats(days: DayRecord[]) {
  let total = 0;
  let done = 0;
  let missed = 0;
  let madeUp = 0;

  for (const day of days) {
    for (const p of PRAYERS) {
      total++;
      const s = day.prayers[p];
      if (s === "done") done++;
      else if (s === "missed") missed++;
      else if (s === "made_up") madeUp++;
    }
  }

  return { total, done, missed, madeUp, completionRate: total > 0 ? (done + madeUp) / total : 0 };
}

/** Get count of total missed prayers (not yet made up). */
export function getMissedCount(): number {
  const days = getAllDays();
  let count = 0;
  for (const day of days) {
    for (const p of PRAYERS) {
      if (day.prayers[p] === "missed") count++;
    }
  }
  return count;
}

/** Get the current week (Mon–Sun) days. */
export function getCurrentWeekDays(): DayRecord[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  const days: DayRecord[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    if (d <= today) {
      days.push(getDay(formatDate(d)));
    }
  }
  return days;
}
