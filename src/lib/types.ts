export const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerName = (typeof PRAYERS)[number];

export interface PrayerEntry {
  fard: boolean;
  sunnah: boolean;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerName, PrayerEntry>;
  extra: number; // additional nawafil beyond the sunnah ratibah
}

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const PRAYER_TIMES: Record<PrayerName, string> = {
  fajr: "Dawn",
  dhuhr: "Midday",
  asr: "Afternoon",
  maghrib: "Sunset",
  isha: "Night",
};

/** Sunnah Ratibah — regular voluntary prayers tied to each fard */
export const SUNNAH_RATIBAH: Record<PrayerName, { before: number; after: number } | null> = {
  fajr: { before: 2, after: 0 },
  dhuhr: { before: 4, after: 2 },
  asr: null, // no sunnah — makruh time
  maghrib: { before: 0, after: 2 },
  isha: { before: 0, after: 2 },
};
