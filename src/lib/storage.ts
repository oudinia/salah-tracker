import type { DayRecord, PrayerName, PrayerEntry } from "./types";
import { PRAYERS, SUNNAH_RATIBAH } from "./types";

const STORAGE_KEY = "salah-tracker-data";
const TRACKING_START_KEY = "salah-tracker-start";

function emptyEntry(): PrayerEntry {
  return { fard: false, sunnah: false };
}

function emptyDay(date: string): DayRecord {
  return {
    date,
    prayers: {
      fajr: emptyEntry(),
      dhuhr: emptyEntry(),
      asr: emptyEntry(),
      maghrib: emptyEntry(),
      isha: emptyEntry(),
    },
    extra: 0,
  };
}

function loadAll(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Migrate from old format (PrayerStatus string → PrayerEntry object)
    for (const key of Object.keys(parsed)) {
      const day = parsed[key];
      if (day.extra === undefined) day.extra = 0;
      for (const p of PRAYERS) {
        const val = day.prayers[p];
        if (typeof val === "string") {
          // Old format: "done" | "missed" | "made_up"
          day.prayers[p] = { fard: val === "done" || val === "made_up", sunnah: false };
        } else if (typeof val === "boolean") {
          day.prayers[p] = { fard: val, sunnah: false };
        } else if (!val || typeof val !== "object") {
          day.prayers[p] = emptyEntry();
        }
      }
    }
    return parsed;
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, DayRecord>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

export function getTrackingStartDate(): string {
  const stored = localStorage.getItem(TRACKING_START_KEY);
  if (stored) return stored;
  const today = formatDate(new Date());
  localStorage.setItem(TRACKING_START_KEY, today);
  return today;
}

export function getDay(date: string): DayRecord {
  const data = loadAll();
  if (data[date]) return data[date];
  return emptyDay(date);
}

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

/** Toggle fard prayer for a given day. */
export function toggleFard(date: string, prayer: PrayerName) {
  const data = loadAll();
  if (!data[date]) data[date] = emptyDay(date);
  data[date].prayers[prayer].fard = !data[date].prayers[prayer].fard;
  saveAll(data);
}

/** Toggle sunnah prayer for a given day. */
export function toggleSunnah(date: string, prayer: PrayerName) {
  if (!SUNNAH_RATIBAH[prayer]) return; // no sunnah for asr
  const data = loadAll();
  if (!data[date]) data[date] = emptyDay(date);
  data[date].prayers[prayer].sunnah = !data[date].prayers[prayer].sunnah;
  saveAll(data);
}

/** Set extra nawafil count for a day. */
export function setExtraPrayers(date: string, count: number) {
  const data = loadAll();
  if (!data[date]) data[date] = emptyDay(date);
  data[date].extra = Math.max(0, count);
  saveAll(data);
}

/** Count how many sunnah rakaat were prayed on a given day. */
export function sunnahRakaatForDay(day: DayRecord): number {
  let count = 0;
  for (const p of PRAYERS) {
    const s = SUNNAH_RATIBAH[p];
    if (s && day.prayers[p].sunnah) {
      count += s.before + s.after;
    }
  }
  return count;
}

/** Get stats for a range of days. */
export function getStats(days: DayRecord[]) {
  let fardTotal = 0;
  let fardDone = 0;
  let sunnahDone = 0;
  let sunnahRakaat = 0;
  let extra = 0;

  for (const day of days) {
    for (const p of PRAYERS) {
      fardTotal++;
      if (day.prayers[p].fard) fardDone++;
      if (day.prayers[p].sunnah && SUNNAH_RATIBAH[p]) {
        sunnahDone++;
        sunnahRakaat += (SUNNAH_RATIBAH[p]!.before + SUNNAH_RATIBAH[p]!.after);
      }
    }
    extra += day.extra || 0;
  }

  return {
    fardTotal,
    fardDone,
    fardNotDone: fardTotal - fardDone,
    sunnahDone,
    sunnahRakaat,
    extra,
    completionRate: fardTotal > 0 ? fardDone / fardTotal : 0,
  };
}

/**
 * Qada debt: fard prayers not done, minus credits from sunnah + extra nawafil.
 * Each sunnah session counts as 1 credit. Each extra nafilah counts as 1 credit.
 */
export function getQadaDebt() {
  const days = getAllDays();
  let notDone = 0;
  let sunnahCredits = 0;
  let extraCredits = 0;

  for (const day of days) {
    for (const p of PRAYERS) {
      if (!day.prayers[p].fard) notDone++;
      if (day.prayers[p].sunnah && SUNNAH_RATIBAH[p]) sunnahCredits++;
    }
    extraCredits += day.extra || 0;
  }

  const totalCredits = sunnahCredits + extraCredits;
  return {
    notDone,
    sunnahCredits,
    extraCredits,
    totalCredits,
    netDebt: Math.max(0, notDone - totalCredits),
  };
}

export function getCurrentWeekDays(): DayRecord[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
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
