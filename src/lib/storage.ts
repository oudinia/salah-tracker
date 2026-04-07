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
    extra: 0,
  };
}

function loadAll(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Migrate old records without `extra` field
    for (const key of Object.keys(parsed)) {
      if (parsed[key].extra === undefined) parsed[key].extra = 0;
    }
    return parsed;
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
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

/** Toggle prayer: missed → done → missed */
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

/** Set extra prayers count for a day. */
export function setExtraPrayers(date: string, count: number) {
  const data = loadAll();
  if (!data[date]) {
    data[date] = emptyDay(date);
  }
  data[date].extra = Math.max(0, count);
  saveAll(data);
}

/** Get stats for a date range. */
export function getStats(days: DayRecord[]) {
  let total = 0;
  let done = 0;
  let missed = 0;
  let madeUp = 0;
  let extra = 0;

  for (const day of days) {
    for (const p of PRAYERS) {
      total++;
      const s = day.prayers[p];
      if (s === "done") done++;
      else if (s === "missed") missed++;
      else if (s === "made_up") madeUp++;
    }
    extra += day.extra || 0;
  }

  return {
    total,
    done,
    missed,
    madeUp,
    extra,
    completionRate: total > 0 ? (done + madeUp) / total : 0,
  };
}

/**
 * Get the qada debt: total missed prayers minus extra prayers credited.
 * Extra prayers (nawafil) reduce the debt — they compensate oldest missed prayers.
 */
export function getQadaDebt(): { rawMissed: number; extraCredit: number; netDebt: number } {
  const days = getAllDays();
  let rawMissed = 0;
  let extraCredit = 0;

  for (const day of days) {
    for (const p of PRAYERS) {
      if (day.prayers[p] === "missed") rawMissed++;
    }
    extraCredit += day.extra || 0;
  }

  return {
    rawMissed,
    extraCredit,
    netDebt: Math.max(0, rawMissed - extraCredit),
  };
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
